function crearReceta(evt){
	evt.preventDefault();

	let url = 'api/recetas',
		xhr = new XMLHttpRequest(),
		fd = new FormData(evt.currentTarget),
		usu = JSON.parse(sessionStorage['datosUsu']),
		auth,
        lista1 = document.querySelectorAll('#ingredientes > li'),
        lista2 = document.querySelectorAll('#etiquetas > li'),
        fotos = document.querySelectorAll('.foto'),
        name = document.querySelector('#nombre').value;

    //anyadimos etiquetas
    lista2.forEach(function(li, idx){
        let texto=li.querySelector('span').textContent;
        fd.append('etiquetas[]', texto);
    });

    //anyadimos ingredientes
    lista1.forEach(function(li, idx){
        let texto = li.querySelector('span').textContent;
        fd.append('ingredientes[]', texto);
    });

    let fotosAdjuntas = false;
    //anyadimos fotos
    fotos.forEach(function (foto, idx){
        let descripcion = foto.querySelector('textarea').value;
        let archivo = foto.querySelector('input[type="file"]').files[0];
        let imagenPredet = foto.querySelector('img').getAttribute('src');
        if (archivo && imagenPredet !== 'no-imagen.png'){
            fd.append('fotos[]', archivo);
            fd.append('descripciones[]', descripcion);
            fotosAdjuntas = true; 
        }
        else{
            fotosAdjuntas = false;
        }
    });

    if (lista1.length === 0) {
        mostrarMensajeModal('Faltan ingredientes', 'Debes añadir al menos un ingrediente a la receta', 'error');
        return;
    }

    if (lista2.length === 0) {
        mostrarMensajeModal('Faltan etiquetas', 'Debes añadir al menos una etiqueta a la receta', 'error');
        return;
    }

    //mostrar mensaje y detener el form si no hay foto
    if (!fotosAdjuntas) {
        mostrarMensajeModal('Fallo con las imágenes', 'Debes adjuntar al menos una imagen de la receta y las fichas de imagen no pueden quedar vacías', 'error');
        return;
    }

	auth = usu.LOGIN + ':' + usu.TOKEN;
	xhr.open('POST', url, true);

	xhr.onload = function(){
        //console.log(xhr.responseText)
		let r = JSON.parse(xhr.responseText);
		//console.log(r); //que imprima la respuesta
		if(r.RESULTADO == 'OK'){
			//se ha realizado el registro de la receta
            mostrarMensajeModal('Receta creada',`La receta se ha creado: ${name}`,'ok');
		}
	}

	xhr.setRequestHeader('Authorization', auth);
	xhr.send( fd );
}

function anyadirIngrediente(){
    let ingrediente = document.querySelector('#ingr').value;
    let li = document.createElement('li');

    li.innerHTML = '<span>' + ingrediente + '</span> <button onclick="eliminarIngr(this);"> x </button>';

    document.querySelector('#ingredientes').appendChild(li);
    document.querySelector('#ingr').value = '';
}

function eliminarIngr(btn){
    btn.parentElement.remove();

}

function anyadirEtiqueta() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'api/etiquetas', true);
    xhr.onload = function() {
        let r = JSON.parse(xhr.responseText);

        if (r.RESULTADO == 'OK') {
            const datalist = document.querySelector('#sugerencias');
            datalist.innerHTML = '';

            r.FILAS.forEach(etiqueta => {
                const option = document.createElement('option');
                option.value = etiqueta.nombre;
                datalist.appendChild(option);
            });

            //agregar();
        }
    };

    xhr.send();
}

function agregar(){
    let etiqueta = document.querySelector('#etiq').value;
    let li = document.createElement('li');

    li.innerHTML = '<span>' + etiqueta + '</span> <button onclick="eliminarEtiq(this);"> x </button>';

    document.querySelector('#etiquetas').appendChild(li);
    document.querySelector('#etiq').value = '';
}

function eliminarEtiq(btn){
    btn.parentElement.remove();

}

function mostrarFoto(inp) {
    let fichero = inp.files[0];

    if (fichero) {
        if (fichero.size > 200000) {
            mostrarMensajeModal('Error con la imagen','El tamaño del archivo seleccionado es demasiado grande (máx. 200KB)','ok3');
            inp.value = '';
            inp.previousSibling.previousSibling.src = 'no-imagen.png';
        } else {
            inp.previousSibling.previousSibling.src = URL.createObjectURL(fichero);
        }
    }
}

function anyadirFoto(evt){
    evt.preventDefault();

    let div = document.createElement('div');
    let html;

    html = '<img src="no-imagen.png" alt="No hay foto">';
    html += '<textarea name="descripciones[]" placeholder="Descripción de la foto..." required></textarea>';
    html += '<input type="file" name="fotos[]" onchange="mostrarFoto(this);" accept="image/*">';

    html += '<div>';
    html += '<button onclick="cargarFoto(event);">Seleccionar Foto</button>';
    html += ' <button onclick="eliminarFoto(event);">Eliminar Foto</button>';
    html += '</div>';

    div.innerHTML = html;
    div.classList.add('foto'); //para anyadirlo a una clase

    document.querySelector('#fotos-subidas').appendChild(div);
}

function cargarFoto(evt){
    evt.preventDefault();

    let ficha = evt.currentTarget.parentElement.parentElement;

    ficha.querySelector('input[type="file"]').click();
}

function eliminarFoto(evt){
    evt.preventDefault();

    let ficha = evt.currentTarget.parentElement.parentElement;
    ficha.remove();
}





