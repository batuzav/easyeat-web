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

/* funciomes de COMIDA COMANDAS */
app.put('/comida/ComandaLista', async(req, res) => {
    const id = req.body.id;
    const fecha = req.body.fecha;
    const data = {
        status: true
    }
    await db.ref("/MenuFechaPersona/" + id + "/" + fecha + "/").child('Comida').update(data, async function(err) {
        console.log('entro aqui');
        if (err) {
            console.log('entro en error');
            return res.status(400).json({
                ok: false,
                err,
                Mensaje: "Error con la base de datos"
            });
        } else {

            res.json({
                ok: true,

            });
        }
    });
});



app.post('/comida/getComandas', async(req, res) => {
    let info = req.body;
    let keys = Object.values(info.keys);
    let data = [];
    let cComida1 = 0;
    let cComida2 = 0;
    let cComida3 = 0;
    let porcionComida1 = 0;
    let porcionComida2 = 0;
    let porcionComida3 = 0;
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
    const NomComida1 = await db.ref("/MenuComida/" + infoMenu.val().comida1.id + "/nombre").once("value");
    const NomComida2 = await db.ref("/MenuComida/" + infoMenu.val().comida2.id + "/nombre").once("value");
    const NomComida3 = await db.ref("/MenuComida/" + infoMenu.val().comida3.id + "/nombre").once("value");
    for (let x = 0; x < busquedaDeFecha.length; x++) {
        console.log('Key por analizar: ', busquedaDeFecha[x].idUsuario);

        const infoComanda = await db.ref("/MenuFechaPersona/" + busquedaDeFecha[x].idUsuario + "/" + busquedaDeFecha[x].fecha + "/Comida/").once("value");
        if (infoComanda.val()) {
            if (!infoComanda.val().completo) {


                const dataUsuario = await db.ref("/usuarios/" + busquedaDeFecha[x].idUsuario + "/").once("value");
                const dataAlimento = await db.ref("/MenuComida/" + infoComanda.val().id + "/").once("value");
                const dataPlanAlimento = await db.ref("/planAlimenticio/" + busquedaDeFecha[x].idUsuario + "/calComida").once("value");
                if (dataUsuario.val() && dataAlimento.val() && dataPlanAlimento.val()) {
                    data.push(await {
                        nombre: dataUsuario.val().nombre,
                        fecha: info.fecha.fechaReporte,
                        menu: dataAlimento.val().nombre,
                        calorias: dataAlimento.val().calorias,
                        porciones: dataPlanAlimento.val() / dataAlimento.val().calorias,
                        uMedida: dataAlimento.val().medidas,
                        id: busquedaDeFecha[x].idUsuario,
                        status: infoComanda.val().status

                    });
                }

                if (infoComanda.val().id === infoMenu.val().comida1.id) {
                    cComida1++;
                    porcionComida1 = porcionComida1 + (dataPlanAlimento.val() / dataAlimento.val().calorias);
                }
                if (infoComanda.val().id === infoMenu.val().comida2.id) {
                    cComida2++;
                    porcionComida2 = porcionComida2 + (dataPlanAlimento.val() / dataAlimento.val().calorias);
                }

                if (infoComanda.val().id === infoMenu.val().comida3.id) {
                    cComida3++;
                    porcionComida3 = porcionComida3 + (dataPlanAlimento.val() / dataAlimento.val().calorias);
                }
                console.log('data completa', data);
            }
        }

    }
    console.log("Total de porciones: ", porcionComida1);


    res.json({
        ok: true,
        comanda: data,
        cComida1,
        cComida2,
        cComida3,
        NomComida1: NomComida1.val(),
        NomComida2: NomComida2.val(),
        NomComida3: NomComida3.val(),
        porcionComida1,
        porcionComida2,
        porcionComida3,

    });
});
/* DESAYUNO FUNCIONES */
app.put('/desayuno/ComandaLista', async(req, res) => {
    const id = req.body.id;
    const fecha = req.body.fecha;
    const data = {
        status: true
    }
    await db.ref("/MenuFechaPersona/" + id + "/" + fecha + "/").child('Desayuno').update(data, async function(err) {
        console.log('entro aqui');
        if (err) {
            console.log('entro en error');
            return res.status(400).json({
                ok: false,
                err,
                Mensaje: "Error con la base de datos"
            });
        } else {

            res.json({
                ok: true,

            });
        }
    });
});

