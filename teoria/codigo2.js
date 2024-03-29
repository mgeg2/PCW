function receta() {
    const urlParams = new URLSearchParams(window.location.search);
    const ID = urlParams.get('ID');

    let url = 'api/recetas/' + ID;
	let xhr = new XMLHttpRequest();
    
    xhr.open('GET',url,true);
    xhr.responseType = 'json';
 
    xhr.onload = function() {
        let r = xhr.response;
        console.log(r);
        if (r.RESULTADO =='OK') { 
            let html='';
           r.FILAS.forEach(function(receta,idx){
            var fechaOriginal =receta.fechaCreacion ;

            // Dividir la fecha en día, mes y año
            var partesFecha = fechaOriginal.split('-');
            var dia = partesFecha[2];
            var mes = partesFecha[1];
            var año = partesFecha[0];
            var fechaGirada = dia + '/' + mes + '/' + año;
            console.log(fechaGirada); // Salida: "03/20/2024"
            console.log(receta);
            html+=`
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
                    ${(() => {
                        switch (receta.dificultad) {
                            case 0:
                                return `Baja`;
                            case 1:
                                return `Media`;
                            case 2:
                                return `Alta`;
                            default:
                                return `<p>Opción por defecto</p>`;
                        }
                    })()}
                    </p>
                   
                </div>
            </div>`
           });
            document.querySelector('#receta-container').innerHTML=html;
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

    let url = 'api/recetas/' + ID +'/ingredientes';
	let xhr = new XMLHttpRequest();
    
    xhr.open('GET',url,true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        let r = xhr.response;
        console.log(r);
        if(r.RESULTADO== 'OK'){
            let html ='';
            r.FILAS.forEach(function(ingrediente,idx){
                html +=`<li>${ingrediente.texto}</li>`;
            });
            document.querySelector('#receta-container').innerHTML+=html;
        }
    }
    xhr.send();

}
