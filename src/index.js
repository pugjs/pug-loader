import path from 'path'
import loaderUtils from 'loader-utils'
import jade from 'jade'
import MyParser from './parser'

let req = loaderUtils.getRemainingRequest(this).replace(/^!/, '')
let query = loaderUtils.parseQuery(this.query)
let missingFileMode = false
let resolve, loadModule, loaderContext, callback
let fileContents = {}
let filePaths = {}

export default class JadeLoader {
  constructor (source) {
    this.cacheable && this.cacheable()
    loadModule = this.loadModule
    resolve = this.resolve
    loaderContext = this
  }

  getFileContent (context, request) {
    request = loaderUtils.urlToRequest(request, query.root)
    let baseRequest = request
    let filePath = filePaths[`${context} ${request}`]
    if (filePath) {
      return filePath
    }
    let isSync = true
    let self = this
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

          filePaths[context + ' ' + baseRequest] = request
          fileContents[request] = JSON.parse(source)

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
      return filePaths[`${context} ${baseRequest}`]
    }
  }

  run () {
    let tmplFunc
    try {
      tmplFunc = jade.compile(this.source, {
        parser: loadModule ? MyParser : undefined,
        filename: req,
        self: query.self,
        globals: ['require'].concat(query.globals || []),
        pretty: query.pretty,
        locals: query.locals,
        doctype: query.doctype || 'html',
        compileDebug: loaderContext.debug || false
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