app.post('/desayuno/getComandas', async(req, res) => {
    let info = req.body;
    let keys = Object.values(info.keys);
    let data = [];
    let cComida1 = 0;
    let cComida2 = 0;
    let cComida3 = 0;
    let porcionComida1 = 0;
    let porcionComida2 = 0;
    let porcionComida3 = 0;
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
    const infoMenu = await db.ref("/MenuHistorial/" + info.fecha.fechaReporte + "/Desayuno").once("value");
    const NomComida1 = await db.ref("/MenuDesayuno/" + infoMenu.val().comida1.id + "/nombre").once("value");
    const NomComida2 = await db.ref("/MenuDesayuno/" + infoMenu.val().comida2.id + "/nombre").once("value");
    const NomComida3 = await db.ref("/MenuDesayuno/" + infoMenu.val().comida3.id + "/nombre").once("value");
    for (let x = 0; x < busquedaDeFecha.length; x++) {
        console.log('Key por analizar: ', busquedaDeFecha[x].idUsuario);

        const infoComanda = await db.ref("/MenuFechaPersona/" + busquedaDeFecha[x].idUsuario + "/" + busquedaDeFecha[x].fecha + "/Desayuno/").once("value");
        if (infoComanda.val()) {
            if (!infoComanda.val().completo) {
                const dataUsuario = await db.ref("/usuarios/" + busquedaDeFecha[x].idUsuario + "/").once("value");
                const dataAlimento = await db.ref("/MenuDesayuno/" + infoComanda.val().id + "/").once("value");
                const dataPlanAlimento = await db.ref("/planAlimenticio/" + busquedaDeFecha[x].idUsuario + "/calDesayuno").once("value");
                if (dataUsuario.val() && dataAlimento.val() && dataPlanAlimento.val()) {
                    data.push(await {
                        nombre: dataUsuario.val().nombre,
                        fecha: info.fecha.fechaReporte,
                        menu: dataAlimento.val().nombre,
                        calorias: dataAlimento.val().calorias,
                        porciones: dataPlanAlimento.val() / dataAlimento.val().calorias,
                        uMedida: dataAlimento.val().medidas,
                        id: busquedaDeFecha[x].idUsuario,
                        status: infoComanda.val().status

                    });
                }

                if (infoComanda.val().id === infoMenu.val().comida1.id) {
                    cComida1++;
                    porcionComida1 = porcionComida1 + (dataPlanAlimento.val() / dataAlimento.val().calorias);
                }
                if (infoComanda.val().id === infoMenu.val().comida2.id) {
                    cComida2++;
                    porcionComida2 = porcionComida2 + (dataPlanAlimento.val() / dataAlimento.val().calorias);
                }

                if (infoComanda.val().id === infoMenu.val().comida3.id) {
                    cComida3++;
                    porcionComida3 = porcionComida3 + (dataPlanAlimento.val() / dataAlimento.val().calorias);
                }
                console.log('data completa', data);

            }
        }

    }
    console.log("Total de porciones: ", porcionComida1);


    res.json({
        ok: true,
        comanda: data,
        cComida1,
        cComida2,
        cComida3,
        NomComida1: NomComida1.val(),
        NomComida2: NomComida2.val(),
        NomComida3: NomComida3.val(),
        porcionComida1,
        porcionComida2,
        porcionComida3,

    });
});

/* Cena Comandas */

