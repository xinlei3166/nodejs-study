const ldap = require('ldapjs')
const error = require('../exception').error
const errorCode = require('../exception/error-code')
const config = require('../settings').LDAP

function createClient() {
  return ldap.createClient({
    url: config.server
  })
}

function bind(client, dn, password, code, msg) {
  return new Promise((resolve, reject) => {
    client.bind(dn, password, function(err) {
      if (err) {
        client.unbind()
        reject(error(code, msg))
      } else {
        resolve(true)
      }
    })
  })
}

function search(client, email) {
  let user
  const opts = {
    filter: `(mail=${email})`,
    scope: 'sub', // 查询范围没有深度限制
    timeLimit: 500 // 查询超时时间
  }

  return new Promise((resolve, reject) => {
    client.search(`${config.searchDn},${config.baseDn}`, opts, function(
      err,
      res
    ) {
      // 查询结果事件响应
      res.on('searchEntry', function(entry) {
        user = entry.object
      })

      res.on('searchReference', function(referral) {
        console.log('referral: ' + referral.uris.join())
      })

      // 查询错误事件
      res.on('error', function() {
        client.unbind()
        reject(
          error(errorCode.LdapSearchError.code, errorCode.LdapSearchError.msg)
        )
      })

      // 查询结束
      res.on('end', function() {
        resolve(user)
      })
    })
  })
}

async function login(email, password) {
  const client = createClient()
  await bind(
    client,
    `${config.bindDn},${config.baseDn}`,
    config.bindPassword,
    errorCode.LdapBindFail.code,
    errorCode.LdapBindFail.msg
  )

  const user = await search(client, email)

  if (user) {
    await bind(
      client,
      `${user.dn}`,
      password,
      errorCode.IncorrectPassword.code,
      errorCode.IncorrectPassword.msg
    )
    client.unbind()
  } else {
    throw error(errorCode.InvalidUser.code, errorCode.InvalidUser.msg)
  }

  return user
}

// login('xxxxxx@xxxxxx.com', 'xxxxxx')
//   .then(user => {
//     console.log('user', user)
//   })
//   .catch(e => {
//     console.log('e', e)
//   })

module.exports = login
