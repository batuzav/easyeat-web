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



app.get('/success', (req, res) => {
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
});


app.get('/cancel', (req, res) => res.send('Cancelled'));


module.exports = app;