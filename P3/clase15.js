const ANCHO_CANVAS = 360;

function inicio() {
    let puzzleState = sessionStorage.getItem('puzzleState');
    if(!puzzleState){
         mostrarMensajeModal('Bienvenid@ a Photo Puzzle', 'Elige una imagen e intenta montar el puzzle. Tienes 3 niveles de dificultad para elegir.', 'ok2');
    }
   
}

function prepararCanvas() {
    let cv = document.querySelector('#cv1'),
        //cv2 = document.querySelector('#cv2'),
        cv3 = document.querySelector('#oculto');

    cv.width = ANCHO_CANVAS;
    cv.height = cv.width;
    //cv2.width = cv.width;
    //cv2.height = cv.height;
    cv3.width = cv.width;
    cv3.height = cv.height;
}


function cargarImagen() {
    let inp = document.createElement('input');
    let sectionCanvas = document.querySelector('section');
    sectionCanvas.onclick = null;

    inp.setAttribute('type', 'file');
    inp.onchange = function(evt) {
        let fichero = inp.files[0];

        if (fichero) {
            let reader = new FileReader();
            reader.onload = function(event) {
                let base64String = event.target.result;

                // Guardar la cadena Base64 en sessionStorage
                sessionStorage.setItem('image', base64String); // No es necesario JSON.stringify()

                let img = document.createElement('img');
                img.onload = function() {
                    let cv = document.querySelector('#cv1'),
                        ctx = cv.getContext('2d'),
                        ancho, alto,
                        posX, posY,
                        factor;
                    
                    document.getElementById('correctas').textContent = 0;
                    document.getElementById('jugadas').textContent = 0;
                    sessionStorage.setItem('correctas', 0);
                    sessionStorage.setItem('jugadas', 0);
                    document.getElementById('tiempo').textContent = '0s';
                    sessionStorage.removeItem('divisions');
                    let radios = document.querySelectorAll('input[name="5x5"]');
                    radios.forEach(radio => {
                        radio.checked = false;
                    });

                    if (img.naturalWidth > img.naturalHeight) {
                        posX = 0;
                        ancho = cv.width;
                        factor = cv.width / img.naturalWidth;
                        alto = img.naturalHeight * factor;
                        posY = (cv.height - alto) / 2;
                    } else {
                        posY = 0;
                        alto = cv.height;
                        factor = cv.height / img.naturalHeight;
                        ancho = img.naturalWidth * factor;
                        posX = (cv.width - ancho) / 2;
                    }

                    ctx.clearRect(0, 0, cv.width, cv.height);
                    ctx.drawImage(img, posX, posY, ancho, alto);

                    let cv3 = document.querySelector('#oculto'),
                        ctx3 = cv3.getContext('2d');

                    ctx3.clearRect(0, 0, cv3.width, cv3.height);
                    ctx3.drawImage(cv, 0, 0);

                    let currentDivisions = sessionStorage.getItem('divisions');
                    if (currentDivisions) {
                        divisiones(currentDivisions);
                    }

                    let empezar = document.getElementById("empezar");
                    empezar.disabled = false;
                };

                img.src = base64String;
            };

            reader.readAsDataURL(fichero); // Utilizamos readAsDataURL para obtener una cadena Base64
        }
    };

    inp.click();
}




function divisiones(div) {
    if (div > 0) {
        sessionStorage.setItem('divisions', div); // Guardar el número de divisiones en sessionStorage
    } else {
        sessionStorage.removeItem('divisions'); // Borrar el número de divisiones de sessionStorage
    }

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

    if (div > 0) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#DBDCF6';

        for (let i = 1; i < nDivs; i++) {
            // divisiones verticales (con líneas)
            ctx.moveTo(i * ancho, 0);
            ctx.lineTo(i * ancho, cv.height);
            // divisiones horizontales
            ctx.moveTo(0, i * alto);
            ctx.lineTo(cv.width, i * alto);
        }
        ctx.stroke(); // no hace falta hacer stroke en el bucle, operaciones se acumulan en el buffer

        // Desactivar las demás opciones de radio
       
    }
}

