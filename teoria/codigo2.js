function receta() {
    let html ='';
    // Recuperar el parámetro del nombre de la receta desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const nombreReceta = urlParams.get('nombre');
    // Usar el nombre de la receta según sea necesario
    console.log(nombreReceta); // Esto imprimirá el nombre de la receta en la consola
    // Aquí puedes agregar lógica adicional para cargar la receta según el nombre, etc.
    html +=`<p>${nombreReceta}</p>`;
    document.querySelector('#receta-container').innerHTML=html;
   
}

document.addEventListener("DOMContentLoaded", receta);