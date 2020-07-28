const emailPattern = require('../utils/patterns').emailPattern
const token = require('../utils/token')
const login = require('../utils/ldap-client')
const collections = require('../constant').collections
const errorCode = require('../exception/error-code')
const settings = require('../settings')
const hashidEncode = require('../utils/utils').hashidEncode
const hashidDecode = require('../utils/utils').hashidDecode

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
  return await ctx.db.insertOne(collections.User, obj)
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
      const _user = await ctx.db.findOne(collections.User, {
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
      ctx.cookies.set('accessToken', accessToken, {
        httpOnly: false,
        overwrite: false,
        // domain: host,
        // path: '/index',
        maxAge: token.accessExpiresIn * 1000
        // expires: new Date('2021-02-06'),
      })
      ctx.cookies.set('refreshToken', refreshToken, {
        httpOnly: false,
        overwrite: false,
        maxAge: token.refreshExpiresIn * 1000
      })
      // ctx.set('authorization', 'Bearer ' + accessToken)
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
    const refreshToken = ctx.request.body.refreshToken
    if (!refreshToken) {
      return ctx.error(
        errorCode.InvalidParams.code,
        errorCode.InvalidParams.msg
      )
    }
    const revokeRefreshToken = await ctx.db.findOne(collections.RevokeToken, {
      key: 'refreshToken_' + refreshToken
    })
    if (revokeRefreshToken) {
      return ctx.error(errorCode.TokenRevoke.code, errorCode.TokenRevoke.msg)
    }

    try {
      const payload = token.decode(settings.SECRET_KEY, refreshToken)
      const sub = hashidDecode(payload.sub)
      const user = await ctx.db.findOne(collections.User, {
        uidNumber: String(sub)
      })
      if (!user) {
        return ctx.error(errorCode.InvalidTokenError.code, '不合法的token sub')
      } else {
        ctx.cookies.set('accessToken', token.refreshAccessToken(refreshToken), {
          httpOnly: false,
          overwrite: false,
          maxAge: token.accessExpiresIn * 1000
        })
        return ctx.success(errorCode.Success.msg)
      }
    } catch (e) {
      const { code, msg } = e
      return ctx.error(code, msg)
    }
  })

  // 注销
  router.post('/api/logout', async ctx => {
    ctx.success(errorCode.Success.msg)
  })

  return router
}
