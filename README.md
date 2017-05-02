# pug-loader

Pug loader for webpack.

## Installation

npm install --save json-loader

## Sample webpack.config.js

``` json
var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        "server": [
            './server'
        ]
    },
    output: {
        path: `${__dirname}/__build__`,
        publicPath: '/__build__/',
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.jade$/,
                loaders: ['pug'],
                exclude: /node_modules/,
                include: path.join(__dirname)
            }
        ]
    }
};
```

## Usage

``` javascript
var template = require("pug-loader!./file.pug");
// => returns file.pug content as template function

// or, if you've bound .pug to pug-loader
var template = require("./file.pug");

var locals = { /* ... */ };

var html = template(locals);
// => the rendered HTML
```

For more information on how to use webpack loaders, check the [official documentation][using-loaders].

### Legacy `.jade` files

pug-loader fully supports `.jade` files. Just use pug-loader with `.jade` files as you would with a `.pug` file.

### Includes

If you are using [includes], you must make sure that `.pug` (and if needed for legacy files, `.jade`) is bound to pug-loader. Check the webpack documentation on how to do that for [CLI][module-bind-cli] and for [configuration files][module-bind-config].

### Options

The following [options] are available to be set for the loader. They are all mapped directly to Pug options, unless pointed out otherwise.

- `doctype`
  - Unlike Pug, it defaults to `"html"` if not set
- `globals`
- `self`
- `plugins`
  - Note that you cannot specify any Pug plugins implementing `read` or `resolve` hooks, as those are reserved for the loader
- `pretty`
- `root`
  - webpack uses its own file resolving mechanism, so while it is functionally equivalent to the Pug option with the same name, it is implemented differently

### Embedded resources

Try to use `require` for all your embedded resources, to process them with webpack.

```pug
div
  img(src=require("./my/image.png"))
```

Remember, you need to configure loaders for these file types too. You might be interested in the [file loader][file-loader].

## License

[MIT][mit]

[file-loader]: https://github.com/webpack/file-loader
[includes]: https://pugjs.org/language/includes.html
[mit]: https://www.opensource.org/licenses/mit-license.php
[module-bind-cli]: https://webpack.js.org/concepts/loaders/#via-cli
[module-bind-config]: https://webpack.js.org/concepts/loaders/#configuration
[options]: https://webpack.js.org/configuration/module/#useentry
[using-loaders]: https://webpack.js.org/loaders
