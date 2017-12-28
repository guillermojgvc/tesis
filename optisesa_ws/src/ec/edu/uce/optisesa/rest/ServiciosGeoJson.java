package ec.edu.uce.optisesa.rest;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.postgresql.util.Base64;

import com.exco.jdbc.Conexion;
import com.exco.jsonxml.utils.ResultSetUtil;

//Tag @Path define la url del servicio REST
//Tag @Get define el tipo de petición HTTP
//Tag @Produces define el MIME type de retorno en el servicio REST
@Path("/ws_optisesa")
public class ServiciosGeoJson {

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

	// Función para construir un vector de objetos JSON con el resultado de una
	// consulta
	private JSONArray obtenerJson(PreparedStatement p) throws Exception {
		ResultSet rs = p.executeQuery();
		return ResultSetUtil.convertToJSON(rs);
	}

	// Función para construir un vector de objetos GeoJSON con el resultado de
	// una consulta
	private JSONArray obtenerGeoJson(PreparedStatement p, int srid)
			throws Exception {
		ResultSet rs = p.executeQuery();
		return ResultSetUtil.convertToGeoJSON(rs, 0, srid);
	}

	// Función para el calculo del tiempo de respuesta, es usado para medir el
	// tiempo que tarda una solicitud en ser respondida
	private void tiempoRespuesta(long startTime, long endTime) {
		System.out.println(endTime - startTime);
	}

	// Función para retornar los objetos JSON solicitados en la petición REST,
	// en caso de existir una variable callback se retorna una variable
	// javascript. (Facilita el uso de Cross Domain en la app)
	private String hasCallback(JSONArray json, String callback) {
		if (callback != null)
			return (callback + "(" + json.toString() + ");");
		else
			return json.toString();
	}

	// Método para probar si el servicio REST esta en funcionamiento
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String sayPlainTextHello() {
		return "REST OPTISESA";
	}

