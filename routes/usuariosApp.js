//constantes para las funciones de express
const express = require('express');
const app = express();
const { db } = require("../config/firebase");
const _ = require('underscore');
const moment = require('moment');
moment.locale('es');


app.post('/usuarios/getKeys', async(req, res) => {
    let now = new Date('2018-12-05');
    let now2 = new Date();
    let data = [];
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

app.post('/oxxopay/getKeys', async(req, res) => {
    let data = [];
    await db.ref("/OxxoPay").once("value", async function(snapshot) {
        // console.log('entro a usaurios getKey');
        if (!snapshot.val()) {
            return res.status(400).json({
                ok: false,

            });
        }
        await snapshot.forEach((child) => {
                // console.log(child.key)
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

app.post('/oxxopay/getUsuarios', async(req, res) => {
    let keys = req.body.data;
    let usuarioActivo = [];
    let usuarioInactivo = [];
    let pedido = [];
    // console.log('ids de usuarios: ', keys.length);
    for (let x = 0; x < keys.length; x++) {
        // console.log('En get usuario de oxxopay: ', keys[x].id);
        const infoUsuario = await db.ref("/usuarios/" + keys[x].id + "/").once("value");
        if (infoUsuario.val()) {
            const infoPlanAlimenticio = await db.ref("/planAlimenticio/" + keys[x].id + "/").once("value");
            if (infoPlanAlimenticio.val()) {
                await db.ref("/OxxoPay/" + keys[x].id + "/").once("value", async function(snapshot) {
                    if (snapshot.val()) {
                        await snapshot.forEach((child) => {
                            // console.log('id del child', child.key);
                            pedido.push({
                                nombre: infoUsuario.val().nombre,
                                fechaNaci: new Date(infoUsuario.val().fechanaci).toISOString().substring(0, 10),
                                id: keys[x].id,
                                total: child.val().objNewCar.total,
                                factura: child.val().objNewCar.infocliente.factura,
                                metodoPago: child.val().objNewCar.infocliente.metodoPago,
                                imc: infoPlanAlimenticio.val().imc,
                                dietaCalorica: infoPlanAlimenticio.val().dietaCalorica,
                                genero: infoPlanAlimenticio.val().genero,
                                plan: 'Plan Alimenticio',
                                id_fichaOxxoPay: child.key
                            })
                        });
                    } else {
                        return res.status(400).json({
                            ok: false,
                            Mensaje: "Error con la base de datos"
                        });
                    }
                })
            } else {
                console.log('No hay plan alimenticio');
            }
        } else {
            console.log('No hay info de usuario');
        }
    }


    // console.log('Pedico completo: ', pedido)
    res.json({
        ok: true,
        pedido,

    })

});


app.post('/usuartios/getUsuarios', async(req, res) => {
    let keys = req.body.data;
    let usuarioActivo = [];
    let usuarioInactivo = [];
    // console.log('ids de usuarios: ', keys.length);
    for (let x = 0; x < keys.length; x++) {
        const infoUsuario = await db.ref("/usuarios/" + keys[x].id + "/").once("value");
        if (infoUsuario.val()) {
            const fechaCena = new Date(infoUsuario.val().ultimacena);
            const fechaDesayuno = new Date(infoUsuario.val().ultimodesayuno);
            const fechaComida = new Date(infoUsuario.val().ultimacomida);
            const fechaCompleto = new Date(infoUsuario.val().ultimocompleto);
            let now = new Date();
            if (fechaCena.getTime() >= now.getTime() || fechaDesayuno.getTime() >= now.getTime() || fechaComida.getTime() >= now.getTime() || fechaCompleto.getTime() >= now.getTime()) {
                const infoPlanAlimenticio = await db.ref("/planAlimenticio/" + keys[x].id + "/").once("value");
                if (infoPlanAlimenticio.val()) {
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
                            if (pedido[pedido.length - 1].metodoPago !== '  Oxxo Pay') {
                                console.log('Diferente de oxxo pay');
                                usuarioActivo.push({
                                    nombre: infoUsuario.val().nombre,
                                    fechaNaci: new Date(infoUsuario.val().fechanaci).toISOString().substring(0, 10),
                                    imc: infoPlanAlimenticio.val().imc,
                                    peso: infoPlanAlimenticio.val().peso,
                                    dietaCalorica: infoPlanAlimenticio.val().dietaCalorica,
                                    genero: infoPlanAlimenticio.val().genero,
                                    plan: pedido[pedido.length - 1].plan,
                                    metodoPago: pedido[pedido.length - 1].metodoPago,
                                    total: pedido[pedido.length - 1].total,
                                    estatura: infoPlanAlimenticio.val().estatura,
                                    id: keys[x].id,
                                    pagado: true

                                });
                            }


                        }

                    });
                }
            }


        }

    }
    res.json({
        ok: true,
        usuarioInactivo,
        usuarioActivo

    })

});



app.post('/usuartios/getUsuariosIn', async(req, res) => {
    let keys = req.body.data;
    let usuarioActivo = [];
    let usuarioInactivo = [];
    // console.log('ids de usuarios: ', keys.length);
    for (let x = 0; x < keys.length; x++) {
        const infoUsuario = await db.ref("/usuarios/" + keys[x].id + "/").once("value");
        if (infoUsuario.val()) {
            const fechaCena = new Date(infoUsuario.val().ultimacena);
            const fechaDesayuno = new Date(infoUsuario.val().ultimodesayuno);
            const fechaComida = new Date(infoUsuario.val().ultimacomida);
            const fechaCompleto = new Date(infoUsuario.val().ultimocompleto);
            let now = new Date();
            if (fechaCena.getTime() >= now.getTime() || fechaDesayuno.getTime() >= now.getTime() || fechaComida.getTime() >= now.getTime() || fechaCompleto.getTime() >= now.getTime()) {

            } else {
                const infoPlanAlimenticio = await db.ref("/planAlimenticio/" + keys[x].id + "/").once("value");
                if (infoPlanAlimenticio.val()) {
                    usuarioInactivo.push({
                        nombre: infoUsuario.val().nombre,
                        fechaNaci: new Date(infoUsuario.val().fechanaci).toISOString().substring(0, 10),
                        imc: infoPlanAlimenticio.val().imc,
                        peso: infoPlanAlimenticio.val().peso,
                        dietaCalorica: infoPlanAlimenticio.val().dietaCalorica,
                        genero: infoPlanAlimenticio.val().genero,
                        pagado: true,
                        id: keys[x].id
                    });
                } else {
                    usuarioInactivo.push({
                        nombre: infoUsuario.val().nombre,
                        fechaNaci: new Date(infoUsuario.val().fechanaci).toISOString().substring(0, 10),
                        pagado: true,
                        id: keys[x].id
                    })
                }
            }


        }

    }
    res.json({
        ok: true,
        usuarioInactivo,
        usuarioActivo

    })

});


let asignarComidas = (key) => {




}


async function validacionCompleto(dias, ultimo, hora, direc, key, id_fichaOxxoPay) {
    ff = new Date();
    hh = ff.getHours();
    ccc = moment(ff).format('YYYY-MM-DD');
    if (ultimo == null || ultimo <= ccc) {
        if (hh < 14) {
            ggg = moment(ff).format('dddd');
            if (ggg == 'lunes' || ggg == 'martes' || ggg == 'miércoles') {
                ccc = moment(ff).add(2, 'days').format('YYYY-MM-DD');
                gg = moment(ccc).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ccc).add(1, 'day').format('YYYY-MM-DD')
                        ccc = gg2
                        gg = moment(ccc).format('dddd');
                    } else {
                        await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ccc).add(3, 'day').format('YYYY-MM-DD')
                        ccc = gg2
                        gg = moment(ccc).format('dddd');
                    }
                }
            }
            if (ggg == 'jueves') {
                ccc = moment(ff).add(4, 'days').format('YYYY-MM-DD');
                gg = moment(ccc).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ccc).add(1, 'day').format('YYYY-MM-DD')
                        ccc = gg2
                        gg = moment(ccc).format('dddd');
                    } else {
                        await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ccc).add(3, 'day').format('YYYY-MM-DD')
                        ccc = gg2
                        gg = moment(ccc).format('dddd');
                    }
                }
            }
            if (ggg == 'viernes') {
                ccc = moment(ff).add(3, 'days').format('YYYY-MM-DD');
                gg = moment(ccc).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ccc).add(1, 'day').format('YYYY-MM-DD')
                        ccc = gg2
                        gg = moment(ccc).format('dddd');
                    } else {
                        await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ccc).add(3, 'day').format('YYYY-MM-DD')
                        ccc = gg2
                        gg = moment(ccc).format('dddd');
                    }
                }
            }
        } else {
            ggg = moment(ff).format('dddd');
            if (ggg == 'lunes' || ggg == 'martes' || ggg == 'viernes') {
                ccc = moment(ff).add(3, 'days').format('YYYY-MM-DD');
                gg = moment(ccc).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ccc).add(1, 'day').format('YYYY-MM-DD')
                        ccc = gg2
                        gg = moment(ccc).format('dddd');
                    } else {
                        await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ccc).add(3, 'day').format('YYYY-MM-DD')
                        ccc = gg2
                        gg = moment(ccc).format('dddd');
                    }
                }
            }
            if (ggg == 'miércoles') {
                ccc = moment(ff).add(5, 'days').format('YYYY-MM-DD');
                gg = moment(ccc).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ccc).add(1, 'day').format('YYYY-MM-DD')
                        ccc = gg2
                        gg = moment(ccc).format('dddd');
                    } else {
                        await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ccc).add(3, 'day').format('YYYY-MM-DD')
                        ccc = gg2
                        gg = moment(ccc).format('dddd');
                    }
                }
            }
            if (ggg == 'jueves') {
                ccc = moment(ff).add(4, 'days').format('YYYY-MM-DD');
                gg = moment(ccc).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ccc).add(1, 'day').format('YYYY-MM-DD')
                        ccc = gg2
                        gg = moment(ccc).format('dddd');
                    } else {
                        await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ccc).add(3, 'day').format('YYYY-MM-DD')
                        ccc = gg2
                        gg = moment(ccc).format('dddd');
                    }
                }
            }
        }
    } else {
        if (hh < 14) {
            ggg = moment(ultimo).format('dddd');
            if (ggg == 'lunes' || ggg == 'martes' || ggg == 'miércoles' || ggg == 'jueves') {
                ccc = moment(ultimo).add(1, 'days').format('YYYY-MM-DD');
                gg = moment(ccc).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ccc).add(1, 'day').format('YYYY-MM-DD')
                        ccc = gg2
                        gg = moment(ccc).format('dddd');
                    } else {
                        await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ccc).add(3, 'day').format('YYYY-MM-DD')
                        ccc = gg2
                        gg = moment(ccc).format('dddd');
                    }
                }
            }
            if (ggg == 'viernes') {
                ccc = moment(ultimo).add(3, 'days').format('YYYY-MM-DD');
                gg = moment(ccc).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ccc).add(1, 'day').format('YYYY-MM-DD')
                        ccc = gg2
                        gg = moment(ccc).format('dddd');
                    } else {
                        await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ccc).add(3, 'day').format('YYYY-MM-DD')
                        ccc = gg2
                        gg = moment(ccc).format('dddd');
                    }
                }
            }
        } else { //AQUI VA LA VALIDACION DESPUES DE LAS 14 HRS
            if (moment(ccc).add(3, 'days').format('YYYY-MM-DD') <= ultimo) {
                ggg = moment(ultimo).format('dddd');
                if (ggg == 'lunes' || ggg == 'martes' || ggg == 'miércoles' || ggg == 'jueves') {
                    ccc = moment(ultimo).add(1, 'days').format('YYYY-MM-DD');
                    gg = moment(ccc).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ccc).add(1, 'day').format('YYYY-MM-DD')
                            ccc = gg2
                            gg = moment(ccc).format('dddd');
                        } else {
                            await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ccc).add(3, 'day').format('YYYY-MM-DD')
                            ccc = gg2
                            gg = moment(ccc).format('dddd');
                        }
                    }
                }
                if (ggg == 'viernes') {
                    ccc = moment(ultimo).add(3, 'days').format('YYYY-MM-DD');
                    gg = moment(ccc).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ccc).add(1, 'day').format('YYYY-MM-DD')
                            ccc = gg2
                            gg = moment(ccc).format('dddd');
                        } else {
                            await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ccc).add(3, 'day').format('YYYY-MM-DD')
                            ccc = gg2
                            gg = moment(ccc).format('dddd');
                        }
                    }
                }
            } else {
                ggg = moment(ff).format('dddd');
                if (ggg == 'lunes' || ggg == 'martes' || ggg == 'viernes') {
                    ccc = moment(ff).add(3, 'days').format('YYYY-MM-DD');
                    gg = moment(ccc).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ccc).add(1, 'day').format('YYYY-MM-DD')
                            ccc = gg2
                            gg = moment(ccc).format('dddd');
                        } else {
                            await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ccc).add(3, 'day').format('YYYY-MM-DD')
                            ccc = gg2
                            gg = moment(ccc).format('dddd');
                        }
                    }
                }
                if (ggg == 'miércoles') {
                    ccc = moment(ff).add(5, 'days').format('YYYY-MM-DD');
                    gg = moment(ccc).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ccc).add(1, 'day').format('YYYY-MM-DD')
                            ccc = gg2
                            gg = moment(ccc).format('dddd');
                        } else {
                            await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ccc).add(3, 'day').format('YYYY-MM-DD')
                            ccc = gg2
                            gg = moment(ccc).format('dddd');
                        }
                    }
                }
                if (ggg == 'jueves') {
                    ccc = moment(ff).add(4, 'days').format('YYYY-MM-DD');
                    gg = moment(ccc).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ccc).add(1, 'day').format('YYYY-MM-DD')
                            ccc = gg2
                            gg = moment(ccc).format('dddd');
                        } else {
                            await asignarFechaCompleto(ccc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ccc).add(3, 'day').format('YYYY-MM-DD')
                            ccc = gg2
                            gg = moment(ccc).format('dddd');
                        }
                    }
                }
            }
        }
    }
}

