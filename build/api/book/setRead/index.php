<?php
header('Content-Type: text/plain; charset=utf-8');

include_once '../../class/SQL.php';

$sql = new SQL();
$res = $sql->getResult('SELECT author_id FROM token WHERE BINARY token = "'.$_COOKIE['token'].'"');

if($res) {
    if ($res->num_rows) {
        $row = $res->fetch_assoc();
        $author_id = $row['author_id'];
        $res = $sql->getResult(
            'SELECT viewTime FROM bookRead
            WHERE id_author = "'.$author_id.'" and id_book = "'.$_POST['id'].'"');
        if($res) {
            if ($res->num_rows) {
                $row = $res->fetch_assoc();
                if($row['viewTime'] < $_POST['time']){
                    $sql->getResult(
                        'UPDATE bookRead SET viewTime = "'.$_POST['time'].'", readdate=NOW()
                        WHERE id_author = "'.$author_id.'" and id_book = "'.$_POST['id'].'"');
                }
                else{
                    $sql->getResult(
                        'UPDATE bookRead SET readdate=NOW()
                        WHERE id_author = "'.$author_id.'" and id_book = "'.$_POST['id'].'"');
                }
            }
            else{
                $res = $sql->getResult(
                    'INSERT INTO bookRead (id_author,UID,id_book,viewTime,readdate)
                    VALUES ("'.$author_id.'","","'.$_POST['id'].'","'.$_POST['time'].'",NOW())');
            }
        }
    }
    else {

        $res = $sql->getResult(
            'SELECT viewTime FROM bookRead
            WHERE UID = "'.$_COOKIE['UID'].'" and id_book = "'.$_POST['id'].'"');
        if($res) {
            if ($res->num_rows) {
                $row = $res->fetch_assoc();
                if($row['viewTime'] < $_POST['time']){
                    $sql->getResult(
                        'UPDATE bookRead SET viewTime = "'.$_POST['time'].'", readdate=NOW()
                        WHERE UID = "'.$_COOKIE['UID'].'" and id_book = "'.$_POST['id'].'"');
                }
                else{
                    $sql->getResult(
                        'UPDATE bookRead SET readdate=NOW()
                        WHERE UID = "'.$_COOKIE['UID'].'" and id_book = "'.$_POST['id'].'"');
                }
            }
            else{
                $res = $sql->getResult(
                    'INSERT INTO bookRead (id_author,UID,id_book,viewTime,readdate)
                    VALUES (-1,"'.$_COOKIE['UID'].'","'.$_POST['id'].'","'.$_POST['time'].'", NOW())');
            }
        }
    }
}
