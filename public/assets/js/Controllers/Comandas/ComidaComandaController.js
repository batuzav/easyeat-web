var angular;
angular.module("app", [])
    .controller("controlador", function($scope, $http) {
        $scope.frmData = {};
        $scope.keys = [];
        $scope.hola = "hola soy batuza";
        $scope.info = {};




        $scope.llamarComandas = async function() {
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
            await $http.post('/comida/getComandas', info)
                .then(function(respone) {
                    $scope.comandas = respone['data'];
                    $scope.comandas = $scope.comandas.comanda;
                    console.log($scope.comandas);

                    alert('Comandas listas ');
                }, function(respone) {
                    alert(respone.err);
                });
        }


    });