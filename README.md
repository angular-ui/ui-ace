# UI.Ace directive [![Build Status](https://travis-ci.org/angular-ui/ui-ace.png)](https://travis-ci.org/angular-ui/ui-ace)

This directive allows you to add [ACE](http://ajaxorg.github.io/ace/) editor elements.

## Requirements

- AngularJS
- [Ace 1.x](https://github.com/ajaxorg/ace-builds/)


## Usage

You can get it from [Bower](http://bower.io/)

```sh
bower install angular-ui-ace\#bower
```

This will copy the UI.Ace files into a `bower_components` folder, along with its dependencies. Load the script files in your application:

```html
<script type="text/javascript" src="bower_components/ace-builds/src-min-noconflict/ace.js"></script>
<script type="text/javascript" src="bower_components/angular/angular.js"></script>
<script type="text/javascript" src="bower_components/angular-ui-ace/ui-ace.js"></script>
```

Add the UI.Ace module as a dependency to your application module:

```javascript
var myAppModule = angular.module('MyApp', ['ui.ace']);
```

Finally, add the directive to your html:

```html
<div ui-ace></div>
```

To see something it's better to add some CSS, like


```css
.ace_editor { height: 200px; }
```

## Options

Ace doesn't provide a one gate access to all the options the jquery way.
Each option is configured with the function of a specific instance.
See the [api doc](http://ajaxorg.github.io/ace/#nav=api) for more.

Although, _ui-ace_ automatically handles some handy options :
 + _showGutter_ : to show the gutter or not.
 + _useWrapMode_ : to set whether or not line wrapping is enabled.
 + _theme_ : to set the theme to use.
 + _mode_ : to set the mode to use.
 + _onLoad_ : callback when the editor has finished loading (see [below](#ace-instance-direct-access)).
 + _onChange_ : callback when the editor content is changed ().
 + _onBlur_ : callback when the editor is blurred ().

```html
<div ui-ace="{
  useWrapMode : true,
  showGutter: false,
  theme:'twilight',
  mode: 'xml',
  onLoad: aceLoaded,
  onChange: aceChanged
}"></div>
```

You'll want to define the `onLoad` and the `onChange` callback on your scope:

```javascript
myAppModule.controller('MyController', [ '$scope', function($scope) {

  $scope.aceLoaded = function(_editor) {
    // Options
    _editor.setReadOnly(true);
  };

  $scope.aceChanged = function(e) {
    //
  };

}]);
```

To handle other options you'll have to use a direct access to the Ace created instance (see [below](#ace-instance-direct-access)).

### Working with ng-model

The ui-ace directive plays nicely with ng-model.

The ng-model will be watched for to set the Ace EditSession value (by [setValue](http://ajaxorg.github.io/ace/#nav=api&api=edit_session)).

_The ui-ace directive stores and expects the model value to be a standard javascript String._

### Can be read only

Simple demo
```html
<div ui-ace readonly="true"></div>
or
Check me to make Ace readonly: <input type="checkbox" ng-model="checked" ><br/>
<div ui-ace readonly="{{checked}}"></div>
```

### Ace instance direct access

For more interaction with the Ace instance in the directive, we provide a direct access to it.
Using

```html
<div ui-ace="{ onLoad : aceLoaded }" ></div>
```

the `$scope.aceLoaded` function will be called with the [Ace Editor instance](http://ajaxorg.github.io/ace/#nav=api&api=editor) as first argument

```javascript
myAppModule.controller('MyController', [ '$scope', function($scope) {

  $scope.aceLoaded = function(_editor){
    // Editor part
    var _session = _editor.getSession();
    var _renderer = _editor.renderer;

    // Options
    _editor.setReadOnly(true);
    _session.setUndoManager(new ace.UndoManager());
    _renderer.setShowGutter(false);

    // Events
    _editor.on("changeSession", function(){ ... });
    _session.on("change", function(){ ... });
  };

}]);
```

## Testing

We use Karma and jshint to ensure the quality of the code.  The easiest way to run these checks is to use grunt:

```sh
npm install -g grunt-cli
npm install && bower install
grunt
```

The karma task will try to open Firefox and Chrome as browser in which to run the tests.  Make sure this is available or change the configuration in `test\karma.conf.js`


### Grunt Serve

We have one task to serve them all !

```sh
grunt serve
```

It's equal to run separately:

* `grunt connect:server` : giving you a development server at [http://127.0.0.1:8000/](http://127.0.0.1:8000/).

* `grunt karma:server` : giving you a Karma server to run tests (at [http://localhost:9876/](http://localhost:9876/) by default). You can force a test on this server with `grunt karma:unit:run`.

* `grunt watch` : will automatically test your code and build your demo.  You can demo generation with `grunt build:gh-pages`.


### Dist

This repo is using the [angular-ui/angular-ui-publisher](https://github.com/angular-ui/angular-ui-publisher).
New tags will automatically trigger a new publication.
To test is locally you can trigger a :

```sh
grunt dist build:bower
```

it will put the final files in the _'dist'_ folder and a sample of the bower tag output in the _'out/built/bower'_ folder.
