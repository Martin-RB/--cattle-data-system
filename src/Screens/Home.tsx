<!DOCTYPE html>
<html>
<head>
	<title>Index</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">

	<link rel="stylesheet" type="text/css" href="estilos.css">
	    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

</head>
<body>

	<!-- Nav -->
	<div class="navbar-fixed">
        <nav>
            <div class="nav-wrapper deep-purple darken-2">
                <!-- Logo -->
                <a href="#"><img src="logo.png" class="brand-logo" width="25%" height="100%"></a>

                <!-- Ícone para abrir no Mobile -->
                <a href="#" data-target="mobile-navbar" class="sidenav-trigger">
                    <i class="material-icons">menu</i>
                </a>

                <ul id="navbar-items" class="right hide-on-med-and-down">
                    <li>
                        <a class="dropdown-trigger" data-target="dropdown-menu" href="#">
                            5 Tareas<i class="material-icons right">arrow_drop_down</i>
                        </a>
                    </li>
                    <li><a href="#">
                    	<i class="material-icons right">power_settings_new</i></a>
                    </li>
                </ul>

                <!-- Dropdown -->
                <ul id="dropdown-menu" class="dropdown-content">
                    <li><a href="#">Tarea 1</a></li>
                    <li><a href="#">Tarea 2</a></li>
                    <li><a href="#">Tarea 3</a></li> 
                </ul>
            </div>
        </nav>
    </div>
    <!-- Fin Nav -->

    <!-- Menu Mobile -->
    <ul id="mobile-navbar" class="sidenav">
        <li><a href="#">Tarea 1</a></li>
        <li><a href="#">Tarea 2</a></li>
        <li><a href="#">Tarea 3</a></li> 
        <li><a href="#">
         	<i class="material-icons right">power_settings_new</i></a>
        </li>
    </ul>
    <!--Fin Menu Mobile -->

    <div class="columnas-menu-info">
    	<!--Columna menu -->
    	<div>
    		<ul>
    			<li>Albán Aguilar Campos</li>
    			<li id="email">albanaguilar1@gmail.com</li>
    			<li>Inicio</li>
    			<li>Registro de Jaulas</li>
    			<li>Trabajar Cabezas</li>
    			<li>Alimentar Corrales</li>
    			<li id="administración">Administracion</li>
    			<ul>
    				<li>BLALALALALALALLALA</li>
    				<li>BLALALALALALALLALA</li>
    				<li>BLALALALALALALLALA</li>
    				<li>BLALALALALALALLALA</li>
    			</ul>
    		</ul>
    	</div>
    	<!--FIN Columna menu -->
    	<!-- Lote-cabeza-busqueda-->
    	<div>
    		<!-- Search bar-->
    		<nav>
			    <div class="nav-wrapper">
			      	<form>
			        	<div class="input-field">
			          		<input id="search" type="search" required>
			          		<label class="label-icon" for="search"><i class="material-icons">search </i></label>
			          		<i class="material-icons">close</i>
			        	</div>
			      	</form>
			    </div>
			</nav>
			<!-- Fin Search bar-->

			<!-- Lote-->
			<div>
				<div>
					<h3>Lote AS32</h3>
					<i class="material-icons">open_in_full</i>
					<i class="material-icons">open_in_full</i>
				</div>
			</div>
			<!-- Lote-->


    	</div>
    	<!-- Fin Lote-cabeza-busqueda-->
    </div>





    <!-- MARTIN ESTOS SON LOS SCRIPTS PARA CONVERTIR
        LA NAV A SIDENAV EN MOVIL



    // Navbar
const elemsDropdown = document.querySelectorAll(".dropdown-trigger");
const instancesDropdown = M.Dropdown.init(elemsDropdown, {
    coverTrigger: false
});
const elemsSidenav = document.querySelectorAll(".sidenav");
const instancesSidenav = M.Sidenav.init(elemsSidenav, {
    edge: "left"
});
-->













	<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
	<script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
	<script type="text/javascript" src="script.js"></script>
</body>
</html>