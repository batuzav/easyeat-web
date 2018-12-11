var angular;
angular.module("app", ['ngCookies'])
    .controller("controlador", function($scope, $http, $cookies) {
        $scope.frmData = {};
        console.log('Entro viejo');


        $scope.iniciar = function() {
            console.log('Entro');

            console.log($scope.frmData);
            $http.post('/login/loging', $scope.frmData, )
                .then(function(respone) {
                    $scope.tipo = respone['data'];
                    login($scope.tipo);
                }, function(respone) {
                    alert(respone.data.mensaje);
                });

        }

        function login(tipo) {
            $http.post('/loging/listo', tipo)
                .then(function(respone) {
                    console.log(respone);
                    $cookies.put('tipo', tipo.tipo);
                    location.href = '/usuarios';
                }, function(respone) {
                    alert(respone.data.mensaje);
                });
        }

    });