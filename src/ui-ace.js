'use strict';

/**
 * Binds a ACE Editor widget
 */
angular.module('ui.ace', [])
  .constant('uiAceConfig', {})
  .directive('uiAce', ['uiAceConfig', function (uiAceConfig) {

    if (angular.isUndefined(window.ace)) {
      throw new Error('ui-ace need ace to work... (o rly?)');
    }

    /**
     * Sets editor options such as the wrapping mode or the syntax checker.
     *
     * The supported options are:
     *
     *   <ul>
     *     <li>showGutter</li>
     *     <li>useWrapMode</li>
     *     <li>onLoad</li>
     *     <li>theme</li>
     *     <li>mode</li>
     *   </ul>
     *
     * @param acee
     * @param session ACE editor session
     * @param {object} opts Options to be set
     */
    var setOptions = function(acee, session, opts) {

      // Boolean options
      if (angular.isDefined(opts.showGutter)) {
        acee.renderer.setShowGutter(opts.showGutter);
      }
      if (angular.isDefined(opts.useWrapMode)) {
        session.setUseWrapMode(opts.useWrapMode);
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
    }

    return {
      restrict: 'EA',
      require: '?ngModel',
      link: function (scope, elm, attrs, ngModel) {

        /**
         * Corresponds the uiAceConfig ACE configuration.
         * @type object
         */
        var options = uiAceConfig.ace || {};

        /**
         * uiAceConfig merged with user options via json in attribute or data binding
         * @type object
         */
        var opts = angular.extend({}, options, scope.$eval(attrs.uiAce));

        /**
         * ACE editor
         * @type object
         */
        var acee = window.ace.edit(elm[0]);

        /**
         * ACE editor session.
         * @type object
         * @see [EditSession]{@link http://ace.c9.io/#nav=api&api=edit_session}
         */
        var session = acee.getSession();

        /**
         * Reference to a change listener created by the listener factory.
         * @function
         * @see listenerFactory.onChange
         */
        var onChangeListener;

        /**
         * Listener factory. Until now only change listeners can be created.
         * @type object
         */
        var listenerFactory = {
          /**
           * Creates a change listener which propagates the change event
           * to the callback from the user option onChange. It might be
           * exchanged during runtime, if this happens the old listener
           * will be unbound.
           *
           * @param callback callback function taken from the
           * @see onChangeListener
           */
          onChange: function (callback) {
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
                    } else {
                      throw new Error('ui-ace use a function as callback.');
                    }
                  });
                }
              }
            };
          }
        };

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

        // Listen for option updates
        scope.$watch( attrs.uiAce, function() {
          opts = angular.extend({}, options, scope.$eval(attrs.uiAce));

          // unbind old listener
          session.removeListener('change', onChangeListener);

          // bind new listener
          onChangeListener = listenerFactory.onChange(opts.onChange);
          session.on('change', onChangeListener);

          setOptions(acee, session, opts);
        }, /* deep watch */ true );

        // EVENTS
        onChangeListener = listenerFactory.onChange(opts.onChange);
        session.on('change', onChangeListener);

        elm.on('$destroy', function () {
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
