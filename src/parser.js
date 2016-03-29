import JadeParser from 'jade/lib/parser'
import filters from 'jade/lib/filters'
import nodes from 'jade/lib/nodes'
import utils from 'jade/lib/utils'
import path from 'path'

var loaderContext, callback
var dirname = path.dirname

export default class Parser extends JadeParser {
  constructor (str, filename, options) {
    super(str, filename, options)
    this._mustBeInlined = false
    loaderContext = options.loader
  }

  parseMixin () {
    this._mustBeInlined = true
    return JadeParser.prototype.parseMixin.call(this)
  }

  parseBlock () {
    this._mustBeInlined = true
    return JadeParser.prototype.parseBlock.call(this)
  }

  parseCall () {
    this._mustBeInlined = true
    return JadeParser.prototype.parseCall.call(this)
  }

  parseExtends () {
    if (!callback) {
      callback = loaderContext.async()
    }
    if (!callback) {
      return JadeParser.prototype.parseExtends.call(this)
    }

    let request = this.expect('extends').val.trim()
    let context = dirname(this.filename.split('!').pop())

    let path = loaderContext.getFileContent(context, request)
    let str = loaderContext.fileContents[path]
    let parser = new this.constructor(str, path, this.options)

    parser.blocks = this.blocks
    parser.contexts = this.contexts
    this.extending = parser

    return new nodes.Literal('')
  }

  parseInclude () {
    if (!callback) {
      callback = loaderContext.async()
    }
    if (!callback) {
      return JadeParser.prototype.parseInclude.call(this)
    }

    var tok = this.expect('include')

    let request = tok.val.trim()
    let context = dirname(this.filename.split('!').pop())
    let path = loaderContext.getFileContent(context, request)
    let str = loaderContext.fileContents[path]

    // has-filter
    if (tok.filter) {
      let hasFilterStr = str.replace(/\r/g, '')
      let options = {filename: path}
      let constantinople
      if (tok.attrs) {
        tok.attrs.attrs.forEach((attribute) => {
          options[attribute.name] = constantinople.toConstant(attribute.val)
        })
      }
      hasFilterStr = filters(tok.filter, hasFilterStr, options)
      return new nodes.Literal(hasFilterStr)
    }

    // non-jade
    if (path.substr(-5) !== '.jade') {
      let nonJadeStr = str.replace(/\r/g, '')
      return new nodes.Literal(nonJadeStr)
    }

    let parser = new this.constructor(str, path, this.options)
    parser.dependencies = this.dependencies

    parser.blocks = utils.merge({}, this.blocks)
    parser.included = true

    parser.mixins = this.mixins

    this.context(parser)
    var ast = parser.parse()
    this.context()
    ast.filename = path

    if (parser._mustBeInlined) {
      this._mustBeInlined = true
    }

    return ast
  }
}
