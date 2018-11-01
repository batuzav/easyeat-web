var angular;
angular.module("app", [])
    .controller("controlador", function($scope, $http) {

        $scope.cenas = [];
        $scope.frmData = {};
        $scope.modify = false;

        cargarCenas();


        async function cargarCenas() {
            await $http.post('/comidas/getcenas')
                .then(function(respone) {
                    $scope.cenas = respone['data'];
                    $scope.cenas = $scope.cenas.cenas;
                    console.log($scope.cenas);
                }, function(respone) {
                    alert(respone);
                });
        }

        $scope.agregarCena = async function() {
            console.log($scope.frmData);
            await $http.post('/comidas/insertcenas', $scope.frmData, {
                    // headers: { 'Content-Type': undefined }
                })
                .then(function(respone) {
                    $scope.frmData = {};

                    console.log(respone);
                    cargarCenas();
                }, function(respone) {
                    alert(respone);
                });

        };

        $scope.modifyCena = async function() {

            console.log($scope.frmData);
            $http.put('/comidas/modifycena', $scope.frmData)
                .then(function(respone) {
                    $scope.frmData = {};
                    $scope.modify = false;
                    console.log(respone);
                    cargarCenas();
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