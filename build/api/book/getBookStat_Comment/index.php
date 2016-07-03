<?php
header('Content-Type: application/json; charset=utf-8');
header("Content-Encoding: gzip");

include_once '../../class/SQL.php';

if(isset($_POST['id'])){
    $id = $_POST['id'];

    $query = 'SELECT * FROM markview WHERE book_id="'.$id.'";';
    $query .= 'SELECT * FROM bookreaduserview WHERE book_id="'.$id.'";';
    $query .= 'SELECT * FROM commentview WHERE book_id="'.$id.'";';

    $sql = new SQL();
    $resArray = $sql->getResult($query, true);
    $markres = $resArray[0];
    $readres = $resArray[1];
    $commentres = $resArray[2];

    if($markres && $readres){
        $result = '{';
        $result .= '"marks":[';

        $i = 0;
        while ($row = $markres->fetch_assoc()) {
            if($i > 0){
                $result .= ',';
            }
            $result .= '{"mark":"'.$row['mark'].'", "author":'.addcslashes ($row['author'], "\r\n\t").'}';
            $i++;
        }
        $result .= ']';

        $result .= ',"read":[';

        $i = 0;
        while ($row = $readres->fetch_assoc()) {
            if($i > 0){
                $result .= ',';
            }
            $result .= '{"count":"'.$row['count'].'", "author":'.addcslashes ($row['author'], "\r\n\t").'}';
            $i++;
        }
        $result .= ']';

        $result .= ',"comments":[';

        $i = 0;
        while ($row = $commentres->fetch_assoc()) {
            if($i > 0){
                $result .= ',';
            }
            $result .= '{"id":"'.$row['comment_id'].
                '", "text":"'.addcslashes ($row['text'], "\r\n\t").
                '", "public_date":"'.$row['public_date'].
                '", "author":'.addcslashes ($row['author'], "\r\n\t").'}';
            $i++;
        }
        $result .= ']';

        $result .= '}';
        echo gzencode ($result,6);
    }
    else{
        echo gzencode ('{"error":"connection"}',1);
    }
}
else{
    echo gzencode ('{"error":"noData"}',1);
}