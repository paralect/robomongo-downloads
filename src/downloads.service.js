'use strict'

let Promise = require('bluebird')
let request = Promise.promisify(require('request'))
Promise.promisifyAll(request)
let config = require('./config/environment')

module.exports.verifyDownload = function (token, canonicalVersion, referer) {
  let url = `${config.buildApiUrl}/builds/${canonicalVersion}/download?token=${token}&secret=${config.buildsApiSecret}&referer=${referer}`

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
