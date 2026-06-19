package entidades;

import java.sql.Date;
import java.time.LocalDateTime;

public class Prestamo {
	
	private int idejemplar;
	private int idsocio;
	private Date fechaprestamo;
	private Date fechalimitedevolucion;
	private String titulo;
	private String nombresocio;
	private int diasdemora;
	
	private LocalDateTime ldfechaprestamo;
	private LocalDateTime ldfechalimitedevolucion;
	
	
	public Prestamo() {
		super();
	}

	public Prestamo(int idejemplar, int idsocio, Date fechaprestamo, Date fechalimitedevolucion, String titulo,
			String nombresocio, int diasdemora, LocalDateTime ldfechaprestamo, LocalDateTime ldfechalimitedevolucion) {
		super();
		this.idejemplar = idejemplar;
		this.idsocio = idsocio;
		this.fechaprestamo = fechaprestamo;
		this.fechalimitedevolucion = fechalimitedevolucion;
		this.titulo = titulo;
		this.nombresocio = nombresocio;
		this.diasdemora = diasdemora;
		this.ldfechaprestamo = ldfechaprestamo;
		this.ldfechalimitedevolucion = ldfechalimitedevolucion;
	}



	public int getIdejemplar() {
		return idejemplar;
	}
	public void setIdejemplar(int idejemplar) {
		this.idejemplar = idejemplar;
	}
	public int getIdsocio() {
		return idsocio;
	}
	public void setIdsocio(int idsocio) {
		this.idsocio = idsocio;
	}
	public Date getFechaprestamo() {
		return fechaprestamo;
	}
	public void setFechaprestamo(Date fechaprestamo) {
		this.fechaprestamo = fechaprestamo;
	}
	public Date getFechalimitedevolucion() {
		return fechalimitedevolucion;
	}
	public void setFechalimitedevolucion(Date fechalimitedevolucion) {
		this.fechalimitedevolucion = fechalimitedevolucion;
	}
	public int getDiasdemora() {
		return diasdemora;
	}
	public void setDiasdemora(int diasdemora) {
		this.diasdemora = diasdemora;
	}
	public String getTitulo() {
		return titulo;
	}
	public void setTitulo(String titulo) {
		this.titulo = titulo;
	}
	public String getNombresocio() {
		return nombresocio;
	}
	public void setNombresocio(String nombresocio) {
		this.nombresocio = nombresocio;
	}
	
	
	public LocalDateTime getLdfechaprestamo() {
		return ldfechaprestamo;
	}

	public void setLdfechaprestamo(LocalDateTime ldfechaprestamo) {
		this.ldfechaprestamo = ldfechaprestamo;
	}

	public LocalDateTime getLdfechalimitedevolucion() {
		return ldfechalimitedevolucion;
	}

	public void setLdfechalimitedevolucion(LocalDateTime ldfechalimitedevolucion) {
		this.ldfechalimitedevolucion = ldfechalimitedevolucion;
	}

	@Override
	public String toString() {
		return "Prestamo [idejemplar=" + idejemplar + ", idsocio=" + idsocio + ", fechaprestamo=" + fechaprestamo
				+ ", fechalimitedevolucion=" + fechalimitedevolucion + ", titulo=" + titulo + ", nombresocio="
				+ nombresocio + ", diasdemora=" + diasdemora + "]";
	}

	

}

