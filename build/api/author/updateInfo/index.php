<?php
header('Content-Type: application/json; charset=utf-8');

include_once '../../class/SQL.php';

if(isset($_COOKIE['token'])){

    $sql = new SQL();
    $res = $sql->getResult('SELECT author_id FROM token WHERE BINARY token = "'.$_COOKIE['token'].'"');

    if ($res) {
        if($res->num_rows > 0) {
            $row = $res->fetch_assoc();
            $id = $row['author_id'];

            $parametr = '';
            foreach ($_POST['user'] as $key => $value) {
                if($parametr != ''){
                    $parametr .= ',';
                }
                if($key == 'birthday'){
                    $parametr .= "$key = STR_TO_DATE('$value','%d.%m.%Y')";
                }
                else{
                    $parametr .= str_replace('notice.n','noticeN',str_replace('favorite.','fav',$key))." = '$value'";
                }
            }

            $res = $sql->getResult('UPDATE author SET '.$parametr.' WHERE id = "'.$id.'"');
            if ($res) {
                echo '{"success":"true"}';
            }
            else{
                echo '{"error":"connection"}';
            }
        }
        else{
            echo '{"error":"noUser"}';
        }
    }
    else{
        echo '{"error":"connection"}';
    }
}
else{
    echo '{"error":"noUser"}';
}