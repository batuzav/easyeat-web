var angular;
angular.module("app", [])
    .controller("controladorLogin", function($scope, $http) {
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
                    location.href = '/usuarios';
                }, function(respone) {
                    alert(respone.data.mensaje);
                });
        }

        $scope.logout = () => {
            console.log('Entro a logout')
            $http.post('/login/logout')
                .then(function(respone) {
                    location.reload();
                }, function(respone) {
                    alert('No se pudo cerrar sesion :(');
                });
        }

    });