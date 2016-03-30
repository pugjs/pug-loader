import path from 'path'
import loaderUtils from 'loader-utils'
import jade from 'jade'
import MyParser from './parser'

export default function (source) {
  if (this.cacheable) this.cacheable()
  var callback = this.async()
  var req = loaderUtils.getRemainingRequest(this).replace(/^!/, '')
  var query = loaderUtils.parseQuery(this.query)
  var stringifyLoader = path.join(__dirname, 'stringify.loader.js')
  var loaderContext = this
  var loadModule = this.loadModule
  var resolve = this.resolve
  var missingFileMode = false

  this.fileContents = {}
  this.filePaths = {}
  this.getFileContent = function (context, request) {
    request = loaderUtils.urlToRequest(request, query.root)
    var baseRequest = request
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
        loadModule(`-!${stringifyLoader}!${request}`, function (err, source) {
          if (err) {
            return callback(err)
          }

          loaderContext.filePaths[`${context} ${baseRequest}`] = request
          loaderContext.fileContents[request] = JSON.parse(source)

          if (!isSync) {
            run()
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

  run()
  function run () {
    try {
      var tmplFunc = jade.compile(source, {
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
