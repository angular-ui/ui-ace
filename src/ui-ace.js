'use strict';

/**
 * Binds a ACE Ediitor widget
 */
angular.module('ui.ace', [])
  .constant('uiAceConfig', {})
  .directive('uiAce', ['uiAceConfig', function (uiAceConfig) {
    if (angular.isUndefined(window.ace)) {
      throw new Error('ui-ace need ace to work... (o rly?)');
    }
    return {
      restrict: 'EA',
      require: '?ngModel',
      link: function (scope, elm, attrs, ngModel) {
        var options, opts, acee, session, onChange;

        options = uiAceConfig.ace || {};
        opts = angular.extend({}, options, scope.$eval(attrs.uiAce));

        acee = window.ace.edit(elm[0]);
        session = acee.getSession();

        onChange = function (callback) {
          return function (e) {
            var newValue = session.getValue();
            if (newValue !== scope.$eval(attrs.value) && !scope.$$phase && !scope.$root.$$phase) {
              if (angular.isDefined(ngModel)) {
                scope.$apply(function () {
                  ngModel.$setViewValue(newValue);
                });
              }

              /**
               * Call the user onChange function.
               */
              if (angular.isDefined(callback)) {
                scope.$apply(function () {
                  if (angular.isFunction(callback)) {
                    callback(e, acee);
                  }
                  else {
                    throw new Error('ui-ace use a function as callback.');
                  }
                });
              }
            }
          };
        };


        // Boolean options
        if (angular.isDefined(opts.showGutter)) {
          acee.renderer.setShowGutter(opts.showGutter);
        }
        if (angular.isDefined(opts.showInvisibles)) {
          acee.renderer.setShowInvisibles(opts.showInvisibles);
        }
        if (angular.isDefined(opts.showIndentGuides)) {
          acee.renderer.setDisplayIndentGuides(opts.showIndentGuides);
        }
        if (angular.isDefined(opts.useWrapMode)) {
          session.setUseWrapMode(opts.useWrapMode);
        }
        if (angular.isDefined(opts.useSoftTabs)) {
          session.setUseSoftTabs(opts.useSoftTabs);
        }
        if (angular.isDefined(opts.disableSearch) && opts.disableSearch) {
          acee.commands.addCommands([{
            name: "unfind",
            bindKey: {
              win: "Ctrl-F",
              mac: "Command-F"
            },
            exec: function (editor, line) {
              return false;
            },
            readOnly: true
          }]);
        }

        // onLoad callback
        if (angular.isFunction(opts.onLoad)) {
          opts.onLoad(acee);
        }

        // Basic options
        if (angular.isString(opts.theme)) {
          acee.setTheme('ace/theme/' + opts.theme);
        }
        if (angular.isString(opts.mode)) {
          session.setMode('ace/mode/' + opts.mode);
        }

        attrs.$observe('readonly', function (value) {
          acee.setReadOnly(value === 'true');
        });

        // Value Blind
        if (angular.isDefined(ngModel)) {
          ngModel.$formatters.push(function (value) {
            if (angular.isUndefined(value) || value === null) {
              return '';
            }
            else if (angular.isObject(value) || angular.isArray(value)) {
              throw new Error('ui-ace cannot use an object or an array as a model');
            }
            return value;
          });

          ngModel.$render = function () {
            session.setValue(ngModel.$viewValue);
          };
        }

        // EVENTS
        session.on('change', onChange(opts.onChange));

        elm.on('$destroy', function() {
          acee.session.$stopWorker();
          acee.destroy();
        });
        
        scope.$watch(function() {
          return [elm[0].offsetWidth, elm[0].offsetHeight];
        }, function() {
          acee.resize();
          acee.renderer.updateFull();
        }, true);
      }
    };
  }]);
