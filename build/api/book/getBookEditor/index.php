<?php
header('Content-Type: application/json; charset=utf-8');
header("Content-Encoding: gzip");

include_once '../../class/Book.php';
include_once '../../class/SQL.php';

$query = "SELECT id, REPLACE(TRIM(CONCAT(Name,' ',Name2)),'\"','\\\"') as name, avatarUrl
          FROM author inner join token on token.author_id = author.id and BINARY token.token = '" . $_COOKIE['token'] . "'";

$sql = new SQL();
$res = $sql->getResult($query);

if ($res) {
    if ($res->num_rows) {
        $row = $res->fetch_assoc();
        $authorId = $row['id'];
        $authorName = $row['name'];
        $authorAvatar = $row['avatarUrl'];

        $authorJSON = "{\"id\":\"$authorId\",\"name\":\"$authorName\",\"avatarUrl\":\"$authorAvatar\"}";

        $book = new BookEditor($authorJSON, 0, 1, '', '', '', '');

        if (strpos($_POST['path'], 'write') !== false && $_POST['id'] > 0) {
            $query = 'SELECT IF(parent_id=0,id,parent_id) as parent_id, (level + 1) as level, name, genreIds
                      FROM bookview as book LEFT OUTER JOIN bookgenreview
                      ON IF( parent_id =0, id, parent_id ) = book_id WHERE id = "'.$_POST['id'].'"';
            $res = $sql->getResult($query);

            if ($res) {
                if ($res->num_rows) {
                    $row = $res->fetch_assoc();
                    $book = new BookEditor($authorJSON, $row['parent_id'], $row['level'], $row['name'], '', $row['genreIds'], '');
                }
                else{
                    echo gzencode ('{"error":"noBook"}', 1);
                    unset($book);
                }
            }
            else{
                echo gzencode ('{"error":"connection"}', 1);
                unset($book);
            }
        }
        else if(strpos($_POST['path'], 'edit') !== false){
            $query = 'SELECT id, parent_id, level, name, chapter, text, genreIds, author_id
                      FROM bookview as book LEFT OUTER JOIN bookgenreview
                      ON IF( parent_id =0, id, parent_id ) = book_id WHERE id = "'.$_POST['id'].'"';
            $res = $sql->getResult($query);

            if ($res) {
                if ($res->num_rows) {
                    $row = $res->fetch_assoc();
                    $book = new BookEditor($authorJSON, $row['parent_id'], $row['level'], $row['name'], $row['chapter'], $row['genreIds'], $row['text']);

                    if($row['author_id'] != $authorId){
                        echo gzencode ('{"error":"editOff"}', 1);
                        unset($book);
                    }
                    else{
                        $query = 'SELECT parent_id FROM booknextchapterview
                                  WHERE parent_id = "'.($row['parent_id'] > 0 ? $row['parent_id'] : $row['id']).
                                '" and level="'.($row['level'] + 1).'" and prev_id="'.$_POST['id'].'"';
                        $res = $sql->getResult($query);
                        if ($res->num_rows) {
                            echo gzencode ('{"error":"editOff"}',1);
                            unset($book);
                        }
                    }
                }
                else{
                    echo gzencode ('{"error":"noBook"}', 1);
                    unset($book);
                }
            }
            else{
                echo gzencode ('{"error":"connection"}',1);
                unset($book);
            }
        }

        if(isset($book)){
            echo gzencode ($book->getJSON(), 6);
        }
    } else {
        echo gzencode ('{"error":"noUser"}',1);
    }
} else {
    echo gzencode ('{"error":"connection"}',1);
}