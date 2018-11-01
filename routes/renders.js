//Constante para importar express
const express = require('express');
const app = express();

/*=============RENDERS=============*/

/*------ Ruras de los renders --------*/


//RENDER PARA EL LOGIN
app.get('/login', (req, res) => {
    res.render('login');
});
// FIN DEL RENDE PARA EL LOGIN \\

// RENDERS DEL SIDE BAR PRINCIPAL \\
app.get('/usuarios', (req, res) => {
    res.render('usuarios');
});

app.get('/comandas', (req, res) => {
    res.render('comandas');
});

app.get('/reportes', (req, res) => {
    res.render('reportes');
});

app.get('/menu', (req, res) => {
    res.render('menu');
});

app.get('/entregas', (req, res) => {
    res.render('entregas');
});
// FIN DE LOS RENDERS DEL SIDE BAR PRINCIPAL \\


// Renders para el apardado de Menu \\

app.get('/menuComidas', (req, res) => {
    res.render('menuComida');
});

app.get('/menuCenas', (req, res) => {
    res.render('menuCena');
});

app.get('/menuColaciones', (req, res) => {
    res.render('menuColacion');
});

app.get('/menuFechas', (req, res) => {
    res.render('menuFechas');
});


// Fin de los renders para el partado de MENU \\


module.exports = app;