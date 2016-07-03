<?php
header('Content-Type: application/json; charset=utf-8');

include_once '../../class/SQL.php';

$sql = new SQL();
$res = $sql->getResult('SELECT author_id FROM token WHERE BINARY token = "'.$_COOKIE['token'].'"');

if($res){
    if($res->num_rows){
        $row = $res->fetch_assoc();
        $id = $row['author_id'];

        $res = $sql->getResult('SELECT mark FROM mark WHERE author_id = "'.$id.'" and book_id = "'.$_POST['id'].'"');
        if($res) {
            $old_mark = -1;
            if($res->num_rows) {
                $row = $res->fetch_assoc();
                $old_mark = $row['mark'];

                $res = $sql->getResult('UPDATE mark SET mark="'.$_POST['mark'].'", markdate=NOW() WHERE author_id = "'.$id.'" and book_id = "'.$_POST['id'].'"');
            }
            else{
                $res = $sql->getResult('INSERT INTO mark (book_id, author_id, mark,markdate)
                        VALUES ("'.$_POST['id'].'","'.$id.'","'.$_POST['mark'].'", NOW())');
            }

            if($res) {
                $res = $sql->getResult('SELECT rating FROM bookmarkview WHERE book_id = "'.$_POST['id'].'"');

                if($res) {
                    $rating = 0;
                    if($res->num_rows) {
                        $row = $res->fetch_assoc();
                        $rating = $row['rating'];
                    }

                    echo '{"mark":"'.$_POST['mark'].'", "old_mark":"'.$old_mark.'", "rating":"'.$rating.'"}';
                }
                else{
                    echo '{"error":"connection"}';
                }
            }
            else{
                echo '{"error":"connection"}';
            }
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