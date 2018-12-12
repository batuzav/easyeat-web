var angular;
angular.module("app", ['ngCookies'])
    .controller("controlador", function($scope, $http, $cookies) {
        document.getElementById('comandas').style = 'background-color: #B1D236; color:white'
        document.getElementById('colacion').style = 'border-bottom: 5px solid white;'
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
        $scope.cDesayuno1 = 0
        $scope.cDesayuno2 = 0
        $scope.cDesayuno3 = 0
        $scope.porcionDesayuno1 = 0
        $scope.porcionDesayuno2 = 0
        $scope.porcionDesayuno3 = 0
        $scope.cCena1 = 0
        $scope.cCena2 = 0
        $scope.cCena3 = 0
        $scope.porcionCena1 = 0
        $scope.porcionCena2 = 0
        $scope.porcionCena3 = 0
            // $scope.NomCena1 = {};
            // $scope.NomCena2 = {};
            // $scope.NomCena3 = {};
            // $scope.NomDesayuno1 = {};
            // $scope.NomDesayuno2 = {};
            // $scope.NomDesayuno3 = {};

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

        $scope.comandaListaCena = async function(comanda) {
            console.log('hola');

            console.log($scope.frmData);
            await $http.put('/cena/ComandaLista', comanda)
                .then(function(respone) {
                    console.log(comanda);
                    console.log($scope.frmData);


                }, function(respone) {
                    alert(respone.err);
                });
        }

        $scope.comandaListaDesayuno = async function(comanda) {
            console.log('hola');

            console.log($scope.frmData);
            await $http.put('/desayuno/ComandaLista', comanda)
                .then(function(respone) {
                    console.log(comanda);
                    console.log($scope.frmData);
                    $scope.comandaListaCena(comanda);
                    $scope.comandaListaComida(comanda);
                    $scope.llamarComandas();
                }, function(respone) {
                    alert(respone.err);
                });
        }

        $scope.comandaListaComida = async function(comanda) {
            console.log('hola');

            console.log($scope.frmData);
            await $http.put('/comida/ComandaLista', comanda)
                .then(function(respone) {
                    console.log(comanda);


                }, function(respone) {
                    alert(respone.err);
                });
        }

        $scope.llamarComandas = async function() {
            $scope.loading = true;
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
            await $http.post('/completas/getComandas', info)
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
                    $scope.cDesayuno1 = $scope.comandas.cDesayuno1;
                    $scope.cDesayuno2 = $scope.comandas.cDesayuno2;
                    $scope.cDesayuno3 = $scope.comandas.cDesayuno3;
                    $scope.porcionDesayuno1 = $scope.comandas.porcionDesayuno1;
                    $scope.porcionDesayuno2 = $scope.comandas.porcionDesayuno2;
                    $scope.porcionDesayuno3 = $scope.comandas.porcionDesayuno3;
                    $scope.cCena1 = $scope.comandas.cCena1;
                    $scope.cCena2 = $scope.comandas.cCena2;
                    $scope.cCena3 = $scope.comandas.cCena3;
                    $scope.porcionCena1 = $scope.comandas.porcionCena1;
                    $scope.porcionCena2 = $scope.comandas.porcionCena2;
                    $scope.porcionCena3 = $scope.comandas.porcionCena3;
                    $scope.NomCena1 = $scope.comandas.NomCena1;
                    $scope.NomCena2 = $scope.comandas.NomCena2;
                    $scope.NomCena3 = $scope.comandas.NomCena3;
                    $scope.NomDesayuno1 = $scope.comandas.NomDesayuno1;
                    $scope.NomDesayuno2 = $scope.comandas.NomDesayuno2;
                    $scope.NomDesayuno3 = $scope.comandas.NomDesayuno3;
                    $scope.comandas = $scope.comandas.comanda;
                    $scope.loading = false;
                    console.log('Esto es desayuno 3: ', $scope.porcionDesayuno3 + ", " + $scope.cDesayuno3)
                    if ($scope.comandas.length == 0) {
                        alert('No hay Comandas')
                    } else {
                        alert('Comandas listas ');
                    }

                }, function(respone) {
                    alert(respone.data.mensaje);
                    location.reload();
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
                    location.reload();
                });
        }



    });