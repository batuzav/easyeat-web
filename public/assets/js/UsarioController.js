var angular;
angular.module("app", [])
    .controller("controlador", function($scope, $http) {

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
                    getUsuarios($scope.hh);

                }, function(respone) {
                    alert(respone);
                });
        }


        async function getUsuarios(info) {
            $scope.entregas = {};
            await $http.post('/usuartios/getUsuarios', info)
                .then(function(respone) {
                    $scope.usuarios = respone['data'];
                    $scope.usuarios = $scope.usuarios.usuarioActivo;
                    console.log($scope.usuarios);
                    alert('Usuarios Listos');

                }, function(respone) {
                    alert(respone);
                });
        }
    });