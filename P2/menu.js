function mostrarMenu(){  //menu cambia en funcion de si usuario esta logeado o no
    let ul = document.querySelector('#menu'),              
    pagina= document.body.getAttribute('data-pagina'),
    html='';
    
    //index y buscar se muestran siempre aunque el usuario no este logeado
    
    if(pagina != 'index'){
    html += '<li><span class="material-symbols-rounded"><i>home</i></span><a href="./index.html">Index</a></li>'; //aqui meter span con el icono
    }
    
    if(pagina != 'buscar'){
    html += '<li><span class="material-symbols-rounded"><i>search</i></span><a href="./buscar.html">Buscar</a></li>';
    }
    
    // location.href = 'login.html'; para cargar pagina desde javascript, dentro de logout se hace peticion y cuando este todo ok hacemos esto a index.html
    
    //ahora comprobar parte que se muestra si el usuario se ha logeado
    if(sessionStorage['datosUsu']){

        let usuario = JSON.parse(sessionStorage['datosUsu']);
        let nombre = usuario.LOGIN;
        
        html += `<li><span class="material-symbols-rounded"><i>logout</i></span><a href="./" onclick="hacerLogout(event);">Logout (${nombre})</a></li>`  //en hacerLogout quitar accion por defecto prevent default
     
        if(pagina != 'nueva'){
        html += '<li><span class="material-symbols-rounded"><i>add</i></span><a href="./nueva.html">Nueva receta</a></li>'
        }
    }
    
    else{
    
    if(pagina != 'login'){
    html += '<li><span class="material-symbols-rounded"><i>login</i></span><a href="./login.html">Login</a></li>'
    }
    
    if(pagina != 'registro'){
    html += '<li><span class="material-symbols-rounded"><i>how_to_reg</i></span><a href="registro.html">Registrarse</a></li>'
    }
    
    }
    
    ul.innerHTML = html;  //llamar en cada pagina que cambiemos
}
    
    
function hacerLogout(evt){
    evt.preventDefault(); //ya no redirecciona a index
    let url = 'api/usuarios/logout',
    xhr = new XMLHttpRequest(),
    usu = JSON.parse(sessionStorage['datosUsu']),
    token;

    token = usu.LOGIN + ':' + usu.TOKEN;
    xhr.open('POST', url, true);
    xhr.responseType = 'json';
    xhr.onload = function(){
    let r = xhr.response;

    if( r.RESULTADO == 'OK'){
    sessionStorage.removeItem('datosUsu'); //para borrar datos usuario del sessionstorage
    location.href = './';
    }
    }

    xhr.setRequestHeader('Authorization', token);
    xhr.send();
}

   
//añadir input tipo text en html placeholder login evento que se produce cuando abandonamos campo onblur="comprobarLogin(this);"
  

//hacer peticion get y devuelve si esta disponible o no disponible si da ok codigo 200 existe en disponible es false y si no disponible true
//si disponibilidad es true seguir registro si es falso mostrar mensaje y no dejar registrar cancelando la accion
//cuando le doy a registrar si tengo error en el html no dejo hacer registro con document.querySelector y no hay ninguno si q deja hacer registro
/*
function comprobarLogin(inp){
    console.log(inp.value);
    let url = 'api/usuarios/' + inp.value;
}
*/
