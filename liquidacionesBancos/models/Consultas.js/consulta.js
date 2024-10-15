async function M_C_function(array) {

    return new Promise(async (resolve, reject) => {
        let queriFinal
      switch(array.CONS){

        case 0 :
            queriFinal = `select tabla,accion,actual,anterior,registro,usuario_web,to_char(fec_grabacion,'DD/MM/YYYY HH:MM')FECHA_REGISTRO
            FROM POZ_log
            where tabla = 'POZ_COLONIA'
            ORDER BY FEC_GRABACION DESC`;
            break;

        case 1 :
            queriFinal = `SELECT ID_COLONIA,DESCRIPCION,ESTADO
            FROM POZ_COLONIA
            WHERE ESTADO IS NOT NULL
            ORDER BY DESCRIPCION ASC`;
            break;

            case 2 :
             queriFinal = `SELECT ID_COLONIA,DESCRIPCION,ESTADO
             FROM POZ_COLONIA
             WHERE ESTADO IS NOT NULL
             AND ID_COLONIA = ${array.ID_COLONIA}
             ORDER BY DESCRIPCION ASC`;
             break;

        case 3 :
           queriFinal = `SELECT ID_COLONIA,DESCRIPCION,ESTADO
           FROM POZ_COLONIA
           WHERE ESTADO  = 'A'
           ORDER BY DESCRIPCION ASC`;
           break;
      }
        try {
            oracledb.outFormat = oracledb.OBJECT;
            oracledb.fetchAsString = [oracledb.CLOB];
            conn = await oracledb.getConnection('mixco');
                console.log(queriFinal)
            const result = await conn.execute(queriFinal)
            if (!result.rows[0]) {
                resolve(result.rows)
            } else {
                resolve({'estado': false, 'codigo': 209})
            }
        } catch (error) {
            console.error('Model.Consultas.M_C_function.Catch : ', error)
            reject(error)

        } finally {
            conn.close()
            try {
            } catch (error) {
                console.error('Model.Consultas.M_C_function.finally.Catch : ', error)
                reject(error)
            }   }
    });
}