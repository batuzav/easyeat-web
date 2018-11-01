const firebase = require("firebase");

//var serviceAccount = require("./config/easyeatapp.json");

firebase.initializeApp({
    credential: "./config/easyeatapp.json",
    databaseURL: "https://easyeatapp-4ebcd.firebaseio.com"
});

const db = firebase.database();



module.exports = {
    db
}