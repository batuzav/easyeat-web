//Constante para importar express
const express = require('express');
const app = express();


app.use(require('./usuariosApp'));

//Rutas del restServer
app.use(require('./alimentos'));
//zc 
//Rutas del restServer para usuarios de la app


//



/*------ impirtacion de las rutas de los renders --------*/
app.use(require('./renders'));

/*--------------Importacion de las funciones REST SERVER DE REPORTES--*/
app.use(require('./reportes'));


/*------Impoprtaciones de las funciones de comandas*/
app.use(require('./comandas'));

/* importaciones de la funciones de Entregas */

app.use(require('./entregas'));


module.exports = app;