async function validacionDesayuno(dias, ultimo, hora, direc, key, id_fichaOxxoPay) {
    console.log('ENTRO A VALIDACION DESAYUNO');
    ff = new Date();
    hh = ff.getHours();
    dd = moment(ff).format('YYYY-MM-DD');
    console.log('Dias: ' + dias);
    console.log('ultimo: ' + ultimo);
    console.log('Hora: ' + hora);
    console.log('Direccion: ' + direc);
    console.log('Hora en numero: ' + hh);
    console.log('fecha hoy: ' + dd);
    if (ultimo == null || ultimo <= dd) {
        console.log('ULTIMO DESAYUNO ES FECHA ANTERIOR A HOY');
        if (hh < 14) {
            ggg = moment(ff).format('dddd');
            if (ggg == 'lunes' || ggg == 'martes' || ggg == 'miércoles') {
                dd = moment(ff).add(2, 'days').format('YYYY-MM-DD');
                gg = moment(dd).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(dd).add(1, 'day').format('YYYY-MM-DD')
                        dd = gg2
                        gg = moment(dd).format('dddd');
                    } else {
                        await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(dd).add(3, 'day').format('YYYY-MM-DD')
                        dd = gg2
                        gg = moment(dd).format('dddd');
                    }
                }
            }
            if (ggg == 'jueves') {
                dd = moment(ff).add(4, 'days').format('YYYY-MM-DD');
                gg = moment(dd).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(dd).add(1, 'day').format('YYYY-MM-DD')
                        dd = gg2
                        gg = moment(dd).format('dddd');
                    } else {
                        await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(dd).add(3, 'day').format('YYYY-MM-DD')
                        dd = gg2
                        gg = moment(dd).format('dddd');
                    }
                }
            }
            if (ggg == 'viernes') {
                dd = moment(ff).add(3, 'days').format('YYYY-MM-DD');
                gg = moment(dd).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(dd).add(1, 'day').format('YYYY-MM-DD')
                        dd = gg2
                        gg = moment(dd).format('dddd');
                    } else {
                        await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(dd).add(3, 'day').format('YYYY-MM-DD')
                        dd = gg2
                        gg = moment(dd).format('dddd');
                    }
                }
            }
        } else {
            ggg = moment(ff).format('dddd');
            if (ggg == 'lunes' || ggg == 'martes' || ggg == 'viernes') {
                dd = moment(ff).add(3, 'days').format('YYYY-MM-DD');
                gg = moment(dd).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(dd).add(1, 'day').format('YYYY-MM-DD')
                        dd = gg2
                        gg = moment(dd).format('dddd');
                    } else {
                        await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(dd).add(3, 'day').format('YYYY-MM-DD')
                        dd = gg2
                        gg = moment(dd).format('dddd');
                    }
                }
            }
            if (ggg == 'miércoles') {
                dd = moment(ff).add(5, 'days').format('YYYY-MM-DD');
                gg = moment(dd).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(dd).add(1, 'day').format('YYYY-MM-DD')
                        dd = gg2
                        gg = moment(dd).format('dddd');
                    } else {
                        await asignarFechaDesayuno(dd, hora, direc, key);
                        gg2 = moment(dd).add(3, 'day').format('YYYY-MM-DD')
                        dd = gg2
                        gg = moment(dd).format('dddd');
                    }
                }
            }
            if (ggg == 'jueves') {
                dd = moment(ff).add(4, 'days').format('YYYY-MM-DD');
                gg = moment(dd).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(dd).add(1, 'day').format('YYYY-MM-DD')
                        dd = gg2
                        gg = moment(dd).format('dddd');
                    } else {
                        await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(dd).add(3, 'day').format('YYYY-MM-DD')
                        dd = gg2
                        gg = moment(dd).format('dddd');
                    }
                }
            }
        }
    } else {
        console.log('ULTIMO DESAYUNO ES FECHA POSTERIOR A HOY');
        if (hh < 14) {
            ggg = moment(ultimo).format('dddd');
            console.log('Dia Semana de Ultimo: ' + ggg);
            if (ggg == 'lunes' || ggg == 'martes' || ggg == 'miércoles' || ggg == 'jueves') {
                console.log('ENTRO A MARTES');
                dd = moment(ultimo).add(1, 'days').format('YYYY-MM-DD');
                gg = moment(dd).format('dddd');
                // console.log('Dia gg: ' + gg);
                for (let i = 0; i < dias; i++) {
                    console.log('CICLO FOR LISTO PARA ASIGNAR');
                    console.log('Dia gg: ' + gg);
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(dd).add(1, 'day').format('YYYY-MM-DD')
                        dd = gg2
                        gg = moment(dd).format('dddd');
                    } else {
                        await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(dd).add(3, 'day').format('YYYY-MM-DD')
                        dd = gg2
                        gg = moment(dd).format('dddd');
                    }
                }
            }
            if (ggg == 'viernes') {
                dd = moment(ultimo).add(3, 'days').format('YYYY-MM-DD');
                gg = moment(dd).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(dd).add(1, 'day').format('YYYY-MM-DD')
                        dd = gg2
                        gg = moment(dd).format('dddd');
                    } else {
                        await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(dd).add(3, 'day').format('YYYY-MM-DD')
                        dd = gg2
                        gg = moment(dd).format('dddd');
                    }
                }
            }
        } else { //AQUI VA LA VALIDACION DESPUES DE LAS 14 HRS
            if (moment(dd).add(3, 'days').format('YYYY-MM-DD') <= ultimo) {
                ggg = moment(ultimo).format('dddd');
                if (ggg == 'lunes' || ggg == 'martes' || ggg == 'miércoles' || ggg == 'jueves') {
                    dd = moment(ultimo).add(1, 'days').format('YYYY-MM-DD');
                    gg = moment(dd).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(dd).add(1, 'day').format('YYYY-MM-DD')
                            dd = gg2
                            gg = moment(dd).format('dddd');
                        } else {
                            await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(dd).add(3, 'day').format('YYYY-MM-DD')
                            dd = gg2
                            gg = moment(dd).format('dddd');
                        }
                    }
                }
                if (ggg == 'viernes') {
                    dd = moment(ultimo).add(3, 'days').format('YYYY-MM-DD');
                    gg = moment(dd).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(dd).add(1, 'day').format('YYYY-MM-DD')
                            dd = gg2
                            gg = moment(dd).format('dddd');
                        } else {
                            await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(dd).add(3, 'day').format('YYYY-MM-DD')
                            dd = gg2
                            gg = moment(dd).format('dddd');
                        }
                    }
                }
            } else {
                ggg = moment(ff).format('dddd');
                if (ggg == 'lunes' || ggg == 'martes' || ggg == 'viernes') {
                    dd = moment(ff).add(3, 'days').format('YYYY-MM-DD');
                    gg = moment(dd).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(dd).add(1, 'day').format('YYYY-MM-DD')
                            dd = gg2
                            gg = moment(dd).format('dddd');
                        } else {
                            await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(dd).add(3, 'day').format('YYYY-MM-DD')
                            dd = gg2
                            gg = moment(dd).format('dddd');
                        }
                    }
                }
                if (ggg == 'miércoles') {
                    dd = moment(ff).add(5, 'days').format('YYYY-MM-DD');
                    gg = moment(dd).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(dd).add(1, 'day').format('YYYY-MM-DD')
                            dd = gg2
                            gg = moment(dd).format('dddd');
                        } else {
                            await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(dd).add(3, 'day').format('YYYY-MM-DD')
                            dd = gg2
                            gg = moment(dd).format('dddd');
                        }
                    }
                }
                if (ggg == 'jueves') {
                    dd = moment(ff).add(4, 'days').format('YYYY-MM-DD');
                    gg = moment(dd).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(dd).add(1, 'day').format('YYYY-MM-DD')
                            dd = gg2
                            gg = moment(dd).format('dddd');
                        } else {
                            await asignarFechaDesayuno(dd, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(dd).add(3, 'day').format('YYYY-MM-DD')
                            dd = gg2
                            gg = moment(dd).format('dddd');
                        }
                    }
                }
            }
        }
    }
}

