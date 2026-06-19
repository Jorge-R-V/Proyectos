package entidades;

public class Libro {
	   private int isbn;
	   private String titulo;
	   private int idautor;
	   
public Libro() {
		super();
		// TODO Auto-generated constructor stub
	}
	   
	public Libro(int isbn, String titulo, int idautor) {
		super();
		this.isbn = isbn;
		this.titulo = titulo;
		this.idautor = idautor;
	}
		
	public int getIsbn() {
		return isbn;
	}

	public void setIsbn(int isbn) {
		this.isbn = isbn;
	}

	public String getTitulo() {
		return titulo;
	}

	public void setTitulo(String titulo) {
		this.titulo = titulo;
	}

	public int getIdautor() {
		return idautor;
	}

	public void setIdautor(int idautor) {
		this.idautor = idautor;
	}


	@Override
	public String toString() {
		return "Libro [isbn=" + isbn + ", titulo=" + titulo + ", idautor=" + idautor + "]";
	}
}
