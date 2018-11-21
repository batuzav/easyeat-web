///requerimientos de configuracion
require('./config/config');

//constante para firebase
require('./config/firebase');

//requerimiento de conecta
const conekta = require('conekta');
//paypal 
const paypal = require('paypal-rest-sdk');

/*\\Proximo cambio //*/
const { db } = require('./config/firebase');

// Variables pars  Express
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

const cors = require('cors')
app.use(cors())

//combertir el bogy en json 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ATEQENk06mNE2p1mLr1bhewoxdiHP82s1FK9jsZun-TzHor6x08EcXqqS2ME7SJP9V5c-SmXN1_hagoE',
    'client_secret': 'EOCKLrvxEui1DZH9SxbsvW5R79JOBLKC_H_4qhVBNj0I5s4reYnAVcXbEUfQ70UZl9NEHCD3URd9Hq3h',

    /* {
         "port": 3000,
         "api": {
             "mode": "live",
             "host": "api.paypal.com",
             "port": "",
             "client_id": "ATEQENk06mNE2p1mLr1bhewoxdiHP82s1FK9jsZun-TzHor6x08EcXqqS2ME7SJP9V5c-SmXN1_hagoE",
             "client_secret": 'EOCKLrvxEui1DZH9SxbsvW5R79JOBLKC_H_4qhVBNj0I5s4reYnAVcXbEUfQ70UZl9NEHCD3URd9Hq3h'
         }*/
});




//Configuracion global de rutas
app.use(require('./routes/index'));




///COnectar al puerto y subir los servicios



//constantes para el socket
let server = require('http').Server(app); //  
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
        console.log(msg.metodoPago);

        /* Tarjeta de credito */
        if (msg.metodoPago === '  Crédito - Debito') {
            console.log('Entro al pago de tarjeta');
            let datos = [];
            let ClienteID = '';
            for (let x = 0; x <= msg.productos.length - 1; x++) {
                datos[x] = {
                    "name": msg.productos[x].nombre,
                    "unit_price": Number(msg.productos[x].precio + '0' + '0'),
                    "quantity": 1
                }

            }


            let idclient = customer = await conekta.Customer.create({
                'name': msg.cliente.nombre,
                'email': msg.cliente.email,
                'phone': msg.cliente.tel.toString(),
                'payment_sources': [{
                    'type': 'card',
                    'token_id': msg.token_id
                }]
            }, function(err, res) {
                if (err) {
                    console.log('error en el token', err);

                    return;
                }
                console.log(res.toObject());
                ClienteID = res.toObject();
                console.log('Id del cleinte en la variable CLienteID', ClienteID.id);
            });

            var data2 = order = await conekta.Order.create({
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
                    } //payment_methods - use the customer's default - a card
                    //to charge a card, different from the default,
                    //you can indicate the card's source_id as shown in the Retry Card Section
                }]
            }, function(err, res) {
                if (err) {
                    console.log('error en hacer la compra', err);
                    return;
                }
                console.log(res.toObject());
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

            console.log(datos);
            const telefono = toString(msg.cp);
            console.log(telefono);
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
                    console.log('idcleinte', msg);
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

        if (msg.metodoPago === '  Paypal') {
            console.log('PAYPAL');
            /* var create_payment_json = {
                 "intent": "authorize",
                 "payer": {
                     "payment_method": "paypal"
                 },
                 "redirect_urls": {
                     "return_url": "http://return.url",
                     "cancel_url": "http://cancel.url"
                 },
                 "transactions": [{
                     "item_list": {
                         "items": [{
                             "name": "item",
                             "sku": "item",
                             "price": "1.00",
                             "currency": "USD",
                             "quantity": 1
                         }]
                     },
                     "amount": {
                         "currency": "USD",
                         "total": "1.00"
                     },
                     "description": "This is the payment description."
                 }]
             };

             paypal.payment.create(create_payment_json, function(error, payment) {
                 if (error) {
                     console.log(error.response);
                     throw error;
                 } else {
                     for (var index = 0; index < payment.links.length; index++) {
                         //Redirect user to this endpoint for redirect url
                         if (payment.links[index].rel === 'approval_url') {
                             console.log('holaviejoo');
                             console.log(payment.links[index].href);

                             /*const execute_payment_json = {
                                 "payer_id": "5115116511651",
                                 "transactions": [{
                                     "amount": {
                                         "currency": "USD",
                                         "total": "25.00"
                                     }
                                 }]
                             };

                             var paymentId = 'PAYMENT id created in previous step';

                             paypal.payment.execute(paymentId, execute_payment_json, function(error, payment) {
                                 if (error) {
                                     console.log(error.response);
                                     throw error;
                                 } else {
                                     console.log("Get Payment Response");
                                     console.log(JSON.stringify(payment));
                                 }
                             });*/

            /*    }
                    }
                    console.log(payment);
                }
            });*/



        }
    });

});
module.exports = {
    io
}