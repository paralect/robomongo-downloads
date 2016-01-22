'use strict'

let config = require('./config')

// Bootstrap server
let app = require('koa')()
require('./config/koa')(app)

app.listen(config.port, config.ip, () => {
  console.log('Koa server listening on %d, in %s mode', config.port, config.env)
})

// Expose app
exports = module.exports = app
