//constantes para las funciones de express
const express = require('express')
const app = express();
const { db } = require("../config/firebase");
const _ = require('underscore');
let array = [];
app.post('/getUsuarios', (req, res) => {
    db.ref("usuarios").once("value", function(snapshot) {
        if (!snapshot.val()) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        let data = snapshot.val();
        // array = Array.from(data.usuarios);
        res.json({
            usuarios: data
        });

    });
});


module.exports = app;