require('dotenv').config();
const oracledb = require('oracledb');
const config = require('config');
const colors = require('colors');
const app = require('./app');
const port = 4405
const mongoose = require('mongoose');


async function mongo() {
    mongoose.connect(config.get('mongo.uri'), {})
        .then(async() => console.info('Conexion a MongoDb Exitosa'.underline.blue))
        .catch(error => console.error('error al conectar a la base de datos', error)
        );
}

async function startup() {
    try {
        await oracledb.createPool(config.get('oracle'));
        console.log('Conexion a Oracle Exitosa'.underline.yellow);
 //       await mongo()
        await server()
    } catch (err) {
        console.error('index.startup : ',err);
        process.exit(1);
    }
}

async function server() {
    var server = app.listen(port, () => {
        console.log(`Server Iniciado en Puerto:  ${port}`.underline.gray);
    });
}

startup();