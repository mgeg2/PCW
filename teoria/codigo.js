
function pedirRecetas(){
	let url = 'api/recetas',
	    xhr = new XMLHttpRequest();

	xhr.open('GET',url,true);
	xhr.responseType = 'json';
	xhr.onload = function(){
		let r= xhr.response;
		console.log(r);

		if(r.RESULTADO== 'OK'){
			let html ='';

			r.FILAS.forEach(function(e,idx){
				let estrellas;

				switch ( parseInt(e.dificultad)) {
					case 0:
						estrellas = `<span class="material-symbols-rounded"><i>star</i></span>`;
						break
					case 1:
						estrellas = `<span class="material-symbols-rounded"><i>star</i><i>star</i></span>`;
						break;
					case 2:
						estrellas = `<span class="material-symbols-rounded"><i>star</i><i>star</i><i>star</i></span>`;
						break;
					default:
						estrellas = `<p>Opción por defecto</p>`;
				}

				html +=`<article classs="index">
							<a href="receta.html?ID=${e.id}">
							<img src="./fotos/${e.imagen}" alt="paisaje4" class="pollo">
							<h3 title="pollo-tikka-masala">${e.nombre}</h3>
							</a>
							<div>
							<span class="material-symbols-rounded"><i>person</i></span>
							<p>${e.personas}</p>
							<p>|</p>
							${estrellas}
							<p>|</p>
							<p>${e.tiempo} mins</p>
							<span class="material-symbols-rounded"><i>timer</i></span>
							</div>
						</article>`

				// html+=`<li>${e.nombre}</li>`;
				// html+=`<img src="./fotos/${e.imagen}">`;
				
				
			});
			document.querySelector('#lista').innerHTML=html;
		}

	}
		xhr.send();
}

// document.addEventListener("DOMContentLoaded", function() {
//     pedirRecetas();
// });
