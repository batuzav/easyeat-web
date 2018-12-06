var angular;
angular.module("app", [])
    .controller("controlador", function($scope, $http) {

        $scope.cenas = [];
        $scope.frmData = {};
        $scope.modify = false;
        $scope.imagen = false;
        $scope.img = {};
        $scope.urlImg = {};

        document.getElementById('menu').style = 'background-color: #B1D236; color:white'
        cargarCenas();

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

        async function cargarCenas() {

            await $http.post('/comidas/getcenas')
                .then(function(respone) {
                    $scope.cenas = respone['data'];
                    $scope.cenas = $scope.cenas.cenas;
                    console.log($scope.cenas);
                }, function(respone) {
                    alert(respone);
                });
        }

        $scope.agregarCena = async function() {
            console.log($scope.frmData);
            if ($scope.img.src) {

                $scope.frmData = Object.assign({}, $scope.frmData, {
                    imagen: $scope.img.src,
                });

                console.log($scope.img.src);
            }
            await $http.post('/comidas/insertcenas', $scope.frmData, {
                    // headers: { 'Content-Type': undefined }
                })
                .then(function(respone) {
                    $scope.frmData = {};
                    alert('Cena agregada');
                    console.log(respone);
                    $scope.imagen = false;
                    console.log('Desayuno agregado');
                    document.getElementById('img1').src = null;

                    console.log(document.getElementById('img1'));
                    cargarCenas();
                }, function(respone) {
                    alert(respone.data.mensaje);
                });

        };
        $scope.cambiarImagen = async function() {
            $scope.imagen = true;
        }

        $scope.modifyCena = async function() {
            if ($scope.img.src) {

                $scope.frmData = Object.assign({}, $scope.frmData, {
                    imagen: $scope.img.src,
                });

                console.log($scope.img.src);
            }

            console.log($scope.frmData);
            $http.put('/comidas/modifycena', $scope.frmData)
                .then(function(respone) {
                    $scope.frmData = {};
                    $scope.modify = false;
                    $scope.imagen = false;
                    document.getElementById('img1').src = null;

                    console.log(document.getElementById('img1'));
                    console.log(respone);
                    alert('Cena modificada');
                    console.log(respone);
                    cargarCenas();
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
            $scope.modify = true;
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