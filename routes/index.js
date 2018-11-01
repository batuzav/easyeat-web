//Constante para importar express
const express = require('express');
const app = express();


//Rutas del restServer
app.use(require('./alimentos'));
//zc 
//Rutas del restServer para usuarios de la app
//
app.use(require('./usuariosApp'));


/*------ impirtacion de las rutas de los renders --------*/
app.use(require('./renders'));

module.exports = app;