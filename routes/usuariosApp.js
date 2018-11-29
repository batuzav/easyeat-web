//constantes para las funciones de express
const express = require('express')
const app = express();
const { db } = require("../config/firebase");
const _ = require('underscore');
let array = [];
app.post('/usuarios/getKeys', async(req, res) => {
    let now = new Date('2018-12-05');
    let now2 = new Date();
    let data = [];

    if (now.getTime() > now2.getTime()) {
        console.log('es mas garnde', now.toISOString().substring(0, 10));
    } else {
        console.log('es mas garnde', now2.toISOString().substring(0, 10));
    }


    await db.ref("/usuarios").once("value", async function(snapshot) {
        console.log('entro a usaurios');
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
            })
            //console.log('entro aqui');
        res.json({
            ok: true,
            data
        });


    });
});

app.post('/usuartios/getUsuarios', async(req, res) => {
    let keys = req.body.data;
    let usuarioActivo = [];
    console.log('ids de usuarios: ', keys.length);
    for (let x = 0; x < keys.length; x++) {
        const infoUsuario = await db.ref("/usuarios/" + keys[x].id + "/").once("value");
        if (infoUsuario) {
            const fechaCena = new Date(infoUsuario.val().ultimacena);
            const fechaDesayuno = new Date(infoUsuario.val().ultimodesayuno);
            const fechaComida = new Date(infoUsuario.val().ultimacomida);
            const fechaCompleto = new Date(infoUsuario.val().ultimocompleto);
            let now = new Date();
            const infoPlanAlimenticio = await db.ref("/planAlimenticio/" + keys[x].id + "/").once("value");
            if (fechaCena.getTime() >= now.getTime() || fechaDesayuno.getTime() >= now.getTime() || fechaComida.getTime() >= now.getTime() || fechaCompleto.getTime() >= now.getTime()) {
                const infoPlanAlimenticio = await db.ref("/planAlimenticio/" + keys[x].id + "/").once("value");
                db.ref("/HistorialPedidos/" + keys[x].id + "/").once("value", async function(snapshot) {
                    let pedido = [];
                    if (snapshot.val()) {
                        snapshot.forEach(async(child) => {
                            pedido.push({
                                total: child.val().monto,
                                plan: child.val().plan,
                                metodoPago: child.val().metPagoH,

                            });
                        });

                        console.log('ULTIMO PEDIDO: ', pedido[pedido.length - 1]);
                        usuarioActivo.push({
                            nombre: infoUsuario.val().nombre,
                            fechaNaci: infoUsuario.val().fechanaci.toISOString().substring(0, 10),
                            imc: infoPlanAlimenticio.val().imc,
                            peso: infoPlanAlimenticio.val().peso,
                            dietaCalorica: infoPlanAlimenticio.val().dietaCalorica,
                            genero: infoPlanAlimenticio.val().genero,
                            plan: pedido[pedido.length - 1].plan,
                            metodoPago: pedido[pedido.length - 1].metodoPago,
                            total: pedido[pedido.length - 1].total,

                        });
                    }

                });
            }


        }

    }



    res.json({
        ok: true
    })

});


module.exports = app;