function limpiarDivisiones() {
    let cv = document.querySelector('#cv1'),
        ctx = cv.getContext('2d'),
        cv3 = document.querySelector('#oculto'),
        ctx3 = cv3.getContext('2d');

    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx3.clearRect(0, 0, cv3.width, cv3.height);

    // Borrar el valor de divisiones en sessionStorage
    sessionStorage.removeItem('divisions');

    // Habilitar todas las opciones de radio
    
}

function prepararEventosCanvas() {
    let cv = document.querySelector('#cv1');

    cv.onmousemove = function(evt) {
        let x = evt.offsetX,
            y = evt.offsetY,
            nDivs = sessionStorage.getItem('divisions'), // Recuperar número de divisiones desde sessionStorage
            ancho = cv.width / nDivs,
            alto = cv.height / nDivs,
            fila = Math.floor(y / ancho),
            col = Math.floor(x / ancho);

        fila = Math.min(Math.max(0, fila), nDivs - 1); // para conseguir que los valores de fila y col estén entre 0 y nDivs-1
        col = Math.min(Math.max(0, col), nDivs - 1);

        //document.querySelector('#pos').innerHTML = `(${x}, ${y}) (fila: ${fila}, columna: ${col})`;

        resaltar(fila, col);
      
    };

    cv.onclick = function(evt) {
        let x = evt.offsetX,
            y = evt.offsetY,
            nDivs = sessionStorage.getItem('divisions'),
            ancho = cv.width / nDivs,
            fila = Math.floor(y / ancho),
            col = Math.floor(x / ancho);

        // Obtener las coordenadas de la pieza seleccionada
        let seleccionada = {
            fila: fila,
            col: col
        };

        //--------------

        // Obtener la información sobre la pieza previamente seleccionada, si existe
        let piezaSeleccionadaPrev = sessionStorage.getItem('piezaSeleccionada');
        if (piezaSeleccionadaPrev) {
            piezaSeleccionadaPrev = JSON.parse(piezaSeleccionadaPrev);
            // Quitar el borde azul de la pieza previamente seleccionada
            quitarBorde(cv, piezaSeleccionadaPrev.fila, piezaSeleccionadaPrev.col, ancho);
        }

        // Añadir el borde azul a la nueva pieza seleccionada
        agregarBorde(cv, fila, col, ancho);

        // Guardar la información de la nueva pieza seleccionada en sessionStorage
        sessionStorage.setItem('piezaSeleccionada', JSON.stringify(seleccionada));

        //----------

        let puzzleState = JSON.parse(sessionStorage.getItem('puzzleState'));

        let piezaSeleccionada = puzzleState.find(pieza => pieza.filaActual === seleccionada.fila && pieza.colActual === seleccionada.col);

        // Verificar si la pieza seleccionada está en la posición original
        if (piezaSeleccionada && piezaSeleccionada.filaActual === piezaSeleccionada.filaOriginal && piezaSeleccionada.colActual === piezaSeleccionada.colOriginal) {
       
            return; // No hacer nada si la pieza está en la posición original
        }

        if (!sessionStorage['seleccionada']) {
            // Guardar la pieza seleccionada en sessionStorage
            sessionStorage['seleccionada'] = JSON.stringify(seleccionada);
        } else {
            let sel = JSON.parse(sessionStorage['seleccionada']);

            if (sel.fila === seleccionada.fila && sel.col === seleccionada.col) {
                // Si se hace clic en la misma pieza, limpiar la selección
                sessionStorage.removeItem('seleccionada');
            } else {
                // Realizar el intercambio de piezas
                intercambiarPiezas(sel, seleccionada);
                let jugadas= document.getElementById('jugadas').textContent;
                jugadas++;
                sessionStorage.setItem('jugadas', jugadas);
                document.getElementById('jugadas').textContent = jugadas;
            }
        }
    };
}