	// Método para verificar el acceso a la aplicación
	// El tag @QueryParam lee las variables que provienen de la petición HTTP
	@GET
	@Path("login")
	@Produces({ "text/javascript", "application/x-json" })
	public String login(@QueryParam("user") String user,
			@QueryParam("pass") String pass,
			@QueryParam("callback") String callback) {
		JSONArray json = null;
		JSONObject jo = new JSONObject();
		long startTime = System.currentTimeMillis();
		try {
			// Realiza la conexión a la base de datos
			Connection con = obtenerDB("0").conectar();
			// Construye el query
			String query = "SELECT serial_usr,apellido_usr, nombre_usr, codigo_usr,disponible FROM usuario WHERE nombre_usr = ? AND clave_usr = md5(?)";
			// Crea la sentencia preparada
			PreparedStatement p = null;
			p = con.prepareStatement(query);
			// asigna los parámetros a la consulta
			p.setString(1, user);
			p.setString(2, pass);
			// retorna el objeto JSON
			json = obtenerJson(p);
			// cierra la conexión con la BD
			con.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		try {
			if (json.length() > 0) {
				json.getJSONObject(0).put("acceso", true);
			} else {
				jo.put("acceso", false);
				json.put(jo);
			}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		tiempoRespuesta(startTime, System.currentTimeMillis());
		return hasCallback(json, callback);
	}

	// Método para obtener el GeoJSON de la base de datos correspondiente a la
	// ruta más corta desde la ubicación actual (x1,y1) de una unidad a la
	// ubicación asignada (x2,y2).
	// El parámetro srid se debe colocar 32717 para obtener las distancias de
	// las rutas en kilómetros.
	@GET
	@Path("ruta/{x1}/{y1}/{x2}/{y2}/{srid}")
	@Produces({ "text/javascript", "application/x-json" })
	public String ruta(@PathParam("x1") Double x1, @PathParam("y1") Double y1,
			@PathParam("x2") Double x2, @PathParam("y2") Double y2,
			@PathParam("srid") Integer srid,
			@QueryParam("callback") String callback) {
		JSONArray json = null;
		long startTime = System.currentTimeMillis();
		try {
			// Realiza la conexión a la base de datos
			Connection con = obtenerDB("0").conectar();
			// Construye el query
			String query = "SELECT ST_AsGeoJSON(ST_Transform(geom,?)),name ,distance, heading, cost FROM pgr_AtoBoptimizado(?, ?, ?, ?, ?, ?)";
			PreparedStatement p = null;
			p = con.prepareStatement(query);
			p.setInt(1, srid);
			p.setString(2, "geo_ways");
			p.setDouble(3, x1);
			p.setDouble(4, y1);
			p.setDouble(5, x2);
			p.setDouble(6, y2);
			p.setInt(7, srid);
			// retorna el objeto GeoJSON
			json = obtenerGeoJson(p, srid);
			con.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		tiempoRespuesta(startTime, System.currentTimeMillis());
		return hasCallback(json, callback);
	}

	// Función que retorna el listado de unidades más cercanas al punto de
	// emergencia (x1,y1) ordenadas de mayor a menor distancia
	@GET
	@Path("unidades/{x1}/{y1}")
	@Produces({ "text/javascript", "application/x-json" })
	public String unidadesDisponibles(@PathParam("x1") Double x1,
			@PathParam("y1") Double y1, @QueryParam("callback") String callback) {
		JSONArray json = null;
		long startTime = System.currentTimeMillis();
		try {
			// Realiza la conexión a la base de datos
			Connection con = obtenerDB("0").conectar();
			// Construye el query
			String query = "select v1.gid as serial_usr,u.nombre_usr,u.codigo_usr,v1.distancia/1000 as distancia_km from optisesa_distancia_rutas(?,?) v1 left join usuario u on v1.gid=u.serial_usr order by distancia asc";
			PreparedStatement p = null;
			p = con.prepareStatement(query);
			p.setDouble(1, x1);
			p.setDouble(2, y1);
			json = obtenerJson(p);
			con.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		tiempoRespuesta(startTime, System.currentTimeMillis());
		return hasCallback(json, callback);
	}

	// Función que retorna las capas configuradas en la base de datos
	@GET
	@Path("layers/{sistema}")
	@Produces({ "text/javascript", "application/x-json" })
	public String obtenerCapas(@QueryParam("var") String var,
			@QueryParam("callback") String callback,
			@PathParam("sistema") String sistema) {
		JSONArray json = null;
		long startTime = System.currentTimeMillis();
		try {
			// Realiza la conexión a la base de datos
			Connection con = obtenerDB("0").conectar();
			// Construye el query
			String query = "SELECT cm.fromwmslayer,cms.label_ctms AS etiquetasubroot, cms.iconcls_ctms AS iconsubroot, cmn.label_ctmn AS etiquetaroot, cmn.iconcls_ctmn AS iconroot, 	cm.displayinlayersw_ctm AS displayinlayer, cmn.type_ctmn AS servicio, cms.subtype_ctms AS nodo, cm.iconcls_ctm AS icon, cm.filtrocql_ctm AS cql, 	cm.rulesld_ctm AS rule, cm.maxresolution_ctm AS maxresol, cm.minresolution_ctm AS minresol, cm.urlficha_ctm AS urlficha, cm.capabASe_ctm AS isbASelayer, 	cm.label_ctm AS nombre,	cm.url_ctm AS url, cm.layer_ctm AS layer, cm.format_ctm AS format, cm.transparent_ctm AS transparent, cm.alpha_ctm AS opacity, 	cm.visible_ctm AS visibility, cm.anio_ctm AS id, cm.idnamefields_ctm AS idnamefields, cm.idfields_ctm AS idfields FROM catalogo_mapa AS cm LEFT JOIN catalogo_mapa_nodo cmn ON cm.type_ctm = cmn.serial_ctmn LEFT JOIN catalogo_mapa_subnodo cms ON cm.subtype_ctm = cms.serial_ctms WHERE cm.mapachk_ctm=true and (cm.grupo_ctm = 0 or cm.grupo_ctm = ?) ORDER BY cmn.orden_ctmn,cms.orden_ctms,cm.orden_ctm;";
			PreparedStatement p = null;
			p = con.prepareStatement(query);
			p.setInt(1, new Integer(sistema));
			json = obtenerJson(p);
			con.close();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		tiempoRespuesta(startTime, System.currentTimeMillis());
		if (callback != null && var == null)
			return (callback + "(" + json.toString() + ");");
		else if (var != null)
			return (var + "=" + json.toString() + ";");
		else
			return json.toString();
	}

	// Función que permite la descarga de los data grid del visor en los
	// diferentes formatos geográficos
	@POST
	@Path("descarga")
	@Produces(MediaType.TEXT_PLAIN)
	public Response obtenerDescarga(@FormParam("filename") String filename,
			@FormParam("mime") String mime, @FormParam("data") String data,
			@FormParam("encoding") String encoding,
			@FormParam("assign_srs") String assign_srs,
			@FormParam("source_srs") String source_srs) {
		long startTime = System.currentTimeMillis();
		InputStream stream = new ByteArrayInputStream(Base64.decode(data));
		ResponseBuilder response = Response.ok(stream);
		response.type(mime);
		response.header("Content-Disposition", "attachment; filename=\""
				+ filename + "\"");
		tiempoRespuesta(startTime, System.currentTimeMillis());
		return response.build();
	}

}