app.put('/cena/ComandaLista', async(req, res) => {
    const id = req.body.id;
    const fecha = req.body.fecha;
    const data = {
        status: true
    }
    await db.ref("/MenuFechaPersona/" + id + "/" + fecha + "/").child('Cena').update(data, async function(err) {
        console.log('entro aqui');
        if (err) {
            console.log('entro en error');
            return res.status(400).json({
                ok: false,
                err,
                Mensaje: "Error con la base de datos"
            });
        } else {

            res.json({
                ok: true,

            });
        }
    });
});

app.post('/cena/getComandas', async(req, res) => {
    let info = req.body;
    let keys = Object.values(info.keys);
    let data = [];
    let cComida1 = 0;
    let cComida2 = 0;
    let cComida3 = 0;
    let porcionComida1 = 0;
    let porcionComida2 = 0;
    let porcionComida3 = 0;
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
    const infoMenu = await db.ref("/MenuHistorial/" + info.fecha.fechaReporte + "/Cena").once("value");
    const NomComida1 = await db.ref("/MenuCena/" + infoMenu.val().comida1.id + "/nombre").once("value");
    const NomComida2 = await db.ref("/MenuCena/" + infoMenu.val().comida2.id + "/nombre").once("value");
    const NomComida3 = await db.ref("/MenuCena/" + infoMenu.val().comida3.id + "/nombre").once("value");
    for (let x = 0; x < busquedaDeFecha.length; x++) {
        console.log('Key por analizar: ', busquedaDeFecha[x].idUsuario);

        const infoComanda = await db.ref("/MenuFechaPersona/" + busquedaDeFecha[x].idUsuario + "/" + busquedaDeFecha[x].fecha + "/Cena/").once("value");
        if (infoComanda.val()) {
            if (!infoComanda.val().completo) {
                const dataUsuario = await db.ref("/usuarios/" + busquedaDeFecha[x].idUsuario + "/").once("value");
                const dataAlimento = await db.ref("/MenuCena/" + infoComanda.val().id + "/").once("value");
                const dataPlanAlimento = await db.ref("/planAlimenticio/" + busquedaDeFecha[x].idUsuario + "/calCena").once("value");
                if (dataUsuario.val() && dataAlimento.val() && dataPlanAlimento.val()) {
                    data.push(await {
                        nombre: dataUsuario.val().nombre,
                        fecha: info.fecha.fechaReporte,
                        menu: dataAlimento.val().nombre,
                        calorias: dataAlimento.val().calorias,
                        porciones: dataPlanAlimento.val() / dataAlimento.val().calorias,
                        uMedida: dataAlimento.val().medidas,
                        id: busquedaDeFecha[x].idUsuario,
                        status: infoComanda.val().status

                    });
                }

                if (infoComanda.val().id === infoMenu.val().comida1.id) {
                    cComida1++;
                    porcionComida1 = porcionComida1 + (dataPlanAlimento.val() / dataAlimento.val().calorias);
                }
                if (infoComanda.val().id === infoMenu.val().comida2.id) {
                    cComida2++;
                    porcionComida2 = porcionComida2 + (dataPlanAlimento.val() / dataAlimento.val().calorias);
                }

                if (infoComanda.val().id === infoMenu.val().comida3.id) {
                    cComida3++;
                    porcionComida3 = porcionComida3 + (dataPlanAlimento.val() / dataAlimento.val().calorias);
                }
                console.log('data completa', data);
            }
        }

    }
    console.log("Total de porciones: ", porcionComida1);


    res.json({
        ok: true,
        comanda: data,
        cComida1,
        cComida2,
        cComida3,
        NomComida1: NomComida1.val(),
        NomComida2: NomComida2.val(),
        NomComida3: NomComida3.val(),
        porcionComida1,
        porcionComida2,
        porcionComida3,

    });
});





//exportacion de app para poder usarla en cualquier parte del proyecto
module.exports = app;