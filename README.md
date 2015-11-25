# Valentjs
--------
Valentjs provide easier way to register framework components (directives / routing / controllers) with features. Registered components could be transalted into different frameworks but right now only [AngularJS](https://github.com/angular/angular.js) available. 

----
Valentjs - just the wrapper for frameworks and could be used together with default frameworks approach.

----

## Valentjs + AngularJS
--------------------
-Vlanetjs provide methods to register and validate:

 - directvies
 - controllers
 - routing

and features form the box:

 - Writing code using ES6
 - Easier application configuration
 - URL manager 
 - Configured URL serializer/unserizlier
 - Multiple routing for one controller
 - Enchanted tcomb structures
 - Interfaces / pipes for directives
 - Debounced safe digest
 - No access to **$scope**


----------
## AngularJS bootstrap 

**valent** - same as **angular** - variable at the global namespace.

```js
import Angular from 'valent/angular';

let framework = new Angular({
  module: 'your-application-name'
});

valent.bootstrap(framework);
```

```html
<body ng-app="your-application-name"></body>
```

----

## Configuration

`valent.config` could be used as key/value storage. Keys with dots will be translated into nested objects.

```js
valent.config.set('routing.otherwise', '/home');
valent.config.set('routing.html5', true);

valent.config.get('routing'); 
// {otherwise: '/home', 'html5': true}
valent.config.get('routing.otherwise') // '/home' 
```

And there are number of shortctus

```js
valent.config.route.otherwise('/home');

valent.config.route.onChangeStart(route => {
	// ...
});

valent.config.route.addResolver('schema', () => {
	// ...
});

valent.config.exception.handler((error, causedBy) => {
	// ...
});
```
List of config shorctus

#### Routing
 - route.otherwise(url) - setup url for redirect if route does not exist
 - route.onChangeStart(callback) - add  hook for event **$routeChangeStart**
 - route.onChangeError(callback) - add hook for event **$routeChangeError**
 - route.addResolver(key, resolver) - add global resolver that will be applied for each route
 - route.enableHistoryApi() - enable html5 routing. By default - html5 routing is enabled
 - route.disableHistoryApi() - disable html5 routing
 - routing.requireBase(isBaseRequired) - is base tag requierd for application

#### Exceptins

 - exception.handler(handler) - setup exception handler that will available for framework's context and window.on('error')

----

## Controllers

Simple configuration
```js
class HomeController {
 // ...
}

valent.controller('home', HomeController, {
	url: '/home'
});
```
`valent.controller` takes 3 arguments

 - controller name
 - controller class
 - options

### Controller class

```js
class HomeController {
	constructor(resolvers, url, logger) {
	}
	
	destructor() {
	}
}
```

Constructor takes 3 arguments 

 - resolvers
 - url 
 - logger - configured logger. Always add colored controller's name to logs

`destructor` method is called when controller's **$scope** is destroyed ($destroy event).

### Controller options 

#### url
url for controller.   Could be a string:
```js
{
	url: '/home'
}
```
or array of strings (means that controller will be available by different routes)
```js
{
	url: ['/home', '/my/home']
}
```

#### resovle
Local resolvers. Function that will be executed before controller's constructor. Support promises. Resolved results will be passed to controller's constructor. Local resolvers will be executed [after global resolvers](http://i.imgur.com/eO43UR5.png). 
Here is [Angular documentation](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider#when) about route resolvers.
```js
{
	resolve: {
		'schema': () => {
			return Schema.load();
		}
	}
}
```

#### template
Template for controller
```js
{
	template: '<div>Yo!</div>'
}
```

#### templateUrl
```js
{
	templateUrl: '/templates/home.html'
}
```
#### Controller.render()
If there is static function **render()** at controller's class - it's result will be used as template.

```js
class HomeController {
	constructor() {
		// ...
	}
	
	static render() {
		return '<div>Yo!</div>'
	}
}
```

#### as 
 An identifier name for a reference to the controller. By default - **controller**.

```html
 <h1>{{ controller.greeting }}</h1>
```

If **as** defined:
```js
{
	as: '_'
}
```
Template should be
```html
 <h1>{{ _.greeting }}</h1>
```


#### struct
Structure for url.
```js
import * as primitives from 'valent/utils/primitives';

class HomeController {
	// ...
}

valent.controller(home, HomeController, {
	url: '/home',
	struct: {
		id: primitives.Num,
		tags: primitives.MaybeListStr,
		period: primitives.MaybeListDat
	}
});
```

----

## Directive

### Interfaces

### Options

### Pipes

----

## Defined structures

----

## Serializers

----

## URL 

----

## Services

### Digest
```js
import Digest from 'valent/angular/services/digest';
```

### Injector
```js
import Injector from 'valent/angular/services/injector';
```
AngularJS $injector. Only method **get()** is available and only after application bootstrap (after angular run phase).

```js
import Injector from 'valent/angular/services/injector';

class HomeController {
	constructor() {
		let $parse = Injector.get('$parse');
	}
}
```

### Watcher
```js
import Watcher from 'valent/angular/services/watcher';
```
Service is using to create watchers. watchGroup, watchCollection and deep watch - are not available. 

	NOTE: We highly recommend NOT to use watchers. No matter how watchers are created - using this service or native $scope methods.

```js
import Watcher from 'valent/angular/services/watcher';

class HomeController {
	title = 'Hello World!';
	
	constructor() {
		let watcher = new Watcher(this);
		watcher.watch('controller.title', title => {
			// ...
		});
	}
}
```

` new Watcher(context)` -  takes one argument - controller's context. Return watcher instance that setuped for controller's $scope.

` new Watcher()` - Return watcher instance that setuped for $rootScope.

###  Events
```js
import Events from 'valent/angular/services/events';
```

Provide access to $scope events. Constructor takes one argument - controller's context.

```js
import Events from 'valent/angular/services/events';

class HomeController {
	constructor() {
		let events = new Events(this);
		events.on('$routeChangeStart', () => {
			// ...
		});

		//events.broadcast()
		//events.emit()
	}
}
```
