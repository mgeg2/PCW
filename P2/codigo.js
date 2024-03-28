
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
			
				html +=`<article classs="index">
							<a href="receta.html?ID=${encodeURIComponent(e.id)}">
							<img src="./fotos/${e.imagen}" alt="paisaje4" class="pollo">
							<h3 title="pollo-tikka-masala">${e.nombre}</h3>
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
			document.querySelector('#lista').innerHTML=html;
		}

	}
		xhr.send();
}

// document.addEventListener("DOMContentLoaded", function() {
//     pedirRecetas();
// });
