package dao;

import entidades.Producto; // Importa la entidad Producto
import conexiones.Conexion; // Importa la clase de conexión
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

public class DaoProducto {

    /**
     * Busca un producto por su ID en la base de datos.
     * Este método es llamado por la lógica del carrito (Controlador) cuando un usuario intenta añadir un producto.
     * * @param idProducto El identificador del producto a buscar.
     * @return El objeto Producto encontrado.
     * @throws SQLException Si ocurre un error al acceder a la base de datos.
     * @throws Exception Si el producto no se encuentra (necesario para la lógica de addElemento).
     */
    public Producto buscaproductoporid(long idProducto) throws SQLException, Exception {
        
        String sql = "SELECT ID, NOMBRE, PRECIO_NORMAL, PRECIO_MINIMO FROM PRODUCTO WHERE ID = ?";
        Producto p = null;
        
        try (Connection con = Conexion.getConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setLong(1, idProducto);
            
            try (ResultSet rs = ps.executeQuery()) {
                
                if (rs.next()) {
                    int id = rs.getInt("ID");
                    String nombre = rs.getString("NOMBRE");
                    BigDecimal precio_normal = rs.getBigDecimal("PRECIO_NORMAL");
                    BigDecimal precio_minimo = rs.getBigDecimal("PRECIO_MINIMO");
                    
                    p = new Producto(id, nombre, precio_normal, precio_minimo);
                } else {
                    // Lanza una excepción si el ID no existe, como requiere la especificación del enunciado
                    throw new Exception("El producto con ID " + idProducto + " no fue encontrado.");
                }
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
            throw e; 
        }
        
        return p;
    }

    /**
     * Obtiene todos los productos de la tabla PRODUCTO para mostrarlos en la vista inicial.
     * * @return Una lista de todos los objetos Producto.
     * @throws SQLException Si ocurre un error al acceder a la base de datos.
     */
    public List<Producto> listaProductos() throws SQLException {
        
        List<Producto> lista = new ArrayList<>();
        String sql = "SELECT ID, NOMBRE, PRECIO_NORMAL, PRECIO_MINIMO FROM PRODUCTO ORDER BY ID";
        
        // Uso de Statement en lugar de PreparedStatement porque no hay parámetros
        try (Connection con = Conexion.getConexion();
             Statement st = con.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            
            while (rs.next()) {
                int id = rs.getInt("ID");
                String nombre = rs.getString("NOMBRE");
                BigDecimal precio_normal = rs.getBigDecimal("PRECIO_NORMAL");
                BigDecimal precio_minimo = rs.getBigDecimal("PRECIO_MINIMO");
                
                Producto p = new Producto(id, nombre, precio_normal, precio_minimo);
                lista.add(p);
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
            throw e; 
        }
        
        return lista;
    }
}