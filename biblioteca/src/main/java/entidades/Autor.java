package entidades;

import java.sql.Date;

/**
*
* La clase Autor establece la correspondencia con la tabla AUTOR.
*/

/**
*
* @author Carlos
*
*/
public class Autor {

   private int idautor;
   private String nombre;
   private Date fechanacimiento;
   
   

   public Autor() {
	super();
	// TODO Auto-generated constructor stub
   }
   public Autor(int idautor, String nombre, Date fechanacimiento) {
	super();
	this.idautor = idautor;
	this.nombre = nombre;
	this.fechanacimiento = fechanacimiento;
   }
   public int getIdautor() {
	return idautor;
   }
   public void setIdautor(int idautor) {
	this.idautor = idautor;
   }
   public String getNombre() {
	return nombre;
   }
   public void setNombre(String nombre) {
	this.nombre = nombre;
   }
   public Date getFechanacimiento() {
	return fechanacimiento;
   }
   public void setFechanacimiento(Date fechanacimiento) {
	this.fechanacimiento = fechanacimiento;
   }
   
   @Override
   public String toString() {
	   return "Autor [idautor=" + idautor + ", nombre=" + nombre + ", fechanacimiento=" + fechanacimiento + "]";
   }

}
