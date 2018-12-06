const admin = require('firebase-admin');
var storage = require('@google-cloud/storage');

var serviceAccount = require('../config/easyeatapp.json');


var firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://easyeatapp-4ebcd.firebaseio.com',

})

var gcs = new storage({
    projectId: 'easyeatapp-4ebcd',

});

const db = firebaseAdmin.database();

gcs.createBucket('nuevo', function(err, bucket) {
    if (!err) {
        // "my-new-bucket" was successfully created.
    }
});


module.exports = {
    db,
    gcs
}