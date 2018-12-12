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
    if (!infoMenu.val()) {
        return res.status(400).json({
            ok: false,
            mensaje: "No existe comidas asignadas a este día :("
        });
    }
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
    console.log(infoMenu.val())
    if (!infoMenu.val()) {
        return res.status(400).json({
            ok: false,
            mensaje: "No existe comidas asignadas a este día :("
        });
    }
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
    if (!infoMenu.val()) {
        return res.status(400).json({
            ok: false,
            mensaje: "No existe comidas asignadas a este día :("
        });
    }
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

app.post('/completas/getComandas', async(req, res) => {
    let info = req.body;
    let keys = Object.values(info.keys);
    let data = [];
    let cComida1 = 0;
    let cComida2 = 0;
    let cComida3 = 0;
    let porcionComida1 = 0;
    let porcionComida2 = 0;
    let porcionComida3 = 0;
    let cDesayuno1 = 0;
    let cDesayuno2 = 0;
    let cDesayuno3 = 0;
    let porcionDesayuno1 = 0;
    let porcionDesayuno2 = 0;
    let porcionDesayuno3 = 0;
    let cCena1 = 0;
    let cCena2 = 0;
    let cCena3 = 0;
    let porcionCena1 = 0;
    let porcionCena2 = 0;
    let porcionCena3 = 0;
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

    const infoMenuCe = await db.ref("/MenuHistorial/" + info.fecha.fechaReporte + "/Cena").once("value");
    if (!infoMenuCe.val()) {
        return res.status(400).json({
            ok: false,
            mensaje: "No existe comidas asignadas a este día :("
        });
    }
    const NomCena1 = await db.ref("/MenuCena/" + infoMenuCe.val().comida1.id + "/nombre").once("value");
    const NomCena2 = await db.ref("/MenuCena/" + infoMenuCe.val().comida2.id + "/nombre").once("value");
    const NomCena3 = await db.ref("/MenuCena/" + infoMenuCe.val().comida3.id + "/nombre").once("value");
    const infoMenuDe = await db.ref("/MenuHistorial/" + info.fecha.fechaReporte + "/Desayuno").once("value");
    if (!infoMenuDe.val()) {
        return res.status(400).json({
            ok: false,
            mensaje: "No existe comidas asignadas a este día :("
        });
    }
    const NomDesayuno1 = await db.ref("/MenuDesayuno/" + infoMenuDe.val().comida1.id + "/nombre").once("value");
    const NomDesayuno2 = await db.ref("/MenuDesayuno/" + infoMenuDe.val().comida2.id + "/nombre").once("value");
    const NomDesayuno3 = await db.ref("/MenuDesayuno/" + infoMenuDe.val().comida3.id + "/nombre").once("value");
    const infoMenuCo = await db.ref("/MenuHistorial/" + info.fecha.fechaReporte + "/Comida").once("value");
    if (!infoMenuCo.val()) {
        return res.status(400).json({
            ok: false,
            mensaje: "No existe comidas asignadas a este día :("
        });
    }
    const NomComida1 = await db.ref("/MenuComida/" + infoMenuCo.val().comida1.id + "/nombre").once("value");
    const NomComida2 = await db.ref("/MenuComida/" + infoMenuCo.val().comida2.id + "/nombre").once("value");
    const NomComida3 = await db.ref("/MenuComida/" + infoMenuCo.val().comida3.id + "/nombre").once("value");
    const infoMenuCol = await db.ref("/MenuHistorial/" + info.fecha.fechaReporte + "/Colacion").once("value");
    if (!infoMenuCol.val()) {
        return res.status(400).json({
            ok: false,
            mensaje: "No existe comidas asignadas a este día :("
        });
    }
    const NomColacion1 = await db.ref("/MenuColacion/" + infoMenuCol.val().comida1.id + "/nombre").once("value");
    const NomColacion2 = await db.ref("/MenuColacion/" + infoMenuCol.val().comida2.id + "/nombre").once("value");



    for (let x = 0; x < busquedaDeFecha.length; x++) {
        console.log('Key por analizar: ', busquedaDeFecha[x].idUsuario);

        const infoComanda = await db.ref("/MenuFechaPersona/" + busquedaDeFecha[x].idUsuario + "/" + busquedaDeFecha[x].fecha + "/").once("value");
        if (infoComanda.val().Desayuno && infoComanda.val().Comida && infoComanda.val().Cena) {
            if (infoComanda.val().Desayuno.completo && infoComanda.val().Comida.completo && infoComanda.val().Cena.completo) {
                const dataUsuario = await db.ref("/usuarios/" + busquedaDeFecha[x].idUsuario + "/").once("value");
                const dataAlimento3 = await db.ref("/MenuCena/" + infoComanda.val().Cena.id + "/").once("value");
                const dataAlimento2 = await db.ref("/MenuComida/" + infoComanda.val().Comida.id + "/").once("value");
                const dataAlimento1 = await db.ref("/MenuDesayuno/" + infoComanda.val().Desayuno.id + "/").once("value");

                const dataPlanAlimento3 = await db.ref("/planAlimenticio/" + busquedaDeFecha[x].idUsuario + "/calCena").once("value");
                const dataPlanAlimento2 = await db.ref("/planAlimenticio/" + busquedaDeFecha[x].idUsuario + "/calComida").once("value");
                const dataPlanAlimento1 = await db.ref("/planAlimenticio/" + busquedaDeFecha[x].idUsuario + "/calDesayuno").once("value");

                if (dataUsuario.val() && dataAlimento1.val() && dataPlanAlimento1.val() && dataAlimento2.val() && dataPlanAlimento2.val() && dataAlimento3.val() && dataPlanAlimento3.val()) {
                    data.push({
                        nombre: dataUsuario.val().nombre,
                        fecha: info.fecha.fechaReporte,
                        menu: "Des: " + dataAlimento1.val().nombre + ", Com: " + dataAlimento2.val().nombre + ", Cen: " + dataAlimento2.val().nombre + ", Col: " + NomColacion1.val() + " & " + NomColacion2.val(),
                        calorias: "Des: " + dataAlimento1.val().calorias + ", Com: " + dataAlimento2.val().calorias + ", Cen: " + dataAlimento3.val().calorias,
                        porciones: "Des: " + (dataPlanAlimento1.val() / dataAlimento1.val().calorias).toFixed(2) + ", Com: " + (dataPlanAlimento2.val() / dataAlimento2.val().calorias).toFixed(2) + ", Cen: " + (dataPlanAlimento3.val() / dataAlimento3.val().calorias).toFixed(2),
                        uMedida: "Des: " + dataAlimento1.val().medidas + ", Com: " + dataAlimento2.val().medidas + ", Cen: " + dataAlimento3.val().medidas,
                        id: busquedaDeFecha[x].idUsuario,
                        status: infoComanda.val().Desayuno.status

                    });

                }

                if (infoComanda.val().Comida.id === infoMenuCo.val().comida1.id && infoComanda.val().Desayuno.completo) {
                    cComida1++;
                    porcionComida1 = porcionComida1 + (dataPlanAlimento2.val() / dataAlimento2.val().calorias);
                }
                if (infoComanda.val().Comida.id === infoMenuCo.val().comida2.id && infoComanda.val().Desayuno.completo) {
                    cComida2++;
                    porcionComida2 = porcionComida2 + (dataPlanAlimento2.val() / dataAlimento2.val().calorias);
                }

                if (infoComanda.val().Comida.id === infoMenuCo.val().comida3.id && infoComanda.val().Desayuno.completo) {
                    cComida3++;
                    porcionComida3 = porcionComida3 + (dataPlanAlimento2.val() / dataAlimento2.val().calorias);
                }

                if (infoComanda.val().Desayuno.id === infoMenuDe.val().comida1.id && infoComanda.val().Desayuno.completo) {
                    cDesayuno1++;
                    porcionDesayuno1 = porcionDesayuno1 + (dataPlanAlimento1.val() / dataAlimento1.val().calorias);
                }
                if (infoComanda.val().Desayuno.id === infoMenuDe.val().comida2.id && infoComanda.val().Desayuno.completo) {
                    cDesayuno2++;
                    porcionDesayuno2 = porcionDesayuno2 + (dataPlanAlimento1.val() / dataAlimento1.val().calorias);
                }

                if (infoComanda.val().Desayuno.id === infoMenuDe.val().comida3.id && infoComanda.val().Desayuno.completo) {
                    cDesayuno3++;
                    porcionDesayuno3 = porcionDesayuno3 + (dataPlanAlimento1.val() / dataAlimento1.val().calorias);
                }

                if (infoComanda.val().Cena.id === infoMenuCe.val().comida1.id && infoComanda.val().Desayuno.completo) {
                    cCena1++;
                    porcionCena1 = porcionCena1 + (dataPlanAlimento3.val() / dataAlimento3.val().calorias);
                }
                if (infoComanda.val().Cena.id === infoMenuCe.val().comida2.id && infoComanda.val().Desayuno.completo) {
                    cCena2++;
                    porcionCena2 = porcionCena2 + (dataPlanAlimento3.val() / dataAlimento3.val().calorias);
                }

                if (infoComanda.val().Cena.id === infoMenuCe.val().comida3.id && infoComanda.val().Desayuno.completo) {
                    cCena3++;
                    porcionCena3 = porcionCena3 + (dataPlanAlimento3.val() / dataAlimento3.val().calorias);
                }
            }

        }
    }
    console.log('data completa: ', data);
    res.json({
        ok: true,
        cComida1,
        cComida2,
        cComida3,
        porcionComida1,
        porcionComida2,
        porcionComida3,
        cDesayuno1,
        cDesayuno2,
        cDesayuno3,
        porcionDesayuno1,
        porcionDesayuno2,
        porcionDesayuno3,
        cCena1,
        cCena2,
        cCena3,
        porcionCena1,
        porcionCena2,
        porcionCena3,
        NomComida1: NomComida1.val(),
        NomComida2: NomComida2.val(),
        NomComida3: NomComida3.val(),
        NomCena1: NomCena1.val(),
        NomCena2: NomCena2.val(),
        NomCena3: NomCena3.val(),
        NomDesayuno1: NomDesayuno1.val(),
        NomDesayuno2: NomDesayuno2.val(),
        NomDesayuno3: NomDesayuno3.val(),
        comanda: data,


    })


});





//exportacion de app para poder usarla en cualquier parte del proyecto
module.exports = app;