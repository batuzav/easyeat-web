var angular;
angular.module("app", ['ngCookies'])
    .controller("controlador", function($scope, $http, $cookies) {
        $scope.imagenDefault = '/assets/img/imagen-predeterminado-comida-menu.png';
        $scope.comidas = [];
        $scope.frmData = {};
        $scope.modify = false;
        $scope.imagen = false;
        $scope.img = {};
        $scope.urlImg = {};
        $scope.imagenTipo = {};
        $scope.nombreTipo = {};

        document.getElementById('menu').style = 'background-color: #B1D236; color:white'
        document.getElementById('comidas').style = 'border-bottom: 5px solid white;'
        cargarTipo();
        cargarComidas();

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

        async function cargarComidas() {
            $scope.loading = true;
            await $http.post('/comidas/getcomidas')
                .then(function(respone) {
                    $scope.comidas = respone['data'];
                    $scope.comidas = $scope.comidas.comidas;
                    console.log($scope.comidas);
                    $scope.loading = false;
                }, function(respone) {
                    alert(respone);
                });
        }

        $scope.agregarComida = async function() {
            console.log($scope.frmData);
            if ($scope.img.src) {

                $scope.frmData = Object.assign({}, $scope.frmData, {
                    imagen: $scope.img.src,
                });

                console.log($scope.img.src);
            }
            $scope.loading = true;
            await $http.post('/comidas/insertcomidas', $scope.frmData)
                .then(function(respone) {
                    $scope.frmData = {};
                    alert('Comida agregada');
                    $scope.imagen = false;

                    document.getElementById('img1').src = null;

                    console.log(document.getElementById('img1'));
                    console.log(respone);
                    // cargarComidas();
                }, function(respone) {
                    alert(respone.data.mensaje);
                    $scope.loading = false;
                });

        };

        $scope.cambiarImagen = async function() {
            $scope.imagen = true;
        }

        $scope.modifyComida = async function() {
            if ($scope.img.src) {

                $scope.frmData = Object.assign({}, $scope.frmData, {
                    imagen: $scope.img.src,
                });

                console.log($scope.img.src);
            }
            console.log($scope.frmData);
            $scope.loading = true;
            $http.put('/comidas/modifycomida', $scope.frmData)
                .then(function(respone) {
                    $scope.frmData = {};
                    $scope.modify = false;
                    $scope.imagen = false;

                    document.getElementById('img1').src = null;

                    console.log(document.getElementById('img1'));
                    console.log(respone);
                    alert('Comida modificada');
                    // cargarComidas();
                }, function(respone) {
                    alert(respone.data.mensaje);
                    $scope.loading = false;
                });

        }

        $scope.selectObject = async function(select) {
            console.log('Entro a seleccion');
            $scope.frmData = {
                id: select.id,
                nombre: select.nombre,
                descripcion: select.descripcion,
                calorias: select.calorias,
                medidas: select.medidas,
                imagen: select.imagen

            };
            $scope.modify = true;
            $scope.imagen = true;
            document.getElementById('img1').src = select.imagen;
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