// 通用错误状态码
const errorCode = {
  // global
  Success: { code: 200, msg: '请求成功' },
  SystemError: { code: 10001, msg: '系统错误' },
  ServiceUnavailable: { code: 10002, msg: '服务不可用' },
  NetworkError: { code: 10003, msg: '网络错误' },
  LdapBindFail: { code: 10004, msg: 'ldap服务器绑定失败' },
  LdapSearchError: { code: 10005, msg: 'ldap服务器查询失败' },
  InvalidParams: { code: 400, msg: '请求参数有误' },
  MissingToken: { code: 401, msg: '缺少token' },
  PermissionDenied: { code: 403, msg: '权限不足' },
  MethodNotAllowed: { code: 405, msg: '请求方法不允许' },
  InvalidTokenError: { code: 20003, msg: '不合法的token' },
  TokenExpiresError: { code: 20004, msg: 'token已过期' },
  TokenFormatError: { code: 20005, msg: 'token格式错误' },
  TokenRevoke: { code: 20006, msg: 'token已被回收' },

  // login
  InvalidUser: { code: 20001, msg: '用户不存在' },
  IncorrectPassword: {
    code: 20002,
    msg: '密码错误'
  }
}

module.exports = errorCode
