import path from 'path'
import loaderUtils from 'loader-utils'
import jade from 'jade'
import MyParser from './parser'

var req, query, resolve, loadModule, loaderContext, callback
var missingFileMode = false

export default class JadeLoader {
  constructor (source) {
    this.cacheable && this.cacheable()
    req = loaderUtils.getRemainingRequest(this).replace(/^!/, '')
    query = loaderUtils.parseQuery(this.query)
    loadModule = this.loadModule
    resolve = this.resolve
    this.fileContents = {}
    this.filePaths = {}
    loaderContext = this
  }

  getFileContent (context, request) {
    request = loaderUtils.urlToRequest(request, query.root)
    var baseRequest = request
    var self = this
    var isSync = true
    let filePath = loaderContext.filePaths[`${context} ${request}`]
    if (filePath) {
      return filePath
    }
    resolve(context, `${request}.jade`, (err, _request) => {
      if (err) {
        resolve(context, request, (err2, _request) => {
          if (err2) {
            return callback(err2)
          }

          request = _request
          next()
        })
        return
      }

      request = _request
      next()
      function next () {
        loadModule(`-!${path.join(__dirname, 'stringify.loader.js')}!${request}`, function (err, source) {
          if (err) {
            return callback(err)
          }

          loaderContext.filePaths[`${context} ${baseRequest}`] = request
          loaderContext.fileContents[request] = JSON.parse(source)

          if (!isSync) {
            self.run()
          } else {
            isSync = false
          }
        })
      }
    })
    if (isSync) {
      isSync = false
      missingFileMode = true
      throw new Error('continue')
    } else {
      return loaderContext.filePaths[`${context} ${baseRequest}`]
    }
  }

  run () {
    try {
      var tmplFunc = jade.compile(this.source, {
        parser: loadModule ? MyParser : undefined,
        filename: req,
        self: query.self,
        globals: ['require'].concat(query.globals || []),
        pretty: query.pretty,
        locals: query.locals,
        doctype: query.doctype || 'html',
        compileDebug: loaderContext.debug || false,
        loader: loaderContext
      })
    } catch (e) {
      if (missingFileMode) {
        // Ignore, it'll continue after async action
        missingFileMode = false
        return
      }
      throw e
    }

    loaderContext.callback(null, JSON.stringify(tmplFunc(query.locals)))
  }

}
