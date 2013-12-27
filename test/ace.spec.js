describe('uiAce', function () {
  'use strict';

  // declare these up here to be global to all tests
  var scope, $compile, uiConfig;

  beforeEach(module('ui.ace'));
  beforeEach(inject(function (uiAceConfig) {
    uiConfig = uiAceConfig;
    uiConfig.ace = {showGutter: false};

  }));

  // inject in angular constructs. Injector knows about leading/trailing underscores and does the right thing
  // otherwise, you would need to inject these into each test
  beforeEach(inject(function (_$rootScope_, _$compile_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
  }));

  afterEach(function () {
    uiConfig = {};
  });

  describe('behavior', function () {

    it('should not throw an error when window.ace is defined', function () {
      function compile() {
        $compile('<div ui-ace>')(scope);
      }

      expect(compile).not.toThrow();
    });


    it('should watch the uiAce attribute', function () {
      spyOn(scope, '$watch');
      $compile('<div ui-ace ng-model="foo">')(scope);
      expect(scope.$watch).toHaveBeenCalled();
    });

  });

  describe('instance', function () {
    var _ace;


    beforeEach(function () {
      var aceEditFunction = window.ace.edit;
      spyOn(window.ace, 'edit').andCallFake(function () {
        _ace = aceEditFunction.apply(this, arguments);
        return _ace;
      });
    });

    it('should call ace.edit', function () {
      $compile('<div ui-ace>')(scope);
      expect(_ace).toBeDefined();
    });

    describe('options', function () {
      describe('passed', function () {
        it('should show the showGutter', function () {
          $compile('<div ui-ace="{showGutter:true}">')(scope);
          expect(_ace.renderer).toBeDefined();
          expect(_ace.renderer.getShowGutter()).toBeTruthy();
        });
      });
      describe('global', function () {
        it('should hide the showGutter', function () {
          $compile('<div ui-ace>')(scope);
          expect(_ace.renderer).toBeDefined();
          expect(_ace.renderer.getShowGutter()).toBeFalsy();
        });
      });
      describe('onLoad', function () {
        it('runs the onLoad callback', function () {
          scope.aceLoaded = function () {
          };
          spyOn(scope, 'aceLoaded');
          $compile('<div ui-ace="{onLoad: aceLoaded}">')(scope);
          expect(scope.aceLoaded).toHaveBeenCalled();
          expect(scope.aceLoaded).toHaveBeenCalledWith(_ace);
        });
      });
    });

    describe('readOnly', function () {
      it('should read only option true', function () {
        $compile('<div ui-ace readonly="true">')(scope);
        scope.$apply();
        expect(_ace.getReadOnly()).toBeTruthy();
        $compile('<div ui-ace readonly="{{foo}}">')(scope);
        scope.$apply('foo = true');
        expect(_ace.getReadOnly()).toBeTruthy();
      });
      it('should read only option false', function () {
        $compile('<div ui-ace>')(scope);
        scope.$apply();
        expect(_ace.getReadOnly()).toBeFalsy();
        $compile('<div ui-ace readonly="false">')(scope);
        scope.$apply();
        expect(_ace.getReadOnly()).toBeFalsy();
        $compile('<div ui-ace readonly="{{foo}}">')(scope);
        expect(_ace.getReadOnly()).toBeFalsy();
        scope.$apply('foo = true');
        expect(_ace.getReadOnly()).toBeTruthy();
        scope.$apply('foo = false');
        expect(_ace.getReadOnly()).toBeFalsy();
      });
    });

    describe('when the model changes', function () {
      it('should update the IDE', function () {
        $compile('<div ui-ace ng-model="foo">')(scope);
        scope.$apply('foo = "bar"');
        expect(_ace.getSession().getValue()).toBe(scope.foo);
      });
    });

    describe('when the IDE changes', function () {
      it('should update the model', function () {
        $compile('<div ui-ace ng-model="foo">')(scope);
        scope.$apply('foo = "bar"');

        var value = 'baz';
        _ace.getSession().setValue(value);
        expect(scope.foo).toBe(value);
      });
    });

    describe('when the model is undefined/null', function () {
      it('should update the IDE with an empty string', function () {
        $compile('<div ui-ace ng-model="foo">')(scope);
        scope.$apply();
        expect(scope.foo).toBeUndefined();
        expect(_ace.getSession().getValue()).toBe('');
        scope.$apply('foo = "bar"');
        expect(scope.foo).toBe('bar');
        expect(_ace.getSession().getValue()).toBe('bar');
        scope.$apply('foo = null');
        expect(scope.foo).toBe(null);
        expect(_ace.getSession().getValue()).toBe('');
      });
    });

    describe('when the callback is not a function', function () {
      it('should throw an error', function () {
        function compileWithObject() {
          scope.changing = {};
          scope.$apply('foo = "bar"');
          $compile('<div ui-ace="{onChange: changing}" ng-model="foo">')(scope);
          _ace.getSession().setValue('baz');
        }

        expect(compileWithObject).toThrow();
      });
    });

    it('should call destroy when the element is removed', function () {
      var element = $compile('<div ui-ace ng-model="foo">')(scope);
      spyOn(_ace, 'destroy').andCallThrough();
      spyOn(_ace.session, '$stopWorker').andCallThrough();

      element.remove();
      scope.$apply();

      expect(_ace.session.$stopWorker).toHaveBeenCalled();
      expect(_ace.destroy).toHaveBeenCalled();
    });
  });

  describe('when the model is an object or an array', function () {
    it('should throw an error', function () {
      function compileWithObject() {
        $compile('<div ui-ace ng-model="foo">')(scope);
        scope.foo = {};
        scope.$apply();
      }

      function compileWithArray() {
        $compile('<div ui-ace ng-model="foo">')(scope);
        scope.foo = [];
        scope.$apply();
      }

      expect(compileWithObject).toThrow();
      expect(compileWithArray).toThrow();
    });
  });

});
