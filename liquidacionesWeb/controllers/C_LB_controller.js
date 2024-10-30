const consulta = require('../models/M_LB_consultas');
//const reporteria = require('../model/M_Reportes');
const insert = require('../models/M_LB_insert');
//const update = require('../model/M_Update');
//const estado = require('../model/M_Inactiva');
const oracledb = require('oracledb');
const moment = require('moment');
async function C_liquidaciones(req, res) {


    try {
        switch (req.params.id) {
      
            case '0':
                try {
           
                    const resolve = await insert.M_I_cargaLiqui(req.body);
                    resolve.descrip = await errores(resolve.codigo);
                    res.status(200).json(resolve);
                } catch (error) {
                    console.error(moment().format('DD/MM/YYYY HH:mm:ss') + 'Error en insert.M_I_cargaLiqui:', error);
                    res.status(500).json({ 'estado': false, 'codigo': 500, 'descrip': 'Error en inserción' });
                }
                break;
            case '1':
                try {
              
                    const resolve = await consulta.M_LB_consulta(req.body);
                    if (resolve.estado === false) {
                        resolve.descrip = await errores(resolve.codigo);
                    }
                    res.status(200).json(resolve);
                } catch (error) {
                    console.error(moment().format('DD/MM/YYYY HH:mm:ss') + 'Error en Controller.consulta.M_LB_consulta:', error);
                    res.status(500).json({ 'estado': false, 'codigo': 500, 'descrip': 'Error codigo CONS' });
                }
                break;
           
            default:
                res.status(400).json({ 'estado': false, 'codigo': 206, 'descrip': 'Error en Consulta a Oracle' });
                break;
        }
    } catch (error) {
        console.error('Controller.C_liquidaciones.catch : ', error);
        res.status(400).json({ 'estado': false, 'codigo': 206, 'descrip': 'Error en Consulta a Oracle' });
    }
}

module.exports = { C_liquidaciones };

function errores(cod){
    return new Promise(async (resolve, reject) => {
      let conn;
      var query = `SELECT DESCRIPCION FROM CATALOGO_RESPUESTAS
      WHERE CODIGO =`+cod+``
      try {
          oracledb.outFormat = oracledb.OBJECT;
          oracledb.fetchAsString = [oracledb.CLOB];
          oracledb.autoCommit = true;
          conn = await oracledb.getConnection('mixco')
          const result = await conn.execute(query);
          if(result.rows !=undefined){
  
            resolve(result.rows[0].DESCRIPCION)
          }else
          resolve({'DESCRIPCION':'ERROR DE SISTEMA'})
      } catch (error) {
        console.error(' Error en: controller.busquedaRecibos.errores.catch : ',error)
          reject(error);
      } finally {
          try {
              conn.close
          } catch (error) {
  
          }
      }
  });
  
  }