const ANCHO_CANVAS = 360;
let currentDivisions = 0;

function prepararCanvas() {
    let cv = document.querySelector('#cv1'),
        cv2 = document.querySelector('#cv2'),
        cv3 = document.querySelector('#oculto');

    cv.width = ANCHO_CANVAS;
    cv.height = cv.width;
    cv2.width = cv.width;
    cv2.height = cv.height;
    cv3.width = cv.width;
    cv3.height = cv.height;
}

function cargarImagen() {
    let inp = document.createElement('input');

    inp.setAttribute('type', 'file');
    inp.onchange = function(evt) {
        let fichero = inp.files[0];

        if (fichero) { // comprobar que el fichero no está vacío, si está vacío aparece como undefined
            let img = document.createElement('img');
            img.onload = function() {
                let cv = document.querySelector('#cv1'),
                    ctx = cv.getContext('2d'),
                    ancho, alto,
                    posX, posY,
                    factor;

                // para comprobar si img es más ancha que alta
                if (img.naturalWidth > img.naturalHeight) { // si imagen es más ancha que alta
                    posX = 0;
                    ancho = cv.width;
                    factor = cv.width / img.naturalWidth;
                    alto = img.naturalHeight * factor; // me da alto imagen proporcional
                    posY = (cv.height - alto) / 2;
                } else { // si imagen es más alta que ancha
                    posY = 0;
                    alto = cv.height;
                    factor = cv.height / img.naturalHeight;
                    ancho = img.naturalWidth * factor; // me da alto imagen proporcional
                    posX = (cv.width - ancho) / 2;
                }

                // renderizamos el canvas de nuevo para borrar imagen anterior
                ctx.clearRect(0, 0, cv.width, cv.height);
                ctx.drawImage(img, posX, posY, ancho, alto); // aquí hay que dibujarla proporcional para que no se estire comprobar ancho y alto de la foto
                
                let cv3 = document.querySelector('#oculto'),
                    ctx3 = cv3.getContext('2d');

                ctx3.clearRect(0, 0, cv3.width, cv3.height);
                ctx3.drawImage(cv, 0, 0); // no especificamos alto y ancho porque es igual

                // Redibujar las divisiones si es necesario
                if (currentDivisions > 0) {
                    divisiones(currentDivisions);
                }
            }

            let buttons = document.querySelectorAll('input[name="5x5"], button[onclick="activaimagen()"]');
            buttons.forEach(button => button.disabled = false);
        
            img.src = URL.createObjectURL(fichero); // asignamos a la imagen el archivo leído
        }
    };

    inp.click();
}

function divisiones(div) {
    currentDivisions = div; // Guardar el número de divisiones actual
    let nDivs = div,
        cv = document.querySelector('#cv1'),
        ctx = cv.getContext('2d'),
        ancho = cv.width / nDivs,
        alto = cv.height / nDivs;

    // Dibujar las divisiones en el canvas
    ctx.clearRect(0, 0, cv.width, cv.height);
    let cv3 = document.querySelector('#oculto'),
        ctx3 = cv3.getContext('2d');

    ctx.drawImage(cv3, 0, 0); // Redibujar la imagen original

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#a00';

    for (let i = 1; i < nDivs; i++) {
        // divisiones verticales (con líneas)
        ctx.moveTo(i * ancho, 0);
        ctx.lineTo(i * ancho, cv.height);
        // divisiones horizontales
        ctx.moveTo(0, i * alto);
        ctx.lineTo(cv.width, i * alto);
    }
    ctx.stroke(); // no hace falta hacer stroke en el bucle, operaciones se acumulan en el buffer
}

function prepararEventosCanvas() {
    let cv = document.querySelector('#cv1');

    cv.onmousemove = function (evt) {
        let x = evt.offsetX,
            y = evt.offsetY,
            nDivs = currentDivisions || 3, // sacar num de divisiones como constante en la práctica se coge del html 
            ancho = cv.width / nDivs,
            fila = Math.floor(y / ancho),
            col = Math.floor(x / ancho);

        fila = Math.min(Math.max(0, fila), nDivs - 1); // para conseguir que los valores de fila y col estén entre 0 y nDivs-1
        col = Math.min(Math.max(0, col), nDivs - 1);

        document.querySelector('#pos').innerHTML = `(${x}, ${y}) (fila: ${fila}, columna: ${col})`;
    }

    cv.onclick = function (evt) {
        let x = evt.offsetX,
            y = evt.offsetY,
            nDivs = currentDivisions || 3, // sacar num de divisiones como constante en la práctica se coge del html 
            ancho = cv.width / nDivs,
            fila = Math.floor(y / ancho),
            col = Math.floor(x / ancho);

        fila = Math.min(Math.max(0, fila), nDivs - 1);
        col = Math.min(Math.max(0, col), nDivs - 1);

        copiar(fila, col); // para copiar región del canvas 1 al canvas 2

        document.querySelector('#clic').innerHTML = `(${x}, ${y}) (fila: ${fila}, columna: ${col})`;
    }
}

function copiar(fila, col) {
    let cv3 = document.querySelector('#oculto'),
        ctx3 = cv3.getContext('2d'),
        cv2 = document.querySelector('#cv2'),
        ctx2 = cv2.getContext('2d'),
        nDivs = currentDivisions || 3, // poner como constante mejor
        ancho = cv3.width / nDivs,
        imgData;

    imgData = ctx3.getImageData(col * ancho, fila * ancho, ancho, ancho);

    let pixel;
    for (let i = 0; i < imgData.height; i++) {
        for (let j = 0; j < imgData.height; j++) {
            pixel = (i * imgData.width + j) * 4; // convertir posición i,j de la matriz en el array imgData es array de pixeles
            // así sale en verde, si comento componente roja y dejo azul y verde sale en rojo
            imgData.data[pixel] = 0; // rojo
            // imgData.data[pixel + 1] = 0; // verde
            imgData.data[pixel + 2] = 0; // azul
            // imgData.data[pixel + 3] = 0; // alpha o transparencia
        }
    }

    ctx2.putImageData(imgData, col * ancho, fila * ancho);
}

document.addEventListener('DOMContentLoaded', (event) => {
    prepararCanvas();
    prepararEventosCanvas();
});
