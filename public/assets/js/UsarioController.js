var angular;
angular.module("app", [])
    .controller("controlador", function($scope, $http) {
        document.getElementById('usuarios').style = 'background-color: #B1D236; color:white'
        $scope.usuarios = [];
        $scope.hola = "hola soy batuza";
        $scope.hh = [];
        $scope.usuarioActivo = [];
        $scope.usuarioInactivo = [];

        cargarUsarios();


        function cargarUsarios() {

            $http.post('/usuarios/getKeys')
                .then(function(respone) {
                    $scope.hh = respone['data'];
                    //console.log($scope.hh);
                    getUsuarios($scope.hh);
                    alert('USUARIOS CARGANDO, PODRA TARDAR UNOS MINUTOS');
                }, function(respone) {
                    alert(respone);
                });
        }


        async function getUsuarios(info) {
            $scope.entregas = {};
            await $http.post('/usuartios/getUsuarios', info)
                .then(function(respone) {
                    $scope.usuarios = respone['data'];
                    $scope.usuarioActivo = $scope.usuarios.usuarioActivo;
                    $scope.usuarioInactivo = $scope.usuarios.usuarioInactivo;
                    $scope.usuarios = $scope.usuarios.usuarioActivo;
                    console.log($scope.usuarios);
                    alert('Usuarios Listos');

                }, function(respone) {
                    alert(respone);
                });
        }

        $scope.MostrarUsuariosAc = () => {
            $scope.usuarios = $scope.usuarioActivo;
        }

        $scope.MostrarUsuariosIn = () => {
            $scope.usuarios = $scope.usuarioInactivo;
        }

        $scope.logout = () => {
            $http.post('/login/logout')
                .then(function(respone) {
                    location.reload();
                }, function(respone) {
                    alert('No se pudo cerrar sesion :(');
                });
        }

    });