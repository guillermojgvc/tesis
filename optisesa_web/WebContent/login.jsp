<!DOCTYPE HTML>
<%@page language="java"
	contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<html lang="es">
<head>
	<meta charset="utf-8">
	<title>Optisesa</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet"
		href="//maxcdn.bootstrapcdn.com/bootswatch/3.3.0/cerulean/bootstrap.min.css"
		type="text/css">
	<link rel="stylesheet" type="text/css" href="css/login.css">
	<script src="//code.jquery.com/jquery-1.10.2.min.js"></script>
	<script
		src="//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min.js"></script>
</head>
<body style="background-position: 55px 10px, 29px 50%;">
	<!-- This is a very simple parallax effect achieved by simple CSS 3 multiple backgrounds, made by http://twitter.com/msurguy -->

	<div class="container">
		<div class="row vertical-offset-100">
			<div class="col-md-4 col-md-offset-4">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h3 class="panel-title">Acceder</h3>
					</div>
					<div class="panel-body">
						<form accept-charset="UTF-8" role="form" method="post" action="/optisesa_web/visor_optisesa/index.html">
							<fieldset>
								<div class="form-group">
									<input class="form-control" placeholder="Usuario" name="email"
										type="text">
								</div>
								
								<div class="form-group">
									<input class="form-control" placeholder="Contraseña"
										name="password" type="password" value="">
								</div>
								<!--div class="checkbox">
			    	    	<label>
			    	    		<input name="remember" type="checkbox" value="Remember Me"> Remember Me
			    	    	</label>
			    	    </div-->
								<input class="btn btn-lg btn-success btn-block" type="submit"
									value="Ingresar">
							</fieldset>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<script type="text/javascript" src="js/login.js" />
</body>
</html>