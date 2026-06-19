package entidades;

import java.sql.Date;

public class Devolucion {
	private int Idejemplar;
	private int Idsocio;
	private Date Fechaprestamo;
	private Date Fechadevolucion;
	
	
	public Devolucion() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Devolucion(int idejemplar, int idsocio, Date fechaprestamo, Date fechadevolucion) {
		super();
		this.Idejemplar = idejemplar;
		this.Idsocio = idsocio;
		this.Fechaprestamo = fechaprestamo;
		this.Fechadevolucion = fechadevolucion;
	}
	
	
	public int getIdejemplar() {
		return Idejemplar;
	}
	public void setIdejemplar(int idejemplar) {
		Idejemplar = idejemplar;
	}
	public int getIdsocio() {
		return Idsocio;
	}
	public void setIdsocio(int idsocio) {
		Idsocio = idsocio;
	}
	public Date getFechaprestamo() {
		return Fechaprestamo;
	}
	public void setFechaprestamo(Date fechaprestamo) {
		Fechaprestamo = fechaprestamo;
	}
	public Date getFechadevolucion() {
		return Fechadevolucion;
	}
	public void setFechadevolucion(Date fechadevolucion) {
		Fechadevolucion = fechadevolucion;
	}
	
	
	@Override
	public String toString() {
		return "Devolucion [Idejemplar=" + Idejemplar + ", Idsocio=" + Idsocio + ", Fechaprestamo=" + Fechaprestamo
				+ ", Fechalimitedevolucion=" + Fechadevolucion + "]";
	}
	
}
