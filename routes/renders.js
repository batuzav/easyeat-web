//Constante para importar express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var session = require('express-session');
const { db } = require("../config/firebase");
const _ = require('underscore');
const paypal = require("paypal-rest-sdk");

let array = [];
let sesion = {};

app.use(session({ secret: "iloveeasyeat" }));

paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id: "ATEQENk06mNE2p1mLr1bhewoxdiHP82s1FK9jsZun-TzHor6x08EcXqqS2ME7SJP9V5c-SmXN1_hagoE",
    client_secret: "EOCKLrvxEui1DZH9SxbsvW5R79JOBLKC_H_4qhVBNj0I5s4reYnAVcXbEUfQ70UZl9NEHCD3URd9Hq3h"
});

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

app.get("/pagopaypal", (req, res) => {
    res.render("indexpaypal");
});


//sesion//



app.get("/paypal", async(req, res) => {
    console.log('AQui debe ir la id:', req.query.id);
    const idCliente = req.query.id;
    let data = [];
    let cont = 0;
    let total = 0;
    let totalString = 0;
    console.log('Total: ', req.query.total);
    totalventa = req.query.total;
    db.ref("/Carrito/" + idCliente + "/productos").once("value", async function(snapshot) {

        if (!snapshot.val()) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        await snapshot.forEach((child) => {
            console.log('Este el valor del hijo del carrtio', child.val());
            const conver = Number(child.val().precio);
            data.push({
                name: child.val().nombre,
                sku: child.val().nombre,
                price: child.val().precio,
                /**/
                currency: "MXN",
                quantity: 1
            });
            cont++;
            total = total + child.val().precio;


        });
        console.log('esta es numero de carrito: ', data.length);
        console.log('Este es total de suma: ', total);

        //totalventa = totalventa.toString();
        console.log('Este es el string de total: ', totalventa);
        console.log('Contador ' + cont + ' total: ' + total);

        var create_payment_json = {
            intent: "sale",
            payer: {
                payment_method: "paypal"
            },
            redirect_urls: {
                return_url: "http://easyeatapp.com/success",
                cancel_url: "http://easyeatapp.com/cancel"
            },
            transactions: [{
                item_list: {
                    items: data
                },
                amount: {
                    currency: "MXN",
                    total: totalventa
                },
                description: "This is the payment description."
            }]
        };

        paypal.payment.create(create_payment_json, function(error, payment) {
            if (error) {
                throw error;
            } else {
                console.log("Create Payment Response");
                console.log(payment);
                res.redirect(payment.links[1].href);
            }
        });
    });


    console.log('Este es el string de total fuera: ', totalventa);

});

app.get("/success", (req, res) => {
    var PayerID = req.query.PayerID;
    var paymentId = req.query.paymentId;
    console.log('total en succes: ', totalventa);
    var execute_payment_json = {
        payer_id: PayerID,
        transactions: [{
            amount: {
                currency: "MXN",
                total: totalventa
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function(
        error,
        payment
    ) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.render("success");

        }
    });
});

app.get("/cancel", (req, res) => {

    res.render("cancel");
});

app.get('*', (req, res) => {
    return res.status(404).send("<h1> NO HAY PAGINA </h1>");
});
// Fin del apartado de comandas \\

module.exports = app;