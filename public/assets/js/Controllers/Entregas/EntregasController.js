var angular;
angular.module("app", ['ngCookies'])
    .controller("controlador", function($scope, $http, $cookies, $filter) {
        document.getElementById('entregas').style = 'background-color: #B1D236; color:white'
        $scope.frmData = {};
        $scope.keys = [];
        $scope.hola = "hola soy batuza";
        $scope.info = {};
        $scope.entregas = {};
        $scope.imagenTipo = {};
        $scope.nombreTipo = {};

        cargarTipo();
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

        function cargarTipo() {
            var tipoC = $cookies.get('tipo');

            if (tipoC == 1) {
                $scope.imagenTipo = "/assets/img/usuario-adm.png";
                $scope.nombreTipo = "Administrador";
            }
            if (tipoC == 2) {
                $scope.imagenTipo = "/assets/img/usuario-chef.png";
                $scope.nombreTipo = "Chef";
            }
            if (tipoC == 3) {
                $scope.imagenTipo = "/assets/img/usuario-repartidor.png";
                $scope.nombreTipo = "Repartidor";
            }

        }


        $scope.llamarComandas = async function() {
            console.log($scope.frmData);
            $scope.loading = true;
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
                    $scope.loading = false;
                    if ($scope.entregas.length == 0) {
                        alert('No hay Entregas')
                    } else {
                        alert('Entregas listas ');
                    }

                }, function(respone) {
                    alert(respone);
                });
        }
        $scope.logout = () => {
            console.log('Entro a logout')
            $http.post('/login/logout')
                .then(function(respone) {
                    $cookies.remove("tipo");
                    location.reload();
                }, function(respone) {
                    alert('No se pudo cerrar sesion :(');
                });
        }


        /* Prueba tablita */






    });