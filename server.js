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
    'client_id': 'AVKkuvPnxLOcwO_VdDmCK-ceUj7uBZhVR0skupVCTqGvBByiW0runX4Cys9Vdd0qoEJe1M4Vrxfc3S5n',
    'client_secret': 'EAujfG0P4Dm0XKzjtsGClmNHA7uS8C2oEo76V9K62wz1-Dl1OSIxlZ0xbvyKl7QBE8hKa2DoG5hZGv7_',

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
            var payReq = JSON.stringify({

                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "https://www.paypal.com",
                    "cancel_url": "https://www.paypal.com",
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": "tacos",
                            "sku": "001",
                            "price": "20.00",
                            "currency": "MXN",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "MXN",
                        "total": "20.00"
                    },
                    "description": "This is the payment description."
                }]
            });

            paypal.payment.create(payReq, async function(error, payment) {
                var links = {};

                if (error) {
                    console.error(JSON.stringify(error));
                } else {
                    // Capture HATEOAS links
                    console.log(payment)
                    payment.links.forEach(async function(linkObj) {
                        links[linkObj.rel] = await {
                            href: linkObj.href,
                            method: linkObj.method
                        };
                    })

                    // If the redirect URL is present, redirect the customer to that URL
                    if (links.hasOwnProperty('approval_url')) {
                        // Redirect the customer to links['approval_url'].href
                    } else {
                        console.error('no redirect URI present');
                    }
                }
            });
        }




    });
});




module.exports = {
    io
}