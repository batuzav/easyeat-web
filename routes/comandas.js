//constantes para las funciones de express
const express = require('express')
const app = express();
const { db } = require("../config/firebase");
const _ = require('underscore');



//Mostrar comandas comida
app.post('/comida/getkeys', async(req, res) => {

    let data = [];
    db.ref("/MenuFechaPersona").on("value", async function(snapshot) {
        if (!snapshot.val()) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        await snapshot.forEach((child) => {
            data.push({
                id: child.key
            });
        });
        console.log(data);
        res.json({
            ok: true,
            keys: data
        });

    });
});

app.post('/comida/getComandas', async(req, res) => {
    let info = req.body;
    let keys = Object.values(info.keys);
    let data = [];
    let cComida1 = 0;
    let cComida2 = 0;
    let cComida3 = 0;
    let busquedaDeFecha = [];

    console.log('Entro al getComandas');
    console.log('size del arreglo', keys.length);
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
    // console.log(busquedaDeFecha);
    const infoMenu = await db.ref("/MenuHistorial/" + info.fecha.fechaReporte + "/Comida").once("value");
    console.log(info.fecha.fechaReporte);
    console.log(busquedaDeFecha.length);
    for (let x = 0; x < busquedaDeFecha.length; x++) {
        console.log('Key por analizar: ', busquedaDeFecha[x].idUsuario);

        const infoComanda = await db.ref("/MenuFechaPersona/" + busquedaDeFecha[x].idUsuario + "/" + busquedaDeFecha[x].fecha + "/Comida/").once("value");
        if (!infoComanda.val()) {

        } else {
            const dataUsuario = await db.ref("/usuarios/" + busquedaDeFecha[x].idUsuario + "/").once("value");
            const dataAlimento = await db.ref("/MenuComida/" + infoComanda.val().id + "/").once("value");
            console.log('trajo info del usuario, ', keys[x].id);


            data.push(await {
                nombre: dataUsuario.val().nombre,
                fecha: info.fecha.fechaReporte,
                menu: dataAlimento.val().nombre,
                calorias: dataAlimento.val().calorias,
                id: keys[x].id,

            });

            if (infoComanda.val().id === infoMenu.val().comida1.id) cComida1++;

            if (infoComanda.val().id === infoMenu.val().comida2.id) cComida2++;

            if (infoComanda.val().id === infoMenu.val().comida3.id) cComida3++;
            console.log('data completa', data);
        }

    }
    const NomComida1 = await db.ref("/MenuComida/" + infoMenu.val().comida1.id + "/nombre").once("value");

    const NomComida2 = await db.ref("/MenuComida/" + infoMenu.val().comida2.id + "/nombre").once("value");
    const NomComida3 = await db.ref("/MenuComida/" + infoMenu.val().comida3.id + "/nombre").once("value");


    res.json({
        ok: true,
        comanda: data,
        cComida1,
        cComida2,
        cComida3,
        NomComida1: NomComida1.val(),
        NomComida2: NomComida2.val(),
        NomComida3: NomComida3.val(),

    });
});



//exportacion de app para poder usarla en cualquier parte del proyecto
module.exports = app;