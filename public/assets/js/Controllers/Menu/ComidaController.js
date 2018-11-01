var angular;
angular.module("app", [])
    .controller("controlador", function($scope, $http) {

        $scope.comidas = [];
        $scope.frmData = {};
        $scope.modify = false;

        cargarComidas();


        async function cargarComidas() {
            await $http.post('/comidas/getcomidas')
                .then(function(respone) {
                    $scope.comidas = respone['data'];
                    $scope.comidas = $scope.comidas.comidas;
                    console.log($scope.comidas);
                }, function(respone) {
                    alert(respone);
                });
        }

        $scope.agregarComida = async function() {
            console.log($scope.frmData);
            await $http.post('/comidas/insertcomidas', $scope.frmData, {
                    // headers: { 'Content-Type': undefined }
                })
                .then(function(respone) {
                    $scope.frmData = {};

                    console.log(respone);
                    cargarComidas();
                }, function(respone) {
                    alert(respone);
                });

        };

        $scope.modifyComida = async function() {

            console.log($scope.frmData);
            $http.put('/comidas/modifycomida', $scope.frmData)
                .then(function(respone) {
                    $scope.frmData = {};
                    $scope.modify = false;
                    console.log(respone);
                    cargarComidas();
                }, function(respone) {
                    alert('ERROR', respone);
                });

        }

        $scope.selectObject = async function(select) {
            console.log('Entro a seleccion');
            $scope.frmData = {
                id: select.id,
                nombre: select.nombre,
                descripcion: select.descripcion,
                calorias: select.calorias,
                medidas: select.medidas,

            };
            $scope.modify = true;
        }

        $scope.cancelarModify = async function() {
            $scope.frmData = {};
            $scope.modify = false;
        }
    });