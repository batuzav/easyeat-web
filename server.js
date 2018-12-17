///requerimientos de configuracion
require('./config/config');

//constante para firebase
require('./config/firebase');

//session
var session = require('express-session');


//requerimiento de conecta
const conekta = require('conekta');
//paypal 
const engines = require("consolidate");
const paypal = require("paypal-rest-sdk");
const fileUpload = require('express-fileupload');


/*\\Proximo cambio //*/
const { db } = require('./config/firebase');

// Variables pars  Express
var fs = require('fs');
var http = require('http');
var https = require('https');
const express = require('express');
const app = express();

//constante para hbs
const hbs = require('hbs');

//constante de bodyParser
const bodyParser = require('body-parser');
/*// Esto es una prueba de middleware \\*/
app.use((req, res, next) => {

    // Dominio que tengan acceso (ej. 'http://example.com')
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Metodos de solicitud que deseas permitir
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Encabecedados que permites (ej. 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Headers', '*');

    next();
});
app.use(fileUpload());
const cors = require('cors')
app.use(cors())

//combertir el bogy en json 
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

//compartir la carpeta publica 
app.use(express.static(__dirname + '/public'));

//EXpress HBS engne
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
//const prueba = require('./views/login');

/*-----------------socket----------------*/
//variables para poder usar conekta
conekta.api_key = 'key_LvJkHquY5PyyEqPALswExA';
conekta.api_version = '2.0.0';

//configure de paypal
// paypal.configure({
//     'mode': 'sandbox', //sandbox or live
//     'client_id': 'ATEQENk06mNE2p1mLr1bhewoxdiHP82s1FK9jsZun-TzHor6x08EcXqqS2ME7SJP9V5c-SmXN1_hagoE',
//     'client_secret': 'EOCKLrvxEui1DZH9SxbsvW5R79JOBLKC_H_4qhVBNj0I5s4reYnAVcXbEUfQ70UZl9NEHCD3URd9Hq3h',
// });

paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id: "ATEQENk06mNE2p1mLr1bhewoxdiHP82s1FK9jsZun-TzHor6x08EcXqqS2ME7SJP9V5c-SmXN1_hagoE",
    client_secret: "EOCKLrvxEui1DZH9SxbsvW5R79JOBLKC_H_4qhVBNj0I5s4reYnAVcXbEUfQ70UZl9NEHCD3URd9Hq3h"
});

let totalventa = 0;

//config de mailg
const nodemailer = require('nodemailer'),
    creds = require('./creds'),
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'easyeatapp.random@gmail.com',
            pass: '*#Easy$13#*',
        },
    }),
    EmailTemplate = require('email-templates-v2').EmailTemplate,
    path = require('path'),
    Promise = require('bluebird');

//Configuracion global de rutas
app.use(require('./routes/index'));

//web-view
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


///COnectar al puerto y subir los servicios

app.get('*', (req, res) => {
    return res.status(404).send("<h1> NO HAY PAGINA </h1>");
});

var optionsCERT = {
    key: fs.readFileSync('./config/easyeatapp.key'),
    cert: fs.readFileSync('./config/f3697fa4cb2a78eb.crt'),
};

//constantes para el socket
let server = require('https').Server(optionsCERT, app); //  
let io = require('socket.io')(server); //ligamos el web socket con el servidor
io.origins('*:*');

server.listen(process.env.PORT, () => {
    console.log('Se esta escuchando el puerto: ', process.env.PORT);
});


