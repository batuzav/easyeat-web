//constantes para las funciones de express
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const { db, gcs } = require("../config/firebase");
const _ = require('underscore');
//const storageRef = db.storage().ref();

app.use(fileUpload());
//PRUEBA


//Ingresar nuevo desayuno 
app.post('/comidas/insertdesayunos', async(req, res) => {
    let data = req.body;
    if (!data.nombre || !data.descripcion || !data.calorias || !data.medidas) {
        res.status(400).json({
            ok: false,
            mensaje: "Campos o formatos incorrectos",

        });

    } else {
        if (data.imagen) {
            console.log(' Hay imagen viejo');

        }

        db.ref("/MenuDesayuno").push(data, (err) => {

            if (err) {
                console.log('Entro al error desde el principio')
                res.status(400).json({
                    ok: false,
                    err
                });
                // return;

            } else {

                console.log('No entreo error aqui', data);


                res.json({
                    ok: true,
                    desayuno: data,
                });
                //return;


            }


        });

    }

});
//Modificar  desayuno 
app.put('/comidas/modifydesayunos', function(req, res) {
    let id = req.body.id;
    let data = _.pick(req.body, ['nombre', 'descripcion', 'calorias', 'medidas', 'imagen']);
    if (!data.nombre || !data.descripcion || !data.calorias || !data.medidas) {
        res.status(400).json({
            ok: false,
            mensaje: "Campos o formatos incorrectos al modificar",

        });

    } else {
        db.ref("/MenuDesayuno").child(id).update(data, async function(err) {
            if (err) {
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


/*app.delete('/comidas/removerdesayuno', function(req, res){
    
});*/

//Mostrar deayunos
app.post('/comidas/getdesayunos', (req, res) => {
    let data = [];
    db.ref("/MenuDesayuno").on("value", async function(snapshot) {
        if (!snapshot.val()) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        await snapshot.forEach((child) => {
            data.push({
                nombre: child.val().nombre,
                descripcion: child.val().descripcion,
                calorias: child.val().calorias,
                medidas: child.val().medidas,
                imagen: child.val().imagen,
                id: child.key
            });
        })

        res.json({
            ok: true,
            desayuno: data
        });

    });
});

/*---------------------------FIN DE DESAYUNOS------------------ */

/*-------------------------------COMIDAS----------------------- */
//Ingresar nuevo Comida 
app.post('/comidas/insertcomidas', async(req, res) => {
    let data = req.body;

    if (!data.nombre || !data.descripcion || !data.calorias || !data.medidas) {
        res.status(400).json({
            ok: false,
            mensaje: "Campos o formatos incorrectos",

        });

    } else {
        db.ref("/MenuComida").push(data, (err) => {
            if (err) {
                console.log('Entro al error desde el principio')
                res.status(400).json({
                    ok: false,
                    err
                });
            } else {
                console.log('No entreo error aqui', data);
                res.json({
                    ok: true,

                });
            }
        });
    }

});

//Modificar  comida 
app.put('/comidas/modifycomida', function(req, res) {
    let id = req.body.id;
    let data = _.pick(req.body, ['nombre', 'descripcion', 'calorias', 'medidas', 'imagen']);
    if (!data.nombre || !data.descripcion || !data.calorias || !data.medidas) {
        res.status(400).json({
            ok: false,
            mensaje: "Campos o formatos incorrectos al modificar",

        });

    } else {
        db.ref("/MenuComida").child(id).update(data, async function(err) {
            if (err) {
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



//Mostrar comidas
app.post('/comidas/getcomidas', (req, res) => {

    let data = [];
    db.ref("/MenuComida").on("value", async function(snapshot) {
        if (!snapshot.val()) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        await snapshot.forEach((child) => {
                data.push({
                    nombre: child.val().nombre,
                    descripcion: child.val().descripcion,
                    calorias: child.val().calorias,
                    medidas: child.val().medidas,
                    imagen: child.val().imagen,
                    id: child.key
                });
            })
            //console.log('entro aqui');
        res.json({
            ok: true,
            comidas: data
        });

    });
});
/*-------------------------FIN DE COMIDAS-----------------------*/
/*--------------------------------CENAS-------------------------*/
app.post('/comidas/insertcenas', async(req, res) => {
    let data = req.body;
    if (!data.nombre || !data.descripcion || !data.calorias || !data.medidas) {
        res.status(400).json({
            ok: false,
            mensaje: "Campos o formatos incorrectos",

        });

    } else {
        db.ref("/MenuCena").push(data, (err) => {
            if (err) {
                console.log('Entro al error desde el principio')
                res.status(400).json({
                    ok: false,
                    err
                });
            } else {
                console.log('No entreo error aqui', data);
                res.json({
                    ok: true,
                    cena: data,
                });
            }
        });
    }

});

//Modificar  cenas 
app.put('/comidas/modifycena', function(req, res) {
    let id = req.body.id;
    let data = _.pick(req.body, ['nombre', 'descripcion', 'calorias', 'medidas', 'imagen']);
    if (!data.nombre || !data.descripcion || !data.calorias || !data.medidas) {
        res.status(400).json({
            ok: false,
            mensaje: "Campos o formatos incorrectos al modificar",

        });

    } else {
        db.ref("/MenuCena").child(id).update(data, async function(err) {
            if (err) {
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


//Mostrar cenas
app.post('/comidas/getcenas', (req, res) => {
    let data = [];
    db.ref("/MenuCena").on("value", async function(snapshot) {
        if (!snapshot.val()) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        await snapshot.forEach((child) => {
                data.push({
                    nombre: child.val().nombre,
                    descripcion: child.val().descripcion,
                    calorias: child.val().calorias,
                    medidas: child.val().medidas,
                    imagen: child.val().imagen,
                    id: child.key
                });
            })
            //console.log('entro aqui');
        res.json({
            ok: true,
            cenas: data
        });

    });
});
/*----------------------------FIN DE CENAS----------------------*/

/*---------------------------COLACIONES------------------------*/
app.post('/comidas/insertcolacion', async(req, res) => {
    let data = req.body;
    if (!data.nombre || !data.descripcion || !data.calorias || !data.medidas) {
        res.status(400).json({
            ok: false,
            mensaje: "Campos o formatos incorrectos",

        });

    } else {
        db.ref("/MenuColacion").push(data, (err) => {
            if (err) {
                console.log('Entro al error desde el principio')
                res.status(400).json({
                    ok: false,
                    err
                });
            } else {
                console.log('No entreo error aqui', data);
                res.json({
                    ok: true,
                    cena: data,
                });
            }
        });

    }

});

//Modificar  colacion
app.put('/comidas/modifycolacion', function(req, res) {
    let id = req.body.id;
    let data = _.pick(req.body, ['nombre', 'descripcion', 'calorias', 'medidas', 'imagen']);
    if (!data.nombre || !data.descripcion || !data.calorias || !data.medidas) {
        res.status(400).json({
            ok: false,
            mensaje: "Campos o formatos incorrectos al modificar",

        });

    } else {
        db.ref("/MenuColacion").child(id).update(data, async function(err) {
            if (err) {
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


//Mostrar colaciones
app.post('/comidas/getcolaciones', (req, res) => {
    let data = [];
    db.ref("/MenuColacion").on("value", async function(snapshot) {
        if (!snapshot.val()) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        await snapshot.forEach((child) => {
                data.push({
                    nombre: child.val().nombre,
                    descripcion: child.val().descripcion,
                    calorias: child.val().calorias,
                    medidas: child.val().medidas,
                    imagen: child.val().imagen,
                    id: child.key
                });
            })
            //console.log('entro aqui');
        res.json({
            ok: true,
            colaciones: data
        });

    });
});



/*-----------------------FIN DE COLACIONES--------------------*/



/*-----------------------INTRODUCIR MENU FECHA---------------*/
app.post('/comidas/insertmenufecha', async(req, res) => {
    let data = req.body;
    console.log('entro a insertar fecha');
    if (!data.fecha) {
        return res.status(400).json({
            ok: false,
            mensaje: "Inserte fecha"
        });
    }
    if (!data.cena1 || !data.cena2 || !data.cena3 || !data.comida1 || !data.desayuno2 || !data.desayuno3 || !data.comida1 || !data.comida2 || !data.comida3 || !data.colacion1 || !data.colacion2) {
        return res.status(400).json({
            ok: false,
            mensaje: "Datos incompletos"
        });
    }
    if (data.cena1.id === data.cena2.id || data.cena2.id === data.cena3.id || data.cena3.id === data.cena1.id) {
        return res.status(400).json({
            ok: false,
            mensaje: "Cena duplicada"
        });

    }
    if (data.desayuno1.id === data.desayuno2.id || data.desayuno2.id === data.desayuno3.id || data.desayuno3.id === data.desayuno1.id) {
        return res.status(400).json({
            ok: false,
            mensaje: "Desayuno duplicado"
        });

    }
    if (data.comida1.id === data.comida2.id || data.comida2.id === data.comida3.id || data.comida3.id === data.comida1.id) {
        return res.status(400).json({
            ok: false,
            mensaje: "Comida duplicada"
        });

    }

    await db.ref("/MenuHistorial").child(data.fecha).set({
        Cena: {
            comida1: {
                id: data.cena1.id,
            },
            comida2: {
                id: data.cena2.id,
            },
            comida3: {
                id: data.cena3.id,
            }

        },
        Desayuno: {
            comida1: {
                id: data.desayuno1.id,
            },
            comida2: {
                id: data.desayuno2.id,
            },
            comida3: {
                id: data.desayuno3.id,
            }

        },
        Comida: {
            comida1: {
                id: data.comida1.id,
            },
            comida2: {
                id: data.comida2.id
            },
            comida3: {
                id: data.comida3.id,
            }

        },
        Colacion: {
            comida1: {
                id: data.colacion1.id,
            },
            comida2: {
                id: data.colacion2.id,
            },

        }

    });
    res.json({
        ok: true,
        fechas: 'Fecha insertada'
    });

    console.log(data.cena1.nombre);

});


/*----------------------FINDE INTRODUCIR MENU FECHA-----------*/


//exportacion de app para poder usarla en cualquier parte del proyecto
module.exports = app;