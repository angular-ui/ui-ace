# ui-ace directive [![Build Status](https://travis-ci.org/angular-ui/ui-ace.png)](https://travis-ci.org/angular-ui/ui-ace)

This directive allows you to add [ACE](http://ajaxorg.github.io/ace/) editor elements.

# Requirements

- AngularJS
- [Ace 2.x](https://github.com/ajaxorg/ace/)

# Testing

We use karma (the new testacular) and jshint to ensure the quality of the code.  The easiest way to run these checks is to use grunt:

```sh
npm install -g grunt-cli
npm install
bower install
grunt
```

The karma task will try to open Firefox as a browser in which to run the tests.  Make sure this is available or change the configuration in `test\karma.conf.js`

# Usage

We use [bower](http://twitter.github.com/bower/) for dependency management.  Add

```json
dependencies: {
"angular-ui-ace": "latest"
}
```

To your `components.json` file. Then run

```sh
bower install
```

This will copy the _ui-ace_ files into your `components` folder, along with its dependencies. Load the script files in your application:

```html
<script type="text/javascript" src="components/ace-builds/src-min-noconflict/ace.js"></script>
<script type="text/javascript" src="components/angular/angular.js"></script>
<script type="text/javascript" src="components/angular-ui-ace/ui-ace.js"></script>
```

Add the Ace module as a dependency to your application module:

```javascript
var myAppModule = angular.module('MyApp', ['ui.ace']);
```

Apply the directive to your form elements:

```html
<div ui-ace></div>
```

To see something it's better to add some CSS, like


```css
.ace_editor { top: 0; bottom: 0; right: 0; left: 0; }
```

Note: the _ui-ace_ directive is wrapped in a `div.ace_editor_wrapper`.
Thus you can use Ace as a block like so :


```css
.ace_editor_wrapper { position : relative; height: 200px}
```

## Options

Ace doesn't provide a one gate access to all the options the jquery way.
Each option is configured with the function of a specific instance.
See the [api doc](http://ajaxorg.github.io/ace/#nav=api) for more.

Although, _ui-ace_ automatically handles some handy options :
 + _showGutter_ : to show the gutter or not.
 + _useWrapMode_ : to set whether or not line wrapping is enabled.
 + _theme_ : to set the thme to use.
 + _mode_ : to set the mode to use.

```html
<div ui-ace="{
  useWrapMode : true,
  showGutter: false,
  theme:'twilight',
  mode: 'xml'
}"></div>
```

To handle other options you'll have to use a direct access to the Ace created instance (see [below](#ace-instance-direct-access)).

## Working with ng-model

The ui-ace directive plays nicely with ng-model.

The ng-model will be watched for to set the Ace EditSession value (by [setValue](http://ajaxorg.github.io/ace/#nav=api&api=edit_session)).

_The ui-ace directive stores and expects the model value to be a standard javascript String._

## Ace instance direct access

For more interaction with the Ace instance in the directive, we provide a direct access to it.
Using

```html
<div ui-ace scope-instance="foo" ></div>
```

 you will have in `$scope.foo` the [Ace Editor instance](http://ajaxorg.github.io/ace/#nav=api&api=editor)

```javascript
myAppModule.controller('MyController', [ '$scope', function($scope) {

  // Editor part
  var _editor = $scope.foo;
  var _session = _editor.getSession();
  var _renderer = _editor.renderer;

  // Options
  _editor.setReadOnly(true);
  _session.setUndoManager(new UndoManager());
  _renderer.setHighlightActiveLine(false);

  // Events
  _editor.on("changeSession", function(){ ... });
  _session.on("change", function(){ ... });

}]);
```
