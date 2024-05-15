function comprobarLogin(inp) {
    let url = 'api/usuarios/' + inp.value;
    let xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);

    xhr.onload = function () {
            let response = JSON.parse(xhr.responseText);
            if (response.DISPONIBLE == false) {
                //login no disponible, mostrar mensaje y evitar registro
                document.getElementById('mensajeLogin').innerText = "Ese usuario ya está en uso";
                inp.value = '';
                inp.focus(); 
            } else {
                document.getElementById('mensajeLogin').innerText = "";
            }
    }
    xhr.send();
}

function comprobarPassword(evt) {
    evt.preventDefault();

    let password = document.getElementById('pwd').value;
    let password2 = document.getElementById('pwd2').value;

    if (password !== password2) {
        document.getElementById('mensajeError').innerText = "Las contraseñas no coinciden";
        document.getElementById('pwd').value = "";
        document.getElementById('pwd2').value = "";
    }
    else{
    }
}


function hacerRegistro(evt) {
    evt.preventDefault();

    let url = 'api/usuarios/registro',
        xhr = new XMLHttpRequest(),
        frm = evt.currentTarget,
        fd = new FormData(frm);

    xhr.open('POST', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        let r = xhr.response;

        console.log(r);
        if (r.RESULTADO == 'OK') {
            console.log(r);
            let titulo='Registro correcto';
            let mensaje='El registro se ha efectuado correctamente';
            mostrarMensajeModal(titulo, mensaje, 'ok2');
        } else {
            console.error('Error en el registro: ', r.mensaje);
        }
    }

    xhr.send(fd);
}
