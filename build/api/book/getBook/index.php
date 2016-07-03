<?php
header('Content-Type: application/json; charset=utf-8');
header("Content-Encoding: gzip");

include_once '../../class/Book.php';
include_once '../../class/SQL.php';

$sql = new SQL();
$sql->getResult("SET SESSION group_concat_max_len = 100000;");
$res = $sql->getResult('SELECT b.*, ifnull(favorite, 0) as favorite FROM
                        bookview as b
                        left outer join
                        (
                        SELECT bookmark.book_id, 1 as favorite FROM bookmark
                        inner join token
                        on binary token = "'.$_COOKIE['token'].'" and token.author_id = bookmark.author_id
                        WHERE bookmark.book_id = "'.$_POST['id'].'"
                        ) as favbook
                        on b.id = favbook.book_id
                        WHERE b.id = "'.$_POST['id'].'"');

if($res){
    if($res->num_rows){
        $row = $res->fetch_assoc();
        $book = new Book($row['author'],$row['parent_id'],$row['prev_id'],$row['name'],$row['text'],$row['rating'],$row['readCount'],$row['commentCount'],$row['chapter'],$row['level'],$row['chapters'], $row['favorite']);
    }
    else{
        $book = new Book('',0,0,'','',0,0,0,'',0,'',0);
    }

    echo gzencode ($book->getJSON(), 6);
}
else{
    echo gzencode ('{"error":"connection"}', 1);
}