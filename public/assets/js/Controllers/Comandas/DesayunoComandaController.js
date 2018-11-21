var angular;
angular.module("app", [])
    .controller("controlador", function($scope, $http) {
        $scope.frmData = {};
        $scope.keys = [];
        $scope.hola = "hola soy batuza";
        $scope.info = {};
        $scope.comandas = {};

        $scope.cComida1 = 0;
        $scope.cComida2 = 0;
        $scope.cComida3 = 0;

        $scope.porcionComida1 = 0;
        $scope.porcionComida2 = 0;
        $scope.porcionComida3 = 0;

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
            await $http.post('/desayuno/getComandas', info)
                .then(function(respone) {
                    $scope.comandas = respone['data'];
                    console.log($scope.comandas);
                    $scope.NomComida1 = $scope.comandas.NomComida1;
                    $scope.NomComida2 = $scope.comandas.NomComida2;
                    $scope.NomComida3 = $scope.comandas.NomComida3;
                    $scope.cComida1 = $scope.comandas.cComida1;
                    $scope.cComida2 = $scope.comandas.cComida2;
                    $scope.cComida3 = $scope.comandas.cComida3;
                    $scope.porcionComida1 = $scope.comandas.porcionComida1;
                    $scope.porcionComida2 = $scope.comandas.porcionComida2;
                    $scope.porcionComida3 = $scope.comandas.porcionComida3;
                    $scope.comandas = $scope.comandas.comanda;

                    if ($scope.comandas.length == 0) {
                        alert('No hay Comandas')
                    } else {
                        alert('Comandas listas ');
                    }

                }, function(respone) {
                    alert(respone);
                });
        }

        $scope.comandaLista = async function(comanda) {
            console.log('hola');

            console.log($scope.frmData);
            await $http.put('/desayuno/ComandaLista', comanda)
                .then(function(respone) {
                    console.log(comanda);
                    console.log($scope.frmData);
                    $scope.llamarComandas();

                }, function(respone) {
                    alert(respone.err);
                });
        }


    });