# prettify-source
prettify all the files in the source directory. prettify-source is quite efficient, it will only prettify files that:
1. have changed (or been created)
2. can be prettified (html, css, scss, sass, less, js and json)
3. need to be prettified - they might already be beautiful! :)

### usage

`npm i prettify-source`

or 

`npm i -D prettify-source`

```js
const prettifySrc = require("prettify-source");
prettifySrc("path/to/source/directory");
```

Good to add as part of a watch script.