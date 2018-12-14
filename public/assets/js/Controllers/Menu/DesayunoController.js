var angular;
angular.module("app", ['ngCookies'])
    .controller("controlador", function($scope, $http, $cookies) {

        $scope.imgenDefault = '/assets/img/imagen-predeterminado-desayuno-menu.png';
        $scope.desayunos = [];
        $scope.hola = "hola soy batuza";
        $scope.hh = [];
        $scope.frmData = {};
        $scope.modify = false;
        $scope.imagen = false;
        $scope.img = {};
        $scope.urlImg = {};
        $scope.imagenTipo = {};
        $scope.nombreTipo = {};
        cargarTipo();
        cargarDesayunos();
        document.getElementById('menu').style = 'background-color: #B1D236; color:white'
        document.getElementById('desayunos').style = 'border-bottom: 5px solid white;'

        function init() {
            $scope.urlImg = document.getElementById('inputFile1');

            $scope.urlImg.addEventListener('change', mostrarImagen, false);
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

        function mostrarImagen(event) {
            var file = event.target.files[0];
            var reader = new FileReader();
            reader.onload = function(event) {
                $scope.img = document.getElementById('img1');
                $scope.img.src = event.target.result;
                console.log('Este es el valor de la variable de imagen: ', $scope.img);
            }
            reader.readAsDataURL(file);
        }

        window.addEventListener('load', init, false);
        async function cargarDesayunos() {
            $scope.loading = true;
            await $http.post('/comidas/getdesayunos')
                .then(function(respone) {
                    $scope.desayunos = respone['data'];
                    $scope.desayunos = $scope.desayunos.desayuno;
                    console.log($scope.desayunos);
                    $scope.loading = false;
                }, function(respone) {
                    alert(respone);
                });
        }

        $scope.agregarDesayuno = async function() {
            console.log('Formulario antes del set: ', $scope.frmData);
            if ($scope.img.src) {

                $scope.frmData = Object.assign({}, $scope.frmData, {
                    imagen: $scope.img.src,
                });

                console.log($scope.img.src);
            }
            $scope.loading = true;
            await $http.post('/comidas/insertdesayunos', $scope.frmData, )
                .then(function(respone) {
                    $scope.frmData = {};
                    alert('Desayuno agregado');
                    $scope.imagen = false;
                    console.log('Desayuno agregado');
                    document.getElementById('img1').src = null;

                    console.log(document.getElementById('img1'));
                    cargarDesayunos();
                }, function(respone) {
                    console.log('respuesta mala', respone)
                    alert(respone.data.mensaje);
                    $scope.loading = false;
                });

        };

        $scope.cambiarImagen = async function() {
            $scope.imagen = true;
        }

        $scope.modifyDesayuno = async function() {
            if ($scope.img.src) {

                $scope.frmData = Object.assign({}, $scope.frmData, {
                    imagen: $scope.img.src,
                });

                console.log($scope.img.src);
            }

            console.log($scope.frmData);
            $scope.loading = true;
            $http.put('/comidas/modifydesayunos', $scope.frmData)
                .then(function(respone) {
                    $scope.frmData = {};
                    $scope.modify = false;
                    $scope.imagen = false;
                    console.log('Desayuno agregado');
                    document.getElementById('img1').src = null;

                    console.log(document.getElementById('img1'));
                    console.log(respone);
                    cargarDesayunos();
                    alert("Desayuno modificado perfectamente");
                }, function(respone) {
                    alert(respone.data.mensaje);
                    $scope.loading = false;
                });

        }

        $scope.selectObject = async function(select) {
            console.log('Entro a seleccion');
            console.log(select);
            $scope.frmData = {
                id: select.id,
                nombre: select.nombre,
                descripcion: select.descripcion,
                calorias: select.calorias,
                medidas: select.medidas,
                imagen: select.imagen

            };
            $scope.imagen = true;
            document.getElementById('img1').src = select.imagen;
            $scope.modify = true;
        }

        $scope.cancelarModify = async function() {
            $scope.frmData = {};
            $scope.modify = false;
            document.getElementById('img1').src = null;
            $scope.imagen = false;
        }

        $scope.cancelarImagen = () => {
            document.getElementById('img1').src = null;
            $scope.imagen = false;
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