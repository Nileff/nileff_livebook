<?php
header('Content-Type: application/json; charset=utf-8');
header("Content-Encoding: gzip");

include_once '../../class/Genre.php';
include_once '../../class/SQL.php';

$query = 'SELECT genre.id, REPLACE(genre.text, \'"\',  \'\\\"\') as text,
          REPLACE(genre.name, \'"\',  \'\\\"\') as name, count(0) as book_count
          FROM genre';
$on = ' inner join book2genre ON genre.id=book2genre.genre_id inner join book ON book2genre.book_id = book.id and book.note = 0';
$group = ' group by genre.id, genre.name, genre.text';
$order = ' order by genre.text';

if(isset($_POST['book_id']))
{
    if($_POST['book_id'] > 0){
        $on = ' inner join book2genre ON genre.id=book2genre.genre_id and book2genre.book_id="'.$_POST['book_id'].'"';
    }
    else{
        $on = ' left outer join book2genre ON genre.id=book2genre.genre_id';
    }
}

$sql = new SQL();

$res = $sql->getResult($query.$on.$group.$order);

if($res){
    $genre = Array();

    while ($row = $res->fetch_assoc()) {
        $genre[$row['id']] = new GenreItem($row['id'],$row['text'],$row['name'],$row['book_count']);
    }

    $result = '[';
    $first = true;
    foreach ($genre as &$value) {
        if(!$first) {
            $result .= ',';
        }
        $result .= $value->getJSON();
        $first = false;
    }
    $result .= ']';
    echo gzencode($result, 6);
}
else{
    echo gzencode('[]', 1);
}