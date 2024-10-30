
const oracledb = require('oracledb');

async function M_I_cargaLiqui(array) {

    return new Promise(async (resolve, reject) => {
        let conn;
      let queyInsert = `insert into visa_carga_diaria (AFILIACION,F_CIERRE,TERMINAL,LOTE,FECHA_VENTA,HORA,COD_AUTORIZACION,CONSUMO,COMISION,IVA,LIQUIDO,TARJETA,ENTIDAD_EMISOR)
VALUES('64409013','31/12/2024','241871','000157','31/12/2024' ,'01/01/1970','831000',271.37,3.12,0,267.87,'543955######3950',2)

insert into visa_carga_diaria (AFILIACION,F_CIERRE,TERMINAL,LOTE,FECHA_VENTA,HORA,COD_AUTORIZACION,CONSUMO,COMISION,IVA,LIQUIDO,TARJETA,ENTIDAD_EMISOR)
VALUES('64409013','31/12/2024','241871','000157','31/12/2024' ,'01/01/1970','831000',271.37,3.12,0,267.87,'543955######3950',2)

insert into visa_carga_diaria (AFILIACION,F_CIERRE,TERMINAL,LOTE,FECHA_VENTA,HORA,COD_AUTORIZACION,CONSUMO,COMISION,IVA,LIQUIDO,TARJETA,ENTIDAD_EMISOR)
VALUES('64409013','31/12/2024','241871','000157','31/12/2024' ,'01/01/1970','831000',271.37,3.12,0,267.87,'543955######3950',2)`
        try {
            oracledb.outFormat = oracledb.OBJECT;
            oracledb.fetchAsString = [oracledb.CLOB];
            oracledb.autoCommit = true;
            conn = await oracledb.getConnection('mixco');
                console.log(moviDetalle)
            const resultPre = await conn.executeMany(queyInsert)
            if(resultPre.rowsAffected === array.length){
                resolve({ 'estado': false, 'codigo': 230})
            }else{
                resolve({ 'estado': true, 'codigo': 111})
            }
        } catch (error) {
            console.error('Model.Insert.M_I_function.Catch : ', error)
            resolve({ 'estado': false, 'codigo': 230})
        } finally {
            conn.close()
            try {
            } catch (error) {
                console.error('Model.M_I_function.finally.Catch : ', error)
                reject(error)
            }
        }
    });
}
module.exports = {M_I_cargaLiqui};