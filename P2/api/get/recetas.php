 <?php
 // FICHERO: api/get/recetas.php
// =================================================================================
// PETICIONES GET ADMITIDAS:
// =================================================================================
//   api/recetas  --------------------> devuelve todos los registros
//   api/recetas/{ID} ----------------> devuelve toda la información del registros con el ID que se le pasa
//   api/recetas/{ID}/fotos ----------> devuelve todas las fotos del registro con el ID que se le pasa
 //   api/recetas/{ID}/ingredientes --> devuelve todos los ingredientes del registro con el ID que se le pasa
 //   api/recetas/{ID}/etiquetas -----> devuelve todas las etiquetas del registro con el ID que se le pasa
//   api/recetas/{ID}/comentarios ----> devuelve todos los comentarios del registro con el ID que se le pasa
// ---------------------------------------------------------------------------------
// PARÁMETROS PARA LA BÚSQUEDA. DEVUELVE LOS REGISTROS QUE CUMPLAN TODOS LOS CRITERIOS DE BÚSQUEDA.
// SE PUEDEN COMBINAR TODOS LOS PARÁMETROS QUE SE QUIERA EN LA MISMA URL MEDIANTE EL OPERADOR &.
// EN LA CONSULTA EN LA BD SE UTILIZARÁ EL OPERADOR AND PARA COMBINAR TODOS LOS CRITERIOS ESPECIFICADOS.
//   api/recetas?t={texto} -> busca el texto indicado en el campo nombre o en el campo elaboracion de la receta. Devuelve la lista de registros que contengan en el nombre o en el texto de elaboración, al menos, una de las palabras separadas por comas "," indicadas en {texto}. Por ejemplo: api/recetas?t=casero,carne
//   api/recetas?i={texto} -> busca el texto indicado en los ingredientes de la receta. Devuelve la lista de recetas que tengan en los ingredientes, al menos, una de las palabras separadas por comas "," indicadas en {texto}. Por ejemplo: api/recetas?i=aceite,sal
//   api/recetas?e={texto} -> busca el texto indicado en las etiquetas asignadas a la receta. Devuelve la lista de recetas que tengan en sus etiquetas, al menos, una de las palabras separadas por comas "," indicadas en {texto}. Por ejemplo: api/recetas?e=pasta,postre
 //   api/recetas?d={valor} -> busca recetas de la dificultad indicada en {valor}. Nota: La dificultad es un valor entre 1 y 3

// ---------------------------------------------------------------------------------
// PAGINACIÓN POR RESULTADOS
//	 api/recetas?reg={número del primer registro a devolver (empieza en 0)}&cant={cantidad de registros a devolver} -> devuelve los registros que están entre las posiciones reg y reg + cant - 1. Por ejemplo: api/recetas?t=carne,queso&reg=24&cant=6
// =================================================================================
// INCLUSIÓN DEL FICHERO DE CONFIGURACIÓN Y DE LA CONEXIÓN A LA BD
// =================================================================================
require_once('../inc/config.php'); // Constantes, etc ...
require_once('../inc/database.php');
// =================================================================================
// SE OBTIENE LA CONEXIÓN A AL BD
// =================================================================================
$db    = new Database();
$dbCon = $db->getConnection();
// =================================================================================
// RECURSO QUE VIENE EN LA PETICIÓN HTTP
// =================================================================================
if(strlen($_GET[_REC_]) > 0)
    $RECURSO = explode("/", substr($_GET[_REC_],1));
else
    $RECURSO = [];
// Se pillan los parámetros de la petición
$PARAMS = array_slice($_GET, 1, count($_GET) - 1,true);

// =================================================================================
// =================================================================================
// FUNCIONES AUXILIARES
// =================================================================================
// =================================================================================