async function validacionComida(dias, ultimo, hora, direc, key, id_fichaOxxoPay) {
    ff = new Date();
    hh = ff.getHours();
    cc = moment(ff).format('YYYY-MM-DD');
    if (ultimo == null || ultimo <= cc) {
        if (hh < 14) {
            ggg = moment(ff).format('dddd');
            if (ggg == 'lunes' || ggg == 'martes' || ggg == 'miércoles') {
                cc = moment(ff).add(2, 'days').format('YYYY-MM-DD');
                gg = moment(cc).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(cc).add(1, 'day').format('YYYY-MM-DD')
                        cc = gg2
                        gg = moment(cc).format('dddd');
                    } else {
                        await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(cc).add(3, 'day').format('YYYY-MM-DD')
                        cc = gg2
                        gg = moment(cc).format('dddd');
                    }
                }
            }
            if (ggg == 'jueves') {
                cc = moment(ff).add(4, 'days').format('YYYY-MM-DD');
                gg = moment(cc).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(cc).add(1, 'day').format('YYYY-MM-DD')
                        cc = gg2
                        gg = moment(cc).format('dddd');
                    } else {
                        await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(cc).add(3, 'day').format('YYYY-MM-DD')
                        cc = gg2
                        gg = moment(cc).format('dddd');
                    }
                }
            }
            if (ggg == 'viernes') {
                cc = moment(ff).add(3, 'days').format('YYYY-MM-DD');
                gg = moment(cc).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(cc).add(1, 'day').format('YYYY-MM-DD')
                        cc = gg2
                        gg = moment(cc).format('dddd');
                    } else {
                        await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(cc).add(3, 'day').format('YYYY-MM-DD')
                        cc = gg2
                        gg = moment(cc).format('dddd');
                    }
                }
            }
        } else {
            ggg = moment(ff).format('dddd');
            if (ggg == 'lunes' || ggg == 'martes' || ggg == 'viernes') {
                cc = moment(ff).add(3, 'days').format('YYYY-MM-DD');
                gg = moment(cc).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(cc).add(1, 'day').format('YYYY-MM-DD')
                        cc = gg2
                        gg = moment(cc).format('dddd');
                    } else {
                        await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(cc).add(3, 'day').format('YYYY-MM-DD')
                        cc = gg2
                        gg = moment(cc).format('dddd');
                    }
                }
            }
            if (ggg == 'miércoles') {
                cc = moment(ff).add(5, 'days').format('YYYY-MM-DD');
                gg = moment(cc).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(cc).add(1, 'day').format('YYYY-MM-DD')
                        cc = gg2
                        gg = moment(cc).format('dddd');
                    } else {
                        await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(cc).add(3, 'day').format('YYYY-MM-DD')
                        cc = gg2
                        gg = moment(cc).format('dddd');
                    }
                }
            }
            if (ggg == 'jueves') {
                cc = moment(ff).add(4, 'days').format('YYYY-MM-DD');
                gg = moment(cc).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(cc).add(1, 'day').format('YYYY-MM-DD')
                        cc = gg2
                        gg = moment(cc).format('dddd');
                    } else {
                        await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(cc).add(3, 'day').format('YYYY-MM-DD')
                        cc = gg2
                        gg = moment(cc).format('dddd');
                    }
                }
            }
        }
    } else {
        if (hh < 14) {
            ggg = moment(ultimo).format('dddd');
            if (ggg == 'lunes' || ggg == 'martes' || ggg == 'miércoles' || ggg == 'jueves') {
                cc = moment(ultimo).add(1, 'days').format('YYYY-MM-DD');
                gg = moment(cc).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(cc).add(1, 'day').format('YYYY-MM-DD')
                        cc = gg2
                        gg = moment(cc).format('dddd');
                    } else {
                        await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(cc).add(3, 'day').format('YYYY-MM-DD')
                        cc = gg2
                        gg = moment(cc).format('dddd');
                    }
                }
            }
            if (ggg == 'viernes') {
                cc = moment(ultimo).add(3, 'days').format('YYYY-MM-DD');
                gg = moment(cc).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(cc).add(1, 'day').format('YYYY-MM-DD')
                        cc = gg2
                        gg = moment(cc).format('dddd');
                    } else {
                        await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(cc).add(3, 'day').format('YYYY-MM-DD')
                        cc = gg2
                        gg = moment(cc).format('dddd');
                    }
                }
            }
        } else { //AQUI VA LA VALIDACION DESPUES DE LAS 14 HRS
            if (moment(cc).add(3, 'days').format('YYYY-MM-DD') <= ultimo) {
                ggg = moment(ultimo).format('dddd');
                if (ggg == 'lunes' || ggg == 'martes' || ggg == 'miércoles' || ggg == 'jueves') {
                    cc = moment(ultimo).add(1, 'days').format('YYYY-MM-DD');
                    gg = moment(cc).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(cc).add(1, 'day').format('YYYY-MM-DD')
                            cc = gg2
                            gg = moment(cc).format('dddd');
                        } else {
                            await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(cc).add(3, 'day').format('YYYY-MM-DD')
                            cc = gg2
                            gg = moment(cc).format('dddd');
                        }
                    }
                }
                if (ggg == 'viernes') {
                    cc = moment(ultimo).add(3, 'days').format('YYYY-MM-DD');
                    gg = moment(cc).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(cc).add(1, 'day').format('YYYY-MM-DD')
                            cc = gg2
                            gg = moment(cc).format('dddd');
                        } else {
                            await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(cc).add(3, 'day').format('YYYY-MM-DD')
                            cc = gg2
                            gg = moment(cc).format('dddd');
                        }
                    }
                }
            } else {
                ggg = moment(ff).format('dddd');
                if (ggg == 'lunes' || ggg == 'martes' || ggg == 'viernes') {
                    cc = moment(ff).add(3, 'days').format('YYYY-MM-DD');
                    gg = moment(cc).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(cc).add(1, 'day').format('YYYY-MM-DD')
                            cc = gg2
                            gg = moment(cc).format('dddd');
                        } else {
                            await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(cc).add(3, 'day').format('YYYY-MM-DD')
                            cc = gg2
                            gg = moment(cc).format('dddd');
                        }
                    }
                }
                if (ggg == 'miércoles') {
                    cc = moment(ff).add(5, 'days').format('YYYY-MM-DD');
                    gg = moment(cc).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(cc).add(1, 'day').format('YYYY-MM-DD')
                            cc = gg2
                            gg = moment(cc).format('dddd');
                        } else {
                            await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(cc).add(3, 'day').format('YYYY-MM-DD')
                            cc = gg2
                            gg = moment(cc).format('dddd');
                        }
                    }
                }
                if (ggg == 'jueves') {
                    cc = moment(ff).add(4, 'days').format('YYYY-MM-DD');
                    gg = moment(cc).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(cc).add(1, 'day').format('YYYY-MM-DD')
                            cc = gg2
                            gg = moment(cc).format('dddd');
                        } else {
                            await asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(cc).add(3, 'day').format('YYYY-MM-DD')
                            cc = gg2
                            gg = moment(cc).format('dddd');
                        }
                    }
                }
            }
        }
    }
}

