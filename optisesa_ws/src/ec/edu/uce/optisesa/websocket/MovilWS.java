package ec.edu.uce.optisesa.websocket;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.websocket.CloseReason;
import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.json.JSONException;
import org.json.JSONObject;

import com.exco.jdbc.Conexion;

//Tag @ServerEndpoint define a esta clase para el manejo de la aplicación (mensajes)
@ServerEndpoint("/wss_optisesa")
public class MovilWS {
	// Propiedades para la conexión con la base de datos
	String driver;
	String connectString;
	String database;
	String user;
	String password;
	String port;
	String url;
	String schema;

	// función para realizar la conexión con la base de datos
	private Conexion obtenerDB(String dbNumber) {
		try {
			// Accesa a las variables de entorno configuradas en el archivo
			// web.xml
			Context env = (Context) new InitialContext()
					.lookup("java:comp/env");
			// asigna las propiedades para conexión con la base de datos
			this.driver = (String) (env.lookup("rest.dbdriver" + dbNumber));
			this.connectString = (String) (env.lookup("rest.connectstring"
					+ dbNumber));
			this.database = (String) (env.lookup("rest.database" + dbNumber));
			this.user = (String) (env.lookup("rest.dbuser" + dbNumber));
			this.password = (String) (env.lookup("rest.dbpass" + dbNumber));
			this.port = (String) (env.lookup("rest.dbport" + dbNumber));
			this.url = (String) (env.lookup("rest.dburl" + dbNumber));
			this.schema = (String) (env.lookup("rest.dbschema" + dbNumber));
		} catch (NamingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// establece la conexión con la base de datos
		Conexion conexion = new Conexion(driver, connectString + url + ":"
				+ port + "/" + database, user, password);
		// la función retorna la conexión con la base de datos
		return conexion;
	}

	private static Set<Session> peers = Collections
			.synchronizedSet(new HashSet<Session>());

	// Función para el manejo de difusión de mensajes según el criterio de
	// consulta de la aplicación
	@OnMessage
	public void broadcast(String message, Session session) throws IOException {
		// System.out.println("broadcast: " + message);
		try {
			JSONObject jsonObject = new JSONObject(message);
			switch (jsonObject.getString("accion")) {
			case "conexion":
				// ejecución de la acción ejecución al conectar
				eventoConexion(new JSONObject(jsonObject.getString("usuario")),
						true, session.getId());
				break;
			case "tracking":
				// ejecución del evento tracking, actualiza la posición actual
				// del dispositivo en la BD
				eventoTracking(
						new JSONObject(jsonObject.getString("posicion")),
						new JSONObject(jsonObject.getString("usuario")));
				break;
			case "asignar":
				// ejecuta la asignación de ruta para un dispositivo específico
				eventoAsignarRuta(jsonObject.getLong("usuarioId"),
						new JSONObject(jsonObject), message);
				break;

			default:
				break;
			}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	// Función para actualizar los dispositivos conectados y asignando el id de
	// sesión para el envío de mensajes personalizados
	public void eventoConexion(JSONObject jsonObject, boolean conexion,
			String sessionId) {
		try {
			Connection con = obtenerDB("0").conectar();
			String query = "UPDATE USUARIO SET DISPONIBLE = ?, WS_SESSION = ? WHERE serial_usr = ?";
			PreparedStatement p = null;
			p = con.prepareStatement(query);
			p.setBoolean(1, conexion);
			p.setString(2, sessionId);
			p.setLong(3, jsonObject.getLong("serial_usr"));
			p.executeUpdate();
			con.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	// Función para actualizar los dispositivos al perder la conexión con el
	// websocket
	public void eventoDesconexion(String sessionId) {
		try {
			Connection con = obtenerDB("0").conectar();
			String query = "UPDATE USUARIO SET DISPONIBLE = FALSE, WS_SESSION = NULL WHERE WS_SESSION = ?";
			PreparedStatement p = null;
			p = con.prepareStatement(query);
			p.setString(1, sessionId);
			p.executeUpdate();
			con.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void eventoTracking(JSONObject posicion, JSONObject usuario) {
		try {
			Connection con = obtenerDB("0").conectar();
			String query = "INSERT INTO GEO_RASTREO (serial_usr,longitud_x, latitud_y, time, geom, precision) values "
					+ "(?,?,?,to_timestamp(?/1000),ST_SetSRID(ST_MakePoint(?, ?),4326),?);";
			PreparedStatement p = null;
			p = con.prepareStatement(query);
			p.setLong(1, usuario.getLong("serial_usr"));
			p.setString(2, posicion.getString("longitud"));
			p.setString(3, posicion.getString("latitud"));
			p.setLong(4, posicion.getLong("timestamp"));
			p.setDouble(5, posicion.getDouble("longitud"));
			p.setDouble(6, posicion.getDouble("latitud"));
			p.setDouble(7, posicion.getDouble("precision"));
			p.execute();
			con.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	//Función para el evento de asignación de ruta a un usuario especificado
	public void eventoAsignarRuta(Long usuarioId, JSONObject jsonObject,
			String mensaje) {
		try {
			Connection con = obtenerDB("0").conectar();
			String query = "Select ws_session from Usuario where serial_usr=?";
			PreparedStatement p = null;
			p = con.prepareStatement(query);
			p.setLong(1, usuarioId);
			ResultSet rs = p.executeQuery();
			while (rs.next()) {
				enviarMensaje(rs.getString("ws_session"), mensaje);
			}
			con.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	// Función para el envio del mensaje al dispositivo especifico por su id
	public void enviarMensaje(String id, String mensaje) throws IOException,
			EncodeException {
		for (Session peer : peers) {
			if (String.valueOf(peer.getId()).equals(id)) {
				peer.getBasicRemote().sendObject(mensaje);
			}

		}
	}

	// Función para almacenar el websocket conectado
	@OnOpen
	public void myOnOpen(Session peer) {
		System.out.println("WebSocket opened: " + peer.getId());
		peers.add(peer);
	}

	// Función para almacenar el websocket conectado
	@OnClose
	public void myOnClose(CloseReason reason, Session peer) {
		System.out.println("Closing a WebSocket due to "
				+ reason.getReasonPhrase());
		eventoDesconexion(peer.getId());
		peers.remove(peer);

	}
}