function intercambiarPiezas(sel, seleccionada) {
    let cv = document.querySelector('#cv1'),
        ctx = cv.getContext('2d'),
        nDivs = sessionStorage.getItem('divisions'),
        ancho = cv.width / nDivs,
        alto = cv.height / nDivs;

    let puzzleState = JSON.parse(sessionStorage.getItem('puzzleState'));

    // Encontrar las piezas correspondientes en el puzzleState
    let pieza1 = null;
    let pieza2 = null;

    console.log(puzzleState);

    puzzleState.forEach(pieza => {
        if (pieza.filaActual === sel.fila && pieza.colActual === sel.col) {
            pieza1 = pieza;
        }
        if (pieza.filaActual === seleccionada.fila && pieza.colActual === seleccionada.col) {
            pieza2 = pieza;
        }
    });

    if (!pieza1 || !pieza2) {
        console.error('No se encontraron las piezas en el estado del puzzle.');
        return;
    }

    // Intercambiar las posiciones actuales de las piezas
    let temp = {
        filaActual: pieza1.filaActual,
        colActual: pieza1.colActual
    };

    pieza1.filaActual = pieza2.filaActual;
    pieza1.colActual = pieza2.colActual;
    pieza2.filaActual = temp.filaActual;
    pieza2.colActual = temp.colActual;

    // Actualizar el puzzleState en el sessionStorage
    sessionStorage.setItem('puzzleState', JSON.stringify(puzzleState));

    // Dibujar las piezas actualizadas en el canvas
    ctx.clearRect(0, 0, cv.width, cv.height);

    let correctas = 0; // Contador de piezas correctas
 
    puzzleState.forEach(pieza => {
        let { filaOriginal, colOriginal, filaActual, colActual } = pieza;
        let cv3 = document.querySelector('#oculto'),
            ctx3 = cv3.getContext('2d'),
            imgData = ctx3.getImageData(colOriginal * ancho, filaOriginal * alto, ancho, alto);

        ctx.putImageData(imgData, colActual * ancho, filaActual * alto);

        // Incrementar el contador si la pieza está en la posición correcta
        if (filaActual === filaOriginal && colActual === colOriginal) {
            correctas++;
            sessionStorage.setItem('correctas', correctas);
            agregarBorde2(cv, filaActual, colActual, ancho);
        }
    });
   
    // Actualizar el contador de piezas correctas en el DOM
    document.getElementById('correctas').textContent = correctas;
    if (correctas === puzzleState.length) {
        pararCronometro();
        movs = document.getElementById('jugadas').textContent;
        movims = parseInt(movs);
        movims += 1;
        let empezar=document.getElementById("empezar");
        let cargar=document.getElementById("cargarImagen");
        let radios = document.querySelectorAll('input[name="5x5"]');
        radios.forEach(radio => {
            radio.disabled = false;
        });
        empezar.disabled=false;
        cargar.disabled=false;
        sessionStorage.clear();
        mostrarMensajeModal('Fin de la partida', `Has completado el puzzle en ${movims} movimientos.`, 'ok');
               
    }

    // Limpiar la selección en sessionStorage
    sessionStorage.removeItem('seleccionada');
    if (nDivs > 0) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#DBDCF6';

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
}


let lastHighlightedPiece = { fila: -1, col: -1 }; // Inicialmente no hay pieza resaltada

function resaltar(fila, col) { 
    let cv1 = document.querySelector('#cv1'),
        ctx = cv1.getContext('2d'),
        nDivs = sessionStorage.getItem('divisions'), // poner como constante mejor
        ancho = cv1.width / nDivs;

    // Si la nueva pieza resaltada es diferente de la última, borra el resaltado de la última pieza
    if (fila !== lastHighlightedPiece.fila || col !== lastHighlightedPiece.col) {
        limpiarResaltado(ctx, ancho);
        lastHighlightedPiece = { fila: fila, col: col }; // Actualiza la última pieza resaltada
    }

    if (fila === -1 || col === -1) { // Si las coordenadas son inválidas, no hagas nada más
        return;
    }

    // Resalta la pieza cambiando el color del borde
    ctx.strokeStyle = '#51558F'; // Cambiar el color del borde para resaltar
    ctx.lineWidth = 2; // Aumentar el grosor del borde para resaltar
    ctx.strokeRect(col * ancho, fila * ancho, ancho, ancho);
}

