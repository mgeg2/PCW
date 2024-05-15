let incremento=6;

function aumentaRecetas(){
	incremento = incremento + 6;
	pedirRecetas();
}

function pedirRecetas( ){
	let reg=0;
	let url = 'api/recetas',
	    xhr = new XMLHttpRequest();
	    url += `?reg=0&cant=`+incremento;
		
	console.log(incremento);
	console.log(url);
	xhr.open('GET',url,true);
	xhr.responseType = 'json';
	xhr.onload = function(){
		let r= xhr.response;
		console.log(r);

		if(r.RESULTADO== 'OK'){
			let html ='';
			let total= r.TOTAL_COINCIDENCIAS;
			r.FILAS.forEach(function(e,idx){
			
				html +=`<article class="index">
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
							</article>`

				// html+=`<li>${e.nombre}</li>`;
				// html+=`<img src="./fotos/${e.imagen}">`;
				
				
			});
			html+= `<div class="paginas">
            <p class="num_pagina">${r.FILAS.length}</p><p> recetas de </p><p class="num_pagina">${total}</p><p> subidas </p>
            
        	</div>`
			document.querySelector('#lista').innerHTML = html;
		}

	}
		xhr.send();
}
