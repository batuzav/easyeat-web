var angular;
angular.module("app", [])
    .controller("controlador", function($scope, $http) {
        $scope.frmData = {};
        $scope.keys = [];
        $scope.hola = "hola soy batuza";
        $scope.info = {};
        $scope.entregas = {};

        $scope.llamarComandas = async function() {
            console.log($scope.frmData);
            await $http.post('/comida/getkeys')
                .then(function(respone) {
                    $scope.keys = respone['data'];
                    console.log($scope.keys);
                    $scope.info = {
                        keys: $scope.keys.keys,
                        fecha: $scope.frmData,
                    }
                    getComandas($scope.info);
                }, function(respone) {
                    alert(respone.err);
                });
        }


        async function getComandas(info) {
            $scope.comandas = {};
            await $http.post('/entregas/getComandas', info)
                .then(function(respone) {
                    $scope.comandas = respone['data'];
                    console.log('hola');

                    /* if ($scope.comandas.length == 0) {
                         alert('No hay Comandas')
                     } else {
                         alert('Comandas listas ');
                     }*/

                }, function(respone) {
                    alert(respone);
                });
        }


    });