function limpiarResaltado(ctx, ancho) {
    let { fila, col } = lastHighlightedPiece;
    if (fila !== -1 && col !== -1) { // Si hay una pieza resaltada
        // Borra el resaltado de la última pieza cambiando el color del borde
        ctx.strokeStyle = '#DBDCF6'; // Color del borde original
        ctx.lineWidth = 2; // Grosor del borde original
        ctx.strokeRect(col * ancho, fila * ancho, ancho, ancho);
    }
}


function agregarBorde(cv, fila, col, ancho) {
    let ctx = cv.getContext('2d');
    ctx.strokeStyle = '#363A70'; // Cambiar el color del borde para resaltar
    ctx.lineWidth = 4; // Aumentar el grosor del borde para resaltar
    ctx.strokeRect(col * ancho, fila * ancho, ancho, ancho);
}

function agregarBorde2(cv, fila, col, ancho) {
    let ctx = cv.getContext('2d');
    ctx.strokeStyle = '#5CC43C'; // Cambiar el color del borde para resaltar
    ctx.lineWidth = 6; // Aumentar el grosor del borde para resaltar
    ctx.strokeRect(col * ancho, fila * ancho, ancho, ancho);
}





function quitarBorde(cv, fila, col, ancho) {
    let ctx = cv.getContext('2d');
    ctx.strokeStyle = '#DBDCF6'; // Color del borde original
    ctx.lineWidth = 2; // Grosor del borde original
    ctx.strokeRect(col * ancho, fila * ancho, ancho, ancho);
}




function randomizarPosiciones() {
    let sectionCanvas = document.querySelector('section');
    sectionCanvas.onclick = null;

    let nDivs = sessionStorage.getItem('divisions');
    if (!nDivs) return;

    let cv = document.querySelector('#cv1'),
        ctx = cv.getContext('2d'),
        ancho = cv.width / nDivs,
        alto = cv.height / nDivs;

    let posiciones = [];
    for (let i = 0; i < nDivs; i++) {
        for (let j = 0; j < nDivs; j++) {
            posiciones.push({ fila: i, col: j });
        }
    }

    posiciones = posiciones.sort(() => Math.random() - 0.5); // Randomizar posiciones

    let cv3 = document.querySelector('#oculto'),
        ctx3 = cv3.getContext('2d'),
        imgData,
        pixel;

    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(cv3, 0, 0); // Redibujar la imagen original

    let nuevaDisposicion = [];

    for (let i = 0; i < nDivs; i++) {
        for (let j = 0; j < nDivs; j++) {
            let { fila, col } = posiciones[i * nDivs + j];
            imgData = ctx3.getImageData(j * ancho, i * alto, ancho, alto);
            ctx.putImageData(imgData, col * ancho, fila * alto);
            nuevaDisposicion.push({ filaOriginal: i, colOriginal: j, filaActual: fila, colActual: col });
        }
    }

    sessionStorage.setItem('puzzleState', JSON.stringify(nuevaDisposicion));
    if (nDivs > 0) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#DBDCF6';

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
    iniciarCronometro();
    let terminar = document.getElementById("terminarPartida");
    let puzzle = document.getElementById("puzle");
    let imagen = document.getElementById("imagen");
    terminar.disabled = false;
    puzzle.disabled = false;
    imagen.disabled = false;
    let empezar=document.getElementById("empezar");
    let cargar=document.getElementById("cargarImagen");
    let radios = document.querySelectorAll('input[name="5x5"]');
    radios.forEach(radio => {
            radio.disabled = true;
    });
    empezar.disabled=true;
    cargar.disabled=true;
}

