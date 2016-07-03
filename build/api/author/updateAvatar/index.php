<?php
header('Content-Type: application/json; charset=utf-8');

include_once '../../class/SQL.php';

function generateRandomString($length = 61) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

function base64_to_jpeg($base64_string, $dir, $file) {
    $data = explode(',', $base64_string);

    if($data[0] == "data:image/jpeg;base64"){
        $ifp = fopen($dir.$file, "wb");
        fwrite($ifp, base64_decode($data[1]));
        fclose($ifp);
        return $file;
        /*
        if($ifp = fopen($dir.$file, "wb")){
            if(fwrite($ifp, base64_decode($data[1]))){
                fclose($ifp);
                return $file;
            }
        }*/
    }

    return false;
}

if(isset($_POST['avatarData']) && isset($_COOKIE['token'])){
    $sql = new SQL();
    $res = $sql->getResult('SELECT author_id FROM token WHERE BINARY token = "'.$_COOKIE['token'].'"');

    if ($res) {
        if($res->num_rows > 0) {
            $row = $res->fetch_assoc();
            $id = $row['author_id'];

            $dir = realpath ("../../../css/img/").'/';
            $file = 'author'.$id.'_'.generateRandomString(16).'.jpg';
            $result = base64_to_jpeg($_POST['avatarData'], $dir, $file);
            if($result == $file){
                $res = $sql->getResult('UPDATE author SET AvatarUrl="'.$file.'" WHERE id = "'.$id.'"');
                if ($res) {
                    echo '{"avatar":"'.$file.'"}';
                    $userAvatars = glob($dir.'author'.$id.'_*.jpg');
                    foreach($userAvatars as $avatar){
                        if(!strpos($avatar, $file)){
                            unlink($avatar);
                        }
                    }
                }
                else{
                    echo '{"error":"connection"}';
                }
            }
            else{
                echo '{"error":"'.$result.'"}';
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