async function validacionCena(dias, ultimo, hora, direc, key, id_fichaOxxoPay) {
    console.log("ENTRO A FUNCION VALIDACIONCENA")
    console.log("Dias: " + dias)
    console.log("Ultimo: " + ultimo)
    console.log("Hora: " + hora)
    console.log("Direccion: " + direc)
    ff = new Date();
    hh = ff.getHours();
    ce = moment(ff).format('YYYY-MM-DD');
    if (ultimo == null || ultimo <= ce) {
        console.log("ULTIMO ES MENOR O IGUAL A HOY")
        console.log("HORA ACTUAL: " + hh)
        if (hh < 14) {
            console.log("ANTES DE LAS 14")
            ggg = moment(ff).format('dddd');
            //lunes martes miércoles jueves viernes
            if (ggg == 'lunes' || ggg == 'martes' || ggg == 'miércoles') {
                ce = moment(ff).add(2, 'days').format('YYYY-MM-DD');
                gg = moment(ce).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ce).add(1, 'day').format('YYYY-MM-DD')
                        ce = gg2
                        gg = moment(ce).format('dddd');
                    } else {
                        console.log("ENTRO A VIERNES Y SE DEBE IR A ASIGNARFECHA CENA")
                        await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ce).add(3, 'day').format('YYYY-MM-DD')
                        ce = gg2
                        gg = moment(ce).format('dddd');
                    }
                }
            }
            if (ggg == 'jueves') {
                ce = moment(ff).add(4, 'days').format('YYYY-MM-DD');
                gg = moment(ce).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ce).add(1, 'day').format('YYYY-MM-DD')
                        ce = gg2
                        gg = moment(ce).format('dddd');
                    } else {
                        await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ce).add(3, 'day').format('YYYY-MM-DD')
                        ce = gg2
                        gg = moment(ce).format('dddd');
                    }
                }
            }
            if (ggg == 'viernes') {
                ce = moment(ff).add(3, 'days').format('YYYY-MM-DD');
                gg = moment(ce).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ce).add(1, 'day').format('YYYY-MM-DD')
                        ce = gg2
                        gg = moment(ce).format('dddd');
                    } else {
                        await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ce).add(3, 'day').format('YYYY-MM-DD')
                        ce = gg2
                        gg = moment(ce).format('dddd');
                    }
                }
            }
        } else {
            console.log("DESPUES DE LAS 14")
            ggg = moment(ff).format('dddd');
            console.log("DIA DE LA SEMANA GGG: " + ggg)
            if (ggg == 'lunes' || ggg == 'martes' || ggg == 'viernes') {
                console.log("GGG HOY ES VIERNES, DEBERIA ENTRAR A ASIGNAR FECHA")
                ce = moment(ff).add(3, 'days').format('YYYY-MM-DD');
                gg = moment(ce).format('dddd');
                console.log("DIA DE LA SEMANA GG : " + gg)
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ce).add(1, 'day').format('YYYY-MM-DD')
                        ce = gg2
                        gg = moment(ce).format('dddd');
                    } else {
                        console.log("GG HOY ES VIERNES, DEBERIA ENTRAR A ASIGNAR FECHA")
                        await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ce).add(3, 'day').format('YYYY-MM-DD')
                        ce = gg2
                        gg = moment(ce).format('dddd');
                    }
                }
            }
            if (ggg == 'miércoles') {
                ce = moment(ff).add(5, 'days').format('YYYY-MM-DD');
                gg = moment(ce).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ce).add(1, 'day').format('YYYY-MM-DD')
                        ce = gg2
                        gg = moment(ce).format('dddd');
                    } else {
                        await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ce).add(3, 'day').format('YYYY-MM-DD')
                        ce = gg2
                        gg = moment(ce).format('dddd');
                    }
                }
            }
            if (ggg == 'jueves') {
                ce = moment(ff).add(4, 'days').format('YYYY-MM-DD');
                gg = moment(ce).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ce).add(1, 'day').format('YYYY-MM-DD')
                        ce = gg2
                        gg = moment(ce).format('dddd');
                    } else {
                        await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ce).add(3, 'day').format('YYYY-MM-DD')
                        ce = gg2
                        gg = moment(ce).format('dddd');
                    }
                }
            }
        }
    } else {
        if (hh < 14) {
            ggg = moment(ultimo).format('dddd');
            if (ggg == 'lunes' || ggg == 'martes' || ggg == 'miércoles' || ggg == 'jueves') {
                ce = moment(ultimo).add(1, 'days').format('YYYY-MM-DD');
                gg = moment(ce).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ce).add(1, 'day').format('YYYY-MM-DD')
                        ce = gg2
                        gg = moment(ce).format('dddd');
                    } else {
                        await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ce).add(3, 'day').format('YYYY-MM-DD')
                        ce = gg2
                        gg = moment(ce).format('dddd');
                    }
                }
            }
            if (ggg == 'viernes') {
                ce = moment(ultimo).add(3, 'days').format('YYYY-MM-DD');
                gg = moment(ce).format('dddd');
                for (let i = 0; i < dias; i++) {
                    if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                        await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ce).add(1, 'day').format('YYYY-MM-DD')
                        ce = gg2
                        gg = moment(ce).format('dddd');
                    } else {
                        await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                        gg2 = moment(ce).add(3, 'day').format('YYYY-MM-DD')
                        ce = gg2
                        gg = moment(ce).format('dddd');
                    }
                }
            }
        } else { //AQUI VA LA VALIDACION DESPUES DE LAS 14 HRS
            if (moment(ce).add(3, 'days').format('YYYY-MM-DD') <= ultimo) {
                ggg = moment(ultimo).format('dddd');
                if (ggg == 'lunes' || ggg == 'martes' || ggg == 'miércoles' || ggg == 'jueves') {
                    ce = moment(ultimo).add(1, 'days').format('YYYY-MM-DD');
                    gg = moment(ce).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ce).add(1, 'day').format('YYYY-MM-DD')
                            ce = gg2
                            gg = moment(ce).format('dddd');
                        } else {
                            await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ce).add(3, 'day').format('YYYY-MM-DD')
                            ce = gg2
                            gg = moment(ce).format('dddd');
                        }
                    }
                }
                if (ggg == 'viernes') {
                    ce = moment(ultimo).add(3, 'days').format('YYYY-MM-DD');
                    gg = moment(ce).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ce).add(1, 'day').format('YYYY-MM-DD')
                            ce = gg2
                            gg = moment(ce).format('dddd');
                        } else {
                            await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ce).add(3, 'day').format('YYYY-MM-DD')
                            ce = gg2
                            gg = moment(ce).format('dddd');
                        }
                    }
                }
            } else {
                ggg = moment(ff).format('dddd');
                if (ggg == 'lunes' || ggg == 'martes' || ggg == 'viernes') {
                    ce = moment(ff).add(3, 'days').format('YYYY-MM-DD');
                    gg = moment(ce).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ce).add(1, 'day').format('YYYY-MM-DD')
                            ce = gg2
                            gg = moment(ce).format('dddd');
                        } else {
                            await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ce).add(3, 'day').format('YYYY-MM-DD')
                            ce = gg2
                            gg = moment(ce).format('dddd');
                        }
                    }
                }
                if (ggg == 'miércoles') {
                    ce = moment(ff).add(5, 'days').format('YYYY-MM-DD');
                    gg = moment(ce).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ce).add(1, 'day').format('YYYY-MM-DD')
                            ce = gg2
                            gg = moment(ce).format('dddd');
                        } else {
                            await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ce).add(3, 'day').format('YYYY-MM-DD')
                            ce = gg2
                            gg = moment(ce).format('dddd');
                        }
                    }
                }
                if (ggg == 'jueves') {
                    ce = moment(ff).add(4, 'days').format('YYYY-MM-DD');
                    gg = moment(ce).format('dddd');
                    for (let i = 0; i < dias; i++) {
                        if (gg == 'lunes' || gg == 'martes' || gg == 'miércoles' || gg == 'jueves') {
                            await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ce).add(1, 'day').format('YYYY-MM-DD')
                            ce = gg2
                            gg = moment(ce).format('dddd');
                        } else {
                            await asignarFechaCena(ce, hora, direc, key, id_fichaOxxoPay);
                            gg2 = moment(ce).add(3, 'day').format('YYYY-MM-DD')
                            ce = gg2
                            gg = moment(ce).format('dddd');
                        }
                    }
                }
            }
        }
    }
}

