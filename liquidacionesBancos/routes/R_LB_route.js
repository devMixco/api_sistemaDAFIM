const express = require('express');
const liquidacionesBancosController = require('../controllers/liquidacionesBancosController');

let api = express.Router();

api.post('/ruta/:id',liquidacionesBancosController.C_function);




module.exports = api;