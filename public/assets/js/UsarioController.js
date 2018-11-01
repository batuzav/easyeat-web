var angular;
angular.module("app", [])
    .controller("controlador", function($scope, $http) {

        $scope.usuarios = [];
        $scope.hola = "hola soy batuza";
        $scope.hh = [];

        cargarUsarios();


        function cargarUsarios() {
            $http.post('/getUsuarios')
                .then(function(respone) {
                    $scope.usuarios = respone['data'];
                    $scope.hh = Object.values($scope.usuarios);
                    $scope.usuarios = Object.values($scope.usuarios.usuarios);
                    console.log($scope.hh[1]);
                }, function(respone) {
                    alert(respone);
                });
        }
    });