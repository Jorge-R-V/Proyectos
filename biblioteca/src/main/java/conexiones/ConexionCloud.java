//package conexiones;
//
//import java.sql.Connection;
//import java.sql.DatabaseMetaData;
//import java.sql.SQLException;
//import java.util.Properties;
//import java.util.logging.Level;
//import java.util.logging.Logger;
//
//import conexiones.Conexion;
//import oracle.jdbc.OracleConnection;
//import oracle.jdbc.pool.OracleDataSource;
//
//public class ConexionCloud {
//
//	public ConexionCloud() {
//		
//	}
//	   /* 
//	      Conexion a la base de datos de Oracle Cloud usando Wallet:
//			1. 	Descargar el Wallet(cartera de credenciales) y situarlo en un
//				directorio. En este ejemplo está en:
//				D:/OracleCloudWallets/ortprofesor
//			2.  Descomprimir el archivo Wallet.
//			
//			3. Incluir las librerias oraclepki.jar, osdt_core.jar y osdt_cert.jar
//			   en vuestro proyecto.
//			4. Hay que usar la clase oracle.jdbc.OracleConnection;
//			   oracleconnection= (OracleConnection) ods.getConnection();
//			   
//			5. Hacemos después un casting para retornar un java.sql.Connection.
//			   
//		*/
//	   public Connection getConexion() throws SQLException{
//			final String DB_URL="jdbc:oracle:thin:@x7a3n0uzzo4evuud_medium?TNS_ADMIN=C:/app/wallet";
//	    	final String DB_USER = "BIBLIOTECA";
//	    	final String DB_PASSWORD = "Bas€Dat0s0racl€";
//	        Properties info = new Properties();  
//	        
//	        Connection con=null;
//	        
//			info.put(OracleConnection.CONNECTION_PROPERTY_USER_NAME, DB_USER);
//			info.put(OracleConnection.CONNECTION_PROPERTY_PASSWORD, DB_PASSWORD);
//			info.put(OracleConnection.CONNECTION_PROPERTY_DEFAULT_ROW_PREFETCH, "20");
//
//	        OracleDataSource ods = new OracleDataSource();
//	        ods.setURL(DB_URL);    
//	        ods.setConnectionProperties(info);
//	        DatabaseMetaData dbmd;
//	        OracleConnection oracleconnection=null;
//	       try {
//	          oracleconnection= (OracleConnection) ods.getConnection();
//	          con=(java.sql.Connection)oracleconnection;
//	          dbmd=con.getMetaData();
//		      Logger logger=Logger.getLogger(Conexion.class.getName());
//	          logger.log(Level.INFO,"Versión de la base de datos: "+dbmd.getDatabaseProductVersion());
//	          
//			}catch (SQLException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//	        return con; 
//	    }			
//
//}