<?php
// FICHERO: api/post/recetas.php
// PETICIONES POST ADMITIDAS:
// Nota: Todas las operaciones deberán añadir a la petición POST una cabecera "Authorization" con el valor "{LOGIN}:{TOKEN}".
// * api/recetas -> Dar de alta un nuevo registro
//   Params: nombre:Nombre de la receta;
//           elaboracion:Texto de la elaboración de la receta;
//           tiempo:Tiempo en minutos de elaboración
//           personas:Número de personas para las que se elabora la receta
//           dificultad:Valor númerico de dificultad de la receta (0-Baja; 1-Media; 2-Alta)
//           ingredientes[]:array de ingredientes de la receta;
//           etiquetas[]:array de etiquetas asignadas a la receta;
//           fotos[]:array de fotos. Cada elemento del array es un input de tipo file
//           descripciones[]:array de descripciones de las fotos.
// * api/recetas/{ID}/comentarios -> Da de alta un comentario para el registro asociado.
//   Params: titulo:Título del comentario;
//           texto:Texto del comentario
// =================================================================================
// INCLUSIÓN DE LA CONEXIÓN A LA BD
// =================================================================================
require_once('../inc/config.php'); // Constantes, etc ...
require_once('../inc/database.php');
// =================================================================================
// Se instancia la base de datos y el objeto producto
// =================================================================================
$db    = new Database();
$dbCon = $db->getConnection();
// =================================================================================
// La instrucción siguiente es para poder recoger tanto errores como warnings que
// se produzcan en las operaciones sobre la BD (funciondes php errorCode() y errorInfo())
// =================================================================================
$dbCon->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
// =================================================================================
// =================================================================================
// CONFIGURACION DE SALIDA JSON Y CORS PARA PETICIONES AJAX
// =================================================================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
// =================================================================================
// Se toman la parte de la url que viene a partir de publicaciones
// =================================================================================
$RECURSO = explode("/", substr($_GET['prm'],1));
// =================================================================================
// =================================================================================
// FUNCIONES AUXILIARES
// =================================================================================
// =================================================================================
/**
 * Copia el archivo indicado al servidor e inserta el correspondiente registro en la BD.
 * @param integer $ID - ID del lugar al que pertenece la foto
 * @param $_FILES['fotos'] $FICHEROS - Array de ficheros de la petición POST de php
 * @param texto[] $DESCRIPCIONES - Descripciones de las fotos
 * @param integer $NFOTO - Índice del fichero de foto de $_FILES a subir
 * @return integer - Retorna 0 si todo fue bien. Retorna -1 si hubo algún error al intentar guardar la foto en la BD. Retorna -2 si no se pudo guardar en disco. Retorna 2 si el tamaño del fichero es mayor al permitido.
*/
function subirFoto($ID_RECETA, $FICHEROS, $DESCRIPCION, $NFOTO)
{
  global $db, $TAM_MAX_ARCHIVO;

  $valor_retorno = -1;

  if($FICHEROS['size'][$NFOTO] <= $TAM_MAX_ARCHIVO)
  {
    $mysql = 'insert into foto(descripcion,idReceta,archivo) values(:DESCRIPCION,:ID_RECETA,:ARCHIVO);';

    $VALORES                 = [];
    $VALORES[':DESCRIPCION'] = $DESCRIPCION;
    $VALORES[':ID_RECETA']   = $ID_RECETA;
    $VALORES[':ARCHIVO']     = ''; // nombre por defecto del archivo. Luego se cambia.

    if( $db->executeStatement($mysql, $VALORES) )
    {
      $mysql = 'select max(ID) as id_fichero from foto';
      $RESPUESTA = $db->select($mysql);
      if( $RESPUESTA['CORRECTO'] )
      {
        $row = $RESPUESTA['RESULT'][0];
        $ID_FICHERO = $row['id_fichero'];

        $ext = pathinfo($FICHEROS['name'][$NFOTO], PATHINFO_EXTENSION); // extensión del fichero
        $NOMBRE_FICHERO = $ID_FICHERO . '.' . $ext;
        $upload_dir     = '../../' . PATH_FOTOS;
        $uploadfile     = $upload_dir . $NOMBRE_FICHERO; // path fichero destino

        // Se comprueba si la carpeta existe y tiene permisos de escritura
        if (is_dir($upload_dir) && is_writable($upload_dir))
        {
          if(move_uploaded_file($FICHEROS['tmp_name'][$NFOTO], $uploadfile)) // se sube el fichero
          {
            $mysql = 'update foto set archivo=:FICHERO where id=:ID_FICHERO';
            $VALORES                = [];
            $VALORES[':FICHERO']    = $NOMBRE_FICHERO;
            $VALORES[':ID_FICHERO'] = $ID_FICHERO;

            $valor_retorno = 0; // Se guardó bien la foto
          }
          else
          { // No se ha podido copiar la foto. Hay que eliminar el registro
            $mysql = 'delete from foto where id=:ID_FICHERO';
            $VALORES[':ID_FICHERO'] = $ID_FICHERO;
            $valor_retorno = -2;
          }
          // SE EJECUTA LA CONSULTA
          $db->executeStatement($mysql, $VALORES);
        }
        else{
          $valor_retorno = -3; // No existe el directorio o no tiene permisos de escritura
        }
      }
    }
  }
  else
  { // Archivo demasiado grande
    $valor_retorno = 2;
  }

  return $valor_retorno;
}
// =================================================================================
// Se pillan las cabeceras de la petición y se comprueba que está la de autorización
// =================================================================================
$headers = apache_request_headers();
// CABECERA DE AUTORIZACIÓN
if(isset($headers['Authorization']))
    $AUTORIZACION = $headers['Authorization'];
