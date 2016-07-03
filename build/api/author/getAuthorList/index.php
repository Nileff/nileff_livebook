<?php
header('Content-Type: application/json; charset=utf-8');
header("Content-Encoding: gzip");

include_once '../../class/Author.php';
include_once '../../class/SQL.php';

$offset = $_POST['offset'];

$query = 'SELECT SQL_CALC_FOUND_ROWS id,
REPLACE(TRIM(CONCAT(IF(name is null, login, name), " ", name2)), \'"\',  \'\\\"\') as name,
REPLACE(avatarUrl, \'"\',  \'\\\"\') as avatarUrl, rating, MainAuthor, AllAuthor
FROM author
inner join authorstatview as t1
ON author_id = author.id';

$order = '';

if(isset($_POST['order'])){
    if($_POST['order'] == 'rating'){
        $order = ' ORDER BY rating desc';
    }
    else if($_POST['order'] == 'author'){
        $order = ' ORDER BY TRIM(CONCAT(IF(name is null, login, name), " ", name2))';
    }
}

$sql = new SQL();
$resArray = $sql->getResult($query.$order." LIMIT $offset, 30; SELECT FOUND_ROWS() as count", true);
$res = $resArray[0];
$res1 = $resArray[1];

$count = 0;
if($res1){
    $row = $res1->fetch_assoc();
    $count = $row['count'];
}

if($res){
    $author = Array();

    $i=0;
    while ($row = $res->fetch_assoc()) {
        $author[$i] =
            new AuthorItem(
                $row['id'],
                $row['name'],
                $row['avatarUrl'],
                $row['rating'],
                $row['MainAuthor'],
                $row['AllAuthor']);
        $i++;
    }

    $result = '{"count":"'.$count.'",
    "items":[';
    $first = true;
    foreach ($author as &$value) {
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