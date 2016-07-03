<?php
header('Content-Type: application/json; charset=utf-8');
header("Content-Encoding: gzip");

include_once '../../class/Book.php';
include_once '../../class/SQL.php';

$query = 'SELECT SQL_CALC_FOUND_ROWS
id,
parent_id,
REPLACE(name, \'"\',  \'\\\"\') as name,
REPLACE(chapter, \'"\',  \'\\\"\') as chapter_name,
REPLACE(LEFT(text, 1024), \'"\',  \'\\\"\') as text,
mark.mark as rating,
DATE_FORMAT(public_date, "%d.%m.%Y") as public_date
FROM book left outer join
(SELECT book_id, AVG(mark) as mark FROM `mark` GROUP BY book_id) as mark
on id = mark.book_id
inner join token
on book.author_id = token.author_id and BINARY token="'.$_COOKIE['token'].'"
WHERE book.note = 0';

$order = ' ORDER BY public_date desc, name';

if(isset($_POST['order'])){
    if($_POST['order'] == 'public'){
        $order = ' ORDER BY public_date desc, name';
    }
    else if($_POST['order'] == 'rating'){
        $order = ' ORDER BY mark.mark desc, public_date desc, name';
    }
    else if($_POST['order'] == 'name'){
        $order = ' ORDER BY name, chapter, public_date desc';
    }
}

$sql = new SQL();
$resArray = $sql->getResult($query.$order."; SELECT FOUND_ROWS() as count", true);
$res = $resArray[0];
$res1 = $resArray[1];

$count = 0;
if($res1){
    $row = $res1->fetch_assoc();
    $count = $row['count'];
}

if($res){
    $book = Array();

    $i=0;

    while ($row = $res->fetch_assoc()) {
        $book[$i] =
            new ChapterItem(
                $row['id'],
                $row['parent_id'],
                $row['name'],
                $row['chapter_name'],
                $row['text'],
                $row['rating'],
                $row['public_date']);
        $i++;
    }

    $result = '{"count":"'.$count.'",
    "items":[';
    $first = true;
    foreach ($book as &$value) {
        if(!$first) {
            $result .= ',';
        }
        $result .= $value->getJSON();
        $first = false;
    }
    $result .= ']}';
    echo gzencode ($result, 6);
}
else{
    echo gzencode ('{"count":"0","items":[]}', 1);
}