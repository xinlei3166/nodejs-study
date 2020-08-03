const { emailPattern } = require('../utils/patterns')
const token = require('../utils/token')
const { SECRET_KEY: key } = require('../settings')
const login = require('../utils/ldap-client')
const { collections } = require('../constant')
const errorCode = require('../exception/error-code')
const { hashidEncode } = require('../utils/utils')
const { validToken } = require('../utils/decorator')

async function createUser(ctx, user) {
  const obj = {
    uid: user.uid,
    uidNumber: user.uidNumber,
    email: user.mail,
    name: user.displayName,
    cn: user.cn,
    title: user.title,
    avatar: ''
  }
  return await ctx.db.insertOne(collections.user, obj)
}

function setAccessTokenCookie(ctx, accessToken) {
  ctx.cookies.set('accessToken', accessToken, {
    httpOnly: false,
    overwrite: false,
    sign: true,
    // domain: host,
    // path: '/index',
    maxAge: token.accessExpiresIn * 1000
    // expires: new Date('2021-02-06'),
  })
}

function setRefreshTokenCookie(ctx, refreshToken) {
  ctx.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    overwrite: false,
    sign: true,
    maxAge: token.refreshExpiresIn * 1000
  })
}

module.exports = function(router) {
  // 登录
  router.post('/api/login', async ctx => {
    const user = ctx.request.body.user
    const password = ctx.request.body.password

    if (![user, password].every(x => x)) {
      return ctx.error(
        errorCode.InvalidParams.code,
        errorCode.InvalidParams.msg
      )
    }

    if (!emailPattern.test(user)) {
      return ctx.error(errorCode.InvalidUser.code, errorCode.InvalidUser.msg)
    }

    try {
      const userInfo = await login(user, password)
      const _user = await ctx.db.findOne(collections.user, {
        uidNumber: userInfo.uidNumber
      })
      if (!_user) {
        await createUser(ctx, userInfo)
      }
      const accessToken = token.generateAccessToken({
        sub: hashidEncode(userInfo.uidNumber)
      })
      const refreshToken = token.generateRefreshToken({
        sub: hashidEncode(userInfo.uidNumber)
      })
      // const host = ctx.request.host
      setAccessTokenCookie(ctx, accessToken)
      setRefreshTokenCookie(ctx, refreshToken)
      return ctx.success('登录成功')
    } catch (e) {
      let { code, msg } = e
      if (
        [errorCode.LdapBindFail.code, errorCode.LdapSearchError.code].includes(
          code
        )
      ) {
        code = errorCode.SystemError.code
        msg = errorCode.SystemError.msg
      }
      return ctx.error(code, msg)
    }
  })

  // 刷新token
  router.post('/api/refreshtoken', async ctx => {
    const refreshToken = ctx.cookies.get('refreshToken')
    if (!refreshToken) {
      return ctx.error(
        errorCode.InvalidParams.code,
        errorCode.InvalidParams.msg
      )
    }
    const valid = await validToken(ctx, refreshToken, 'refreshToken')
    if (valid) {
      setAccessTokenCookie(ctx, token.refreshAccessToken(refreshToken))
      return ctx.success(errorCode.Success.msg)
    }
  })

  // 注销
  router.post('/api/logout', async ctx => {
    const exp = ctx.state.user.exp
    let accessToken = ctx.state.user.token
    const refreshToken = ctx.cookies.get('refreshToken')
    const payload = token.decode(key, refreshToken, false)
    const res = ctx.db.insertMany('token', [
      {
        exp: new Date(exp * 1000),
        type: 'accessToken',
        token: accessToken
      },
      {
        exp: new Date(payload.exp * 1000),
        type: 'refreshToken',
        token: refreshToken
      }
    ])
    if (res) {
      ctx.success('退出登录成功')
    } else {
      ctx.error(errorCode.LogoutFail.code, errorCode.LogoutFail.msg)
    }
  })

  return router
}
