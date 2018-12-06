var angular;
angular.module("app", [])
    .controller("controlador", function($scope, $http) {
        $scope.frmData = {};
        $scope.cenas = {};
        $scope.colaciones = {};
        $scope.desayunos = {};
        $scope.comidas = {};

        document.getElementById('menu').style = 'background-color: #B1D236; color:white'
        cargarCenas();
        cargarColaciones();
        cargarDesayunos();
        cargarComidas();



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



    });