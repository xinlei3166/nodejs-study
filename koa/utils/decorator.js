// check token
const errorCode = require('../exception/error-code')
const { unless } = require('../constant')
const token = require('../utils/token')
const { hashidDecode } = require('../utils/utils')
const { collections } = require('../constant')
const settings = require('../settings')

const validToken = async (ctx, _token, _tokenType) => {
  const revokeToken = await ctx.db.findOne(collections.token, {
    token: _token,
    type: _tokenType
  })

  if (revokeToken) {
    return ctx.error(errorCode.TokenRevoke.code, errorCode.TokenRevoke.msg)
  }

  try {
    const payload = token.decode(settings.SECRET_KEY, _token)

    const tokenType = payload.tokenType
    if (tokenType !== _tokenType) {
      return ctx.error(errorCode.InvalidTokenError.code, '不合法的token type')
    }

    const sub = hashidDecode(payload.sub)
    const user = await ctx.db.findOne(collections.user, {
      uidNumber: String(sub)
    })
    if (!user) {
      return ctx.error(errorCode.InvalidTokenError.code, '不合法的token sub')
    } else {
      ctx.state.user = { sub: String(sub), exp: payload.exp, token: _token }
      return true
    }
  } catch (e) {
    const { code, msg } = e
    return ctx.error(code, msg)
  }
}

const checkToken = async (ctx, next) => {
  if (!unless.includes(ctx.url)) {
    let accessToken = ctx.request.headers.authorization
    if (!accessToken) {
      return ctx.error(errorCode.MissingToken.code, errorCode.MissingToken.msg)
    }
    if (!accessToken.startsWith('Bearer ')) {
      return ctx.error(
        errorCode.TokenFormatError.code,
        errorCode.TokenFormatError.msg
      )
    }
    accessToken = accessToken.split(' ')[1]

    const valid = await validToken(ctx, accessToken, 'accessToken')
    if (!valid) return
  }
  await next()
}

module.exports = {
  validToken,
  checkToken
}
