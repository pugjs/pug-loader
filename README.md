# jade loader for webpack

## Usage

``` javascript
var template = require("jade!./file.jade");
// => returns file.jade content as template function
```

Don't forget to polyfill `require` if you want to use it in node.
See `webpack` documentation.

## License

MIT (http://www.opensource.org/licenses/mit-license.php)