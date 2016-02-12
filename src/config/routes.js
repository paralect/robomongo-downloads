'use strict'

let Router = require('koa-router')
let parse = require('co-busboy')
let indexRouter = new Router()
let config = require('./../config')
let fs = require('fs')
let path = require('path')
let serve = require('koa-static')
let Promise = require('bluebird')
let mkdirp = Promise.promisify(require('mkdirp'))
let downloadService = require('./../downloads.service')

indexRouter
  .post('/upload', function *() {
    let os = this.query.os
    let version = this.query.version
    let uploadToken = this.query.token

    // Temp flag, to store packages built on centos in separate directory
    let linuxType = this.query.linux_type
    if (uploadToken !== config.uploadToken) {
      this.body = 'upload token is invalid'
      return
    }

    if (!os || !version) {
      this.body = 'os and version are mandatory query parameters'
      return
    }

    let uploadPath = path.join(config.uploadsDir, version, os)
    if (linuxType) {
      uploadPath = path.join(uploadPath, linuxType)
    }
    let pathExists = fs.existsSync(uploadPath)
    if (!pathExists) {
      yield mkdirp(uploadPath)
    }

    let parts = parse(this, {
      autoFields: true
    })

    let part = yield parts
    while (part) {
      let stream = fs.createWriteStream(path.join(uploadPath, part.filename))
      part.pipe(stream)
      console.log('uploading %s -> %s', part.filename, stream.path)
      part = yield parts
    }

    this.body = 'ok'
  })

module.exports = function (app) {
  app.use(indexRouter.routes())
  app.use(function *(next) {
    if (!config.protectPrivateBuilds) {
      yield* next
      return
    }
    let root = path.resolve(config.uploadsDir)
    let filePath = path.join(root, this.path)

    let fileStats
    try {
      fileStats = fs.statSync(filePath)
    } catch (e) {
      // not found
    }

    // checks if user allowed to download specific build
    if (fileStats && fileStats.isFile()) {
      let buildVersion = this.path.split('/')[1]

      let canDowndloadResult = yield downloadService.verifyDownload(this.query.token || '', buildVersion)
      if (canDowndloadResult.canDownload) {
        yield* next
      } else {
        this.status = canDowndloadResult.statusCode
      }
    } else {
      yield* next
    }
  })
  app.use(serve(config.uploadsDir))
  app.use(require('koa-serve-index')(config.uploadsDir))
}
