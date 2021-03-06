var angular;
angular.module("app", ['ngCookies'])
    .controller("controlador", function($scope, $http, $cookies) {
        document.getElementById('comandas').style = 'background-color: #B1D236; color:white'
        document.getElementById('desayunos').style = 'border-bottom: 5px solid white;'
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

        $scope.imagenTipo = {};
        $scope.nombreTipo = {};

        $scope.now = new Date();
        console.log($scope.now);
        //  $scope.llamarComandas();

        cargarTipo();

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

        $scope.frmData.fechaReporte = $scope.now.toISOString().substring(0, 10);


        $scope.llamarComandas = async function() {
            console.log($scope.frmData);
            $scope.loading = true;
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
        $scope.llamarComandas();
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
                    $scope.loading = false;
                    if ($scope.comandas.length == 0) {
                        alert('No hay Comandas')
                        $scope.loading = false;
                    }

                }, function(respone) {
                    $scope.loading = false;
                    alert(respone.data.mensaje);
                    // location.reload();
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



    });