// =================================================================================
// Añade las condiciones de filtro (búsqueda)
// =================================================================================
// $valores -> Guardará los valores de los parámetros, ya que la consulta es preparada
// $params  -> Trae los parámetros de la petición
function aplicarFiltro(&$valores, $params)
{
    $filtroSQL = '';

    // FILTRO POR TEXTO
    if( isset($params['t']) )
    {
        if($filtroSQL != '') $filtroSQL .= ' and';
        $filtroSQL .= ' (false';

        $texto = explode(',', $params['t']);
        $paraTexto = '';
        foreach ($texto as $idx=>$valor) {
            $paraTexto .= ' or r.nombre like :NOMBRE' . $idx . ' or r.elaboracion like :ELABORACION' . $idx;
            $valores[':NOMBRE' . $idx] = '%' . trim($valor) . '%';
            $valores[':ELABORACION' . $idx] = '%' . trim($valor) . '%';
        }
        $filtroSQL .= $paraTexto . ')';
    }
    // FILTRO POR AUTOR
    if( isset($params['a']) )
    {
        if($filtroSQL != '') $filtroSQL .= ' and';
        $filtroSQL .= ' (false';

        $texto = explode(',', $params['a']);
        $paraAutor = '';
        foreach ($texto as $idx=>$valor) {
            $paraAutor .= ' or r.autor like :AUTOR' . $idx;
            $valores[':AUTOR' . $idx] = '%' . trim($valor) . '%';
        }
        $filtroSQL .= $paraAutor . ')';
    }
    // FILTRO POR INGREDIENTE
    if( isset($params['i']) )
    {
        if($filtroSQL != '') $filtroSQL .= ' and';
        $filtroSQL .= ' r.id in (';
        $filtroSQL .= 'select distinct idReceta from ingrediente i where false';

        $texto = explode(',', $params['i']);
        $paraIngrediente = '';
        foreach ($texto as $idx=>$valor) {
            $paraIngrediente .= ' or i.texto like :INGR' . $idx;
            $valores[':INGR' . $idx] = '%' . trim($valor) . '%';
        }
        $filtroSQL .= $paraIngrediente . ')';
    }
    // FILTRO POR ETIQUETA
    if( isset($params['e']) )
    {
        if($filtroSQL != '') $filtroSQL .= ' and';
        $filtroSQL .= ' r.id in (';
        $filtroSQL .= 'select distinct r.id from receta_etiqueta re, receta r, etiqueta e ';
        $filtroSQL .= 'where re.idReceta=r.id and re.idEtiqueta=e.id ';
        $filtroSQL .= 'and (false';

        $texto = explode(',', $params['e']);
        $paraEtiqueta = '';
        foreach ($texto as $idx=>$valor) {
            $paraEtiqueta .= ' or e.nombre like :ETIQ' . $idx;
            $valores[':ETIQ' . $idx] = '%' . trim($valor) . '%';
        }
        $filtroSQL .= $paraEtiqueta . '))';
    }
    // FILTRO POR DIFICULTAD
    if( isset($params['d']) && is_numeric($params['d']) )
    {
        if($filtroSQL != '') $filtroSQL .= ' and';
        $filtroSQL .= ' r.dificultad=' . $params['d'];
    }

    return $filtroSQL;
}
// =================================================================================
// =================================================================================
// FIN DE FUNCIONES AUXILIARES
// =================================================================================
// =================================================================================

// =================================================================================
// CONFIGURACIÓN DE SALIDA JSON Y CORS PARA PETICIONES AJAX
// =================================================================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Content-Type: application/json; charset=UTF-8");
// =================================================================================
// SE PREPARA LA RESPUESTA
// =================================================================================
$R                   = [];  // Almacenará el resultado.
$RESPONSE_CODE       = 200; // código de respuesta por defecto: 200 - OK
$mysql               = '';  // para el SQL
$VALORES             = [];  // Son los valores para hacer la consulta
$TOTAL_COINCIDENCIAS = -1;  // Total de coincidencias en la BD
// =================================================================================
// SE COGE EL ID DEL REGISTRO, SI EXISTE
// =================================================================================
$ID = array_shift($RECURSO); // Se comprueba si se proporciona el id del registro
// =================================================================================
// SQL POR DEFECTO PARA SELECCIONAR TODOS LOS REGISTROS
// =================================================================================
$mysql  = 'select r.id, r.nombre, r.personas, r.dificultad, r.tiempo ';
$mysql .= ', (select archivo from foto f where f.idReceta=r.id order by id limit 1) as imagen ';

