async function M_I_function(array) {

    return new Promise(async (resolve, reject) => {
        let conn;
  
        let moviDetalle = `query insert`
        try {
            oracledb.outFormat = oracledb.OBJECT;
            oracledb.fetchAsString = [oracledb.CLOB];
            oracledb.autoCommit = true;
            conn = await oracledb.getConnection('mixco');
                console.log(moviDetalle)
            const resultPre = await conn.execute(moviDetalle)
            if(resultPre.rowsAffected != 1){
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