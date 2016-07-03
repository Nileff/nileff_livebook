<?php
header('Content-Type: application/json; charset=utf-8');

include_once '../../class/SQL.php';
include_once '../../mail/sendMail.php';

$sql = new SQL();
$res = $sql->getResult('SELECT author_id FROM token WHERE BINARY token = "'.$_COOKIE['token'].'"');

if($res){
    if($res->num_rows){
        $row = $res->fetch_assoc();
        $author_id = $row['author_id'];

        $name = str_replace('"','\\"',str_replace("'", "\\'",$_POST['name']));
        $chapter_name = str_replace('"','\\"',str_replace("'", "\\'",$_POST['chapter_name']));
        $text = str_replace('"','\\"',str_replace("'", "\\'",$_POST['text']));

        if(strpos($_POST['path'], 'write') !== false){
            $query = 'INSERT INTO `book`
                      (parent_id,prev_id,name,chapter,level,author_id,text,public_date,note)
                      VALUES
                      ("'.$_POST["parent_id"].'","'.$_POST["id"].'","'.$name.'","'.$chapter_name.
                        '","'.$_POST["level"].'","'.$author_id.'","'.$text.'",NOW(),0);';
            $query .= "select last_insert_id() as id;";

            $resArr = $sql->getResult($query, true);
            if($resArr !== false){
                if($resArr[0]->num_rows) {
                    $row = $resArr[0]->fetch_assoc();
                    $book_id = $row['id'];

                    if($_POST["parent_id"] != 0) {
                        $res = $sql->getResult("SELECT a.id as author_id,
                                    trim(concat(a.Name,' ',a.Name2)) as author_name,
                                    EMail,
                                    if(b.parent_id > 0, b.parent_id, b.id) as book_id,
                                    b.name as book_name
                                    from book as b inner join author as a
                                    on a.id = b.author_id
                                    WHERE (b.id='" . $_POST["parent_id"] . "' OR b.parent_id='" . $_POST["parent_id"] . "')
                                    AND a.noticeNewChapter = 1
                                    GROUP BY a.id");

                        if ($res) {
                            if ($res->num_rows) {
                                while ($row = $res->fetch_assoc()) {
                                    $author_id2 = $row['author_id'];

                                    if ($author_id2 != $author_id) {
                                        $to = $row['EMail'];
                                        $subject = 'Новая глава в Вашей книге';
                                        $name = $row['author_name'];
                                        $text = '
                                            <p>
                                                К Вашей книге
                                                <a href="http://livebook.pro/#/book/' . $row['book_id'] . '">' . $row['book_name'] . '</a>
                                                написали новую главу.
                                            </p>
                                            <p>
                                                Новую главу "' . $chapter_name . '" можно прочесть перейдя по
                                                <a href="http://livebook.pro/#/book/' . $book_id . '">ссылке</a>.
                                            </p>
                                            ';

                                        sendMail($to, $subject, $name, $text);
                                    }
                                }
                            }
                        }
                    }

                    $query = 'INSERT INTO mark (book_id, author_id, mark) VALUES ("'.$book_id.'","'.$author_id.'","5");';
                    if($_POST["parent_id"] == 0) {
                        $query .= 'DELETE FROM book2genre WHERE book_id = "' . $book_id . '";';
                        $query .= 'INSERT INTO book2genre (book_id,genre_id) VALUES';
                        for ($i = 0; $i < count($_POST['genre']); $i++) {
                            if ($i > 0) {
                                $query .= ',';
                            }
                            $query .= '("' . $book_id . '","' . $_POST['genre'][$i] . '")';
                        }
                    }

                    $resArr = $sql->getResult($query, true);
                    if($resArr !== false) {
                        echo '{"id":"'.$book_id.'"}';
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
        else if(strpos($_POST['path'], 'edit') !== false){
            $query = 'UPDATE book SET
                      name="'.$name.'",
                      chapter="'.$chapter_name.'",
                      text="'.$text.'"
                      WHERE id="'.$_POST["id"].'" and author_id="'.$author_id.'"';

            $res = $sql->getResult($query);
            if($res){
                $query = '';
                if($_POST["parent_id"] == 0) {
                    $query = 'DELETE FROM book2genre WHERE book_id = "' . $_POST["id"] . '";';
                    $query .= 'INSERT INTO book2genre (book_id,genre_id) VALUES';
                    for ($i = 0; $i < count($_POST['genre']); $i++) {
                        if ($i > 0) {
                            $query .= ',';
                        }
                        $query .= '("' . $_POST["id"] . '","' . $_POST['genre'][$i] . '")';
                    }
                }

                if($query == ''){
                    echo '{"id":"'.$_POST["id"].'"}';
                }
                else {
                    $resArr = $sql->getResult($query, true);
                    if ($resArr !== false) {
                        echo '{"id":"' . $_POST["id"] . '"}';
                    } else {
                        echo '{"error":"connection"}';
                    }
                }
            }
            else{
                echo '{"error":"connection"}';
            }
        }
        else{
            echo '{"error":"unknownError"}';
        }
    }
    else{
        echo '{"error":"noUser"}';
    }
}
else{
    echo '{"error":"connection"}';
}