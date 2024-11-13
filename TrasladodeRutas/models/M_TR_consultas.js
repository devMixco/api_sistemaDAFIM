const oracledb = require('oracledb');

async function M_TR_consulta(array) {
    console.log(array)
    return new Promise(async (resolve, reject) => {
        let queriFinal
        let conn
      switch(array.CONS){

        case 0 :
            queriFinal = `Select 
            decode(estado_traslado,null,'No Trasladado','S','Trasladado') estado_traslado, numero_caja, fecha, recibo, forma, serie, pago, pago, nombre, concepto, concepto3, cheque, importe
            From mcj_pagos_fha
            Where codigo_ruta = ${array.RUTA}   
            And Fecha = to_date('${array.FECHA1}','dd/mm/yyyy')`;
            break;

        case 1 :
            queriFinal = `update 
            MCJ_PAGOS_FHA
            set estado_traslado = null
            WHERE CODIGO_RUTA = ${array.RUTA}  
            AND FECHA = to_date('${array.FECHA1}','dd/mm/yyyy')
            And estado_trasladado = 'S'`;
            break;

        case 2 :
            queriFinal = `update 
            MCJ_PAGOS_FHA
            set estado_traslado = 'S'
            WHERE CODIGO_RUTA = ${array.RUTA}   
            AND FECHA = to_date('${array.FECHA1}','dd/mm/yyyy') 
            And estado_trasladado = null`;
             break;

        case 3 :
           queriFinal = ``;
           break;
      }

        try {
            
            oracledb.outFormat = oracledb.OBJECT;
            oracledb.fetchAsString = [oracledb.CLOB];
            conn = await oracledb.getConnection('mixco');
            console.log(queriFinal)
            const result = await conn.execute(queriFinal)
            console.log(result.rows[0])
            if (result.rows[0] != undefined) {
                resolve(result.rows)
            } else {
                resolve({'estado': false, 'codigo': 209})
            }
        } catch (error) {
            console.error('Model.Consultas.M_TR_consulta.Catch : ', error)
            reject(error)

        } finally {
            conn.close()
            try {
            } catch (error) {
                console.error('Model.Consultas.M_TR_consulta.finally.Catch : ', error)
                reject(error)
            }   }
    });
}
module.exports = {M_TR_consulta};
