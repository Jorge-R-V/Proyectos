package excepciones;

public class PrestamoException extends Exception {
	private static final long serialVersionUID = 1L;
	public PrestamoException() {
		
	}
	public PrestamoException(String message) {
		super(message);
	}
}
