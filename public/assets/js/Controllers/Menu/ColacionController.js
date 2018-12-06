var angular;
angular.module("app", [])
    .controller("controlador", function($scope, $http) {

        $scope.colaciones = [];
        $scope.frmData = {};
        $scope.modify = false;
        $scope.imagen = false;
        $scope.img = {};
        $scope.urlImg = {};

        document.getElementById('menu').style = 'background-color: #B1D236; color:white'
        cargarColaciones();

        function init() {
            $scope.urlImg = document.getElementById('inputFile1');

            $scope.urlImg.addEventListener('change', mostrarImagen, false);
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

        async function cargarColaciones() {
            await $http.post('/comidas/getcolaciones')
                .then(function(respone) {
                    $scope.colaciones = respone['data'];
                    $scope.colaciones = $scope.colaciones.colaciones;
                    console.log($scope.colaciones);
                }, function(respone) {
                    alert(respone);
                });
        }

        $scope.agregarColacion = async function() {
            console.log($scope.frmData);
            if ($scope.img.src) {

                $scope.frmData = Object.assign({}, $scope.frmData, {
                    imagen: $scope.img.src,
                });

                console.log($scope.img.src);
            }
            await $http.post('/comidas/insertcolacion', $scope.frmData, {
                    // headers: { 'Content-Type': undefined }
                })
                .then(function(respone) {
                    $scope.frmData = {};
                    alert('Colacion agregada');
                    $scope.imagen = false;
                    console.log('Desayuno agregado');
                    document.getElementById('img1').src = null;

                    console.log(document.getElementById('img1'));
                    cargarColaciones();
                }, function(respone) {
                    alert(respone.data.mensaje);
                });

        };

        $scope.cambiarImagen = async function() {
            $scope.imagen = true;
        }

        $scope.modifyColacion = async function() {
            if ($scope.img.src) {

                $scope.frmData = Object.assign({}, $scope.frmData, {
                    imagen: $scope.img.src,
                });

                console.log($scope.img.src);
            }
            console.log($scope.frmData);
            $http.put('/comidas/modifycolacion', $scope.frmData)
                .then(function(respone) {
                    $scope.frmData = {};
                    $scope.modify = false;
                    alert('Colacion modificada');
                    $scope.modify = false;
                    $scope.imagen = false;
                    console.log('Desayuno agregado');
                    document.getElementById('img1').src = null;

                    console.log(document.getElementById('img1'));
                    cargarColaciones();
                }, function(respone) {
                    alert(respone.data.mensaje);
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
    });