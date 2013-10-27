# jade loader for webpack

## Usage

``` javascript
var template = require("jade!./file.jade");
// => returns file.jade content as template function
```

Don't forget to polyfill `require` if you want to use it in node.
See `webpack` documentation.

### Webpack-powered includes

```
var template = require("jade?webpackInclude=1!./file.jade");
```

This will convert all `include` statements in the template to webpack-enabled
require statements. This is useful if you have prefilters that you want to apply
to the included templates.

It also has the effect of de-duplicating sub-templates that are included in
multiple places.

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
