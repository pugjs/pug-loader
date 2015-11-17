# jade loader for webpack

## Usage

``` javascript
var template = require("jade!./file.jade");
// => returns file.jade content as template function
```

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

### Pre-render templates
Paired with the [apply-loader](https://github.com/mogelbrod/apply-loader), produce static templates:

```javascript
var template = require("apply!jade!./file.jade");
// => returns file.jade content as template string
```

#### Passing locals
```javascript
var locals = {
	city: 'New York'
};
var template = require("apply?{obj: ${JSON.stringify(locals)}}!jade!./file.jade");
// => returns file.jade content as template string rendered with template options
```

### Embedded resources

Try to use `require` for all your embedded resources, to process them with webpack.

``` jade
div
  img(src=require("./my/image.png"))
```

You need to configure loaders for these filetypes too. (Take a look at the [file-loader](https://github.com/webpack/file-loader).)

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
