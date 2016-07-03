<?php
header('Content-Type: application/json; charset=utf-8');
header("Content-Encoding: gzip");

include_once '../../class/Menu.php';
include_once '../../class/SQL.php';

$query = 'SELECT id,parent_id,REPLACE(text, \'"\',  \'\\\"\') as text,REPLACE(name, \'"\',  \'\\\"\') as name FROM menu';

$where = ' WHERE hide=0 and forAll = 1';

$order = ' order by id=parent_id desc, parent_id, number';
if($_POST['full'] == 'true'){
    $where = ' WHERE hide=0';
}

$sql = new SQL();
$res = $sql->getResult($query.$where.$order);

if($res){
    $menu = Array();

    while ($row = $res->fetch_assoc()) {
        if($row['id'] == $row['parent_id']){
            $menu[$row['id']] = new MenuItem($row['text'], $row['name']);
        }
        else{
            $menu[$row['parent_id']]->submenu[$row['id']] = new MenuItem($row['text'], $row['name']);
        }
    }

    $result = '[';
    $first = true;
    foreach ($menu as &$value) {
        if(!$first) {
            $result .= ',';
        }
        $result .= $value->getJSON();
        $first = false;
    }
    $result .= ']';
    echo gzencode($result, 5);
}
else{
    echo gzencode('[]', 1);
}