elseif (isset($headers['authorization']))
    $AUTORIZACION = $headers['authorization'];

if(!isset($AUTORIZACION))
{ // Acceso no autorizado
  $RESPONSE_CODE    = 403;
  $R['RESULTADO']   = 'ERROR';
  $R['CODIGO']      = $RESPONSE_CODE;
  $R['DESCRIPCION'] = 'Falta autorización';
}
else
{
  // =================================================================================
  // Se prepara la respuesta
  // =================================================================================
  $R             = [];  // Almacenará el resultado.
  $RESPONSE_CODE = 200; // código de respuesta por defecto: 200 - OK
  // =================================================================================
  // =================================================================================
  // Se supone que si llega aquí es porque todo ha ido bien y tenemos los datos correctos
  // de la nueva entrada, NO LAS FOTOS. Las fotos se suben por separado una vez se haya
  // confirmado la creación correcta de la entrada.
  $PARAMS = $_POST;
  list($login,$token) = explode(':', $AUTORIZACION);

  if( !$db->comprobarSesion($login,$token) )
  {
    $RESPONSE_CODE    = 401;
    $R['RESULTADO']   = 'ERROR';
    $R['CODIGO']      = $RESPONSE_CODE;
    $R['DESCRIPCION'] = 'Error de autenticación.';
  }
  else
  {
    $ID_REGISTRO = array_shift($RECURSO);
    try{
      $dbCon->beginTransaction();
      if(!is_numeric($ID_REGISTRO)) // NUEVO REGISTRO
      { // Si no es numérico $ID es porque se está creando un nuevo registro
        $nombre        = $PARAMS['nombre'];
        $elaboracion   = nl2br($PARAMS['elaboracion'],false);
        $tiempo        = $PARAMS['tiempo'];
        $personas      = $PARAMS['personas'];
        $dificultad    = $PARAMS['dificultad'];
        $ingredientes  = $PARAMS['ingredientes'];
        $etiquetas     = $PARAMS['etiquetas'];
        $descripciones = $PARAMS['descripciones'];

        // =================================================================================
        // Se inserta el registro principal
        // =================================================================================
        $mysql  = 'insert into receta(nombre,elaboracion,personas,dificultad,tiempo,autor) ';
        $mysql .= 'values(:NOMBRE,:ELABORACION,:PERSONAS,:DIFICULTAD,:TIEMPO,:AUTOR)';
        $VALORES                 = [];
        $VALORES[':NOMBRE']      = $nombre;
        $VALORES[':ELABORACION'] = $elaboracion;
        $VALORES[':PERSONAS']    = $personas;
        $VALORES[':DIFICULTAD']  = $dificultad;
        $VALORES[':TIEMPO']      = $tiempo;
        $VALORES[':AUTOR']       = $login;

        if( $db->executeStatement($mysql, $VALORES) )
        { // SI SE CREA EL REGISTRO CORRECTAMENTE SE BUSCA SU ID
          $mysql = "select MAX(id) as idReceta from receta";
          $RESPUESTA = $db->select($mysql);
          if($RESPUESTA['CORRECTO'])
          {
            $ID_RECETA = $RESPUESTA['RESULT'][0]['idReceta'];

            $VALORES               = [];
            $VALORES[':ID_RECETA'] = $ID_RECETA;
            // ===============================
            // Se insertan los ingredientes
            // ===============================
            foreach ($ingredientes as $ing) {
              $mysql = "insert into ingrediente(idReceta, texto) values(:ID_RECETA, :TEXTO)";
              $VALORES[':TEXTO'] = $ing;
              if( !$db->executeStatement($mysql, $VALORES) ) {
                print("ERROR al insertar el ingrediente: " . $ing . "\n");
              }
            }
            // ===============================
            // Se insertan las etiquetas
            // ===============================
            foreach ($etiquetas as $etiq) {
              // Primero se busca la etiqueta. Si existe, no se inserta como nueva
              $mysql = "select * from etiqueta where nombre=:NOMBRE";
              $RESPUESTA = $db->select($mysql, [':NOMBRE'=>$etiq]);
              if($RESPUESTA['CORRECTO'])
              {
                if(count($RESPUESTA['RESULT']) > 0 )
                { // Ya existe la etiqueta
                  $ID_ETIQUETA = $RESPUESTA['RESULT'][0]['id'];
                }
                else
                { // No existe la etiqueta. Hay que darla de alta
                  $mysql = 'insert into etiqueta(nombre) values(:NOMBRE)';
                  if( !$db->executeStatement($mysql, [':NOMBRE'=>$etiq]) ) {
                    print("ERROR al insertar la etiqueta: " . $etiq . "\n");
                  }
                  else {
                    // Se busca el id de la nueva etiqueta
                    $mysql = 'select max(id) as idMax from etiqueta';
                    $RESPUESTA = $db->select($mysql);
                    if($RESPUESTA['CORRECTO'])
                    {
                      if(count($RESPUESTA['RESULT']) > 0 ){
                        $ID_ETIQUETA = $RESPUESTA['RESULT']['0']['idMax'];
                      }
                    }
                  }
                }
                // Ahora se inserta el registro en la tabla receta_etiqueta
                $mysql = "insert into receta_etiqueta(idReceta, idEtiqueta) values(:ID_RECETA,:ID_ETIQUETA)";

                $VALORES                 = [];
                $VALORES[':ID_RECETA']   = $ID_RECETA;
                $VALORES[':ID_ETIQUETA'] = $ID_ETIQUETA;
                if( !$db->executeStatement($mysql, $VALORES) ) {
                  print("ERROR al insertar la relación receta_etiqueta: " . $ID_RECETA . "-" . $ID_ETIQUETA . "\n");
                }
              }
              else {
                print("ERROR");
              }
            }

            // ===============================
            // Si hay fotos, hay que guardarlas
            // ===============================
            if(isset($_FILES['fotos'])) {
                $fotos = [];

                if($_FILES['fotos']['error'][0] != UPLOAD_ERR_NO_FILE)
                { // Hay ficheros que guardar
                  for($i=0;$i<count($_FILES['fotos']['name']);$i++)
                  {
                    $val_ret = subirFoto($ID_RECETA, $_FILES['fotos'], $descripciones[$i], $i);
                    $fotoSubida             = [];
                    $fotoSubida['NOMBRE']   = $_FILES['fotos']['name'][$i];
                    $fotoSubida['GUARDADA'] = ($val_ret == 0)?'SI':'NO';
                    if($val_ret !=0)
                    {
                      switch($val_ret)
                      {
                        case -1: // Error al intentar guardar la foto en la BD
                            $fotoSubida['ERROR'] = 'No se ha podido guardar la foto en la BD. Error del servidor o la BD no está creada.';
                          break;
                        case -2: // Error al intentar guardar la foto en disco
                            $fotoSubida['ERROR'] = 'No se ha podido copiar la foto a la carpeta de fotos.';
                          break;
                        case -3: // La carpeta de fotos no existe o no tiene permisos de escritura
                            $fotoSubida['ERROR'] = 'No se ha podido copiar la foto a la carpeta de fotos. Puede ser que la carpeta de fotos no exista o no tenga permisos de escritura.';
                          break;
                        case 2: // No se guarda la foto porque pesa más de lo permitido
                            $fotoSubida['ERROR'] = 'No se ha podido guardar la foto porque pesa más de lo permitido (' . ($max_uploaded_file_size/1024) . 'KB)';
                          break;
                      }
                    }
                    array_push($fotos, $fotoSubida);
                  }
                }
            }

            // Se prepara la respuesta
            $RESPONSE_CODE    = 201;
            $R['RESULTADO']   = 'OK';
            $R['CODIGO']      = $RESPONSE_CODE;
            $R['DESCRIPCION'] = 'Registro creado correctamente';
            $R['ID_RECETA']   = $ID_RECETA;
            $R['NOMBRE']      = $nombre;
            $R['FOTOS']       = $fotos;

          }
          else
            $ID = -1;
        }
        else
        {
          $RESPONSE_CODE    = 500; // INTERNAL SERVER ERROR
          $R['RESULTADO']   = 'ERROR';
          $R['CODIGO']      = $RESPONSE_CODE;
          $R['DESCRIPCION'] = 'Error indefinido al crear el nuevo registro';
        }
      }
      else // El registro ya existe y se quiere realizar alguna operación sobre él
      {
        $VALORES               = [];
        $VALORES[':ID_RECETA'] = $ID_REGISTRO;
        $VALORES[':LOGIN']     = $login;
        $rec = array_shift($RECURSO);
        switch( $rec ){
          case 'comentarios': // Dejar comentario para una receta
              $VALORES[':TITULO'] = $PARAMS['titulo'];
              $VALORES[':TEXTO']  = nl2br($PARAMS['texto'],false);
              $mysql  = 'insert into comentario(titulo,texto, autor, idReceta) ';
              $mysql .= 'values(:TITULO, :TEXTO, :LOGIN, :ID_RECETA)';
              $mensaje = 'Guardar comentario.';

              if($db->executeStatement($mysql, $VALORES)){
                $RESPONSE_CODE    = 201;
                $R['RESULTADO']   = 'OK';
                $R['CODIGO']      = $RESPONSE_CODE;
                $R['DESCRIPCION'] = $mensaje . ' Operación realizada correctamente.';
              }
              else
              {
                $RESPONSE_CODE    = 500; // INTERNAL SERVER ERROR
                $R['RESULTADO']   = 'ERROR';
                $R['CODIGO']      = $RESPONSE_CODE;
                $R['DESCRIPCION'] = $mensaje . ' Error indefinido al realizar la operación';
              }
            break;
        }
      } // else // El registro ya existe y se quiere realizar alguna operación sobre él

      $dbCon->commit();
    }catch(Exception $e){
      echo $e;
      $dbCon->rollBack();
    }
  } // if( !comprobarSesion($login,$clave) )
}
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
