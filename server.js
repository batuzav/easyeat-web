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
    console.log("un cliente se ha conectado id=" + socket.id);

    socket.on('mensaje', function(data) {
        // console.log(data);
        let mensaje = null;
        let msg = JSON.parse(data);
        console.log(msg.metodoPago);

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
                    socket.broadcast.emit('mensaje', mensaje);
                    console.log(msg.idcliente);
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
                    console.log(err)
                }
            })

        }

        if (msg.metodoPago === '  Paypal') {
            var create_payment_json = {
                "intent": "authorize",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "https://easyeat-web.herokuapp.com/PagoPaypalHecho",
                    "cancel_url": "https://easyeat-web.herokuapp.com/PagoPaypalCancel"
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
                            console.log(payment.links[index].href);
                        }
                    }
                    console.log(payment);
                }
            });


        }




    });
});

app.get('/PagoPaypalHecho', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "25.00"
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function(error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            res.send('Success');
        }
    });

    var capture_details = {
        "amount": {
            "currency": "USD",
            "total": "4.54"
        },
        "is_final_capture": true
    };

    paypal.authorization.capture("A21AAEAV2X3q3t54y2uSL8hZc0-617h8tz8OO2FaK5QnSgEDJZZssHa5BHr1d-R2906FLCWYmP_MHTN5JdsLEgSSadZJbJ6Lg", capture_details, function(error, capture) {
        if (error) {
            console.error(error);
        } else {
            console.log(capture);
        }
    });

});

app.get('/PagoPaypalCancel', (req, res) => res.send('Cancelled'));


module.exports = {
    io
}