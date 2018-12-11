var angular;
angular.module("app", ['ngCookies'])
    .controller("controlador", function($scope, $http, $cookies) {
        $scope.frmData = {};
        $scope.cenas = {};
        $scope.colaciones = {};
        $scope.desayunos = {};
        $scope.comidas = {};
        $scope.imagenTipo = {};
        $scope.nombreTipo = {};

        document.getElementById('menu').style = 'background-color: #B1D236; color:white'
        document.getElementById('fechas').style = 'border-bottom: 5px solid white;'
        cargarTipo();
        cargarCenas();
        cargarColaciones();
        cargarDesayunos();
        cargarComidas();

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

        function cargarCenas() {
            $http.post('/comidas/getcenas')
                .then(function(respone) {
                    $scope.cenas = respone['data'];
                    $scope.cenas = $scope.cenas.cenas;
                    console.log($scope.cenas);
                }, function(respone) {
                    alert(respone.data.err);
                });
        }

        function cargarColaciones() {
            $http.post('/comidas/getcolaciones')
                .then(function(respone) {
                    $scope.colaciones = respone['data'];
                    $scope.colaciones = $scope.colaciones.colaciones;
                    console.log($scope.colaciones);
                }, function(respone) {
                    alert(respone.data.err);
                });
        }

        function cargarDesayunos() {
            $http.post('/comidas/getdesayunos')
                .then(function(respone) {
                    $scope.desayunos = respone['data'];
                    $scope.desayunos = $scope.desayunos.desayuno;
                    console.log($scope.desayunos);
                }, function(respone) {
                    alert(respone.data.err);
                });
        }

        function cargarComidas() {
            $http.post('/comidas/getcomidas')
                .then(function(respone) {
                    $scope.comidas = respone['data'];
                    $scope.comidas = $scope.comidas.comidas;
                    console.log($scope.comidas);
                }, function(respone) {
                    alert(respone.data.err);
                });
        }

        $scope.agregarMenu = async function() {
            $http.post('/comidas/insertmenufecha', $scope.frmData)
                .then(function(respone) {
                    console.log(respone.data.ok);
                    $scope.frmData = {};
                    alert('¡HECHO!');
                }, function(respone) {
                    console.log(respone);
                    alert(respone.data.mensaje);
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