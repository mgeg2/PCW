<?php
// =================================================================================
// HACER REGISTRO
// =================================================================================
// FICHERO: api/post/usuarios/registro.php
// MÉTODO: POST
// PETICIONES POST ADMITIDAS:
// * api/usuarios/registro -> Dar de alta un nuevo usuario
//      Params: usu:login del usuario; pwd:password del usuario; pwd2:password de usuario repetido; email:email del usuario;
// =================================================================================
// INCLUSION DE LA CONEXION A LA BD
// =================================================================================
require_once('../../inc/config.php'); // Constantes, etc ...
require_once('../../inc/database.php');
// =================================================================================
// Se instancia la base de datos y el objeto producto
// =================================================================================
$db    = new Database();
$dbCon = $db->getConnection();
// =================================================================================
// COMPROBAR SI EXISTE EL USUARIO EN LA BD
// =================================================================================
function comprobarExistencia($login, $db)
{
    $valorRet = false;
    $mysql    = 'select * from usuario where login=:LOGIN';

    $RESPUESTA = $db->select($mysql, [':LOGIN'=>$login]);
    if($RESPUESTA['CORRECTO'])
    {
      // Se comprueba si el resultado tiene un único registro y si el password coincide
      if( count($RESPUESTA['RESULT'])==1 && $RESPUESTA['RESULT'][0]['login'] == $login )
        $valorRet = true;
    }
    return $valorRet;
}
// =================================================================================
// CONFIGURACION DE SALIDA JSON Y CORS PARA PETICIONES AJAX
// =================================================================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
// =================================================================================
// Se prepara la respuesta
// =================================================================================
$R = [];  // Almacenará el resultado.
// =================================================================================
// Se cogen los parámetros de la petición
// =================================================================================
$PARAMS = $_POST;
// =================================================================================
// Se cogen el usuario y el login:
// =================================================================================
$login = $PARAMS['usu'];
$pwd   = $PARAMS['pwd'];
$pwd2  = $PARAMS['pwd2'];
$email = $PARAMS['email'];

if( $pwd != $pwd2 )
{ // Contraseñas distintas
  $RESPONSE_CODE    = 422; // UNPROCESSABLE ENTITY
  $R['RESULTADO']   = 'ERROR';
  $R['CODIGO']      = $RESPONSE_CODE;
  $R['DESCRIPCION'] = 'Contraseñas distintas';
}
else if( $login == '' )
{
  $RESPONSE_CODE    = 422;
  $R['RESULTADO']   = 'ERROR';
  $R['CODIGO']      = $RESPONSE_CODE;
  $R['DESCRIPCION'] = 'Login no válido';
}
else
{
  try{
    // ******** INICIO DE TRANSACCION **********
    $dbCon->beginTransaction();
    if(!comprobarExistencia($login, $db))
    { // El usuario no existe, se da de alta
      $mysql  = 'insert into usuario(login,pwd,email) values(:LOGIN,:PWD,:EMAIL)';
      $VPARAMS[':LOGIN'] = $login;
      $VPARAMS[':PWD']   = $pwd;
      $VPARAMS[':EMAIL'] = $email;

      if( $db->executeStatement($mysql, $VPARAMS) )
      {
        $RESPONSE_CODE    = 201; // RESOURCE CREATED INSIDE A COLLECTION
        $R['RESULTADO']   = 'OK';
        $R['CODIGO']      = $RESPONSE_CODE;
        $R['DESCRIPCION'] = 'Usuario creado correctamente';
        $R['LOGIN']       = $login;
      }
      else
      {
        $RESPONSE_CODE    = 500; // INTERNAL SERVER ERROR
        $R['RESULTADO']   = 'ERROR';
        $R['CODIGO']      = $RESPONSE_CODE;
        $R['DESCRIPCION'] = 'Error indefinido al crear el nuevo registro';
      }
    } // if(!comprobarExistencia($login))
    else
    { // El usuario existe
      $RESPONSE_CODE    = 409; // CONFLICT
      $R['RESULTADO']   = 'ERROR';
      $R['CODIGO']      = $RESPONSE_CODE;
      $R['DESCRIPCION'] = 'Login no válido, ya está en uso.';
    }
    // ******** FIN DE TRANSACCION **********
    $dbCon->commit();
  } catch(Exception $e){
    // Se ha producido un error, se cancela la transacción.
    $dbCon->rollBack();
  }
}
// =================================================================================
// SE CIERRA LA CONEXION CON LA BD
// =================================================================================
$dbCon = null;
// =================================================================================
// SE DEVUELVE EL RESULTADO DE LA CONSULTA
// =================================================================================
http_response_code($RESPONSE_CODE);
print json_encode($R);
?>
