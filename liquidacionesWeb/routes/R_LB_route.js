const express = require('express');
const liquidacionesBancosController = require('../controllers/C_LB_controller');

let api = express.Router();


const bodyParser = require('body-parser');
const validateJson = require('../middleware/validaJson'); 

api.post('/liquiWeb/:id',validateJson,liquidacionesBancosController.C_liquidaciones);




module.exports = api;