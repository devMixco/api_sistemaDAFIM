const oracledb = require('oracledb');

async function M_U_function(array) {
    return new Promise(async (resolve, reject) => {
        let conn;
        let preupdate = `select DESCRIPCION FROM POZ_RUBRO
        WHERE ID_RUBRO = ${array.ID_RUBRO}
        AND ESTADO = 'A'`

        let queriFinal = `UPDATE POZ_RUBRO
        SET DESCRIPCION = '${array.DESCRIPCION.toUpperCase()}',
        USUARIO_WEB_MODIFICA = '${array.USUARIO_WEB.toUpperCase()}'
        WHERE ESTADO = 'A'
        AND ID_RUBRO = ${array.ID_RUBRO}`
        try {
            oracledb.outFormat = oracledb.OBJECT;
            oracledb.fetchAsString = [oracledb.CLOB];
            oracledb.autoCommit = true;
            conn = await oracledb.getConnection('mixco');
            const resultPre = await conn.execute(preupdate)
    
            if(resultPre.rows[0] === undefined){
                resolve({ 'estado': false, 'codigo':234})
            }else{
     
            const result = await conn.execute(queriFinal)        
            if (result.rowsAffected === 1) {
              

                resolve({ 'estado': true, 'codigo': 112})
            } else {
                resolve({ 'estado': false, 'codigo': 231})
            }}
        } catch (error) {
            console.error('Model.Insert.M_U_function.Catch : ', error)
            reject(error)

        } finally {
            conn.close()
            try {
            } catch (error) {
                console.error('Model.M_U_function.finally.Catch : ', error)
                reject(error)
            }
        }
    });
}