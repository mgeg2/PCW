let incremento = 6;

function aumentaRecetas() {
    incremento += 6;
    buscarRecetas();
}


function buscarRecetas() {
    // Comprobar si hay parámetros en la URL
    const params = new URLSearchParams(window.location.search);
    const urlAutor = params.get('a');
    const urlEtiqueta = params.get('e');
    const urlTexto=params.get('t');
    const urlDificultad=params.get('d');
    const urlIngredientes=params.get('i');
    history.replaceState({},document.title,window.location.pathname);
    console.log(urlAutor);
    console.log(urlDificultad);

    // Utilizar los parámetros de la URL si están presentes
    if (urlAutor) {
        document.getElementById('autor').value = urlAutor;
    }
    if (urlEtiqueta ) {
        document.getElementById('etiqueta').value = urlEtiqueta;
    }
    if (urlTexto) {
        document.getElementById('nombre').value = urlTexto;
    }
    if(urlDificultad){
        document.getElementById('dificultad').value = urlDificultad;
    }
    if(urlIngredientes){
        document.getElementById('ingredientes').value = urlIngredientes;
    }

    // Construir la URL de la solicitud con los parámetros de búsqueda
    let url = 'api/recetas';
    if (urlAutor) {
        if(url!=='api/recetas'){
            url+='&';
        }else{
            url+='?';
        }
        url += `a=${encodeURIComponent(urlAutor)}`;
    } 
    if (urlEtiqueta) {
        if(url!=='api/recetas'){
            url+='&';
        }else{
            url+='?';
        }
        url += `e=${encodeURIComponent(urlEtiqueta)}`;
    }
    if(urlTexto){
        if(url!=='api/recetas'){
            url+='&';
        }else{
            url+='?';
        }
        url += `t=${encodeURIComponent(urlTexto)}`;
    }
    if(urlDificultad){
        let dificultad
        switch(urlDificultad){
            case "baja":
                dificultad=0;
                break;
            case "media":
                dificultad=1;
            break;
            case "alta":
                dificultad=2;
                break;
            default:
                console.log("no dificultad")

        }
        
        if(url!=='api/recetas'){
            url+='&';
        }else{
            url+='?';
        }
        url += `d=${dificultad}`;
        
    }
    if(urlIngredientes){
        if(url!=='api/recetas'){
            url+='&';
        }else{
            url+='?';
        }
        url += `i=${encodeURIComponent(urlIngredientes)}`;
    }
    console.log(url);
    url += `&reg=0&cant=`+incremento;

    // Realizar la solicitud al servidor
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        let r = xhr.response;
        console.log(r);
        if (r.RESULTADO == 'OK') {
            let html = '';
            let total = r.TOTAL_COINCIDENCIAS;
            r.FILAS.forEach(function(e, idx) {
                html += `<article class="index">
                            <a href="receta.html?ID=${encodeURIComponent(e.id)}">
                                <img src="./fotos/${e.imagen}" alt="imagen" class="pollo">
                                <h3 title="${e.nombre}">${e.nombre}</h3>
                            </a>
                            <div>
                                <span class="material-symbols-rounded"><i>person</i></span>
                                <p>${e.personas}</p>
                                <p>|</p>
                                ${(() => {
                                    switch (e.dificultad) {
                                        case 0:
                                            return `<span class="material-symbols-rounded"><i>star</i></span>`;
                                        case 1:
                                            return `<span class="material-symbols-rounded"><i>star</i><i>star</i></span>`;
                                        case 2:
                                            return `<span class="material-symbols-rounded"><i>star</i><i>star</i><i>star</i></span>`;
                                        default:
                                            return `<p>Opción por defecto</p>`;
                                    }
                                })()}
                                <p>|</p>
                                <p>${e.tiempo} mins</p>
                                <span class="material-symbols-rounded"><i>timer</i></span>
                            </div>
                        </article>`;
            });
            html += `<div class="paginas">
                        <p class="num_pagina">${r.FILAS.length}</p><p> recetas de </p><p class="num_pagina">${total}</p><p> encontradas </p>
                    </div>`;
            document.querySelector('#lista').innerHTML = html;
        }
    };
    xhr.send();
}
