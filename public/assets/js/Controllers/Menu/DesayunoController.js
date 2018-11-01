var angular;
angular.module("app", [])
    .controller("controlador", function($scope, $http) {

        $scope.desayunos = [];
        $scope.hola = "hola soy batuza";
        $scope.hh = [];
        $scope.frmData = {};
        $scope.modify = false;

        cargarDesayunos();


        async function cargarDesayunos() {
            await $http.post('/comidas/getdesayunos')
                .then(function(respone) {
                    $scope.desayunos = respone['data'];
                    $scope.desayunos = $scope.desayunos.desayuno;
                    console.log($scope.desayunos);
                }, function(respone) {
                    alert(respone);
                });
        }

        $scope.agregarDesayuno = async function() {
            console.log($scope.frmData);
            await $http.post('/comidas/insertdesayunos', $scope.frmData, {
                    //  headers: { "Content-Type: application/json", "Authorization: Bearer myaccesstokenishere"}
                })
                .then(function(respone) {
                    $scope.frmData = {};

                    console.log(respone);
                    cargarDesayunos();
                }, function(respone) {
                    alert(respone);
                });

        };

        $scope.modifyDesayuno = async function() {

            console.log($scope.frmData);
            $http.put('/comidas/modifydesayunos', $scope.frmData)
                .then(function(respone) {
                    $scope.frmData = {};
                    $scope.modify = false;
                    console.log(respone);
                    cargarDesayunos();
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