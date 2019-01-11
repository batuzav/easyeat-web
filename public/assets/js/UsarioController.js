var angular;
angular.module("app", ['ngCookies'])
    .controller("controlador", function($scope, $http, $cookies) {
        document.getElementById('usuarios').style = 'background-color: #B1D236; color:white';
        document.getElementById('AC').style = 'border-bottom: 5px solid white;';
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
            await $http.post('/usuartios/getUsuarios', info)
                .then(function(respone) {
                    $scope.usuarios = respone['data'];
                    $scope.usuarioActivo = $scope.usuarios.usuarioActivo;
                    $scope.usuarioInactivo = $scope.usuarios.usuarioInactivo;
                    $scope.usuarios = $scope.usuarios.usuarioActivo;
                    console.log($scope.usuarios);
                    $scope.loading = false;


                }, function(respone) {
                    alert(respone);
                    location.reload();
                    $scope.loading = false;
                });
        }

        $scope.MostrarUsuariosAc = async() => {
            // var Table = document.getElementById("tableUsers");
            // $scope.tableInner = Table.innerHTML;
            // console.log($scope.tableInner);
            // // Table.innerHTML = "";
            $scope.usuarios = [];
            $scope.showEsatdo = true;
            $scope.usuarios = $scope.usuarioActivo;
            document.getElementById('AC').style = 'border-bottom: 5px solid white;';
            document.getElementById('IN').style = '';
        }

        $scope.MostrarUsuariosIn = async() => {
            // var Table = document.getElementById("tableUsers");
            // $scope.tableInner = Table.innerHTML;
            // console.log($scope.tableInner);
            // Table.innerHTML = "";
            $scope.usuarios = [];
            $scope.showEsatdo = false;
            //$scope.usuarios = $scope.usuarioInactivo;

            document.getElementById('IN').style = 'border-bottom: 5px solid white;';
            document.getElementById('AC').style = '';


        }

        $scope.UsuarioListo = async function(usuario) {
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