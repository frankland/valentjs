# Valent

[![Build Status](https://travis-ci.org/frankland/valent.svg)](https://travis-ci.org/frankland/valent)

Valent is the wrapper on the angular. Provide easier way to register angular components and
add unique directive features.

## Install

`bower install valent`

## Components

### Controller
#### Controller using flow
```js
import Controller from 'valent/controller';

class HomeController {

}

Controller('home.index')
    .src(HomeController)
    .templateUrl('/home/index.html');
```

#### Controller using model
```js
import Controller from 'valent/controller/controller-model';
import Valent from 'valent';

class HomeController {

}
var homeController = new Controller('home.index');
homeController.setSource(HomeController);

Valent.addController(homeController);
```

### Route
#### Route using flow
```js
import Route from 'valent/route';



```


#### Route using model

# test


#### TODO:

- [ ]  Remove factory component. Remove DI from components. That need because I want components to be independent of js framework
