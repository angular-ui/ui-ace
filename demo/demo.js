
angular.module('doc.ui-ace', ['ui.ace', 'prettifyDirective'])
  .controller('AceCtrl', ['$scope', function ($scope) {
    $scope.aceModel = "Ace Hello World";
  }])
;