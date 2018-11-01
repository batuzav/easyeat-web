//constantes para las funciones de express
const express = require('express')
const app = express();
const { db } = require("../config/firebase");
const _ = require('underscore');


//PRUEBA


//Ingresar nuevo desayuno 
app.post('/comidas/insertdesayunos', async(req, res) => {
    let data = req.body;
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



});
//Modificar  desayuno 
app.put('/comidas/modifydesayunos', function(req, res) {
    let id = req.body.id;
    let data = _.pick(req.body, ['nombre', 'descripcion', 'calorias', 'medidas']);
    db.ref("/MenuDesayuno").child(id).update(data, async function(err) {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
                Mensaje: "Error con la base de datos"
            });
        } else {
            /* db.ref("comidas/desayunos").once("value", async function(snapshot) {
                 if (!snapshot.val()) {
                     return res.status(400).json({
                         ok: false,
                         err,
                         Mensaje: "usuario no encontrado"
                     });
                 }*/
            res.json({
                ok: true,

            });
        }
    });
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
                id: child.key
            });
        })
        console.log('entro aqui');
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
                desayuno: data,
            });
        }
    });
});

//Modificar  comida 
app.put('/comidas/modifycomida', function(req, res) {
    let id = req.body.id;
    let data = _.pick(req.body, ['nombre', 'descripcion', 'calorias', 'medidas']);
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
});

//Modificar  cenas 
app.put('/comidas/modifycena', function(req, res) {
    let id = req.body.id;
    let data = _.pick(req.body, ['nombre', 'descripcion', 'calorias', 'medidas']);
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
});

//Modificar  colacion
app.put('/comidas/modifycolacion', function(req, res) {
    let id = req.body.id;
    let data = _.pick(req.body, ['nombre', 'descripcion', 'calorias', 'medidas']);
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
    /*  await db.ref("/MenuHistorial").on("value", async function(snapshot) {
          if (!snapshot.val()) {
              return res.status(400).json({
                  ok: false,
                  err
              });
          }
          console.log(data.fecha);
          await snapshot.forEach((child) => {
              console.log(child.key);
              if (data.fecha === child.key) {
                  console.log(data.fecha, 'Es la misma que la base de dato');
                  return res.status(400).json({
                      ok: false,
                      err: 'Fecha modificada'
                  });
              }
          });
      });*/
    await db.ref("/MenuHistorial").child(data.fecha).set({
        Cena: {
            comida1: {
                calorias: data.cena1.calorias,
                medidas: data.cena1.medidas,
                nombre: data.cena1.nombre,
                descripcion: data.cena1.descripcion,

            },
            comida2: {
                calorias: data.cena2.calorias,
                medidas: data.cena2.medidas,
                nombre: data.cena2.nombre,
                descripcion: data.cena2.descripcion,

            },
            comida3: {
                calorias: data.cena3.calorias,
                medidas: data.cena3.medidas,
                nombre: data.cena3.nombre,
                descripcion: data.cena3.descripcion,

            }

        },
        Desayuno: {
            comida1: {
                calorias: data.desayuno1.calorias,
                medidas: data.desayuno1.medidas,
                nombre: data.desayuno1.nombre,
                descripcion: data.desayuno1.descripcion,

            },
            comida2: {
                calorias: data.desayuno2.calorias,
                medidas: data.desayuno2.medidas,
                nombre: data.desayuno2.nombre,
                descripcion: data.desayuno2.descripcion,

            },
            comida3: {
                calorias: data.desayuno3.calorias,
                medidas: data.desayuno3.medidas,
                nombre: data.desayuno3.nombre,
                descripcion: data.desayuno3.descripcion,

            }

        },
        Comida: {
            comida1: {
                calorias: data.comida1.calorias,
                medidas: data.comida1.medidas,
                nombre: data.comida1.nombre,
                descripcion: data.comida1.descripcion,

            },
            comida2: {
                calorias: data.comida2.calorias,
                medidas: data.comida2.medidas,
                nombre: data.comida2.nombre,
                descripcion: data.comida2.descripcion,

            },
            comida3: {
                calorias: data.comida3.calorias,
                medidas: data.comida3.medidas,
                nombre: data.comida3.nombre,
                descripcion: data.comida3.descripcion,

            }

        },
        Colacion: {
            comida1: {
                calorias: data.colacion1.calorias,
                medidas: data.colacion1.medidas,
                nombre: data.colacion1.nombre,
                descripcion: data.colacion1.descripcion,

            },
            comida2: {
                calorias: data.colacion2.calorias,
                medidas: data.colacion2.medidas,
                nombre: data.colacion2.nombre,
                descripcion: data.colacion2.descripcion,

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