io.on('connection', function(socket) { //habla al metodo connection
    //console.log("Clientes conectados desde server Carlos");  
    //socket.emit('mensaje',"Hola mundo desde server Carlos");


    socket.on('mensaje', async function(data) {
        // console.log(data);
        let mensaje = null;
        let msg = JSON.parse(data);


        /* Tarjeta de credito */
        if (msg.metodoPago === '  Crédito - Debito') {
            console.log('Entro al pago de tarjeta');
            let datos = [];
            let ClienteID = '';

            console.log(msg.cliente);
            for (let x = 0; x <= msg.productos.length - 1; x++) {
                datos[x] = {
                    "name": msg.productos[x].nombre,
                    "unit_price": Number(msg.productos[x].precio + '0' + '0'),
                    "quantity": 1
                }
            }
            console.log(msg.cliente.nombre);
            console.log(msg.cliente.email);
            console.log(msg.cliente.tel.toString());

            customer = await conekta.Customer.create({
                'name': msg.cliente.nombre,
                'email': msg.cliente.email,
                'phone': msg.cliente.tel.toString(),
                'payment_sources': [{
                    'type': 'card',
                    'token_id': msg.token_id
                }]
            }, async function(err, res) {
                if (err) {
                    console.log('error en el token', err);

                    return;
                }
                console.log(res.toObject());
                ClienteID = res.toObject();
                console.log('no hay error');
                console.log(ClienteID);
                console.log('Id del cleinte en la variable CLienteID', ClienteID.id);
                order = await conekta.Order.create({
                    "line_items": datos,
                    "shipping_lines": [{
                        "amount": 0,
                        "carrier": "Default"
                    }], //shipping_lines - physical goods only
                    "currency": "MXN",
                    "customer_info": {
                        "customer_id": ClienteID.id
                    },
                    "shipping_contact": {
                        "address": {
                            "street1": msg.direccion,
                            "postal_code": msg.cp.toString(),
                            "country": "México"
                        }
                    }, //shipping_contact - required only for physical goods
                    "metadata": { "description": "Plan alimenticio", "reference": "1334523452345" },
                    "charges": [{
                        "payment_method": {
                            "type": "default"
                        }
                    }]
                }, function(err, res) {
                    if (err) {
                        console.log('error en hacer la compra', err);
                        db.ref("/Carrito/" + msg.idcliente + "/").child('infocliente').update({
                            status: false,
                        }, async function(err) {
                            if (err) {
                                console.log('ERROR')
                            } else {
                                console.log('HECHO')
                            }
                        });
                        return;
                    }
                    console.log(res.toObject());
                    db.ref("/Carrito/" + msg.idcliente + "/").child('infocliente').update({
                        status: true,
                    }, async function(err) {
                        if (err) {
                            console.log('ERROR')
                        } else {
                            console.log('HECHO')
                        }
                    });
                });
            });



        }

        if (msg.metodoPago === '  Oxxo Pay') {
            //OXXO PAY
            console.log('Pagara con oxxopay el compa');

            let datos = [];
            for (let x = 0; x <= msg.productos.length - 1; x++) {
                datos[x] = {
                    "name": msg.productos[x].nombre,
                    "unit_price": Number(msg.productos[x].precio + '0' + '0'),
                    "quantity": 1
                }

            }

            //console.log(datos);
            const telefono = toString(msg.cp);
            // console.log(telefono);
            var data2 = order = conekta.Order.create({
                "line_items": datos,
                "shipping_lines": [{
                    "amount": 0,
                    "carrier": "Default"
                }], //shipping_lines - phyiscal goods only
                "currency": "MXN",
                "customer_info": {
                    "name": msg.cliente.nombre,
                    "email": msg.cliente.email,
                    "phone": msg.cliente.tel.toString(),
                },
                "shipping_contact": {
                    "address": {
                        "street1": msg.direccion,
                        "postal_code": msg.cp.toString(),
                        "country": "México"
                    }
                }, //shipping_contact - required only for physical goods
                "charges": [{
                    "payment_method": {
                        "type": "oxxo_cash"
                    }
                }]


            }, function(err, res) {
                if (res) {
                    console.log(res.toObject());
                    mensaje = res.toObject();
                    //socket.broadcast.emit('mensaje', mensaje);
                    console.log(mensaje.charges.data[0].payment_method.reference);
                    console.log('idcleinte', mensaje);
                    let efer = mensaje.charges.data[0].payment_method.reference;
                    let users = [{
                        name: mensaje.customer_info.name,
                        email: mensaje.customer_info.email,
                    }];

                    function sendEmail(obj) {
                        return transporter.sendMail(obj);
                    }

                    function loadTemplate(templateName, contexts) {
                        let template = new EmailTemplate(path.join(__dirname, 'templates', templateName));
                        return Promise.all(contexts.map((context) => {
                            return new Promise((resolve, reject) => {
                                template.render(context, (err, result) => {
                                    if (err) reject(err);
                                    else resolve({
                                        email: result,
                                        context,
                                    });
                                });
                            });
                        }));
                    }

                    loadTemplate('welcome', users).then((results) => {
                        console.log(results)
                        return Promise.all(results.map((result) => {
                            sendEmail({
                                to: result.context.email,
                                from: 'EASYEAT-APP',
                                subject: result.email.subject,
                                html: "<html lang='en' > <head> <link href='./conekta/styles.css' media='all' rel='stylesheet' type='text/css' /> <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600,700' rel='stylesheet'> <script src='https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js'></script> <style> /* Reset -------------------------------------------------------------------- */ *    { margin: 0;padding: 0; } body { font-size: 14px; } /* OPPS --------------------------------------------------------------------- */ h3 { margin-bottom: 10px; font-size: 15px; font-weight: 600; text-transform: uppercase; } .opps { width: 496px; border-radius: 4px; box-sizing: border-box; padding: 0 45px; margin: 40px auto; overflow: hidden; border: 1px solid #b0afb5; font-family: 'Open Sans', sans-serif; color: #4f5365; } .opps-reminder { position: relative; top: -1px; padding: 9px 0 10px; font-size: 11px; text-transform: uppercase; text-align: center; color: #ffffff; background: #000000; } .opps-info { margin-top: 2 px; position: relative; } .opps-info:after { visibility: hidden; display: block; font-size: 0; content: ' '; clear: both; height: 0; } .opps-brand { width: 45%; float: left; } .opps-brand img { max-width: 150px; margin-top: 2px; } .opps-ammount { width: 55%; float: right; } .opps-ammount h2 { font-size: 36px; color: #000000; line-height: 24px; margin-bottom: 15px; } .opps-ammount h2 sup { font-size: 16px; position: relative; top: -2px } .opps-ammount p { font-size: 10px; line-height: 14px; } .opps-reference { margin-top: 14px; } h1 { font-size: 27px; color: #000000; text-align: center; margin-top: -1px; padding: 6px 0 7px; border: 1px solid #b0afb5; border-radius: 4px; background: #f8f9fa; } .opps-instructions { margin: 32px -45px 0; padding: 32px 45px 45px; border-top: 1px solid #b0afb5; background: #f8f9fa; } ol { margin: 17px 0 0 16px; } li + li { margin-top: 10px; color: #000000; } a { color: #1155cc; } .opps-footnote { margin-top: 22px; padding: 22px 20 24px; color: #108f30; text-align: center; border: px solid #108f30; border-radius: 4px; background: #ffffff; } </style> </head> <body > <div class='opps'> <div class='opps-header'> <div class='opps-reminder'>Ficha digital. No es necesario imprimir.</div> <div class='opps-info'> <div class='opps-brand'><img src='https://scontent.fgdl5-1.fna.fbcdn.net/v/t1.15752-9/47056285_340117119902573_3179407570167136256_n.png?_nc_cat=101&_nc_ht=scontent.fgdl5-1.fna&oh=10f53ec6795c1da7930f186c61e01c89&oe=5C6CB506' alt='OXXOPay'></div> <div class='opps-ammount'> <h3>Monto a pagar</h3> <h2>" + mensaje.amount / 100 + "<sup>" + mensaje.currency + "</sup></h2> <p>OXXO cobrará una comisión adicional al momento de realizar el pago.</p></div> </div> <div class='opps-reference'> <h3>Referencia</h3> <h1>" + efer + "</h1> </div> </div> <div class='opps-instructions'> <h3>Instrucciones</h3> <ol> <li>Acude a la tienda OXXO más cercana. <a href='https://www.google.com.mx/maps/search/oxxo/' target='_blank'>Encuéntrala aquí</a>.</li> <li>Indica en caja que quieres realizar un pago de <strong>OXXOPay</strong>.</li> <li>Dicta al cajero el número de referencia en esta ficha para que tecleé directamete en la pantalla de venta.</li> <li>Realiza el pago correspondiente con dinero en efectivo.</li> <li>Al confirmar tu pago, el cajero te entregará un comprobante impreso. <strong>En el podrás verificar que se haya realizado correctamente.</strong> Conserva este comprobante de pago.</li> </ol> <div class='opps-footnote'>Al completar estos pasos recibirás un correo de <strong>easyeat-app</strong> confirmando tu pago.</div> </div> </div> </body> </html>",
                                text: result.email.text,
                            });
                        }));
                    }).then(() => {
                        console.log('Yay!');

                    });


                    db.ref("/Carrito/" + msg.idcliente + "/").child('infocliente').update({
                        status: true,
                    }, async function(err) {
                        if (err) {
                            console.log('ERROR')
                        } else {
                            console.log('HECHO')


                        }
                    });
                }
                if (err) {
                    console.log(err);
                    db.ref("/Carrito/" + msg.idcliente + "/").child('infocliente').update({
                        status: false,
                    }, async function(err) {
                        if (err) {
                            console.log('ERROR')
                        } else {
                            console.log('HECHO')


                        }
                    });
                }
            })

        }

    });

});
module.exports = {
    io
}