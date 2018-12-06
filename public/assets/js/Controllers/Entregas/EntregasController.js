var angular;
angular.module("app", [])
    .controller("controlador", function($scope, $http) {
        document.getElementById('entregas').style = 'background-color: #B1D236; color:white'
        $scope.frmData = {};
        $scope.keys = [];
        $scope.hola = "hola soy batuza";
        $scope.info = {};
        $scope.entregas = {};

        $scope.entregaLista = async function(entrega) {
            console.log($scope.frmData);
            await $http.put('/entregas/entregaLista', entrega)
                .then(function(respone) {
                    console.log(entrega);
                    console.log($scope.frmData);
                    $scope.llamarComandas();

                }, function(respone) {
                    alert(respone.err);
                });
        }


        $scope.llamarComandas = async function() {
            console.log($scope.frmData);
            await $http.post('/entregas/getkeys')
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
            $scope.entregas = {};
            await $http.post('/entregas/getComandas', info)
                .then(function(respone) {
                    $scope.entregas = respone['data'];
                    $scope.entregas = $scope.entregas.data;
                    console.log($scope.entregas);
                    if ($scope.entregas.length == 0) {
                        alert('No hay Entregas')
                    } else {
                        alert('Entregas listas ');
                    }

                }, function(respone) {
                    alert(respone);
                });
        }


    });