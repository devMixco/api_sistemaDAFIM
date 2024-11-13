const express = require('express');
const trasladorutaController = require('../controllers/C_TR_controller');

let api = express.Router();


const bodyParser = require('body-parser');
const validateJson = require('../middleware/validaJson'); 

api.post('/traslaWeb/:id',validateJson,trasladorutaController.C_traslado);




module.exports = api;