async function asignarFechaCompleto(cc, hora, direc, key, id_fichaOxxoPay) {
    let cont = 1

    await db.ref("usuarios/" + key + "/").once('value', (snapshot) => {
        if (snapshot.val) {
            use = snapshot.val();
            if (use.ultimocompleto != null) {
                if (use.ultimocompleto > cc) {} else {
                    db.ref("usuarios/" + key + "/").update({ ultimocompleto: cc, ultimacena: cc, ultimacomida: cc, ultimodesayuno: cc });
                }
            } else {
                db.ref("usuarios/" + key + "/").update({ ultimocompleto: cc, ultimacena: cc, ultimacomida: cc, ultimodesayuno: cc });
            }

            if (use.ContDesayuno != null) {
                let nuevoCont = use.ContDesayuno + cont
                db.ref("usuarios/" + key + "/").update({ ContDesayuno: nuevoCont });
            } else {
                db.ref("usuarios/" + key + "/").update({ ContDesayuno: cont });
            }

            if (use.ContComida != null) {
                let nuevoCont2 = use.ContComida + cont
                db.ref("usuarios/" + key + "/").update({ ContComida: nuevoCont2 });
            } else {
                db.ref("usuarios/" + key + "/").update({ ContComida: cont });
            }

            if (use.ContCena != null) {
                let nuevoCont3 = use.ContCena + cont
                db.ref("usuarios/" + key + "/").update({ ContCena: nuevoCont3 });
            } else {
                db.ref("usuarios/" + key + "/").update({ ContCena: cont });
            }

            uu = moment(cc).add(-1, 'days').format('YYYY-MM-DD')
            db.ref("FechaEntrega/" + key + "/" + uu + "/").update({ id_menuFechaPersona: cc });
        }
    })

    //firebase.database().ref("usuarios/"+ key +"/").update({ultimocompleto: cc, ultimacena: cc, ultimacomida: cc, ultimodesayuno: cc});
    await db.ref('MenuHistorial/' + cc + '/Desayuno/comida1/').once('value', (snapshot) => {
        if (snapshot.val) {
            objD = snapshot.val();
            db.ref('MenuFechaPersona/' + key + '/' + cc + '/Desayuno/').update({ id: objD.id, completo: true, hora: hora, direccion: direc });
        }
    })
    await db.ref('MenuHistorial/' + cc + '/Comida/comida1/').once('value', (snapshot) => {
        if (snapshot.val) {
            objCo = snapshot.val();
            db.ref('MenuFechaPersona/' + key + '/' + cc + '/Comida/').update({ id: objCo.id, completo: true, hora: hora, direccion: direc });
        }
    })
    await db.ref('MenuHistorial/' + cc + '/Cena/comida1/').once('value', (snapshot) => {
        if (snapshot.val) {
            objCe = snapshot.val();
            db.ref('MenuFechaPersona/' + key + '/' + cc + '/Cena/').update({ id: objCe.id, completo: true, hora: hora, direccion: direc });
        }
    })

    await db.ref('OxxoPay/' + key + '/' + id_fichaOxxoPay + '/').remove();
}

