//constantes para las funciones de express
const express = require('express')
const app = express();
const { db } = require("../config/firebase");
const _ = require('underscore');
var moment = require('moment');
moment().format();

app.post('/entregas/getkeys', async(req, res) => {

    let data = [];
    db.ref("/FechaEntrega").on("value", async function(snapshot) {
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

app.put('/entregas/entregaLista', async(req, res) => {
    const id = req.body.idUsuario;
    const fecha = req.body.fecha;
    const tipo = req.body.tipoComida;
    const data = {
        entrega: true
    }
    console.log('entrega lista tippo de comida: ', tipo);
    console.log('entrega lista fech de comida: ', fecha);
    console.log('entrega lista id de comida: ', id);

    await db.ref("/MenuFechaPersona/" + id + "/" + fecha + "/").child(tipo).update(data, async function(err) {
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

app.post('/entregas/getComandas', async(req, res) => {
    let info = req.body;
    let keys = Object.values(info.keys);
    let data = [];
    let busquedaDeFecha = [];
    console.log('Entro a traer entregas');
    for (let x = 0; x < keys.length; x++) {
        console.log(x);
        await db.ref("/FechaEntrega/" + keys[x].id + "/").on("value", async function(snapshot) {
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

            console.log("este es el objeto pot buscar: ", busquedaDeFecha);
        });
    }

    for (let x = 0; x < busquedaDeFecha.length; x++) {
        let cont = 0;
        console.log('Key por analizar: ', busquedaDeFecha[x].idUsuario);
        console.log('Fecha por analizar: ', busquedaDeFecha[x].fecha);
        const fechaComanda = await db.ref("/FechaEntrega/" + busquedaDeFecha[x].idUsuario + "/" + busquedaDeFecha[x].fecha + "/id_menuFechaPersona").once("value");
        if (fechaComanda.val()) {
            console.log('Fecha de entrega verdadera o preparacion: ', fechaComanda.val());
            const infoComanda = await db.ref("/MenuFechaPersona/" + busquedaDeFecha[x].idUsuario + "/" + fechaComanda.val() + "/").once("value");
            if (infoComanda.val()) {
                if (infoComanda.val().Desayuno && infoComanda.val().Comida && infoComanda.val().Cena && infoComanda.val().Desayuno.completo === true) {
                    console.log('hay un completo');


                } else {
                    if (infoComanda.val().Desayuno) {
                        console.log('Info de la comanda de dayuno: ', infoComanda.val().Desayuno);
                        const infoComida = await db.ref("/MenuDesayuno/" + infoComanda.val().Desayuno.id + "/").once("value");
                        console.log('info del desayuno: ', infoComida.val());
                        const infoUsuario = await db.ref("/usuarios/" + busquedaDeFecha[x].idUsuario + "/").once("value");
                        console.log('Nombre del usuario: ', infoUsuario.val().nombre);
                        const infoDireccion = await db.ref("/direccion/" + busquedaDeFecha[x].idUsuario + "/" + infoComanda.val().Desayuno.direccion + "/").once("value");
                        console.log('Direccion: ', infoDireccion.val());

                        data.push({
                            nombre: infoUsuario.val().nombre,
                            fecha: busquedaDeFecha[x].fecha,
                            hora: infoComanda.val().Desayuno.hora,
                            direccion: "Calle: " + infoDireccion.val().calle + "  Colonia: " + infoDireccion.val().colonia + "  CP: " + infoDireccion.val().cp,
                            comentarios: infoDireccion.val().comentarios,
                            comida: infoComida.val().nombre,
                            idUsuario: busquedaDeFecha[x].idUsuario,
                            entrega: infoComanda.val().Desayuno.entrega,
                            tipoComida: "Desayuno"
                        });

                    }
                    if (infoComanda.val().Comida) {
                        console.log('Info de la comanda de comida: ', infoComanda.val().Comida);
                        const infoComida = await db.ref("/MenuComida/" + infoComanda.val().Comida.id + "/").once("value");
                        console.log('info del comida: ', infoComida.val());
                        const infoUsuario = await db.ref("/usuarios/" + busquedaDeFecha[x].idUsuario + "/").once("value");
                        console.log('Nombre del usuario: ', infoUsuario.val().nombre);
                        const infoDireccion = await db.ref("/direccion/" + busquedaDeFecha[x].idUsuario + "/" + infoComanda.val().Comida.direccion + "/").once("value");
                        console.log('Direccion: ', infoDireccion.val());

                        data.push({
                            nombre: infoUsuario.val().nombre,
                            fecha: busquedaDeFecha[x].fecha,
                            hora: infoComanda.val().Comida.hora,
                            direccion: "Calle: " + infoDireccion.val().calle + "  Colonia: " + infoDireccion.val().colonia + "  CP: " + infoDireccion.val().cp,
                            comentarios: infoDireccion.val().comentarios,
                            comida: infoComida.val().nombre,
                            idUsuario: busquedaDeFecha[x].idUsuario,
                            entrega: infoComanda.val().Comida.entrega,
                            tipoComida: "Comida",
                        });

                    }
                    if (infoComanda.val().Cena) {
                        console.log('Info de la comanda de cena: ', infoComanda.val().Cena);
                        const infoComida = await db.ref("/MenuCena/" + infoComanda.val().Cena.id + "/").once("value");
                        console.log('info del cena: ', infoComida.val());
                        const infoUsuario = await db.ref("/usuarios/" + busquedaDeFecha[x].idUsuario + "/").once("value");
                        console.log('Nombre del usuario: ', infoUsuario.val().nombre);
                        const infoDireccion = await db.ref("/direccion/" + busquedaDeFecha[x].idUsuario + "/" + infoComanda.val().Cena.direccion + "/").once("value");
                        console.log('Direccion: ', infoDireccion.val());

                        data.push({
                            nombre: infoUsuario.val().nombre,
                            fecha: busquedaDeFecha[x].fecha,
                            hora: infoComanda.val().Cena.hora,
                            direccion: "Calle: " + infoDireccion.val().calle + "  Colonia: " + infoDireccion.val().colonia + "  CP: " + infoDireccion.val().cp,
                            comentarios: infoDireccion.val().comentarios,
                            comida: infoComida.val().nombre,
                            idUsuario: busquedaDeFecha[x].idUsuario,
                            entrega: infoComanda.val().Cena.entrega,
                            tipoComida: "Cena"
                        });

                    }
                }


            }

        } else console.log('no hay');

    }

    console.log('DATA COMPLETA: ', data);

    res.json({
        ok: true,
        data

    });
});

//exportacion de app para poder usarla en cualquier parte del proyecto
module.exports = app;