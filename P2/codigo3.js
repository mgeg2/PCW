function receta() {
    const urlParams = new URLSearchParams(window.location.search);
    const ID = urlParams.get('ID');

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
                    <p>Autor: <a href="buscar.html">${receta.autor}</a></p>
                    <p>Raciones: 8</p>
                    <p>Tiempo: 90 min</p>
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
            `
            });
            document.querySelector('#receta-container').innerHTML = html;

            ingredientes();
            etiquetas();
            pasos();

        }
    }
    xhr.send();



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
        // console.log(r);
        if (r.RESULTADO == 'OK') {
            let html = '';
            r.FILAS.forEach(function (etiqueta, idx) {
                html += `<p><a href=index.html>${etiqueta.nombre}</a></p>`;

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

                 var pasos = r.FILAS[0].elaboracion.split("\n");
    
                console.log(pasos);
                for (let i = 0; i < pasos.length; i++) {
                    html +=`<li>${pasos[i]}</li>`;    
                }
            document.querySelector('#pasos').innerHTML += html;
        }
    }
    xhr.send();
}