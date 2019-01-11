var angular;
angular.module("app", ['ngCookies'])
    .controller("controlador", function($scope, $http, $cookies) {
        document.getElementById('usuarios').style = 'background-color: #B1D236; color:white';
        document.getElementById('OX').style = 'border-bottom: 5px solid white;';
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

            $http.post('/oxxopay/getKeys')
                .then(function(respone) {
                    $scope.hh = respone['data'];
                    console.log($scope.hh);
                    getUsuarios($scope.hh);

                }, function(respone) {
                    $scope.loading = false;
                    alert('No hay pedidos por OxxoPay');
                });
        }


        async function getUsuarios(info) {
            $scope.loading = true;
            $scope.entregas = {};
            await $http.post('/oxxopay/getUsuarios', info)
                .then(function(respone) {
                    $scope.usuarios = respone['data'];

                    $scope.usuarios = $scope.usuarios.pedido;
                    console.log($scope.usuarios);
                    $scope.loading = false;


                }, function(respone) {
                    alert(respone);
                    $scope.loading = false;
                });
        }
        $scope.UsuarioListo = async function(usuario) {
            $scope.loading = true;
            console.log($scope.frmData);
            await $http.post('/usuario/Pago', usuario)
                .then(function(respone) {
                    console.log(usuario);

                    cargarUsarios();

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