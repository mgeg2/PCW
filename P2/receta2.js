let i = 0;

function receta() {
    const urlParams = new URLSearchParams(window.location.search);
    const ID = urlParams.get('ID');

    //if (ID){ } else{window.location.href = "index.html";}

    if (ID){

        let url = 'api/recetas/' + ID;
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.responseType = 'json';

        xhr.onload = function () {
            let r = xhr.response;
            // console.log(r);
            if (r.RESULTADO == 'OK') {
                let html = '';
                r.FILAS.forEach(function (receta, idx) {
                    let estrellas;

                    switch (parseInt(receta.dificultad)) {
                        case 0:
                            estrellas = `<p>Baja</p>`;
                            break
                        case 1:
                            estrellas =`<p>Media</p>`;
                            break;
                        case 2:
                            estrellas = `<p>Alta</p>`;
                            break;
                        default:
                            estrellas = `<p>Opción por defecto</p>`;
                    }
                    var fechaOriginal = receta.fechaCreacion;

                    // Dividir la fecha en día, mes y año
                    var partesFecha = fechaOriginal.split('-');
                    var dia = partesFecha[2];
                    var mes = partesFecha[1];
                    var año = partesFecha[0];
                    var fechaGirada = dia + '/' + mes + '/' + año;
                    console.log(fechaGirada); // Salida: "03/20/2024"

                    html += `
                <div class="tituloyfecha">
                    <h1>${receta.nombre}</h1>
                    <p>${fechaGirada}</p>
                </div>
                <div class="inforeceta">
                    <img class="pollo2" src="./fotos/${receta.imagen}" alt="pollo">
                    <div>
                        <p>Autor: <a href="buscar.html?a=${receta.autor}">${receta.autor}</a></p>
                        <p>Raciones: ${receta.personas}</p>
                        <p>Tiempo: ${receta.tiempo}</p>
                        <p>Dificultad:
                        </p>
                        ${estrellas}
                        <div id="etiqs"></div> <!-- Llamando a la función etiquetas aquí -->
                        
                    </div>
                </div>
                <h2>Ingredientes</h2>
                <ul id="ing"></ul>
                <h2>Pasos</h2>
                <ol id="pasos"></ol>
                <h2>Imágenes</h2>
                <div id="carrusel">
                    <div id="fotos"></div>
                    <div id="botones-carrusel">
                        <button id="anterior" onclick="anterior()"> < </button>
                        <button id="siguiente" onclick="siguiente()"> > </button>
                    </div>
                </div>
                <h2>Comentarios</h2>
                <div id="dejarcomentario"></div>
                <section id="coments">
                
                </section>
                
                
                `

                });
                document.querySelector('#receta-container').innerHTML = html;

                ingredientes();
                etiquetas();
                pasos();
                fotos();
                verComentarios();
                pedirForm();
            }
        }


        xhr.send();
    }

    else{
        window.location.href = "index.html"
    }


    // Usar el nombre de la receta según sea necesario
    // Esto imprimirá el nombre de la receta en la consola
    // Aquí puedes agregar lógica adicional para cargar la receta según el nombre, etc.

}

function ingredientes() {
    const urlParams = new URLSearchParams(window.location.search);
    const ID = urlParams.get('ID');

    let url = 'api/recetas/' + ID + '/ingredientes';
    let xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        let r = xhr.response;
        // console.log(r);
        if (r.RESULTADO == 'OK') {
            let html = '';
            r.FILAS.forEach(function (ingrediente, idx) {
                html += `<li><p>${ingrediente.texto}</p></li>`;
            });
            document.querySelector('#ing').innerHTML += html;
        }
    }
    xhr.send();

}

function etiquetas() {
    const urlParams = new URLSearchParams(window.location.search);
    const ID = urlParams.get('ID');

    let url = 'api/recetas/' + ID + '/etiquetas';
    let xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        let r = xhr.response;
        console.log(r);
        if (r.RESULTADO == 'OK') {
            let html = '';
            r.FILAS.forEach(function (etiqueta, idx) {
                let nombre=encodeURIComponent(etiqueta.nombre);
                html += `<p><a href=buscar.html?e=${nombre}>${etiqueta.nombre}</a></p>`;

            });

            document.querySelector('#etiqs').innerHTML += html;
        }
    }
    xhr.send();

}

function pasos() {
    const urlParams = new URLSearchParams(window.location.search);
    const ID = urlParams.get('ID');

    let url = 'api/recetas/' + ID;
    let xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.responseType = 'json';

    xhr.onload = function () {
        let r = xhr.response;
        console.log(r);
        if (r.RESULTADO == 'OK') {
            let html = '';

            var pasos = r.FILAS[0].elaboracion.split("<br>");
    
            console.log(pasos);
            for (let i = 0; i < pasos.length; i++) {
                    html +=`<li>${pasos[i]}</li>`;    
            }
            document.querySelector('#pasos').innerHTML += html;
        }
    }
    xhr.send();
}