if(is_numeric($ID)) {
    // INFORMACIÓN RELACIONADA CON UN REGISTRO CONCRETO
    switch (array_shift($RECURSO))
    {
        case 'comentarios': // SE PIDEN LOS COMENTARIOS DE LA RECETA
                $mysql   = 'select u.login,c.titulo,c.texto,c.fechaHora from comentario c, usuario u where c.idReceta=:ID_REC and c.autor=u.login order by fechaHora desc';
                $VALORES = [];
            break;
        case 'etiquetas': // SE PIDEN LAS ETIQUETAS DE LA RECETA
                $mysql   = 'select e.id, e.nombre from etiqueta e, receta_etiqueta re where re.idEtiqueta=e.id and re.idReceta=:ID_REC order by nombre';
                $VALORES = [];
            break;
        case 'ingredientes': // SE PIDEN LOS INGREDIENTES DE LA RECETA
                $mysql   = 'select i.id, i.texto from ingrediente i where idReceta=:ID_REC';
                $VALORES = [];
            break;
        case 'fotos': // SE PIDEN LAS FOTOS ASOCIADAS A LA RECETA INDICADA
                $mysql   = 'select * from foto where idReceta=:ID_REC';
                $VALORES = [];
            break;
        default: // SE PIDE TODA LA INFORMACIÓN DE UNA RECETA CONCRETA
                $mysql .= ', r.autor, r.elaboracion, DATE_FORMAT(r.fechaHora,"%Y-%m-%d") as fechaCreacion ';
                $mysql .= ' FROM receta r';
                $mysql .= ' where r.id=:ID_REC';
                $info_completa = true; // Hay que devolver toda la información
            break;
    }
    $VALORES[':ID_REC'] = $ID;
}
else if( count($PARAMS) > 0 ) {
    // INFORMACIÓN RELACIONADA CON TODOS LOS REGISTROS

    $mysql .= ' from receta r where true ';

    // =================================================================================
    // SE AÑADE EL FILTRO EN FUNCIÓN DE LOS PARÁMETROS
    // =================================================================================
    $filtroSQL = aplicarFiltro($VALORES, $PARAMS);
    if($filtroSQL != ''){
        if(substr($filtroSQL,0, strlen(' having ')) == ' having ')
            $mysql .= $filtroSQL;
        else
            $mysql .= ' and' . $filtroSQL;
    }
    // =================================================================================
    // SE AÑADE EL ORDEN DE BÚSQUEDA
    // =================================================================================
    $mysql .= ' order by r.fechaHora desc';
}
else {
    // SE AÑADE LA IMAGEN PARA MOSTRAR LOS DATOS DE TODOS LOS REGISTROS
    $mysql .= ', (select archivo from foto f where f.idReceta=r.id order by id limit 1) as imagen FROM receta r';
    $mysql .= ' order by r.fechaHora desc';
}
// echo $mysql;
// exit();

// =================================================================================
// SE CONSTRUYE LA PARTE DEL SQL PARA PAGINACIÓN
// =================================================================================
if(isset($PARAMS['reg']) && is_numeric($PARAMS['reg'])      // Página a listar
    && isset($PARAMS['cant']) && is_numeric($PARAMS['cant']))   // Tamaño de la página
{
    $SQL_PAGINACION   = ' LIMIT ' . $PARAMS['reg'] . ',' . $PARAMS['cant'];
    // =================================================================================
    // Para sacar el total de coincidencias que hay en la BD:
    // =================================================================================
    $RESPUESTA = $db->select($mysql, $VALORES);
    if($RESPUESTA['CORRECTO'])
    {
        $TOTAL_COINCIDENCIAS = count($RESPUESTA['RESULT']);
        $R['TOTAL_COINCIDENCIAS'] = count($RESPUESTA['RESULT']);
        $R['REG']  = $PARAMS['reg'];
        $R['CANT'] = $PARAMS['cant'];
    }

    $mysql .= $SQL_PAGINACION;
}

// =================================================================================
// SE HACE LA CONSULTA
// =================================================================================
// Se hace la petición con el sql preparado completo y sus parámetros, y se obtiene el resultado
$RESPUESTA = $db->select($mysql, $VALORES);
if( $RESPUESTA['CORRECTO'] ) // execute query OK
{
    $RESPONSE_CODE  = 200;
    $R = ['RESULTADO' => 'OK'] + $R;
    $R['FILAS']     = $RESPUESTA['RESULT'];
}
else
{
    $RESPONSE_CODE    = 500;
    $R['RESULTADO']   = 'ERROR' ;
    $R['DESCRIPCION'] = 'Se ha producido un error en el servidor al ejecutar la consulta.';
    $R['ERROR']       = $RESULTADO['ERROR'];
}
$R = ['CODIGO'=>$RESPONSE_CODE] + $R;
// =================================================================================
// SE CIERRA LA CONEXION CON LA BD
// =================================================================================
$dbCon = null;
// =================================================================================
// SE DEVUELVE EL RESULTADO DE LA CONSULTA
// =================================================================================
http_response_code($RESPONSE_CODE);
echo json_encode($R);
?>
