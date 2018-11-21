//constantes para las funciones de express
const express = require('express')
const app = express();
const { db } = require("../config/firebase");
const _ = require('underscore');
var moment = require('moment');
moment().format();

app.post('/entregas/getComandas', async(req, res) => {
    let info = req.body;
    let keys = Object.values(info.keys);
    let data = [];
    let busquedaDeFecha = [];

    for (let x = 0; x < keys.length; x++) {
        console.log(x);
        await db.ref("/MenuFechaPersona/" + keys[x].id + "/").on("value", async function(snapshot) {
            if (!snapshot.val()) {
                return res.status(400).json({
                    ok: false,
                });
            }
            await snapshot.forEach((child) => {
                if (info.fecha.fechaReporte === child.key) {
                    busquedaDeFecha.push({
                        fecha: child.key,
                        idUsuario: keys[x].id,
                    });
                }
            });
        });
    }

    for (let x = 0; x < busquedaDeFecha.length; x++) {
        let cont = 0;
        console.log('Key por analizar: ', busquedaDeFecha[x].idUsuario);

        const infoComanda = await db.ref("/MenuFechaPersona/" + busquedaDeFecha[x].idUsuario + "/" + busquedaDeFecha[x].fecha + "/").once("value");
        if (infoComanda.val()) {

            if (infoComanda.val().Desayuno && infoComanda.val().Comida && infoComanda.val().Cena) {
                console.log('hay un completo');
            } else {
                if (infoComanda.val().Desayuno) {
                    console.log('Info de la comanda de dayuno: ', infoComanda.val().Desayuno);
                }
                if (infoComanda.val().Comida) {
                    console.log('Info de la comanda de comida: ', infoComanda.val().Comida);
                }
                if (infoComanda.val().Cena) {
                    console.log('Info de la comanda de cena: ', infoComanda.val().Cena);
                }
            }


        }

    }

    res.json({
        ok: true,

    });
});

//exportacion de app para poder usarla en cualquier parte del proyecto
module.exports = app;