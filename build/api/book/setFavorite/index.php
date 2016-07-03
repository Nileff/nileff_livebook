<?php
header('Content-Type: application/json; charset=utf-8');

include_once '../../class/SQL.php';

$sql = new SQL();
$res = $sql->getResult('SELECT author_id FROM token WHERE BINARY token = "'.$_COOKIE['token'].'"');

if($res){
    if($res->num_rows){
        $row = $res->fetch_assoc();
        $author_id = $row['author_id'];
        $book_id = $_POST['id'];
        $parent_id = $_POST['parent_id'];
        if($parent_id == 0){
            $parent_id = $book_id;
        }

        $res = $sql->getResult('SELECT book_id FROM bookmark
                                WHERE author_id = "'.$author_id.'" and parent_id = "'.$parent_id.'"');
        if($res) {
            if($res->num_rows) {
                $row = $res->fetch_assoc();
                $query_book_id = $row['book_id'];
                if($query_book_id == $book_id) {
                    $res = $sql->getResult('DELETE FROM bookmark
                                            WHERE author_id = "' . $author_id . '" and parent_id = "' . $parent_id . '"');
                    if ($res) {
                        echo '{"error":"", "favorite":"false"}';
                    } else {
                        echo '{"error":"connection"}';
                    }
                }
                else{
                    $res = $sql->getResult('UPDATE bookmark
                                            SET book_id = "'.$book_id.'"
                                            WHERE author_id = "' . $author_id . '" and parent_id = "' . $parent_id . '"');
                    if ($res) {
                        echo '{"error":"", "favorite":"true"}';
                    } else {
                        echo '{"error":"connection"}';
                    }
                }
            }
            else{
                $res = $sql->getResult('INSERT INTO bookmark (parent_id, book_id, author_id)
                                        VALUES ("'.$parent_id.'","'.$book_id.'","'.$author_id.'")');
                if($res) {
                    echo '{"error":"", "favorite":"true"}';
                }
                else{
                    echo '{"error":"connection"}';
                }
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