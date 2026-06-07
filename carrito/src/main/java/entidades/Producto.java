package entidades;

import java.math.BigDecimal;

public class Producto {
	private int id;
    private String nombre;
    private BigDecimal precio_normal;
    private BigDecimal precio_minimo;
    
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public BigDecimal getPrecio_normal() {
		return precio_normal;
	}
	public void setPrecio_normal(BigDecimal precio_normal) {
		this.precio_normal = precio_normal;
	}
	public BigDecimal getPrecio_minimo() {
		return precio_minimo;
	}
	public void setPrecio_minimo(BigDecimal precio_minimo) {
		this.precio_minimo = precio_minimo;
	}
	@Override
	public String toString() {
		return "Producto [id=" + id + ", nombre=" + nombre + ", precio_normal=" + precio_normal + ", precio_minimo="
				+ precio_minimo + "]";
	}
	public Producto(int id, String nombre, BigDecimal precio_normal, BigDecimal precio_minimo) {
		super();
		this.id = id;
		this.nombre = nombre;
		this.precio_normal = precio_normal;
		this.precio_minimo = precio_minimo;
	}
	public Producto() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    
}