function mostrarImagenOriginal() {
    let cv = document.querySelector('#cv1'),
        ctx = cv.getContext('2d'),
        imgSrc = sessionStorage.getItem('image');

    if (imgSrc) {
        let img = new Image();
        img.onload = function() {
            let ancho, alto,
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
            ctx.clearRect(0, 0, cv.width, cv.height);
            ctx.drawImage(img, posX, posY, ancho, alto);
        };
        img.src = imgSrc;
    }
    cv.onclick = null;
}




// renderizamos el canvas de nuevo para borrar imagen anterior

function mostrarPuzzle() {
    let cv = document.querySelector('#cv1'),
        ctx = cv.getContext('2d'),
        cv3 = document.querySelector('#oculto'),
        ctx3 = cv3.getContext('2d'),
        nDivs = sessionStorage.getItem('divisions');

    if (!nDivs) return;

    let ancho = cv.width / nDivs,
        alto = cv.height / nDivs,
        puzzleState = JSON.parse(sessionStorage.getItem('puzzleState'));

    ctx.clearRect(0, 0, cv.width, cv.height);

    puzzleState.forEach(pieza => {
        let { filaOriginal, colOriginal, filaActual, colActual } = pieza;
        let imgData = ctx3.getImageData(colOriginal * ancho, filaOriginal * alto, ancho, alto);
        ctx.putImageData(imgData, colActual * ancho, filaActual * alto);

        // Desactivar clic si la pieza está en su posición original
        if (filaActual === filaOriginal && colActual === colOriginal) {
            cv.onclick = null; // Desactivar el evento onclick
            agregarBorde2(cv, filaActual, colActual, ancho);
        
        }
    });
    if (nDivs > 0) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#DBDCF6';

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
    prepararEventosCanvas();
}

function iniciarCronometro() {
    let tiempoDisplay = document.getElementById('tiempo');
    let startTime = sessionStorage.getItem('startTime');

    if (!startTime) {
        startTime = Date.now();
        sessionStorage.setItem('startTime', startTime);
    } else {
        startTime = parseInt(startTime, 10);
    }

    let intervalId = setInterval(() => {
        let elapsed = Math.floor((Date.now() - startTime) / 1000);
        
        let minutes = Math.floor(elapsed / 60);
        let seconds = elapsed % 60;
        
        // Formatear los minutos y segundos para que siempre se muestren con dos dígitos
        let formattedMinutes = String(minutes).padStart(2, '0');
        let formattedSeconds = String(seconds).padStart(2, '0');
        
        tiempoDisplay.textContent = `${formattedMinutes}m ${formattedSeconds}s`;
    }, 1000);

    sessionStorage.setItem('intervalId', intervalId);
}


function pararCronometro() {
    let intervalId = sessionStorage.getItem('intervalId');
    if (intervalId) {
        clearInterval(intervalId);
        sessionStorage.removeItem('intervalId');
    }
}

function terminarPartida() {
    // Detener el cronómetro
    let tiempoDisplay = document.getElementById('tiempo');
    let intervalId = sessionStorage.getItem('intervalId');
    if (intervalId) {
        clearInterval(intervalId);
        sessionStorage.removeItem('intervalId');
    }
    tiempoDisplay.textContent = '0s';

    // Bloquear la interacción con el puzzle
    let cv = document.querySelector('#cv1');
    let ctx = cv.getContext('2d');
    //let cv2 = document.querySelector('#cv2');
    //let ctx2 = cv2.getContext('2d');
    let cv3 = document.querySelector('#oculto');
    let ctx3 = cv3.getContext('2d');
    
    // Limpiar los canvas
    ctx.clearRect(0, 0, cv.width, cv.height);
    //ctx2.clearRect(0, 0, cv2.width, cv2.height);
    ctx3.clearRect(0, 0, cv3.width, cv3.height);

    // Habilitar los botones y las opciones de radio
    let empezar = document.getElementById("empezar");
    let cargar = document.getElementById("cargarImagen");
    let radios = document.querySelectorAll('input[name="5x5"]');
    radios.forEach(radio => {
        radio.disabled = false;
    });
    empezar.disabled = false;
    cargar.disabled = false;

    // Mostrar alerta de partida terminada
    correc = document.getElementById('correctas').textContent;
    movs = document.getElementById('jugadas').textContent;
    sessionStorage.clear();
    mostrarMensajeModal('Fin de la partida', `Has completado ${correc} piezas en ${movs} movimientos.`, 'ok');
}



