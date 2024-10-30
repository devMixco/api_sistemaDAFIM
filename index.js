require('dotenv').config();
const oracledb = require('oracledb');
const config = require('config');
const colors = require('colors');
const app = require('./app');
const port = 4605;
const mongoose = require('mongoose');

console.info(('ambiente: ' + config.get('Environment')).underline.red);

async function mongo() {
    try {
        await mongoose.connect(config.get('mongo.uri'), {
         /*   useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false   */
        });
        console.info('Conexión a MongoDB Exitosa'.underline.blue);
    } catch (error) {
        console.error('Error al conectar a la base de datos MongoDB:', error);
        process.exit(1); // Salir del proceso con error
    }
}

async function oracle() {
    try {
        await oracledb.createPool(config.get('oracle'));
        console.log('Conexión a Oracle Exitosa'.underline.yellow);
    } catch (error) {
        console.error('Error al conectar a la base de datos Oracle:', error);
        process.exit(1); // Salir del proceso con error
    }
}

async function startup() {
    try {
        await oracle(); // Conexión a OracleDB
    //    await mongo(); // Conexión a MongoDB
        await server();
    } catch (err) {
        console.error('index.startup : ', err);
        process.exit(1);
    }
}

async function server() {
    var server = app.listen(port, () => {
        console.log(`Server Iniciado en Puerto: ${port}`.underline.gray);
    });
}

startup();

// Desconectar de Oracle
process.on('SIGTERM', async () => {
    console.info('SIGTERM signal received: closing HTTP server');
    server.close(async () => {
        console.info('HTTP server closed');
        try {
            await oracledb.getPool().close(10);
            console.info('Oracle pool closed');
        } catch (err) {
            console.error('Error closing Oracle pool:', err);
        }
        process.exit(0);
    });
});