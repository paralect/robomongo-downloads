'use strict'

const _ = require('lodash')
const path = require('path')
const fs = require('fs')

let env = process.env.NODE_ENV || 'development'

let base = {
  env: env,
  port: 4000,
  logType: 'combined',
  uploadsDir: path.join(__dirname, '../../uploads'),
  uploadToken: process.env.ROBOMONGO_UPLOAD_TOKEN || 'dev'
}

if (!fs.existsSync(base.uploadsDir)) {
  fs.mkdirSync(base.uploadsDir)
}

base = _.merge(base, require(`./${env}.js`) || {})

let loadLocalConfig = (name) => {
  let localConfigPath = path.join(__dirname, name)
  if (fs.existsSync(localConfigPath)) {
    base = _.merge(base, require(localConfigPath))
    console.log(`loaded ${localConfigPath} config`)
  }
}

// local file can be used to customize any config values during development
loadLocalConfig('local.js')

module.exports = base