document.addEventListener('DOMContentLoaded', (event) => {
    inicio();
    prepararCanvas();
    prepararEventosCanvas();

    // Desactivar estos botones inicialmente
    if(!sessionStorage.getItem('puzzleState')){
        let empezar = document.getElementById("empezar");
        let terminar = document.getElementById("terminarPartida");
        let puzzle = document.getElementById("puzle");
        let imagen = document.getElementById("imagen");
        empezar.disabled = true;
        terminar.disabled = true;
        puzzle.disabled = true;
        imagen.disabled = true;
    }

    // Limpiar las divisiones al recargar la página
    //limpiarDivisiones();

    // Si se carga una imagen y hay divisiones en sessionStorage, redibujar las divisiones
    /*
    let currentDivisions = sessionStorage.getItem('divisions');
    if (currentDivisions) {
        divisiones(currentDivisions);
    }
    */
    let base64String = sessionStorage.getItem('image'),
        cv3 = document.querySelector('#oculto'),
        ctx3 = cv3.getContext('2d'),
        posX, posY, ancho, alto, factor;

    if (base64String) {
        let img = new Image();
        img.onload = function() {
            if (img.naturalWidth > img.naturalHeight) {
                        posX = 0;
                        ancho = cv3.width;
                        factor = cv3.width / img.naturalWidth;
                        alto = img.naturalHeight * factor;
                        posY = (cv3.height - alto) / 2;
                    } else {
                        posY = 0;
                        alto = cv3.height;
                        factor = cv3.height / img.naturalHeight;
                        ancho = img.naturalWidth * factor;
                        posX = (cv3.width - ancho) / 2;
            }
            ctx3.clearRect(0, 0, cv3.width, cv3.height);
            ctx3.drawImage(img, posX, posY, ancho, alto);
        };
        img.src = base64String;
    }
    if (sessionStorage.getItem('puzzleState')) {
        let jug = parseInt(sessionStorage.getItem('jugadas')),
            corr = parseInt(sessionStorage.getItem('correctas')),
            radios = document.querySelectorAll('input[name="5x5"]');

        let empezar = document.getElementById("empezar");
        let cargar = document.getElementById("cargarImagen");

        empezar.disabled = true;
        cargar.disabled = true;

        radios.forEach(radio => {
            radio.disabled = true;
        });

        if (sessionStorage.getItem('startTime')) {
            iniciarCronometro();
        }

        document.getElementById('correctas').textContent = corr;
        document.getElementById('jugadas').textContent = jug;

        mostrarPuzzle();
    }

});






 function mostrarMensajeModal(titulo, mensaje, tipo) {
    let dialogo = document.createElement('dialog'),
    html = '';
    
    // Se crea el html del diálogo
    html += '<h4>' + titulo + '</h4>';
    html += '<p>' + mensaje + '</p>';
    html += '<div></div>';
    
    dialogo.innerHTML = html;
    
    // Se aplica el estilo en función del tipo de mensaje
    switch(tipo) {
    case 'ok': // mensaje de OK
    dialogo.querySelector('h4').classList.add('ok');
    break;
    case 'error': // mensaje de error
    dialogo.querySelector('h4').classList.add('error');
    break;
    default: // mensaje normal
    dialogo.querySelector('h4').classList.add('normal');
    }
    // Se añaden los botones de interacción con el usuario

    
    // Al ser un mensaje modal debe llevar, al menos, el botón de Aceptar
    let btn = document.createElement('button');
    
    btn.innerHTML = 'Aceptar';
    btn.classList.add('btn', 'icon-ok');
    btn.onclick = function(){
    document.querySelector('dialog').close();
    if(tipo=='ok'){
        window.location.href = "clase15.html";
    }
    else{}
    
    };
    dialogo.querySelector('div').appendChild(btn);
    
    // Cuando se cierra el mensaje modal se elimina del documento
    dialogo.onclose = function() {
    this.remove();
    }
    
    // Se añade al documento
    document.body.appendChild(dialogo);
    dialogo.showModal();
}


