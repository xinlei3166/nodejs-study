const Request = require('request')
const url = 'https://www.baidu.com'

const request = Request.defaults({
  headers: {//设置请求头
    "content-type": "application/json",
  },
  rejectUnauthorized: false
})

request({
  url: url,//请求路径
  method: "GET",//请求方式，默认为get
}, function(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(response.body)
  }
});