async function asignarFechaDesayuno(cc, hora, direc, key, id_fichaOxxoPay) {
    let cont2 = 1
        // console.log('CC: ' + cc);
        // console.log('KEY: ' + key);
        // console.log('HORA: ' + hora);
        // console.log('DIRECCION: ' + direc);

    await db.ref("usuarios/" + key + "/").once('value', (snapshot) => {
            console.log("ENTRO A BASE DE DAOTS");
            if (snapshot.val) {
                use = snapshot.val();
                console.log(use);
                if (use.ultimocompleto != null) {
                    if (use.ultimocompleto > cc) {
                        db.ref("usuarios/" + key + "/").update({ ultimodesayuno: cc });
                    } else {
                        db.ref("usuarios/" + key + "/").update({ ultimodesayuno: cc, ultimocompleto: cc });
                    }
                } else {
                    db.ref("usuarios/" + key + "/").update({ ultimodesayuno: cc, ultimocompleto: cc });
                }

                if (use.ContDesayuno != null) {
                    let nuevoCont = use.ContDesayuno + cont2
                    db.ref("usuarios/" + key + "/").update({ ContDesayuno: nuevoCont });
                } else {
                    db.ref("usuarios/" + key + "/").update({ ContDesayuno: cont2 });
                }

                db.ref("FechaEntrega/" + key + "/" + cc + "/").update({ id_menuFechaPersona: cc });
            }
        })
        //firebase.database().ref("usuarios/"+ key +"/").update({ultimodesayuno: cc, ultimocompleto: cc});
    await db.ref('MenuHistorial/' + cc + '/Desayuno/comida1/').once('value', (snapshot) => {
        if (snapshot.val) {
            objD = snapshot.val();
            console.log(objD.id);
            db.ref('MenuFechaPersona/' + key + '/' + cc + '/Desayuno/').update({ id: objD.id, completo: false, hora: hora, direccion: direc });
        }
    })

    //AQUI SE TIENE QUE ELIMINAR DE LA TABLA OXXOPAY TODA LA INFO
    await db.ref('OxxoPay/' + key + '/' + id_fichaOxxoPay + '/').remove();
}

