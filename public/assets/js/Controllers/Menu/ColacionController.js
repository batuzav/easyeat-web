var angular;
angular.module("app", [])
    .controller("controlador", function($scope, $http) {

        $scope.colaciones = [];
        $scope.frmData = {};
        $scope.modify = false;

        cargarColaciones();


        async function cargarColaciones() {
            await $http.post('/comidas/getcolaciones')
                .then(function(respone) {
                    $scope.colaciones = respone['data'];
                    $scope.colaciones = $scope.colaciones.colaciones;
                    console.log($scope.colaciones);
                }, function(respone) {
                    alert(respone);
                });
        }

        $scope.agregarColacion = async function() {
            console.log($scope.frmData);
            await $http.post('/comidas/insertcolacion', $scope.frmData, {
                    // headers: { 'Content-Type': undefined }
                })
                .then(function(respone) {
                    $scope.frmData = {};

                    console.log(respone);
                    cargarColaciones();
                }, function(respone) {
                    alert(respone);
                });

        };

        $scope.modifyColacion = async function() {

            console.log($scope.frmData);
            $http.put('/comidas/modifycolacion', $scope.frmData)
                .then(function(respone) {
                    $scope.frmData = {};
                    $scope.modify = false;
                    console.log(respone);
                    cargarColaciones();
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