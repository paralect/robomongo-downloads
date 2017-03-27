'use strict'

let Promise = require('bluebird')
let request = Promise.promisify(require('request'))
Promise.promisifyAll(request)
let config = require('./config/environment')

module.exports.verifyDownload = function (token, canonicalVersion, referer, os) {
  let url = `${config.buildApiUrl}/builds/${canonicalVersion}/download?token=${token}&secret=${config.buildsApiSecret}&referer=${referer}&os=${os}`

  return request.getAsync(url)
    .then(function (res) {
      return {
        canDownload: res.statusCode === 200,
        statusCode: res.statusCode
      }
    })
    .catch(function () {
      return false
    })
}
