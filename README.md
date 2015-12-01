# Valentjs
---
[![Join the chat at https://gitter.im/frankland/valent](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/frankland/valent?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Valentjs provide easier way to register framework components (directives / routing / controllers) with features. Registered components could be transalted into different frameworks but right now only [AngularJS](https://github.com/angular/angular.js) available. 

Valentjs - just the wrapper for frameworks and could be used together with default frameworks approach.


- [Valentjs](#valentjs)
- [Valentjs + AngularJS](#valentjs--angularjs)
- [AngularJS bootstrap](#angularjs-bootstrap)
- [Configuration](#configuration)
  - [Routing](#routing)
  - [Exceptins](#exceptins)
- [Angular configuration (config/run)](#angular-configuration-configrun)
- [Controllers](#controllers)
  - [Controller class](#controller-class)
  - [Controller options](#controller-options)
    - [controller.option.as](#controlleroptionas)
    - [controller.option.url](#controlleroptionurl)
    - [controller.option.params](#controlleroptionparams)
    - [controller.option.resolve](#controlleroptionresolve)
    - [controller.option.struct](#controlleroptionstruct)
    - [controller.option.template](#controlleroptiontemplate)
    - [controller.option.templateUrl](#controlleroptiontemplateurl)
    - [Controller.render()](#controllerrender)
- [Route](#route)
  - [url](#url)
  - [Route options](#route-options)
    - [route.option.params](#routeoptionparams)
    - [route.option.resolve](#routeoptionresolve)
    - [route.option.template](#routeoptiontemplate)
    - [route.option.templateUrl](#routeoptiontemplateurl)
    - [route.option.struct](#routeoptionstruct)
- [Directive](#directive)
  - [Directive Controller class](#directive-controller-class)
  - [Directive options](#directive-options)
    - [directive.option.as](#directiveoptionas)
    - [directive.option.template](#directiveoptiontemplate)
    - [directive.option.templateUrl](#directiveoptiontemplateurl)
    - [directive.option.restrict](#directiveoptionrestrict)
    - [directive.option.require](#directiveoptionrequire)
    - [directive.option.params](#directiveoptionparams)
    - [directive.option.interfaces](#directiveoptioninterfaces)
    - [directive.option.options (rename)](#directiveoptionoptions-rename)
    - [directive.option.pipes](#directiveoptionpipes)
  - [Directive Params](#directive-params)
- [Defined structures](#defined-structures)
- [Serializers](#serializers)
  - [Base serializer](#base-serializer)
  - [Rename serializer](#rename-serializer)
  - [Custom serializer](#custom-serializer)
  - [Url serializer](#url-serializer)
- [Url](#url)
- [Url Manager](#url-manager)
- [Services](#services)
  - [Digest](#digest)
  - [Injector](#injector)
  - [Watcher](#watcher)
  - [Events](#events)
- [Decorators](#decorators)
- [Base Components](#base-components)
- [Contributing](#contributing)
- [TODO](#todo)


TOC was generated using [doctoc](https://github.com/thlorenz/doctoc).

# Valentjs + AngularJS

Valentjs provide methods to register and validate:

 - directvies
 - controllers
 - routing

and features form the box:

 - Writing code using ES6
 - Easier application configuration
 - URL manager 
 - Configured URL serializer/unserializer
 - Custom serializers
 - Multiple routing for one controller
 - Enchanted [tcomb](https://github.com/gcanti/tcomb) structures
 - Interfaces / pipes for directives
 - Debounced safe digest
 - No access to **$scope**

Simple examples (valentjs / angularjs)

- [controller](https://gist.github.com/tuchk4/eed3b6e58d52dac1d51e)
- [directive](https://gist.github.com/tuchk4/6c25e0fc25cb5eb5d31d)
- [route](https://gist.github.com/tuchk4/12683667be66b562794c)
- [configuration](https://gist.github.com/tuchk4/7ad1707ee0aed2df673a)

# AngularJS bootstrap 

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
# Configuration

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

## Routing
 - route.otherwise(url) - setup url for redirect if route does not exist
 - route.onChangeStart(callback) - add  hook for event **$routeChangeStart**
 - route.onChangeError(callback) - add hook for event **$routeChangeError**
 - route.addResolver(key, resolver) - add [global resolver](http://i.imgur.com/eO43UR5.png) that will be applied for each route
    - resolver(name, params) - same as [local resolver](#routeoptionresolve). Takes 2 arguments - route name, route params.
 - route.enableHistoryApi() - enable html5 routing. By default - html5 routing is enabled
 - route.disableHistoryApi() - disable html5 routing
 - routing.requireBase(isBaseRequired) - is base tag requierd for application

## Exceptions

 - exception.handler(handler) - setup exception handler that will available for framework's context and window.on('error')


# Angular configuration (config/run)
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
# Controllers

Simple configuration
```js
class HomeController {
    // ...
} 

valent.controller('home', HomeController);

// or with already attached route
valent.controller('home', HomeController, {
    url: '/home'
});
```
`valent.controller` takes 3 arguments

 - controller name
 - controller class
 - options

## Controller class

```js
class HomeController {
    constructor(resolvers, url, logger) {
        // ...
    }
    
    destructor() {
        // ...
    }
}
```

Constructor takes 3 arguments 

 - resolvers
 - url 
 - logger - configured logger. Always add colored controller's name to logs

`destructor` method is called when controller's **$scope** is destroyed ($destroy event).

## Controller options

### controller.option.as 
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

### controller.option.url
Route [url proxy](#url)

### controller.option.params
Route [url proxy](#routeoptionparams)

### controller.option.resolve
Route [resolve proxy](#routeoptionresolve)

### controller.option.struct
Route [struct proxy](#routeoptionstruct)

### controller.option.template
Route [template proxy](#routeoptiontemplate)

### controller.option.templateUrl
Route [templateUrl proxy](#routeoptiontemplateurl)

### Controller.render()
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

# Route

```js
valent.route('home', '/home', {
    template: '<div>...</div>'
});
```

`valent.controller` takes 3 arguments

- controller name
- url
- options

## url
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

## Route options 

### route.option.params
Any params that will be passed to angular route config. Also route params are available in resolvers (local and global) as second argument.

```js
valent.route('home', '/home', {
    params: {
        guest: true
    }
});
```

### route.option.resolve
Local resolvers. Function that will be executed before controller's constructor. Support promises. Resolved results will be passed to controller's constructor. Local resolvers will be executed [after global resolvers](http://i.imgur.com/eO43UR5.png). 
Here is [Angular documentation](https://docs.angularjs.org/api/ngRoute/provider/$routeProvider#when) about route resolvers.
Each resolver take 2 arguments:
    
- `name`  - resolving route name
- `params` - resolving [route params](#routeoptionparams)
    
```js
{
    resolve: {
        'permission': (name, params) => {
            return Users.me().catch(() => {
            
                return params.guest 
                    ? Promise.resolve('Allowed as guest') 
                    : Promise.reject('Denied for guests');
            });
        }
    }
}
```

### route.option.template
```js
{
    template: '<div>Yo!</div>'
}
```

### route.option.templateUrl
```js
{
    templateUrl: '/templates/home.html'
}
```

### route.option.struct
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

# Directive
```js
class GreetMeController {
    // ...
}

valent.component('greet-me', GreetMeController, {

});
```

## Directive Controller class
Full list of auto called methods. They are **NOT** required.

```js
class GreetMeController {
    constructor(params, logger) {
    
    }	
    
    destructor() {
    
    }
    
    link(element, compileResult) {
    
    }
    
    require(controllers) {
    
    }
    
    static compile(element) {
        return {};
    }
    
    static render() {
        return '<div>....</div>';
    }
}
```
Constructor arguments are depends on options. By default constructor takes 2 arguments

- [directive params](#directive-params)
- logger - configured logger. Always add colored controller's name to logs

if `interfaces` or `optionals (options)` are defined - they will passed before.

    TODO: Find better naming for this features. High prio :)

- `destructor` method is called when controller's \$scope is destroyed (\$destroy event).

- `link(element, compileResult)` method - same as [default angular's link](https://docs.angularjs.org/api/ng/service/$compile#-link-) function but do not take \$scope.  `static compile()` result will be passed as second argument.

- `require(controllers)` method - takes all required controllers. Returned content will be passed as second argument to `link()` method.

- `static render()` - result of this method could be used as directive's template.

- `static compile(element)` method could be used for template compilation. Same as [default angular's compile](https://docs.angularjs.org/api/ng/service/$compile#-compile-). Very useful if directive's templates are used as configuration. In this way - directive's template should **NOT** be defined.

For example in this case "Applications" will be used for multi-select label.
```html
<pl-multiselect items="controller.items">
    Applications
</pl-multiselect>
```

For example in this case - cell templates are defined as a content of `grid` directive.  In `static compile(element)` method this could be parsed and passed to directive controller. 
```html
<grid>
    <column id="network">
        <network-icon id="cell.value"></network-icon>
    </column>
    <column id="date">
        {{ cell.value | date:"MM/dd/yyyy" }}
    </column>
</grid>
```

## Directive options

### directive.option.as
Same as valent.controller [as option](#controlleroptionas)

### directive.option.template
Same as valent.controller [template option](#controlleroptiontemplate) but not proxy no route.

### directive.option.templateUrl
Same as valent.controller [templateUrl option](#controlleroptiontemplateurl) but not proxy no route.

### directive.option.restrict
Same as angular directive's options [restrict](https://docs.angularjs.org/guide/directive#template-expanding-directive).

Recomment to use only
- A - only matches attribute name
- E - only matches element name

### directive.option.require
Uses for [directive communications](https://docs.angularjs.org/guide/directive#creating-directives-that-communicate).
```js
{
    require: ['ngModel', '^^plFilterBar']
}
More details at official angular [doc](https://docs.angularjs.org/api/ng/service/$compile#-require-).
```
### directive.option.params
Same as angular directive's options [scope](https://docs.angularjs.org/api/ng/service/$compile#-scope-).

### directive.option.interfaces
```js
// app-connector.js
class AppConnector {
    host = valent.config.get('app.server.host');
    
    constructor(port) {
        //...
    }

    connect() {
        
    }

    // ...
}
```
```js
// server-status-component.js
import AppConnector from './app-connector';

class ServerStatusController {
    constructor(connector) {
        connector.connect().then(status => {
            this.status = status;
        });
    }

    static render() {
        return '<div>{{ _.status }}</div>'
    }
}

valent.component('server-status', ServerStatusController, {
    interfaces: {
        connector: AppConnector
    }
});
```

```js
// home-screen.js
import AppConnector from './app-connector';

class HomeController {
    connector = new AppConnector(9001);
    
    constructor() {
        this.connector.notify();
    }

    static render() {
        return `<server-status connector="controller.connector"></server-status>`;
    }
}

valent.controller('home', HomeController);
```

So we defined for directive `<server-status>`interface **connector** with specific class - **AppConnector**. So already created instance of this class should be passed to directive as attribute. If not - Exception. If wrong class - Exception.
Bonuses:

 - Have control over same object in directive and in parent controller (no matter if it is screen's controller or another directive's controller). Could be useful to create relation between app components.
 - Interfaces are passed as first arguments to directitve's constructor
 - Inside directive you are sure that instance (or its parents) has correct class (type).
 - Useful for complex directives that works with **charts**, **grids**, **forms** etc.

### directive.option.options (rename)
```js
valent.component('server-status', ServerStatusController, {
    interfaces: {
        connector: AppConnector
    },
    option: {
        validator: AppValidator
    }
});
```
Same as interfaces but options are **NOT** required. 
If option's attribute is defined at directive - option instance will be passed to directive's constructor.
```html
<server-status connector="controller.connector" validator="controller.connector"></server-status>
```
```js
class ServerStatusController {
    constructor(connector, validator) {
        //
    }
}
```

If option's attribute is **NOT** defined - null will be passed to directive's constructor.
```html
<server-status  connector="controller.connector"></server-status>
```
```js
class ServerStatusController {
    constructor(connector, validator) {
        equals(validator, null);
    }
}
```

### directive.option.pipes
If defined and not passed to directive - will be created automatically. Available throw `DirectiveParams.get()`.

```js
// toggler.js
class Toggler extends Events {
    isVisible = false;
    
    open() {
        if (!this.isVisible) {
            this.isVisible = true;
            this.emit('open');
        }
    }
    
    close() {
        if (this.isVisible) {
            this.isVisible = false;
            this.emit('close');
        }
    }
}
```

```js
// drop-down-component.js
import Toggler from './toggler';

class DropDownController {
    constructor(params) {
        this.toggler = params.get('toggler');
    }

    static render() {
        return `
            <button
                ng-click="controller.toggler.open()">
                Open
            </button>
            <button 
                ng-click="controller.toggler.close()">
                Close
            </button>
            <div ng-if="controller.toggler.isVisible">
                ...
            </div>`;
    }	
}

valent.component('drop-down', DropDownController, {
    pipes: {
        toggler: Toggler
    }
});
```

```js
// home-screen.js
import Toggler from './toggler';

class HomeController {
    toggler = new Toggler();
    
    constructor() {
        this.toggler.open();
        this.toggler.on('open', () => {
            console.log('opened :)');
        });
    }
}

valent.controller('home', HomeController);
```
```html
<div ng-controller="home">
    <drop-down></drop-down>
    <drop-down toggler="controller.toggler></drop-down>
</div>
```

Both cases will work.  If you not pass toggler from parent controller - it will be created automatically (only if `params.get('toggler')` was called). For first `<drop-down>` component - initial state is `controller.toggler.isVisible == false`. For second - `controller.toggler.isVisible == true`.  And HomeController listens to `open` event. 

- In HomeController we have control over directive.
- Toggler instance incapsulate all logic - open/close methods, events etc. 
- Toggler Could be used **multiple** times.
- Do not need to implement open/close logic inside directitve

## Directive Params

```js
class GreetMeController {
    constructor(params) {
        this.name = params.get('name');
        params.watch('name', name => {
            // ...
        });
    }
    
    static render() {
        return '<div>{{ controller.name }} </div>'
    }
}

valent.component('greet-me', GreetMeController, {
    params: {
        name: '='
    }
});
```
Available methods:

- get(key) - available only we defined params (component options.params). Returns passed value.
- watch(key, callback) -available only we defined params (component options.params). Create watcher for this key. Callback takes actual param's value.
- parse(key) - available for all passed attributes. Uses `$scope.$parse(attr)` to get value. Do not create extra watchers. Useful for large applications.

If try to `get()` or `watch()` for keys that are not defined at component's params or not equal component's name (for params with restrict 'A')  - will be Exception.

`parse()` example:
```js
class GreetMeController {
    constructor(params) {
        this.name = params.parse('name');
    }
    
    static render() {
        return '<div>{{ controller.name }} </div>'
    }
}

valent.component('greet-me', GreetMeController, {
    params: {}
});
```


# Defined structures
```js
import * as primitives from 'valent/utils/primitives';
```
Use [tcomb](https://github.com/gcanti/tcomb) and define structures. Exported structures.
```js
export const ListNum = list(Num, 'ListNum');
export const ListInt = list(Int, 'ListInt');
export const ListStr = list(Str, 'ListStr');
export const ListBool = list(Bool, 'ListBool');
export const ListDat = list(Dat, 'ListDat');


export const MaybeNum = maybe(Num, 'MaybeNum');
export const MaybeInt = maybe(Int, 'MaybeInt');
export const MaybeStr = maybe(Str, 'MaybeStr');
export const MaybeBool = maybe(Bool, 'MaybeBool');
export const MaybeDat = maybe(Dat, 'MaybeDat');


export const MaybeListNum = maybe(ListNum, 'MaybeListNum');
export const MaybeListInt = maybe(ListInt, 'MaybeListInt');
export const MaybeListStr = maybe(ListStr, 'MaybeListStr');
export const MaybeListBool = maybe(ListBool, 'MaybeListBool');
export const MaybeListDat = maybe(ListDat, 'MaybeListDat');


// [[1,..n],[1..m]...k]
export const MatrixNum = list(ListNum, 'MatrixNum');
// [[1, undefined, ..n],[1 undefined,..m]...k]
export const MatrixMaybeNum = list(MaybeListNum, 'MatrixMaybeNum');

// [['a',..n],['a'..m]...k]
export const MatrixStr = list(ListStr, 'MatrixStr');
// [['a', undefined, .n],['a' undefined,..m]...k]
export const MatrixMaybeStr = list(MaybeListStr, 'MatrixMaybeStr');

export const MatrixDate = list(ListDat, 'MatrixDate');
export const MatrixMaybeDate = list(MaybeListDat, 'MatrixMaybeDate');

export const MatrixBool = list(ListBool, 'MatrixBool');
export const MatrixMaybeBool = list(MaybeListBool, 'MatrixMaybeBool');
```

# Serializers

There 3 serializers

 - base serializer 
 - rename serializer
 - url serializer - extends rename serializer with already added rules for all struc that defined in primitives (valent/utils/primitives)

```js
import Serializer from 'valent/serializers/serializer';
import RenameSerializer from 'valent/serializers/rename-serializer';
import UrlSerializer from 'valent/serializers/url-serializer';
```

## Base serializer
Constructor takes 1 argument - params structure. Does **NOT** contain any encode/decode rules.

 - encode(decoded)
 - decode(encoded)

Struct example
```js
import primitives from 'valent/utils/primitives';

let struct = {
    id: primitives.Num
    tags: primitives.MaybeListStr
};
```

## Rename serializer
Extends custom serializer but support attributes renaming encode and returns the, original names during decode. Does **NOT** contain any encode/decode rules. Constructor takes 1 argument - params structure.

Struct example
```js
import primitives from 'valent/utils/primitives';

let struct = {
    // "id" key will encoded into "i"
    id: ['i', primitives.Num]
    tags: primitives.MaybeListStr
};
```

## Custom serializer

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

## Url serializer
Extends rename serializer and contain rules for encode/decode. Does not contains URL instance. Rules will work only if struct attributes are references to primitives.

    NOTE: Serializers contains WeakMap of encode/decode rules. And keys - are objects from "primitives.js" module. 
    Thats you need to make references to primitives. Primitives works with tcomb - so it also works as type validator.

    TODO: map strings to primitive's objects?
    {
        id: 'number',
        tags: 'maybe.listOfStrings'
    }

Constructor takes 2 arguments

 - struct (same as at rename serializer)
 - encode/decode options

Default options:
```js
{
    list_delimiter: '~',
    matrix_delimiter: '!',
    date_format: 'YYYYMMDD'
}
```

Example:
```js
import primitives from 'valent/utils/primitives';
import UrlSerializer from 'valent/serializers/url-serializer';

let serializer = new UrlSerializer({
    id: ['i', primitives.Num]
    tags: primitives.MaybeListStr	
});

let origin = {
    id: 1,
    tags: ['a', 'b', 'c']
};

let encoded = serializer.encode(origin);
let decoded = serializer.decode(encoded);

equals(origin, decoded);
```

Encode rules:

Primitive | Origin | Encoded 
--------- | ------ | ------- 
primitives.Num, primitives.MaybeNum | 1 | 1
primitives.Str, primitives.MaybeStr | 'a' | a
primitives.Bool, primitives.MaybeBool | true | 1
primitives.Bool, primitives.MaybeBool | false | 0
primitives.Dat, primitives.MaybeDat | new Date() | 2015112
primitives.ListNum, primitives.MaybeListNum | [1, 2, 3] | 1~2~3
primitives.ListMaybeNum | [1, null, 2, 3] | 1~~2,3
primitives.ListStr, primitives.MaybeListStr | ['a', 'b', 'c'] | a~b~c
primitives.ListMaybeStr | ['a', null, 'b', 'c'] | a~~b~c
primitives.ListBool, primitives.MaybeListBool | [true, false] | 1~0
primitives.ListDat, primitives.MaybeListDat | [new Date(), new Date()] | 2015112~2015112
primitives.MatrixNum, primitives.MaybeMatrixNum | [[1,2],[3,4]] | 1~2!3~4
primitives.MatrixMaybeNum | [[1,2,null,3],[4,null,5]] | 1~2~~3!4~~5
primitives.MatrixStr, primitives.MaybeMatrixStr | [['a','b'],['c','4']] | a~b!c~d
primitives.MatrixBool, primitives.MaybeMatrixBool | [[true, false],[false, true]] | 1~0!0~1


# Url 
If route is defined for controller url instance will be passed to controller's constructor. Also url instance could be created manually.
```js
import Url from 'valent/angular/angular-url';
import * as primitives from 'valent/utils/primitives';

let url = new Url('/store/:id/:tags', {
    id: primitives.Num,
    tags: primitives.MaybeListStr,
    period: primitives.MaybeListDat,
    search: ['q', primitives.MaybeListStr
});
```

Uses URL serializer. Constructor takes 2 arguments:

 - pattern - url pattern with placeholders. 
 - struct - url params structure

```js 
import Url from 'valent/angular/angular-url';
import * as primitives from 'valent/utils/primitives';

let url = new Url('/store/:id/:tags', {
    id: primitives.Num,
    tags: primitives.MaybeListStr,
    period: primitives.MaybeListDat,
    search: ['q', primitives.MaybeStr
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

Provide helpful methods to work with url. Available methods:

 - `go(params, options)` - replace current url with generating according to passed params. Works in angular context - all route events will be fired. **options** - event options that will be available at url watchers.
 
 - `stringify(params)` - return url according to passed params

 - `redirect(params)` - same as **go()** but with page reloading

 - `parse()` - parse current url and return decoded params

 - `watch(callback)` - listen url changes (\$scope event **\$routeUpdate**) and execute callback. Callback arguments - params, diff, options.  
     - params - current url params. 
     - diff - difference between previous url update.
     - options - event options that were passed to **go()** method

 - `isEmpty()` - return true if there are no params in current url

 - `link(key, fn)` - describe setter for url param.

 - `linkTo(store)` - automatically link all structure params to store object

 - `apply()` - execute all added **link()** functions

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
# Url Manager
```js
let homeUrl = valent.url.get('home');
homeUrl.go(params);

valent.url.set('custom-url', ManualltCreatedUrlInstance);
```

- valent.url.get(key) returns url instance for passed **key**.
- valent.url.set(key, instance) set url instance for **key**.

For controller with attached url `valent.url.set(...)` will be called automatically.

# Services

## Digest
```js
import digest from 'valent/angular/services/digest';

class HomeController {
    constructor() {
        digest(this);
    }
}
```

Already [debounce](https://lodash.com/docs#debounce) digest (trailing = true, timeout = 50). Configurable. 
Global configuration:
```js
valent.config.set('angular.digest.timeout', 100); 
```
Local configuration:
```js
import digest from 'valent/angular/services/digest';
let configured = digest.configure(100);
```

## Injector
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

## Watcher
```js
import Watcher from 'valent/angular/services/watcher';
```
Service is using to create [watchers](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$watch). watchGroup, watchCollection and deep watch - are not available. 

    NOTE: We highly recommend NOT to use watchers. No matter how watchers are created
    using this service or native $scope methods.

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

##  Events
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

# Decorators

From [PR#10](https://github.com/frankland/valentjs/pull/10).

    TODO: implement and add docs :)

```js
import { Template, Url } from 'valent/decorators';

@Template('home.html');
@Url('/home', '/index');
class HomeController {
    // ...
}
```
    
# Base Components
```js
import BaseScreenController from 'valent/angular/base/screen-controller';

import BaseComponentController from 'valent/angular/base/component-controller';
```

    TODO: implement and add docs :)
    
# Contributing

    TODO: add docs :)

# TODO
- [ ] Boilerplate
- [ ] Examples
- [ ] valentjs vs angularjs. Configuration diffs
- [ ] implement TODO application using valent
- [ ] Fix old and add new test
- [ ] redevelop angular-url. Kick extra dependencies (url-pattern)
- [ ] rename directive options - interfaces / optionals / pipes
- [ ] rename DirecitveParams into ComponentParams
- [ ] replace pathes -  `/valent/..`. into `/valentjs/....`
- [ ] redevelop exception system. Right now RuntimeException and RegisterException are not comfortable for debugging.
- [ ] add more useful primitives
- [ ] do not register component's interfaces / options / pipes as angular directive option - **scope**. This is extra watchers. Use `DirectiveParams.parse()` method to get them.
