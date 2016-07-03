<?php
header('Content-Type: application/json; charset=utf-8');

include_once '../../class/SQL.php';
include_once '../../mail/sendMail.php';

$sql = new SQL();
$res = $sql->getResult('SELECT author_id FROM token WHERE BINARY token = "' . $_COOKIE['token'] . '"');

if ($res) {
    if ($res->num_rows) {
        $row = $res->fetch_assoc();
        $author_id = $row['author_id'];

        $book_id = $_POST['id'];
        $text = str_replace('"', '\\"', str_replace("'", "\\'", $_POST['text']));

        $res = $sql->getResult("INSERT INTO comment(id_book,id_author,text,public_date)
                        VALUES ('$book_id', '$author_id', '$text', NOW())");
        if($res){
            echo '{"success":"true"}';

            $res = $sql->getResult("SELECT a.id as author_id,
                                    trim(concat(a.Name,' ',a.Name2)) as author_name,
                                    EMail,
                                    b.name as book_name,
                                    b.chapter as book_chapter
                                    from book as b inner join author as a
                                    on a.id = b.author_id
                                    WHERE b.id='$book_id' AND a.noticeNewComment = 1");
            if($res){
                if ($res->num_rows) {
                    $row = $res->fetch_assoc();
                    $author_id2 = $row['author_id'];

                    if($author_id2 != $author_id){
                        $to = $row['EMail'];
                        $subject = 'Новый комментарий к Вашей главе';
                        $name = $row['author_name'];
                        $text = '
                        <p>
                            К Вашей главе
                            <a href="http://livebook.pro/#/book/'.$book_id.'">'.$row['book_name'].' ('.$row['book_chapter'].')</a>
                            оставлен новый комментарий.
                        </p>
                        ';

                        sendMail($to, $subject, $name, $text);
                    }
                }
            }
        }
        else{
            echo '{"error":"connection"}';
        }
    } else {
        echo '{"error":"noUser"}';
    }
} else {
    echo '{"error":"connection"}';
}