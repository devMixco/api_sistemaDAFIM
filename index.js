require('dotenv').config();
const oracledb = require('oracledb');
const config = require('config');
const colors = require('colors');
const app = require('./app');
const port = 4302
const mongoose = require('mongoose');


async function mongo() {
    try {
        await mongoose.connect(config.get('mongo.uri'), {});
        console.info('Conexión a MongoDB Exitosa'.underline.blue);
    } catch (error) {
        console.error('Error al conectar a la base de datos', error);
        process.exit(1); // Salir del proceso con error
    }
}

async function startup() {
    try {
        await oracledb.createPool(config.get('oracle'));
        console.info('Conexion a Oracle Exitosa'.underline.yellow);
       // await mongo() //CONEXION A MONGO DB 
        await server()
    } catch (err) {
        console.error('index.startup : ',err);
        process.exit(1); // Salir del proceso con error
    }
}

async function server() {
    var server = app.listen(port, () => {
        console.info(`Server Iniciado en Puerto:  ${port}`.underline.gray);
    });
}
console.info(('Ambiente : ' +config.get ('Environment')).red)
startup();