const oracledb = require('oracledb');

async function M_LB_consulta(array) {
    return new Promise(async (resolve, reject) => {
        let queriFinal
    
      switch(array.CONS){

        case 0 :
            queriFinal = `Select Usuario_Actualizacion, Nombre_Usuario, Fecha_foto, Count(*) Cantidad
From
(
-- Detalle de Actualizaciones
Select
       B.usuario_actualizacion,
       U.Nombre_Usuario,
       to_char(B.FECHA_FOTO,'DD/MM/YYYY') Fecha_Foto,
       to_char(B.FECHA_ACTUALIZACION,'DD/MM/YYYY') Fecha_Actualizacion,
       A.NUMERO_RENGLON,
       A.CODIGO_EMPLEADO,
       A.NOMBRE_EMPLEADO, 
       A.NOMBRE_PUESTO,
       upper(C.NOMBRE_GRUPO) NOMBRE_GRUPO,
       F_Pertenece(nvl(c.id_puesto,0)) Pertenece,
       b.cod_ubicacion_area,
       UPPER(d.DESCRIPCION) Ubicacion_Fisica,
       UPPER(d.DIRECCION)  Direccion_Ubicacion_Fisica
  FROM V_MRH_EMPLEADOS A,
       mrh_empleados B,
       V_RHJP_PUESTOS C,
       MRH_UBICACION_AREA_TRABAJO d,
       MOM_PUESTOS E,
       mom_empleado_puesto  f,
       Mom_puesto_Nominal   g,
       Mg_usuarios u
WHERE A.CODIGO_EMPLEADO    = B.CODIGO_EMPLEADO
  AND B.ID_PUESTO          = C.ID_PUESTO(+)
  And b.cod_ubicacion_area = d.cod_ubicacion_area(+)
  And a.codigo_empleado    = f.codigo_empleado(+)
  AND f.Codigo_Nominal = g.Codigo_Nominal(+)
  AND B.CODIGO_PUESTO_FUNCIONAL = E.CODIGO_PUESTO(+) 
  And B.USUARIO_ACTUALIZACION   = U.CODIGO_USUARIO(+)
  And b.fecha_foto >= to_date('14/10/2024','dd/mm/yyyy')  
  And b.fecha_foto Between to_date('${array.FECHA1}','dd/mm/yyyy') And to_date('${array.FECHA2}','dd/mm/yyyy')  -- Parametro
Order by Trunc(b.fecha_foto), b.usuario_actualizacion)
Group By Usuario_Actualizacion, Nombre_Usuario, Fecha_Foto`;
            break;

        case 1 :
            queriFinal = `Select

       U.Nombre_Usuario,
       to_char(B.FECHA_FOTO,'DD/MM/YYYY') Fecha_Foto,
       to_char(B.FECHA_ACTUALIZACION,'DD/MM/YYYY') Fecha_Actualizacion,
       A.NUMERO_RENGLON,
       A.CODIGO_EMPLEADO,
       A.NOMBRE_EMPLEADO,
       A.NOMBRE_PUESTO,
       upper(C.NOMBRE_GRUPO) NOMBRE_GRUPO,
       F_Pertenece(nvl(c.id_puesto,0)) Pertenece,
       b.cod_ubicacion_area,
       UPPER(d.DESCRIPCION) Ubicacion_Fisica,
       UPPER(d.DIRECCION)  Direccion_Ubicacion_Fisica
  FROM V_MRH_EMPLEADOS A,
       mrh_empleados B,
       V_RHJP_PUESTOS C,
       MRH_UBICACION_AREA_TRABAJO d,
       MOM_PUESTOS E,
       mom_empleado_puesto  f,
       Mom_puesto_Nominal   g,
       Mg_usuarios u
WHERE A.CODIGO_EMPLEADO    = B.CODIGO_EMPLEADO
  AND B.ID_PUESTO          = C.ID_PUESTO(+)
  And b.cod_ubicacion_area = d.cod_ubicacion_area(+)
  And a.codigo_empleado    = f.codigo_empleado(+)
  AND f.Codigo_Nominal = g.Codigo_Nominal(+)
  AND B.CODIGO_PUESTO_FUNCIONAL = E.CODIGO_PUESTO(+)
  And B.USUARIO_ACTUALIZACION   = U.CODIGO_USUARIO(+)
  And b.fecha_foto >= '14-OcT-2024'
  and B.usuario_actualizacion = '${array.USUARIO_ACTUALIZACION}'
 And b.fecha_foto Between to_date('${array.FECHA1}','dd/mm/yyyy') And to_date('${array.FECHA2}','dd/mm/yyyy')  -- Parametro
Order by Trunc(b.fecha_foto), b.usuario_actualizacion`;
            break;

            case 2 :
             queriFinal = ``;
             break;

        case 3 :
           queriFinal = ``;
           break;
      }
        try {
            let conn
            oracledb.outFormat = oracledb.OBJECT;
            oracledb.fetchAsString = [oracledb.CLOB];
            conn = await oracledb.getConnection('mixco');
            const result = await conn.execute(queriFinal)
            if (result.rows[0] != undefined) {
                resolve(result.rows)
            } else {
                resolve({'estado': false, 'codigo': 209})
            }
        } catch (error) {
            console.error('Model.Consultas.M_LB_consulta.Catch : ', error)
            reject(error)

        }/* finally {
            conn.close()
            try {
            } catch (error) {
                console.error('Model.Consultas.M_LB_consulta.finally.Catch : ', error)
                reject(error)
            }   }*/
    });
}
module.exports = {M_LB_consulta};