# v0.1

```js
import Angular from 'valent/angular';

angular.module('playground', [
  'ngRoute'
]);

valent.config.exception.handler((error) => {
  console.log(error);
});

valent.config.route.onChangeError(() => {
  console.log('error');
});

valent.config.route.addResolver('user', () => {
  return {
    name: 'dev'
  }
});


let framework = new Angular({
  module: 'playground'
});


valent.bootstrap(framework);
```

```js

class IndexController {
  constructor(resolved, url, logger) {
    
  }

  static render() {
    return `
      <h1>Index Controlelr</h1>
      <div>
        <button ng-clikc="controller.cilck()">click me</button>
      </div>`;
  }
}

valent.controller('index', IndexController, {
  url: '/index',
  // template: '<div>asdsa</div>',
  struct: {
    id: Num
  },
  resolve: {
    schema: () => {
      return ['a', 'b', 'c'];
    }
  }
});
```

```js

class HelloWorld {
  constructor(clicker, selector, params) {
    
  }

  require(ngModel) {
    console.log(ngModel);
  }
 
  static render() {

    return `
      <div>
        {{ controller.name }}
        <button ng-click="controller.click()">click me</button>
      </div>`;
  }
}


valent.component('hello-world', HelloWorld, {
  interfaces: {  // :D
    clicker: Clicker
  },
  optional: { // :|
    selector: Selector
  },
  substitution: { // :(
    toggler: Toggler
  },
  params: {
    title: '@',
    appName: '@'
  },
  require: ['ngModel']
});

```
