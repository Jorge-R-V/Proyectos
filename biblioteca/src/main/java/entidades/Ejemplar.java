package entidades;

public class Ejemplar {
	private int Idejemplar;
	private String Isbn;
	private String Baja;
	
	public Ejemplar() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Ejemplar(int idejemplar, String isbn, String baja) {
		super();
		Idejemplar = idejemplar;
		Isbn = isbn;
		Baja = baja;
	}
	
	
	public int getIdejemplar() {
		return Idejemplar;
	}
	public void setIdejemplar(int idejemplar) {
		Idejemplar = idejemplar;
	}
	public String getIsbn() {
		return Isbn;
	}
	public void setIsbn(String isbn) {
		Isbn = isbn;
	}
	public String getBaja() {
		return Baja;
	}
	public void setBaja(String baja) {
		Baja = baja;
	}
	
	
	@Override
	public String toString() {
		return "Ejemplar [Idejemplar=" + Idejemplar + ", Isbn=" + Isbn + ", Baja=" + Baja + "]";
	}	
}
/*package entidades;

import java.io.Serializable;

/**
 * Mapea la tabla EJEMPLAR:
 *  - IDEJEMPLAR (PK)
 *  - ISBN (FK a LIBRO)
 *  - BAJA ('N' activo, 'S' dado de baja)
 *//*
public class Ejemplar implements Serializable {
    private static final long serialVersionUID = 1L;

    private int idejemplar;
    private String isbn;
    private String baja; // 'N' o 'S'

    public Ejemplar() {}

    public Ejemplar(int idejemplar, String isbn, String baja) {
        this.idejemplar = idejemplar;
        this.isbn = isbn;
        this.baja = baja;
    }

    public int getIdejemplar() { return idejemplar; }
    public void setIdejemplar(int idejemplar) { this.idejemplar = idejemplar; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }

    public String getBaja() { return baja; }
    public void setBaja(String baja) { this.baja = baja; }

    @Override
    public String toString() {
        return "Ejemplar{idejemplar=" + idejemplar +
               ", isbn='" + isbn + '\'' +
               ", baja='" + baja + '\'' +
               '}';
    }
}*/

