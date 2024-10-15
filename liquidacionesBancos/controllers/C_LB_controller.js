const consulta = require('../model/M_Consultas')
const reporteria = require('../model/M_Reportes')
const insert = require('../model/M_Insert')
const update = require('../model/M_Update')
const estado = require('../model/M_Inactiva')
const oracledb = require('oracledb');


async function C_function(req, res) {
    try {
        switch (req.params.id) {
            case '0':
                insert.M_I_poz_rubro(req.body).then(async resolve => {
                    resolve.descrip = await errores(resolve.codigo);
                    res.status(200).json(resolve);
                });
                break;
            case '1':
                consulta.M_C_poz_rubro(req.body).then(async resolve => {
                    if (resolve.estado === false) {
                        resolve.descrip = await errores(resolve.codigo);
                    }
                    res.status(200).json(resolve);
                });
                break;
            case '2':
                update.M_U_poz_rubro(req.body).then(async resolve => {
                    resolve.descrip = await errores(resolve.codigo);
                    res.status(200).json(resolve);
                });
                break;
            case '3':
                estado.M_E_poz_rubro(req.body).then(async resolve => {
                    resolve.descrip = await errores(resolve.codigo);
                    res.status(200).json(resolve);
                });
                break;
            default:
                res.status(400).json({ 'estado': false, 'codigo': 206, 'descrip': 'Error en Consulta a Oracle' });
                break;
        }
} catch (error) {
        console.error('Controller.C_function.catch : ', error)
        res.status(400).json({ 'estado': false, 'codigo': 206, 'descrip': 'Error en Consulta a Oracle' })
    }
}



module.exports = {C_function}

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