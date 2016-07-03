<?php
header('Content-Type: application/json; charset=utf-8');
header("Content-Encoding: gzip");

include_once '../../class/Book.php';
include_once '../../class/SQL.php';

$offset = $_POST['offset'];

$query = 'SELECT SQL_CALC_FOUND_ROWS
book.id, book.name, book.genre, book.author, book.co_author,
book.text, book.rating, book.max_level, date_format(book.public_date,\'%d.%m.%Y\') AS public_date,
date_format(book.update_date,\'%d.%m.%Y\') AS update_date,
ifnull(fav.book_id,0) as favorite
 FROM booklistview as book
 left outer join
(SELECT bookmark.parent_id, bookmark.book_id FROM bookmark
inner join token
on BINARY token="'.$_COOKIE['token'].'" and bookmark.author_id = token.author_id) as fav
 on book.id=fav.parent_id';

$filter = ' WHERE book.note = 0';

if(isset($_POST['path']) && strpos($_POST['path'], 'library/all') !== false){
    $filter = ' WHERE book.note = 0';
}
else if(isset($_POST['path']) && isset($_POST['id']) && strpos($_POST['path'], 'library/genre/'.$_POST['id']) !== false){
    $filter = ' inner join book2genre ON book.id = book2genre.book_id AND
    book2genre.genre_id = "'.$_POST['id'].'" WHERE book.note = 0';
}
else if(isset($_POST['path']) && strpos($_POST['path'], 'library/favorite') !== false){
    $filter = ' WHERE book.note = 0 and fav.book_id is not null';
}
else if(isset($_POST['path']) && isset($_COOKIE['token']) && strpos($_POST['path'], 'user/book') !== false){
    $filter = ' inner join token on book.authorId = token.author_id and BINARY token="'.$_COOKIE['token'].'"
    WHERE book.note = 0';
}

$order = ' ORDER BY book.update_date desc, book.name';

if(isset($_POST['order'])){
    if($_POST['order'] == "update"){
        $order = ' ORDER BY book.update_date desc, book.name';
    }
    else if($_POST['order'] == "public"){
        $order = ' ORDER BY book.public_date desc, book.name';
    }
    else if($_POST['order'] == "rating"){
        $order = ' ORDER BY book.rating desc, book.update_date desc, book.name';
    }
    else if($_POST['order'] == "name"){
        $order = ' ORDER BY book.name, book.update_date desc';
    }
    else if($_POST['order'] == "author"){
        $order = ' ORDER BY book.authorName, book.update_date desc';
    }
}

$sql = new SQL();
$sql->getResult("SET SESSION group_concat_max_len = 100000;");
$resArray = $sql->getResult($query.$filter.$order." LIMIT $offset, 30; SELECT FOUND_ROWS() as count", true);
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
            new BookItem(
                $row['id'],
                $row['favorite'],
                $row['name'],
                $row['genre'],
                $row['author'],
                $row['co_author'],
                $row['text'],
                $row['rating'],
                $row['max_level'],
                $row['public_date'],
                $row['update_date']);
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
    echo gzencode ('{"count":"0","items":[]}',1);
}