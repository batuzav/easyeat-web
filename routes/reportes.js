//constantes para las funciones de express
const express = require('express')
const app = express();
const { db } = require("../config/firebase");
const _ = require('underscore');


app.post('/reportes/getkey', async(req, res) => {
    let reporte = req.body;
    console.log('fecha de reporte: ', reporte);
    db.ref("/reportes/" + reporte.fecha + "/" + reporte.rama + "/" + reporte.plan + "/").on("value", async function(snapshot) {
        if (!snapshot.val()) {
            return res.status(400).json({
                ok: false,
            });
        }
        console.log('Entro aqui: ');
        snapshot.forEach((child) => {
            console.log('Entro aqui 2: ');
            if (child.val().comentarios === reporte.comentarios && child.val().nombre === reporte.nombre && child.val().telefono === reporte.telefono) {
                console.log("Encontro un reporte igual");
                let data = {
                    status: true,
                }
                console.log(child.val().comentarios);
                db.ref("/reportes/" + reporte.fecha + "/" + reporte.rama + "/" + reporte.plan + "/").child(child.key).update(data, async function(err) {
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
            }
        });
    });
});




/*-------OPTIMIZAR-----NO CHETO---- */
app.post('/getreportes', async(req, res) => {
    let fecha = req.body;
    //Variable con la info completa
    let data = [];
    //Variable para la info de llegada tarde
    //let dataTarde = [];
    let dataTardeComida = [];
    let dataTardeDesayuno = [];
    let dataTardeCena = [];
    let cTarde = 0;
    //Variable para la info de mal estado
    let dataMalEstadoComida = [];
    let dataMalEstadoDesayuno = [];
    let dataMalEstadoCena = [];
    let cEstado = 0;
    //Variable para la info de comida no llego nunca
    let dataNollegoComida = [];
    let dataNollegoDesayuno = [];
    let dataNollegoCena = [];
    let cNoLlego = 0;

    //Consulta para obtener los reportes de comida llego tarde en comidas  
    const dataTarde = await db.ref("/reportes/" + fecha.fechaReporte + "/ComidaLlegoTarde/Comida").once("value");
    if (!dataTarde) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
    if (dataTarde.val()) dataTardeComida = await Object.values(dataTarde.val());
    else dataTardeComida = false;
    console.log(dataTardeComida[1]);
    for (let x = 0; x < dataTardeComida.length; x++) {
        dataTardeComida[x] = Object.assign({}, dataTardeComida[x], {
            plan: 'Comida',
            // status: false,
            fecha: fecha.fechaReporte,
            rama: "ComidaLlegoTarde",
        });

        cTarde++;
    }
    //Consulta para obtener los reportes de comida llego tarde en Desayunos
    const dataTardeD = await db.ref("/reportes/" + fecha.fechaReporte + "/ComidaLlegoTarde/Desayuno").once("value");
    if (!dataTardeD) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
    if (dataTardeD.val()) dataTardeDesayuno = await Object.values(dataTardeD.val());
    else dataTardeDesayuno = false;
    console.log(dataTardeDesayuno[1]);
    for (let x = 0; x < dataTardeDesayuno.length; x++) {
        dataTardeDesayuno[x] = Object.assign({}, dataTardeDesayuno[x], {
            plan: 'Desayuno',
            // status: false,
            fecha: fecha.fechaReporte,
            rama: "ComidaLlegoTarde",
        });
        cTarde++;
    }
    //Consulta para obtener los reportes de comida llego tarde en Cena  
    const dataTardeC = await db.ref("/reportes/" + fecha.fechaReporte + "/ComidaLlegoTarde/Cena").once("value");
    if (!dataTardeC) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
    if (dataTardeC.val()) dataTardeCena = await Object.values(dataTardeC.val());
    else dataTardeCena = false;
    console.log(dataTardeCena[1]);
    for (let x = 0; x < dataTardeCena.length; x++) {
        dataTardeCena[x] = Object.assign({}, dataTardeCena[x], {
            plan: 'Cena',
            //status: false,
            fecha: fecha.fechaReporte,
            rama: "ComidaLlegoTarde",
        });
        cTarde++;
    }

    /* ComidaMalEstado*/
    //Consulta para obtener los reportes de comida mal estado en comidas  
    const dataEstado = await db.ref("/reportes/" + fecha.fechaReporte + "/ComidaMalEstado/Comida").once("value");
    if (!dataEstado) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
    if (dataEstado.val()) dataMalEstadoComida = await Object.values(dataEstado.val());
    else dataMalEstadoComida = false;
    console.log(dataMalEstadoComida[1]);
    for (let x = 0; x < dataMalEstadoComida.length; x++) {
        dataMalEstadoComida[x] = Object.assign({}, dataMalEstadoComida[x], {
            plan: 'Comida',
            //status: false,
            fecha: fecha.fechaReporte,
            rama: "ComidaMalEstado",
        });
        cEstado++;
    }
    //Consulta para obtener los reportes de comida mal etado en Desayunos
    const dataEstadoD = await db.ref("/reportes/" + fecha.fechaReporte + "/ComidaMalEstado/Desayuno").once("value");
    if (!dataEstadoD) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
    if (dataEstadoD.val()) dataMalEstadoDesayuno = await Object.values(dataEstadoD.val());
    else dataMalEstadoDesayuno = false;
    console.log(dataMalEstadoDesayuno[1]);
    for (let x = 0; x < dataMalEstadoDesayuno.length; x++) {
        dataMalEstadoDesayuno[x] = Object.assign({}, dataMalEstadoDesayuno[x], {
            plan: 'Desayuno',
            // status: false,
            fecha: fecha.fechaReporte,
            rama: "ComidaMalEstado",
        });
        cEstado++;
    }
    //Consulta para obtener los reportes de comida mal estado en Cena  
    const dataEstadoC = await db.ref("/reportes/" + fecha.fechaReporte + "/ComidaMalEstado/Cena").once("value");
    if (!dataEstadoC) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
    if (dataEstadoC.val()) dataMalEstadoCena = await Object.values(dataEstadoC.val());
    else dataMalEstadoCena = false;
    console.log(dataMalEstadoCena[1]);
    for (let x = 0; x < dataMalEstadoCena.length; x++) {
        dataMalEstadoCena[x] = Object.assign({}, dataMalEstadoCena[x], {
            plan: 'Cena',
            // status: false,
            fecha: fecha.fechaReporte,
            rama: "ComidaMalEstado",
        });
        cEstado++;
    }

    /* ComidaNoLlego*/
    //Consulta para obtener los reportes de comida mal estado en comidas  
    const datallego = await db.ref("/reportes/" + fecha.fechaReporte + "/ComidaNoLlego/Comida").once("value");
    if (!datallego) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
    if (datallego.val()) dataNollegoComida = await Object.values(datallego.val());
    else dataNollegoComida = false;
    console.log(dataNollegoComida[1]);
    for (let x = 0; x < dataNollegoComida.length; x++) {
        dataNollegoComida[x] = Object.assign({}, dataNollegoComida[x], {
            plan: 'Comida',
            // status: false,
            fecha: fecha.fechaReporte,
            rama: "ComidaNoLlego",
        });
        cNoLlego++;
    }
    //Consulta para obtener los reportes de comida mal etado en Desayunos
    const datallegoD = await db.ref("/reportes/" + fecha.fechaReporte + "/ComidaNoLlego/Desayuno").once("value");
    if (!datallegoD) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
    if (datallegoD.val()) dataNollegoDesayuno = await Object.values(datallegoD.val());
    else dataNollegoDesayuno = false;
    console.log(dataNollegoDesayuno[1]);
    for (let x = 0; x < dataNollegoDesayuno.length; x++) {
        dataNollegoDesayuno[x] = Object.assign({}, dataNollegoDesayuno[x], {
            plan: 'Desayuno',
            //  status: false,
            fecha: fecha.fechaReporte,
            rama: "ComidaNoLlego",
        });
        cNoLlego++;
    }
    //Consulta para obtener los reportes de comida mal estado en Cena  
    const datallegoC = await db.ref("/reportes/" + fecha.fechaReporte + "/ComidaNoLlego/Cena").once("value");
    if (!datallegoC) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
    if (datallegoC.val()) dataNollegoCena = await Object.values(datallegoC.val());
    else dataNollegoCena = false;
    console.log(dataNollegoCena[1]);
    for (let x = 0; x < dataNollegoCena.length; x++) {
        dataNollegoCena[x] = Object.assign({}, dataNollegoCena[x], {
            plan: 'Cena',
            //   status: false,
            fecha: fecha.fechaReporte,
            rama: "ComidaNoLlego",
        });
        cNoLlego++;
    }


    res.json({
        dataTardeComida,
        dataTardeDesayuno,
        dataTardeCena,
        dataMalEstadoComida,
        dataMalEstadoDesayuno,
        dataMalEstadoCena,
        dataNollegoComida,
        dataNollegoDesayuno,
        dataNollegoCena,
        cTarde,
        cEstado,
        cNoLlego,
    });


});


//exportacion de app para poder usarla en cualquier parte del proyecto
module.exports = app;