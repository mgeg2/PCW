function hacerLogin(evt) {
	//lo primero es cancelar la accion por defecto, que para el submit es recargar la pagina:
	evt.preventDefault();
	let dialogo = document.querySelector('#msjModal');
	
	let url = 'api/usuarios/login',
		xhr = new XMLHttpRequest(),
		frm = evt.currentTarget, //me da acceso al objeto que genera ese evento, asi accedo al formulario

		//formdata nos encapsula los objetos ya del formulario sin tener q hacerlo a mano
		fd = new FormData(frm);

	xhr.open('POST', url, true);
	xhr.responseType= 'json';
	xhr.onload = function() {
		let r = xhr.response;

		console.log(r); 
		if(r.RESULTADO == 'OK'){
			sessionStorage['datosUsu'] = JSON.stringify(r);
			let titulo= 'Login correcto';
			let mensaje=' Última vez que iniciaste sesión: ' + r.ULTIMO_ACCESO;
			mostrarMensajeModal(titulo,mensaje, 'ok');
          
		}
		else{
			let titulo= 'Error';
			let mensaje=' Usuario o contraseña incorrectos';
			document.getElementById('usu').focus();
			mostrarMensajeModal(titulo,mensaje, 'error');
		}
	} 

	xhr.send(fd);
	
}