function prepararDNDfoto() {
    let cv = document.querySelector('#cv1');
    let sectionCanvas = document.querySelector('section');

    cv.width = ANCHO_CANVAS;
    cv.height = cv.width;

    cv.ondragover = function( evt ) {
        evt.preventDefault();
    }


    cv.ondrop = function( evt ) {
        evt.preventDefault();
        if( evt.dataTransfer.getData('text/plain') == ''){
            console.log("FICHERO EXTERNO");
            let fichero = evt.dataTransfer.files[0];

            mostrarImagenEnCanvas( fichero );
        }
        else {
            let idx = evt.dataTransfer.getData('text/plain'), 
                img = document.querySelector('[data-idx="' + idx + '"]'),
                ctx = cv.getContext('2d');

            // Pintar la imagen
            let ancho, alto,
                posX, posY;

            if( img.naturalWidth > img.naturalHeight ) {
                ancho = cv.width;
                posX = 0;
                alto = img.naturalHeight * (cv.width / img.naturalWidth);
                posY = (cv.height - alto) / 2;
            }
            else {
                alto = cv.height;
                posY = 0;
                ancho = img.naturalWidth * (cv.height / img.naturalHeight);
                posX = (cv.width - ancho) / 2;
            }
            cv.width = cv.width;
            ctx.drawImage( img, posX, posY, ancho, alto);
        }
    }


    let puzzleState = sessionStorage.getItem('puzzleState');
    if(!puzzleState){
        sectionCanvas.onclick = function(evt) {
            cargarImagen();
        }
    }
}

function mostrarImagenEnCanvas(fichero) {
    let cv = document.querySelector('#cv1'),
        ctx = cv.getContext('2d'),
        img = new Image();

    let reader = new FileReader();
    
    reader.onloadend = function() {
        // Convertir la imagen a una cadena Base64
        let base64String = reader.result;
        // Guardar la cadena Base64 en sessionStorage
        sessionStorage.setItem('image', base64String);

        img.src = base64String;
    };

    reader.readAsDataURL(fichero);

    img.onload = function() {
        let ancho, alto, posX, posY;

        document.getElementById('correctas').textContent = 0;
        document.getElementById('jugadas').textContent = 0;
        sessionStorage.setItem('correctas', 0);
        sessionStorage.setItem('jugadas', 0);
        document.getElementById('tiempo').textContent = '0s';
        sessionStorage.removeItem('divisions');

        if (img.naturalWidth > img.naturalHeight) {
            ancho = cv.width;
            posX = 0;
            alto = img.naturalHeight * (cv.width / img.naturalWidth);
            posY = (cv.height - alto) / 2;
        } else {
            alto = cv.height;
            posY = 0;
            ancho = img.naturalWidth * (cv.height / img.naturalHeight);
            posX = (cv.width - ancho) / 2;
        }

        cv.width = cv.width; // Reiniciar el canvas
        ctx.drawImage(img, posX, posY, ancho, alto);

        let cv3 = document.querySelector('#oculto'),
            ctx3 = cv3.getContext('2d');

        ctx3.clearRect(0, 0, cv3.width, cv3.height);
        ctx3.drawImage(cv, 0, 0); // no es necesario especificar ancho y alto

        // Redibujar las divisiones si es necesario
        let currentDivisions = sessionStorage.getItem('divisions');
        if (currentDivisions) {
            divisiones(currentDivisions);
        }

        let empezar = document.getElementById("empezar");
        empezar.disabled = false;
    };
}


window.addEventListener('load', (event) => {
    mostrarPuzzle();
});