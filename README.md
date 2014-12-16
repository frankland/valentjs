04.12.14 README file will be amended and supplemented in few days.

# NGX

## 1. Overview

As bower component NGX provide runtime scripts for angular that simplify components declaration and decreases the amount of code.

As npm module NGX provide API for compilation ES6 application to ES5 using [traceur](https://github.com/google/traceur-compiler)


## 2. node module

```
npm install ngx
```

As console component - ngx proxy `init`, `setup`, `create`, `info` to [enchup](https://github.com/tuchk4/enchup) and add
`build` command.
P.S. Right now build will not work corectly from console becuase there is no way to setup `System.map` paramters.

### Source maps

If source maps enabled - in browser dev tools you will work with ES6 code.

### node API

```js
var ngx = require('ngx');

var Instance = ngx({
  src: 'src/application', // src directory
  dist: 'src/build',      // dist directory
  output: 'app.js',       // output file
  root: 'src'             // web server root
});

/**
 * If there are errors while compiling ES6 to ES5 - they will be injected into index.html
 * and shown in dialog.
 */
Instance.config.inject = 'src/index.html';

/**
 * Setup System.map parameter. Something like require.js paths config
 */
System.map["ngx"] = "../vendor/ngx/bower/runtime";
System.map["angular"] = "../application/angular";

Instance.compile().then(function() {

});
```


Available API methods:

 - compile - start compiling ES6 to ES5 and coping files from src to dist
 - setOptions - set [Traceur options](https://github.com/google/traceur-compiler/blob/master/src/Options.js#L25)
 - addProcessor - add post processor. [Example](https://github.com/tuchk4/ngx/blob/master/src/processors/module-names.js)

 - type - [parent class](https://github.com/tuchk4/ngx/blob/master/src/deployment/types/html.js#L19) for Type object.
 - addType - add type that should be copied from `src` to `dist` with `translte`, `normalize`, `process` hooks. [Example](https://github.com/tuchk4/ngx/blob/master/src/deployment/types/html.js)



 ### Examples

  - Example gulpfile - https://github.com/tuchk4/angular-ngx/blob/master/gulpfile.js
  - Example application - https://github.com/tuchk4/angular-ngx

To init already configured application run. Additional info [here](https://github.com/tuchk4/angular-ngx).

```
ngx init
```


## 3. Bower component

Install from gh.

```
bower install --save tuchk4/ngx#master
```

## 4. Controller

```js
import { Controller } from 'Runtime';

class Base {

}

class Demo extends Base {
  constructor() {

  }

  toggle() {

  }
}



Controller('demo')
.route('/')
.src(new Demo());

```

All public methods from `Demo` will be available in Scope. Also available `route` method that describe routing for controller.

```js
Controller('demo')
  .route('<url>', '<template>')
```

If template is not described - ngx will try to load template with same name as controller (in this case - `demo.html`) at the same dir.


Available methods:

 - src - scope. If `object` - all public methods will be available in scope. If `function` - will work as default angular controller.
 - route - controller's routing
 - at - controller's module
 - watch - object with scope watchers
 - defaults - default scope variables
 - resolve - routing resolving
 - dependencies - angular deps. If src is `object` and initialize function is defined -it will be called with all dependencies as arguments.
 - tempalte
 - templateUrl

All angular dependencies are available in this way:

```js

class Demo extends Base {

  toggle() {
    var LoadingOverlay = this.get('ui.loading-overlay');
    LoadingOverlay.toggle();
  }
}
```

Full example:

```js
import { Controller } from 'Runtime';

class Base {

}

class Demo extends Base {
  constructor() {

  }

  toggle() {

  }
}



Controller('application.demo')
.route('/') // will try to find demo.html (not `application.demo.html`) tempalte is same dir.
.resolve('meta', function(){
  return 'meta'
})
.resolve('acl', function(){
  return 'acl'
})
.defaults({
  name: 'ngx'
})
.watch({
  name: function(){
    console.log('name changed');
  }
})
.dependencies([
  'foo.bar',
  'baz'
])
.src(new Demo());
```


## 5. Directive

```js
import { Directive } from 'ngx';

class Controller {
  constructor(){

  }
}



Directive('hello-world')
.scope({
  name: '='
})
.defaults({

})
.controller(new Controller());

```

If directives template is not defined - ngx will try to find template at same dir with same name ('hello-world.html');

Available methods:

 - scope
 - defaults
 - controller
 - api
 - dependencies
 - tempalte
 - templateUrl


## 6. Directives API


`hello-world.js`
```js
import { Directive } from 'ngx';

class Controller {
  constructor(){

  }
}

class HelloWorld {
  constructor(scope){
    this.scope = scope;
  }

  toggle() {
    this.scope.visible = !this.scope.visible;
  }
}



Directive('hello-world')
 .api(HelloWorld)
 .controller(new Controller());
```

`hello-world.html`

```html
<div ng-show="visible">
 Hello World
</div>
```


`controller.js`
```js
import { Controller } from 'Runtime';

class Base {

}

class Demo extends Base {
  constructor() {

  }

  toggle() {
    this.api('hello-world').toggle(); // Will call toggle method from HelloWorld obect that have acces to diretive scope.
  }
}



Controller('demo')
.route('/')
.src(new Demo());
```


If there are few same directives:

```html
<hello-world api-key="first"></hello-world>
<hello-world api-key="second"></hello-world>
```

```js
class Demo extends Base {
  constructor() {

  }

  toggle() {
    this.api('hello-world#first').toggle();
  }
}

```

If there are nested directives

```html
<hello-world api-key="first">
  <hello-ngx api-key="second"></hello-ngx>
</hello-world>

```

```js
class Demo extends Base {
  constructor() {

  }

  toggle() {
    this.api('hello-world#first')('hello-ngx').toggle(); // P.S this way will be redeveloped
  }
}

```


## 7. Factory

```js
import { Factory } from 'Runtime';

var LoadingOverlay = {
  show: function(){
    console.log('Loading overlay show');
  },
  
  hide: function(){
    console.log('Loading overlay hide');
  }
};

Factory('ui.loading-overlay')
 .src(LoadingOverlay);
```



## 8. Compile Output

 - tempaltes/*
 - all.js - compiled application ES6 js code
 - all.map - source map
 - tempalte-cache.js - all html templates are puted to $templateChache service.
 
 
 Output is configrable. You can describe what file types should be copied from `src` dir to `dist` using `normalize`, `process` and `translate` hooks.