async function asignarFechaComida(cc, hora, direc, key, id_fichaOxxoPay) {
    let cont3 = 1

    await db.ref("usuarios/" + key + "/").once('value', (snapshot) => {
            if (snapshot.val) {
                use = snapshot.val();
                if (use.ultimocompleto != null) {
                    if (use.ultimocompleto > cc) {
                        db.ref("usuarios/" + key + "/").update({ ultimacomida: cc });
                    } else {
                        db.ref("usuarios/" + key + "/").update({ ultimacomida: cc, ultimocompleto: cc });
                    }
                } else {
                    db.ref("usuarios/" + key + "/").update({ ultimacomida: cc, ultimocompleto: cc });
                }

                if (use.ContComida != null) {
                    let nuevoCont2 = use.ContComida + cont3
                    db.ref("usuarios/" + key + "/").update({ ContComida: nuevoCont2 });
                } else {
                    db.ref("usuarios/" + key + "/").update({ ContComida: cont3 });
                }

                db.ref("FechaEntrega/" + key + "/" + cc + "/").update({ id_menuFechaPersona: cc });
            }
        })
        //firebase.database().ref("usuarios/"+ key +"/").update({ultimacomida: cc, ultimocompleto: cc});
    await db.ref('MenuHistorial/' + cc + '/Comida/comida1/').once('value', (snapshot) => {
        if (snapshot.val) {
            objCo = snapshot.val();
            db.ref('MenuFechaPersona/' + key + '/' + cc + '/Comida/').update({ id: objCo.id, completo: false, hora: hora, direccion: direc });
        }
    })

    await db.ref('OxxoPay/' + key + '/' + id_fichaOxxoPay + '/').remove();
}

