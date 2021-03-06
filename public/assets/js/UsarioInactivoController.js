var angular;
angular.module("app", ['ngCookies'])
    .controller("controlador", function($scope, $http, $cookies) {
        document.getElementById('usuarios').style = 'background-color: #B1D236; color:white';
        document.getElementById('IN').style = 'border-bottom: 5px solid white;';
        $scope.usuarios = [];
        $scope.hola = "hola soy batuza";
        $scope.hh = [];
        $scope.usuarioActivo = [];
        $scope.usuarioInactivo = [];
        $scope.imagenTipo = {};
        $scope.nombreTipo = {};
        $scope.tableInner = {};
        $scope.showEsatdo = true;
        cargarTipo();
        cargarUsarios();


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

        function cargarUsarios() {
            $scope.loading = true;

            $http.post('/usuarios/getKeys')
                .then(function(respone) {
                    $scope.hh = respone['data'];
                    //console.log($scope.hh);
                    getUsuarios($scope.hh);

                }, function(respone) {
                    alert(respone);
                });
        }


        async function getUsuarios(info) {
            $scope.loading = true;
            $scope.entregas = {};
            await $http.post('/usuartios/getUsuariosIn', info)
                .then(function(respone) {
                    $scope.usuarios = respone['data'];
                    $scope.usuarioActivo = $scope.usuarios.usuarioActivo;
                    $scope.usuarioInactivo = $scope.usuarios.usuarioInactivo;
                    $scope.usuarios = $scope.usuarios.usuarioInactivo;
                    console.log($scope.usuarios);
                    $scope.loading = false;


                }, function(respone) {
                    alert(respone);
                    $scope.loading = false;
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