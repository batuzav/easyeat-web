var angular;
angular.module("app", [])
    .controller("controlador", function($scope, $http) {
        document.getElementById('reportes').style = 'background-color: #18ab29; color:white'
        $scope.reportes = {};
        $scope.tabla = [];
        $scope.frmData = {};
        //variables para tablas con filtros
        $scope.dataTardeComida = {};
        $scope.dataTardeDesayuno = {};
        $scope.dataTardeCena = {};
        $scope.dataMalEstadoComida = {};
        $scope.dataMalEstadoDesayuno = {};
        $scope.dataMalEstadoCena = {};
        $scope.dataNollegoComida = {};
        $scope.dataNollegoDesayuno = {};
        $scope.dataNollegoCena = {};
        //contadores de reportes 



        //Variables para latabla sin filtro
        $scope.InfoLlegoTarde = [];
        $scope.InfoLlegoMal = [];
        $scope.InfoNoLlego = [];

        $scope.llamarReportes = async function() {
            $scope.tabla.length = 0;
            $scope.tabla.length = 0;
            $scope.dataTardeDesayuno.length = 0;
            $scope.dataTardeComida.length = 0;
            $scope.dataTardeCena.length = 0;
            $scope.dataMalEstadoComida.length = 0;
            $scope.dataMalEstadoDesayuno.length = 0;
            $scope.dataMalEstadoCena.length = 0;
            $scope.dataNollegoComida.length = 0;
            $scope.dataNollegoDesayuno.length = 0;
            $scope.dataNollegoCena.length = 0;
            $scope.InfoLlegoTarde.length = 0;
            $scope.InfoLlegoMal.length = 0;
            $scope.InfoNoLlego.length = 0;
            await $http.post('/getreportes', $scope.frmData)
                .then(function(respone) {
                    $scope.reportes = respone['data'];
                    console.log($scope.reportes);
                    cargarReportes($scope.reportes);
                    alert('Reportes listos');
                    console.log($scope.reportes.dataTardeDesayuno);
                }, function(respone) {
                    alert(respone);
                });
        }

        async function cargarReportes(reportes) {
            console.log("tabla iniciando el cargar", $scope.tabla);
            $scope.dataTardeDesayuno = reportes.dataTardeDesayuno;
            $scope.dataTardeComida = reportes.dataTardeComida;
            $scope.dataTardeCena = reportes.dataTardeCena;
            $scope.dataMalEstadoComida = reportes.dataMalEstadoComida;
            $scope.dataMalEstadoDesayuno = reportes.dataMalEstadoDesayuno;
            $scope.dataMalEstadoCena = reportes.dataMalEstadoCena;
            $scope.dataNollegoComida = reportes.dataNollegoComida;
            $scope.dataNollegoDesayuno = reportes.dataNollegoDesayuno;
            $scope.dataNollegoCena = reportes.dataNollegoCena;

            $scope.InfoLlegoTarde = $scope.InfoLlegoTarde.concat($scope.dataTardeComida, $scope.dataTardeCena, $scope.dataTardeDesayuno);

            $scope.InfoLlegoMal = $scope.InfoLlegoMal.concat($scope.dataMalEstadoDesayuno, $scope.dataMalEstadoCena, $scope.dataMalEstadoComida);

            $scope.InfoNoLlego = $scope.InfoNoLlego.concat($scope.dataNollegoDesayuno, $scope.dataNollegoCena, $scope.dataNollegoComida);

            $scope.tabla = $scope.tabla.concat($scope.InfoLlegoMal, $scope.InfoNoLlego, $scope.InfoLlegoTarde);
            $scope.tabla = $scope.tabla.filter(Boolean);
            console.log('cantidad de posiciones', $scope.tabla.length);
        }

        $scope.reporteListo = async(reporte) => {
            await $http.post('/reportes/getkey', reporte)
                .then(function(respone) {
                    console.log(respone);
                    $scope.tabla = [];
                    $scope.llamarReportes();
                }, function(respone) {
                    alert(respone.err);
                });

        }

    });