async function asignarFechaCena(cc, hora, direc, key, id_fichaOxxoPay) {
    console.log("ENTRO A ASIGNAR FECHE CENA")
    console.log("FECHA: " + cc)
    console.log("hora: " + hora)
    console.log("Direccion: " + direc)
    let cont4 = 1

    await db.ref("usuarios/" + key + "/").once('value', (snapshot) => {
            if (snapshot.val) {
                use = snapshot.val();
                if (use.ultimocompleto != null) {
                    if (use.ultimocompleto > cc) {
                        db.ref("usuarios/" + key + "/").update({ ultimacena: cc });
                    } else {
                        db.ref("usuarios/" + key + "/").update({ ultimacena: cc, ultimocompleto: cc });
                    }
                } else {
                    db.ref("usuarios/" + key + "/").update({ ultimacena: cc, ultimocompleto: cc });
                }

                if (use.ContCena != null) {
                    let nuevoCont3 = use.ContCena + cont4
                    db.ref("usuarios/" + key + "/").update({ ContCena: nuevoCont3 });
                } else {
                    db.ref("usuarios/" + key + "/").update({ ContCena: cont4 });
                }

                db.ref("FechaEntrega/" + key + "/" + cc + "/").update({ id_menuFechaPersona: cc });
            }
        })
        //firebase.database().ref("usuarios/"+ key +"/").update({ultimacena: cc, ultimocompleto: cc});
    await db.ref('MenuHistorial/' + cc + '/Cena/comida1/').once('value', (snapshot) => {
        if (snapshot.val) {
            objCe = snapshot.val();
            db.ref('MenuFechaPersona/' + key + '/' + cc + '/Cena/').update({ id: objCe.id, completo: false, hora: hora, direccion: direc });
        }
    })

    await db.ref('OxxoPay/' + key + '/' + id_fichaOxxoPay + '/').remove();
}


app.post('/usuario/Pago', async(req, res) => { //OXXO PAY ASIGNACION
    console.log("Entro a USUARIO PAGO");
    //console.log("Ficha Oxxo Pay: " + req.body.id_fichaOxxoPay);
    const key = req.body.id;
    const id_fichaOxxoPay = req.body.id_fichaOxxoPay;
    let diasCompleto = 0;
    let completo = '';
    let ultimocom = '';
    let diasDesayuno = 0;
    let desayuno = '';
    let ultimodes = '';
    let diasComida = 0;
    let comida = '';
    let ultimacom = '';
    let diasCena = 0;
    let cena = '';
    let ultimacen = '';
    await db.ref("OxxoPay/" + key + '/' + id_fichaOxxoPay + '/objNewCar/infocliente/').once('value', async(snapshot) => { //Aqui debe entrar a infocliente
        if (snapshot.val) {
            objx = snapshot.val();
            console.log('Valor de objx');
            console.log(objx)
            if (objx != null) {
                await db.ref("OxxoPay/" + key + '/' + id_fichaOxxoPay + '/objNewCar/productos/').once('value', (snapshot) => {
                    console.log("Entro a consultar Productos");
                    if (snapshot.val) {
                        valA = 0
                        valB = 0
                        valC = 0
                        valD = 0
                        snapshot.forEach((child) => {
                            console.log("Entro a Child del Carrito")
                            if (child.val().plan == 'Completo') {
                                console.log("Entro a Child --> Completo")
                                TotalDias = valA + child.val().dias
                                valA = TotalDias
                                diasCompleto = TotalDias;
                                completo = 'Completo';

                                db.ref("usuarios/" + key + "/").once('value', (snapshot) => {
                                    if (snapshot.val) {
                                        use = snapshot.val();
                                        ultimocom = use.ultimocompleto;

                                    }
                                })
                            }

                            if (child.val().plan == 'Desayuno') {
                                console.log("Entro a Child --> Desayuno")
                                TotalDiasDe = valB + child.val().dias
                                valB = TotalDiasDe
                                diasDesayuno = TotalDiasDe;
                                desayuno = 'Desayuno';

                                db.ref("usuarios/" + key + "/").once('value', (snapshot) => {
                                    if (snapshot.val) {
                                        use = snapshot.val();
                                        ultimodes = use.ultimodesayuno;

                                    }
                                })
                            }

                            if (child.val().plan == 'Comida') {
                                console.log("Entro a Child --> Comida")
                                TotalDiasCo = valC + child.val().dias
                                valC = TotalDiasCo
                                diasComida = TotalDiasCo;
                                comida = 'Comida';

                                db.ref("usuarios/" + key + "/").once('value', (snapshot) => {
                                    if (snapshot.val) {
                                        use = snapshot.val();
                                        ultimacom = use.ultimacomida;

                                    }
                                })
                            }

                            if (child.val().plan == 'Cena') {
                                console.log("Entro a Child --> Cena")
                                TotalDiasCe = valD + child.val().dias
                                valD = TotalDiasCe
                                diasCena = TotalDiasCe;
                                cena = 'Cena';

                                db.ref("usuarios/" + key + "/").once('value', (snapshot) => {
                                    if (snapshot.val) {
                                        use = snapshot.val();
                                        ultimacen = use.ultimacena;

                                    }
                                })
                            }
                        })

                        if (completo == 'Completo') {
                            console.log("Paso el Child -->Va a entrar a Validacion Completo")
                            db.ref("usuarios/" + key + "/").once('value', async(snapshot) => {
                                if (snapshot.val) {
                                    use = snapshot.val();
                                    await validacionCompleto(diasCompleto, use.ultimocompleto, objx.horaplanCompleto, objx.direccion, key, id_fichaOxxoPay);
                                }
                            })
                        }
                        if (desayuno == 'Desayuno') {
                            console.log("Paso el Child -->Va a entrar a Validacion Desayuno")
                            db.ref("usuarios/" + key + "/").once('value', async(snapshot) => {
                                if (snapshot.val) {
                                    use = snapshot.val();
                                    // console.log('Key: ' + key);
                                    // console.log('Dias Desayuno: ' + diasDesayuno);
                                    // console.log('Ultimo desayuno: ' + use.ultimodesayuno);
                                    // console.log('Hora Desayuno: ' + objx.horaplanDesayuno);
                                    // console.log('Direccion: ' + objx.direccion);
                                    await validacionDesayuno(diasDesayuno, use.ultimodesayuno, objx.horaplanDesayuno, objx.direccion, key, id_fichaOxxoPay);
                                }
                            })
                        }
                        if (comida == 'Comida') {
                            console.log("Paso el Child -->Va a entrar a Validacion Comida")
                            db.ref("usuarios/" + key + "/").once('value', async(snapshot) => {
                                if (snapshot.val) {
                                    use = snapshot.val();
                                    await validacionComida(diasComida, use.ultimacomida, objx.horaplanComida, objx.direccion, key, id_fichaOxxoPay);
                                }
                            })
                        }
                        if (cena == 'Cena') {
                            console.log("Paso el Child -->Va a entrar a Validacion Cena")
                            db.ref("usuarios/" + key + "/").once('value', async(snapshot) => {
                                if (snapshot.val) {
                                    use = snapshot.val();
                                    await validacionCena(diasCena, use.ultimacena, objx.horaplanCena, objx.direccion, key, id_fichaOxxoPay);
                                }
                            })
                        }
                    }
                })
            }
        }

        res.json({
            ok: true,
        })
    })
});


module.exports = app;