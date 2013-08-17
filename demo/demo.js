angular.module('doc.ui-ace', ['ui.ace', 'prettifyDirective', 'ui.bootstrap'])
  .controller('AceCtrl', ['$scope', function ($scope) {
    $scope.aceModel = "Ace Hello World";
  }])
;