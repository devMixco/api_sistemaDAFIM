const oracledb = require('oracledb');
const moment = require('moment');
async function M_LB_consulta(array) {
    return new Promise(async (resolve, reject) => {
        console.log(array)
       // let queriFinal
    
      switch(array.CONS){

        case 0 :
            queriFinal = `select TO_CHAR(f_cierre,'DD/MM/YYYY')FECHA_CIERRE,TO_CHAR(AFILIACION)AFILIACION,decode(entidad_emisor,1,'VisaNet',2,'MasterCard')
             as Tipo_tarjeta, COUNT(*) CANTIDAD,TO_CHAR(SUM(CONSUMO))MONTO 

            from visa_carga_diaria a
            WHERE LOTE_MUNI  is null
            and a.f_cierre between to_date('${array.FECHA1}' ,'dd/mm/yyyy') and to_date('${array.FECHA2}','dd/mm/yyyy')
            GROUP BY AFILIACION,entidad_emisor,f_cierre
            ORDER BY f_cierre,AFILIACION,entidad_emisor ASC`;
            break;



            case 1 :
             queriFinal = `select a.autorizacion_visa,a.consumo,a.tarjeta,
          TO_CHAR(A.FECHA_VENTA,'dd/mm/yyyy') FECHA_VENTA,
          TO_CHAR(A.F_cierre,'dd/mm/yyyy') FECHA_CIERRE
        
          from visa_carga_diaria a,
          SMU_ENCABEZADO_PAGOS_7B b

                where a.f_cierre between to_date('${array.FECHA1}' ,'dd/mm/yyyy') and to_date('${array.FECHA2}','dd/mm/yyyy')
                and a.autorizacion_visa = b.autorizacion(+)
                 and a.tarjeta = b.notarjeta(+)
                 and a.lote_muni is null
                 and b.correlativo_fel is null
                 and a.afiliacion = 64018412`;
             break;




        case 2 :
            queriFinal = `select decode(B.ID_GRUPO,4,'REMISIONES',6,'BOLETO ORNATO',1,'AGUA Y DRENAJE',2,'IUSI') as tipo,d.id_tipo,d.descripcion,
        decode(b.estado,1,'ACTIVO',0,'ANULADO') as ESTADO,
        count(*)cantidad,TO_CHAR(sum(b.total))monto ,decode(A.entidad_emisor,1,'VisaNet',2,'MasterCard') as Tipo_tarjeta,
        decode(B.ID_ORIGEN,1,'PagosOnline',2,'EmixPOS') as Origen
        
        from visa_carga_diaria a,
        SMU_ENCABEZADO_PAGOS_7B b,
        SMU_detalle_PAGOS_7B c,
        SMU_TIPO d
        
                where a.f_cierre between to_date('${array.FECHA1}' ,'dd/mm/yyyy') and to_date('${array.FECHA2}','dd/mm/yyyy')
                and a.autorizacion_visa = b.autorizacion
                 and a.tarjeta = b.notarjeta
                 and b.ID_ORIGEN = 1
                 and b.estado = 1
                and c.id_partida not in('10289.2')
                and b.correlativo_fel = c.correlativo_fel
                and d.id_tipo = c.id_tipo

         group by B.ID_GRUPO,d.id_tipo,d.descripcion,b.estado,A.entidad_emisor,B.ID_ORIGEN
          order by tipo asc`;
            break;



        case 3 :
           queriFinal = `select decode(B.ID_GRUPO,4,'REMISIONES',6,'BOLETO ORNATO',1,'AGUA Y DRENAJE',2,'IUSI') as tipo,d.id_tipo,d.descripcion,
        decode(b.estado,1,'ACTIVO',0,'ANULADO') as ESTADO,to_char(b.correlativo_fel) recibo,c.id_partida partida_contable,b.nombre,b.codigo,
        b.autorizacion Auth_visa,b.concepto, sum(c.descM) as descuento,sum(c.interes) as interes, TO_CHAR(A.COMISION) COMISION,
        TO_CHAR(A.LIQUIDO) LIQUIDO,b.total MONTO_RECIBO,A.CONSUMO MONTO_LIQUIDA,sum(c.MONTO) as MONTO_DETALLE,b.notarjeta,decode(A.entidad_emisor,1,'VisaNet',2,'MasterCard') as Tipo_tarjeta,
        decode(B.ID_ORIGEN,1,'PagosOnline',2,'EmixPOS') as Origen,TO_CHAR(A.FECHA_VENTA,'dd/mm/yyyy') FECHA_VENTA,a.lote
        
        from visa_carga_diaria a,
        SMU_ENCABEZADO_PAGOS_7B b,
        SMU_detalle_PAGOS_7B c,
        SMU_TIPO d
        
                where a.f_cierre between to_date('${array.FECHA1}' ,'dd/mm/yyyy') and to_date('${array.FECHA2}','dd/mm/yyyy')
                and a.autorizacion_visa = b.autorizacion
                 and a.tarjeta = b.notarjeta
                 and b.ID_ORIGEN = 1
                 and b.estado = 1
                 and b.estado_liquidado is null
                and c.id_partida not in('10289.2')
                and b.correlativo_fel = c.correlativo_fel
                and d.id_tipo = c.id_tipo


         group by b.correlativo_fel,b.codigo,b.nombre,b.estado,b.autorizacion,b.concepto,A.COMISION,
          A.LIQUIDO,b.total,b.notarjeta,B.ID_GRUPO,A.entidad_emisor,B.ID_ORIGEN,a.fecha_venta,a.lote,
          c.id_partida,d.descripcion,d.id_tipo,A.CONSUMO
          
          order by tipo,partida_contable,recibo asc`;
           break;

           case 4 :
            let fec  

if(array.FECHA == null){
fec =' > TRUNC(SYSDATE)-2'
}else{
    fec =` = to_date('${array.FECHA}','dd/mm/yyyy')`
}

           queriFinal = `select to_char(fec_transaccion,'dd/mm/yyyy') fecha_transaccion ,tipo ,decode(tipo,1,'AGUA',2,'IUSI',4,'REMISIONES',6,'BOLETO')tipo_pago,
           estado_transaccion ESTADO,count(descripcion) CANTIDAD
from LOG_TRANSACCIONES_PAGOS_WEB 
WHERE FEC_TRANSACCION ${fec}
AND AMBIENTE = 'api.cybersource.com'
group by fec_transaccion,tipo,trunc(fec_transaccion),estado_transaccion
ORDER BY fec_transaccion DESC,TIPO asc,estado_transaccion ASC`;
           break;

           case 5 :
           queriFinal = `select  to_char(fec_grabacion,'HH24:MI:SS') hora,decode(id_origen,1,'WEB',5,'APP')ORIGEN,codigo,monto,
           estado_transaccion ESTADO,decode(tipo,1,'AGUA',2,'IUSI',4,'REMISIONES',6,'BOLETO')tipo_pago,
           to_char(fec_transaccion,'dd/mm/yyyy') FECHA_TRANSACCION,DESCRIPCION
from LOG_TRANSACCIONES_PAGOS_WEB 
WHERE  AMBIENTE = 'api.cybersource.com'
and trunc(fec_transaccion) = to_date('${array.FECHA_1}','dd/mm/yyyy')
and tipo = ${array.TIPO}
and estado_transaccion = '${array.ESTADO}'
ORDER BY fec_grabacion DESC,TIPO asc,estado_transaccion ASC`;
           break;

           case 6 :
            queriFinal = `select to_char(fec_grabacion, 'dd/mm/yyyy hh24:mi:ss') fecha_grabacion,decode(tipo,1,'AGUA',2,'IUSI',4,'REMISIONES',6,'BOLETO')tipo,
            codigo,decode(id_origen,1,'WEB',5,'APP')ORIGEN,estado_transaccion ESTADO,descripcion,correo,tarjeta,autorizacion,MONTO
from LOG_TRANSACCIONES_PAGOS_WEB 
where trunc(fec_transaccion) = trunc(sysdate)
and AMBIENTE = 'api.cybersource.com'
--and codigo is not null
ORDER BY fec_grabacion desc`;
            break;
      }
        try {
       
            oracledb.outFormat = oracledb.OBJECT;
            oracledb.fetchAsString = [oracledb.CLOB];
            console.log(array)
            conn = await oracledb.getConnection('mixco');
            console.log(queriFinal)

            const result = await conn.execute(queriFinal)
           // console.log(array, result.rows)
            if (result.rows[0] != undefined) {
                resolve(result.rows)
            } else {
                resolve({'estado': false, 'codigo': 209})
            }
        } catch (error) {
            console.error(moment().format('DD/MM/YYYY HH:mm:ss') + 'Model.Consultas.M_LB_consulta.Catch : ', error)
            reject(error)

        } finally {
            conn.close()
            try {
            } catch (error) {
                console.error(moment().format('DD/MM/YYYY HH:mm:ss') + 'Model.Consultas.M_LB_consulta.finally.Catch : ', error)
                reject(error)
            }   }
    });
}
module.exports = {M_LB_consulta};