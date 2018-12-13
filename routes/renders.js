//Constante para importar express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var session = require('express-session');
const { db } = require("../config/firebase");
const _ = require('underscore');

let array = [];
let sesion = {};

app.use(session({ secret: "iloveeasyeat" }));



//middlewatre
const usuarioRegistrado = (req, res, next) => {
    if (req.session.userRegistrado === true) { next(); } else {
        res.redirect('/login');
    }
}

const permisosUsuarios = (req, res, next) => {
    if (req.session.tipoUser == 1) next();

    if (req.session.tipoUser == 2) res.redirect('/comandas');

    if (req.session.tipoUser == 3) res.redirect('/entregas');

}

const permisosAlimentos = (req, res, next) => {
    if (req.session.tipoUser == 1 || req.session.tipoUser == 2) next();

    else res.redirect('/entregas');
}

const permisosEntregas = (req, res, next) => {
        if (req.session.tipoUser == 1 || req.session.tipoUser == 3) next();

        else res.redirect('/comandas');
    }
    /*=============RENDERS=============*/

/*------ Rutas de los renders --------*/
app.post('/login/loging', (req, res) => {
    data = req.body;
    let cont = false;
    console.log(data);
    db.ref("/UsuariosPanel").on("value", async function(snapshot) {
        if (!snapshot.val()) {
            return res.status(400).json({
                ok: false,
                err,
                menaje: "Error en la base de datos o conexion :("
            });
        }
        await snapshot.forEach((child) => {
            console.log(child.key);
            if (data.user === child.val().user && data.pass.toString() === child.val().pass.toString()) {
                console.log('Encontro usuario');
                cont = true;
                res.json({ ok: true, tipo: child.val().tipo })
            }
        });

        if (!cont) { res.json({ ok: false, mensaje: "Usuario no encontrado" }); }



    });



});

app.post('/loging/listo', (req, res) => {
    data = req.body;
    console.log('valor de data despues del primer login: ', data);
    req.session.userRegistrado = data.ok;
    req.session.tipoUser = data.tipo;
    console.log('antes del middleware: ', req.session.userRegistrado);
    sesion = req.session.userRegistrado;
    res.end('done');
});

app.post('/login/logout', (req, res) => {
    req.session.userRegistrado = false;
    req.session.tipoUser = 0;
    res.end('done');
});



//RENDER PARA EL LOGIN
// FIN DEL RENDE PARA EL LOGIN \\
app.get('/login', (req, res) => {
    res.render('login');
});



// RENDERS DEL SIDE BAR PRINCIPAL \\
app.get('/usuarios', usuarioRegistrado, permisosUsuarios, (req, res) => {
    res.render('usuarios');
});

app.get('/comandas', usuarioRegistrado, permisosAlimentos, (req, res) => {
    res.render('comandaDesayuno');

});

app.get('/reportes', usuarioRegistrado, permisosUsuarios, (req, res) => {
    res.render('reportes');
});

app.get('/menu', usuarioRegistrado, permisosAlimentos, (req, res) => {
    res.render('menu');
});

app.get('/entregas', usuarioRegistrado, permisosEntregas, (req, res) => {
    res.render('entregas');
});
// FIN DE LOS RENDERS DEL SIDE BAR PRINCIPAL \\


// Renders para el apardado de Menu \\

app.get('/menuComidas', usuarioRegistrado, permisosAlimentos, (req, res) => {
    res.render('menuComida');
});

app.get('/menuCenas', usuarioRegistrado, permisosAlimentos, (req, res) => {
    res.render('menuCena');
});

app.get('/menuColaciones', usuarioRegistrado, permisosAlimentos, (req, res) => {
    res.render('menuColacion');
});

app.get('/menuFechas', usuarioRegistrado, permisosAlimentos, (req, res) => {
    res.render('menuFechas');
});
// Fin de los renders para el partado de MENU \\

// Renders para el apartado de Comandas \\

app.get('/comandaComidas', usuarioRegistrado, permisosAlimentos, (req, res) => {
    res.render('comandas');
});

app.get('/comandaCenas', usuarioRegistrado, permisosAlimentos, (req, res) => {
    res.render('comandaCenas');
});
app.get('/comandaColaciones', usuarioRegistrado, permisosAlimentos, (req, res) => {
    res.render('comandaColaciones');
});

app.get('/', usuarioRegistrado, permisosUsuarios, (req, res) => {
    res.redirect('/usuarios');
});


// Fin del apartado de comandas \\

module.exports = app;