function fotos(){
    const urlParams = new URLSearchParams(window.location.search);
    const ID = urlParams.get('ID');

    let url = 'api/recetas/' + ID + '/fotos';
    let xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.responseType = 'json';

    xhr.onload = function () {
        let r = xhr.response;
        console.log(r);
        if (r.RESULTADO == "OK"){
            let html = '';
            let tam = r.FILAS.length - 1;

            if( i<0 ){
                i = tam;
            }
            if( i>tam ){
                i = 0;
            }

            let foto = r.FILAS[i];
         
            html += `<div><img src="fotos/${foto.archivo}" class="pollo2" alt="foto"></div>`;
            html += `<p>${foto.descripcion}</p>`;

            document.querySelector('#fotos').innerHTML = html;

        }
    }
    xhr.send();

}


function anterior(){
    i--;
    fotos();
}

function siguiente(){
    i++;
    fotos();
}

function verComentarios(){
    console.log("Llamada")
    const urlParams = new URLSearchParams(window.location.search);
    const ID = urlParams.get('ID');
    let url = 'api/recetas/' + ID +'/comentarios';
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload=function(){
        console.log("llamada onload")
        let comentarios = xhr.response;
        console.log(comentarios);
        if(comentarios.RESULTADO=='OK'){
   
            let html ='';
            comentarios.FILAS.forEach((comentario,idx)=>{
                var fecha= comentario.fechaHora.split(" ")[0];
                var mes=fecha.split("-")[1];
                switch(mes){
                    case '01':
                            mes="enero";
                            break;
                    case '02':
                            mes="febrero";
                            break;
                    case '03':
                            mes="marzo";   
                            break;
                    case '04':
                            mes="abril";   
                            break;
                    case '05':
                            mes="mayo";   
                            break;
                    case '06':
                            mes="junio";   
                            break;
                    case '07':
                            mes="julio";   
                            break;
                    case '08':
                            mes="agosto";   
                            break;
                    case '09':
                            mes="septiembre";   
                            break;
                    case '10':
                            mes="octubre";   
                            break;
                    case '11':
                            mes="noviembre";   
                            break;
                    case '12':
                             mes="diciembre";   
                             break;           
                }
                var dia=fecha.split("-")[2];
                var año=fecha.split("-")[0];
                var hora= comentario.fechaHora.split(" ")[1];
                var hora2= hora.split(":");
                var horabuena=hora2[0]+":"+hora2[1];
                fechabuena=dia+"/"+mes+"/"+año +", " +horabuena;
                html+=`
                <article>
                <div class="comentario">
                    <p>${comentario.login}</p>
                    <p>${fechabuena}</p>
                </div>
                <h5>${comentario.titulo}</h5>
                <p>${comentario.texto}</p>
                </article>
                `;

            });
            document.querySelector('#coments').innerHTML = html;
        }
    }
    xhr.send();
    // return false;
}

function pedirForm(){
    if(sessionStorage['datosUsu']){
        let url="formcomentario.html",
        xhr= new XMLHttpRequest();
        xhr.open("GET",url,true);
        xhr.onload=function(){
        let html=xhr.responseText;
        document.querySelector('#dejarcomentario').innerHTML += html;
    }
    xhr.send();
    }else{
        let html=` <p>Para dejar un comentario tienes que  <a class="registrate" href="login.html">iniciar sesión</a></p>`;
        document.querySelector('#dejarcomentario').innerHTML += html; 
    }
}

function dejarComentario(evt) {
    evt.preventDefault();
    const formulario = evt.currentTarget;
    const titulo = formulario.elements['titulo'].value;
    const texto = formulario.elements['texto'].value;

    const urlParams = new URLSearchParams(window.location.search);
    const ID = urlParams.get('ID');
    const url = 'api/recetas/'+ID+'/comentarios';

    let xhr = new XMLHttpRequest();
    let fd = new FormData(formulario);
    let usu;
    let auth;

    if(sessionStorage['datosUsu']) {
        usu = JSON.parse(sessionStorage['datosUsu']);
        auth = usu.LOGIN + ':' + usu.TOKEN;

        xhr.open('POST', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
            let r = xhr.response;
            console.log(r); 

            if (r.RESULTADO === 'OK') {
                //actualizar sin recargar
                verComentarios();
            
                //limpiar el formulario
                formulario.reset();

                let titulo= 'Comentario guardado';
                let mensaje= 'Se ha guardado el comentario correctamente';
                mostrarMensajeModal(titulo, mensaje, 'ok3');
            }
        }

        xhr.setRequestHeader('Authorization', auth);
        xhr.send(fd);
}
return false;
}

