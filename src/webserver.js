/*
 *       .                             .o8                     oooo
 *    .o8                             "888                     `888
 *  .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
 *    888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
 *    888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
 *    888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
 *    "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 *  ========================================================================
 *  Author:     Chris Brame
 *  Updated:    1/20/19 4:43 PM
 *  Copyright (c) 2014-2019. All rights reserved.
 */

const _ = require('lodash')
const nconf = require('nconf')
  .argv()
  .env()

const express = require('express')
const { resolve } = require('path')
const WebServer = express()
const winston = require('./logger')
const middleware = require('./middleware')
const routes = require('./routes')
// const I18N = require('@ladjs/i18n')
const server = require('http').createServer(WebServer)
let port = nconf.get('port') || 8118

;(app => {
  'use strict'

  // Load Events
  require('./emitter/events')

  module.exports.server = server
  module.exports.app = app
  module.exports.init = async (db, callback, p) => {
    if (p !== undefined) port = p
    middleware(app, db, function (middleware, store) {
      module.exports.sessionStore = store

      /*
      // Setup i18n
      const i18n = new I18N({
        defaultLocale: 'pt',               // ou 'pt-BR' se preferir o padrão com região
        locales: ['en', 'pt'],             // ← obrigatório: inclua 'pt' aqui!
        // ou se quiser mais: ['en', 'pt', 'es', 'fr']

        // Outras opções úteis (recomendadas):
        //directory: path.join(__dirname, '../locales'),  // pasta com arquivos JSON de traduções (ex: locales/pt.json)
        directory: resolve('../locales'),
        objectNotation: true,              // permite chaves como 'header.title'
        updateFiles: false,                // não atualiza arquivos automaticamente (útil em prod)
        indent: '  ',
        extension: '.json',
        cookie: 'locale',                  // nome do cookie para persistir a escolha do usuário
        logDebugFn: console.log,
        logWarnFn: console.log,
        logErrorFn: console.log
      })
      app.use(i18n.middleware);
      app.use(i18n.redirect);
      */

      routes(app, middleware)

      if (typeof callback === 'function') callback()
    })
  }

  module.exports.listen = (callback, p) => {
    if (!_.isUndefined(p)) port = p

    server.on('error', err => {
      if (err.code === 'EADDRINUSE') {
        winston.error('Address in use, exiting...')
        server.close()
      } else {
        winston.error(err.message)
        throw err
      }
    })

    server.listen(port, '0.0.0.0', () => {
      winston.info('Trudesk is now listening on port: ' + port)

      if (_.isFunction(callback)) return callback()
    })
  }

  module.exports.installServer = function (callback) {
    const router = express.Router()
    const controllers = require('./controllers/index.js')
    const path = require('path')
    const hbs = require('express-hbs')
    const hbsHelpers = require('./helpers/hbs/helpers')
    const bodyParser = require('body-parser')
    const favicon = require('serve-favicon')
    const pkg = require('../package.json')
    const routeMiddleware = require('./middleware/middleware')(app)

    app.set('views', path.join(__dirname, './views/'))
    app.engine(
      'hbs',
      hbs.express3({
        defaultLayout: path.join(__dirname, './views/layout/main.hbs'),
        partialsDir: [path.join(__dirname, './views/partials/')]
      })
    )
    app.set('view engine', 'hbs')
    hbsHelpers.register(hbs.handlebars)

    app.use('/assets', express.static(path.join(__dirname, '../public/uploads/assets')))

    app.use(express.static(path.join(__dirname, '../public')))
    app.use(favicon(path.join(__dirname, '../public/img/favicon.ico')))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    router.get('/healthz', (req, res) => {
      res.status(200).send('OK')
    })
    router.get('/version', (req, res) => {
      return res.json({ version: pkg.version })
    })

    router.get('/install', controllers.install.index)
    router.post('/install', routeMiddleware.checkOrigin, controllers.install.install)
    router.post('/install/elastictest', routeMiddleware.checkOrigin, controllers.install.elastictest)
    router.post('/install/mongotest', routeMiddleware.checkOrigin, controllers.install.mongotest)
    router.post('/install/existingdb', routeMiddleware.checkOrigin, controllers.install.existingdb)
    router.post('/install/restart', routeMiddleware.checkOrigin, controllers.install.restart)

    app.use('/', router)

    app.use((req, res) => {
      return res.redirect('/install')
    })

    require('socket.io')(server)

    require('./sass/buildsass').buildDefault(err => {
      if (err) {
        winston.error(err)
        return callback(err)
      }

      if (!server.listening) {
        server.listen(port, '0.0.0.0', () => {
          return callback()
        })
      } else {
        return callback()
      }
    })
  }
})(WebServer)
