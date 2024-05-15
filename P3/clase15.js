const ANCHO_CANVAS = 360;

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

		if( fichero ) { //comprobar que el fichero no esta vacio, si esta vacio aparece como undefined
			let img = document.createElement('img');
			img.onload = function() {
				let cv = document.querySelector('#cv1'),
					ctx = cv.getContext('2d'),
					ancho, alto,
					posX, posY,
					factor;

				//para comprobar si img es mas ancha que alta
				if( img.naturalWidth > img.naturalHeight ) { //si imagen es mas ancha que alta
					posX = 0;
					ancho = cv.width;
					factor = cv.width / img.naturalWidth;
					alto = img.naturalHeight * factor; //me da alto imagen proporcional
					posY = (cv.height - alto)/2;
				}
				else { //si imagen es mas alta que ancha
					posY = 0;
					alto = cv.height;
					factor = cv.height / img.naturalHeight;
					ancho = img.naturalWidth * factor; //me da alto imagen proporcional
					posX = (cv.width - ancho)/2;
				}

				//renderizamos el canvas de nuevo para borrar imagen anterior
				cv.width = cv.width;
				ctx.drawImage(img, posX, posY, ancho, alto); //aqui hay que dibujarla proporcional para que no se estire comprobar ancho y alto de la foto
				let cv3 = document.querySelector('#oculto'),
					ctx3 = cv3.getContext('2d');

				ctx3.drawImage( cv, 0, 0 ); //no especicifcamos alto y ancho pq es igual

			}

			img.src = URL.createObjectURL( fichero ); //asignamos a la imagen el archivo leido
		}
	};

	inp.click();

}

//repasar pintar imagen para examen
function divisiones() {
	let nDivs = 3, //para que sea puzzle 3x3
		i,
		cv = document.querySelector('#cv1'),
		ctx = cv.getContext('2d'),
		ancho = cv.width / nDivs;
		//alto = cv.height / nDivs; no hace falta porque canvas es cuadrado

	//para no interferir en otras operaciones de dibujo
	ctx.beginPath();
	ctx.lineWidth = 2; //poner con numeros pares
	ctx.strokeStyle = '#a00';

	for( i = 1; i < nDivs; i++ ) { //empezamos el bucle en uno para obtener solo las divisiones interiores del canvas
		//divisiones verticales (con lineas)
		ctx.moveTo( i * ancho, 0 );
		ctx.lineTo( i * ancho, cv.height );
		//divisiones horizontales
		ctx.moveTo( 0, i * ancho );
		ctx.lineTo( cv.width, i * ancho );
	}
	ctx.stroke(); //no hace falta hacer stroke en el bucle, operaciones se acumulan en el buffer

}

function prepararEventosCanvas() {
	let cv = document.querySelector('#cv1');

	cv.onmousemove = function ( evt ) {
		let x = evt.offsetX,
			y = evt.offsetY,
			nDivs = 3, //sacar num de divisiones como constante en la practica se coge del html 
			ancho = cv.width / nDivs,
			fila = Math.floor(y / ancho),
			col = Math.floor(x / ancho);

		fila = Math.min( Math.max(0, fila), nDivs - 1 ); //para conseguir que los valores de fila y col esten entre 0 y nDivs-1
		col = Math.min( Math.max(0, col), nDivs - 1 );


		document.querySelector('#pos').innerHTML = `(${x}, ${y}) (fila: ${fila}, columna: ${col})`;
	}

	cv.onclick = function ( evt ) {
		let x = evt.offsetX,
			y = evt.offsetY,
			nDivs = 3, //sacar num de divisiones como constante en la practica se coge del html 
			ancho = cv.width / nDivs,
			fila = Math.floor(y / ancho),
			col = Math.floor(x / ancho);

		fila = Math.min( Math.max(0, fila), nDivs - 1 );
		col = Math.min( Math.max(0, col), nDivs - 1 );

		copiar(fila, col); //para copiar region del canvas 1 al canvas 2

		document.querySelector('#clic').innerHTML = `(${x}, ${y}) (fila: ${fila}, columna: ${col})`;
	}


}

function copiar_ant( fila, col ) {
	let cv3 = document.querySelector('#oculto'),
		cv2 = document.querySelector('#cv2'),
		ctx2 = cv2.getContext('2d'),
		nDivs = 3, //poner como constante mejor
		ancho = cv3.width / nDivs;

	//tambien se puede hacer con getimagedata y putimagedata
	ctx2.drawImage( cv3, col * ancho, fila * ancho, ancho, ancho, col * ancho, fila * ancho, ancho, ancho );  //(que dibujamos, posicion x, posicion y) esto seria esquina superior izquierda de ese trozo

}

function copiar( fila, col ) {
	let cv3 = document.querySelector('#oculto'),
		ctx3 = cv3.getContext('2d'),
		cv2 = document.querySelector('#cv2'),
		ctx2 = cv2.getContext('2d'),
		nDivs = 3, //poner como constante mejor
		ancho = cv3.width / nDivs,
		imgData;

		imgData = ctx3.getImageData( col * ancho, fila * ancho, ancho, ancho );

		let pixel;
		for ( let i=0; i < imgData.height; i++ ){
			for ( let j=0; j < imgData.height; j++) {
				pixel = (i * imgData.width + j) * 4; //convertir posicion i,j de la matriz en el array imgData es array de pixeles
				//asi sale en verde, si comento componente roja y dejo azul y verde sale en rojo
				imgData.data[pixel] = 0; //rojo
				//imgData.data[pixel + 1] = 0; //verde
				imgData.data[pixel + 2] = 0; //azul
				//imgData.data[pixel + 3] = 0; //alpha o transparencia
			}
		}

		ctx2.putImageData( imgData, col * ancho, fila * ancho );
}


//usar como objetos javascript para cada pieza, añadir propiedades para ver si esta seleccionada o no
//trabajar con las coordenadas de las piezas y variable auxiliar para intercambiarlas
//si hago clic en esa seccion 
//la matriz que guardamos en memoria meter las coordenadas de las piezas (antes de barajar las piezas) guardar piezas por
//posiciones de 0,0... 
