# verifyjs

## Getting started

###Install with NPM:
``` javascript
npm install verifyjs
```

## Usage

require as module
``` javascript
var verifyjs = require('verifyjs')
```

set options
``` javascript
var options = {
  port: 8080,
  base: __dirname + "/app",
  dir: "models",
  ignore: ['node_modules', 'test', 'bin', 'scripts', 'vendor', '.git'],
  jshint: {
    "es5": true,
    "maxcomplexity": 5,
    "white": false,
    "sub": true,
    "lastsemic": true
  }
};
```

initialize with options
``` javascript
verifyjs(options);
```

Using your browser, open the app's URL at port 8080 (or whichever port you set) to view the results from running JSHint on your specified directory.