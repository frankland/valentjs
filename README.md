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


-----

## AngularJS bootstrap

**valent** - same as **angular** - variable at the global namespace.

```js
import Angular from 'valent/angular';

let framework = new Angular('your-application-name', {

	/**
	 * if dependencies are defined - angular module
	 * will be created automatically
     *
     * Otherwise - you should register angular module
     * manually
	 */
	dependencies: [
		'ngRoute'
	]
});

valent.bootstrap(framework);
```

```html
<body ng-app="your-application-name"></body>
```
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


## Angular configuration (config/run)
```js
import Angular from 'valent/angular';

let framework = new Angular('your-application-name', {
	dependencies: [
		'ngRoute'
	]
});

// app - angular module
let app = framework.getAngularModule();

// same as with native angular
app.config(['$rootScope', $rootScope => {
	// ...
});

// same as with native angular
app.run(['$rootScope', $rootScope => {
	// ...
});
```
Or you can run config/run methods directly to angular.module

```js
import Angular from 'valent/angular';

let framework = new Angular('your-application-name', {
	dependencies: [
		'ngRoute'
	]
});

angular.module('your-application-name')
	.config(['$rootScope', $rootScope => {
	    // ...
	});
```
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

## Directive

### Interfaces

### Options

### Pipes

## Defined structures
```js
import * as primitives from 'valent/utils/primitives';
```

## Serializers

There 3 serializers

 - base serializer
 - rename serializer
 - url serializer - extends rename serializer with already added rules for all struc that defined in primitives (valent/utils/primitives)

```js
import Serializer from 'valent/serializers/serializer';
import RenameSerializer from 'valent/serializers/rename-serializer';
import UrlSerializer from 'valent/serializers/url-serializer';
```

#### Base serializer
Constructor takes 1 argument - params structure. Does not contain any encode/decode rules

 - encode(decoded)
 - decode(encoded)

##### RenameSerialzier

#### Custom serializer

Extends custom serializers from base or rename serializer and add rule for encode/decode.

```js
import tcomb from 'tcomb';
import Serializer from 'valent/serializers/serializer';

let User = tcomb.struct({
	id: tcomb.Num,
	name: tcomb.Str
});

class UserSerializer extends Serializer {
	constructor() {
		super({
			user: User
		});

		this.addRule(User, {
			encode: (user) => `${user.id}:${user.name}`,
			decode: raw => {
				let splitted = raw.split(':');
				return new UserStruct({
					id: splitted[0],
					name: splitted[1]
				});
			}
		});
	},

	/**
	 *  We should override encode/decode methods
	 *  because by default encode method takes object
	 *  same as struct that is defined in constructor
	 */
	encode(user) {
		return super.encode({user});
	}

	decode(raw) {
		let decoded = super.decode(raw);
		return decoded.user;
	}
}

let serializer = new UserSerializer();

let user = new User({
	id: 1,
	name: 'Lorem'
});

// encode
let encoded = serializer.encode(user);
equal(encoded, '1:Lorem');

// decode
let decoded = serializer.decode('2:Ipsum');
equal(decided, new User({
	id: 2,
	name: Ipsum
}));
```

## URL
```js
import Url from 'valent/angular/angular-url';
import * as primitives from 'valent/utils/primitives';

let url = new Url('/store/:id/:tags', {
	id: primitives.Num,
	search: ['q', primitives.MaybeListStr,
	tags: primitives.MaybeListStr,
	period: primitives.MaybeListDat
});
```

Constructor takes 2 arguments:

 - pattern - url pattern with placeholders.
 - struct - url params structure. Defined types. If struct value defined as array - first element - how this parameter will be renamed.

```js
import Url from 'valent/angular/angular-url';
import * as primitives from 'valent/utils/primitives';

let url = new Url('/store/:id/:tags', {
	id: primitives.Num,
	search: ['q', primitives.MaybeStr,
	tags: primitives.MaybeListStr,
	period: primitives.MaybeListDat
});

let route = url.stringify({
	id: 1,
	search: 'Hello',
	tags: ['yellow', 'large']
});

equal(route, '/store/1/yellow-large?q=Hello');

// And if current url is
// '/store/1/yellow-large?q=Hello?period=20151110-20151120'

let params = url.parse();
equal(parms, {
	id: 1,
	search: 'Hello',
	tags: ['yellow', 'large'],
	period: [
	// date objects. btw - not sure about correct timezones...
		Wed Nov 10 2015 00:00:00 GMT+0200 (EET),
		Wed Nov 20 2015 00:00:00 GMT+0200 (EET)
	]
});
```

Structures with **Maybe** prefix - means that this parameters are not required. If passed parameters have wrong type - will be exception. Parameters that are not described as placeholder at url pattern - will be added as GET parameter.

Provide helpful methods to work with url.
Available methods:

 - go(params, options) - replace current url with generating according to passed params. Works in angular context - all route events will be fired. **options** - event options that will be available at url watchers.
 - stringify(params) - return url according to passed params
 - redirect(params) - same as **go()** but with page reloading
 - parse - parse current url and return decoded params
 - watch(callback) - listen url changes (\$scope event **\$routeUpdate**) and execute callback. Callback arguments - params, diff, options.
	 - params - current url params.
	 - diff - difference between previous url update.
	 - options - event options that were passed to **go()** method
 - isEmpty - return true if there are no params in current url
 - link(key, fn) - describe setter for url param.
 - linkTo(store) - automatically link all structure params to store object
 - apply - execute all added **link()** functions

Url link and apply example. If url is changed (no matter how - back/forward browser buttons, url.go(params) method,  page reload etc.) - each **link** function will be executed and take current value of binded param.

```js
import Url from 'valent/angular/angular-url';

class HomeController {
	filters = {};

	constructor(resovled, url) {
		/**
		 *  url params "search", "tags"
		 *  will be linked this this.filters object
		 */
		url.linkTo(this.filters, [
			'tags',
			'search'
		]);

		// add link for "id" param
		url.link('id', id => {
			this.id = id;
		});

		url.link('search', search => {
			this.filters.search = search;
		});

		url.watch((params, diff, options) => {
			/**
			 * We can not run apply automatically
			 * on route update because there are
			 * a lot of cases when developers should
			 * call apply() manually
			 */
			url.apply();
		});
	}
}

valent.controller('store', StoreController, {
	url: '/store/:id/:tags',
	struct: {
		id: primitives.Num,
		search: ['q', primitives.MaybeStr,
		tags: primitives.MaybeListStr,
	}
});
```

## Services

### Digest
```js
import Digest from 'valent/angular/services/digest';
```
Wrapper for AngularJS

```js
import Digest from 'valent/angular/services/digest';

class HomeController {
	constructor() {
		digest(this);
	}
}
```

### Injector
```js
import Injector from 'valent/angular/services/injector';
```
AngularJS [\$injector](https://docs.angularjs.org/api/auto/service/$injector) service. Only method **get()** is available and only after application bootstrap (after angular run phase).

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
Service is using to create [watchers](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$watch). watchGroup, watchCollection and deep watch - are not available.

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

Provide access to [$scope events](https://docs.angularjs.org/guide/scope#scope-events-propagation). Constructor takes one argument - controller's context.

```js
import Events from 'valent/angular/services/events';

class HomeController {
	constructor() {
		let events = new Events(this);
		events.on('$routeChangeStart', () => {
			// ...
		});

		events.broadcast('my.custom.event', {
			greeting: 'Yo'
		});

		events.emit('my.custom.event', {
			greeting: 'Yo'
		});
	}
}
```
