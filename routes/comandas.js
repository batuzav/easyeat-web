//constantes para las funciones de express
const express = require('express')
const app = express();
const { db } = require("../config/firebase");
const _ = require('underscore');

/*---- Funcion prueba --*/
let getcomanda = (async(key, fecha) => {
    const menu = await db.ref("/MenuFechaPersona/" + key + "/" + fecha.fechaReporte + "/Comida/").once("value");
    const dataUsuario = await db.ref("/usuarios/" + key + "/").once("value");
    const dataAlimento = await db.ref("/MenuComida/" + menu.id + "/").once("value");

    console.log(menu.val());
    console.log(dataUsuario.val());
    console.log(dataAlimento.val());
});

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

    console.log('Entro al getComandas');
    //console.log('size del arreglo', info.keys.lenght);
    const infoMenu = await db.ref("/MenuHistorial/" + info.fecha.fechaReporte + "/Comida/").once("value");
    console.log(infoMenu.val());
    for (let x = 0; x < keys.length; x++) {
        const infoComanda = await db.ref("/MenuFechaPersona/" + keys[x].id + "/" + info.fecha.fechaReporte + "/Comida/").once("value");
        if (!infoComanda.val()) {
            return res.status(400).json({
                ok: false,

            });
        }
        const dataUsuario = await db.ref("/usuarios/" + keys[x].id + "/").once("value");
        const dataAlimento = await db.ref("/MenuComida/" + infoComanda.val().id + "/").once("value");
        console.log('ciclo');

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


    }
    console.log(cComida1);
    console.log(cComida2);
    console.log(cComida3);
    console.log('data completa', data);
    const NomComida1 = await db.ref("/MenuComida/" + infoMenu.val().comida1.id + "/nombre").once("value");
    const NomComida2 = await db.ref("/MenuComida/" + infoMenu.val().comida2.id + "/nombre").once("value");
    const NomComida3 = await db.ref("/MenuComida/" + infoMenu.val().comida3.id + "/nombre").once("value");
    console.log(NomComida1.val());
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