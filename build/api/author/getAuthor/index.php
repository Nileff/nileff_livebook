<?php
header('Content-Type: application/json; charset=utf-8');
header("Content-Encoding: gzip");

include_once '../../class/Author.php';
include_once '../../class/Book.php';
include_once '../../class/SQL.php';

if(isset($_POST['state']) && $_POST['state'] == 'full'){
    $query = 'SELECT id, REPLACE(IF(name is null, login, name), \'"\',  \'\\\"\') as name,
                REPLACE(name2, \'"\',  \'\\\"\') as name2, REPLACE(avatarUrl, \'"\',  \'\\\"\') as avatarUrl, email,
                DATE_FORMAT(birthday, "%d.%m.%Y") as birthday, REPLACE(city, \'"\',  \'\\\"\') as city,
                REPLACE(about, \'"\',  \'\\\"\') as about,
                REPLACE(education, \'"\',  \'\\\"\') as education, REPLACE(favAuthor, \'"\',  \'\\\"\') as favAuthor,
                REPLACE(favBook, \'"\',  \'\\\"\') as favBook, REPLACE(favGenre, \'"\',  \'\\\"\') as favGenre,
                REPLACE(favFilm, \'"\',  \'\\\"\') as favFilm, REPLACE(favMusic, \'"\',  \'\\\"\') as favMusic,
                noticeNewChapter, noticeNewComment, noticeNews
                FROM author
                inner join token
                ON author.id = token.author_id AND BINARY token.token = "'.$_COOKIE['token'].'" LIMIT 1';

    $sql = new SQL();
    $res = $sql->getResult($query);

    if ($res) {
        $row = $res->fetch_assoc();
        $author =
            new Author(
                $row['id'],
                $row['name'],
                $row['name2'],
                $row['avatarUrl'],
                0,//rating
                $row['birthday'],
                $row['city'],
                $row['education'],
                $row['about'],
                $row['favAuthor'],
                $row['favBook'],
                $row['favGenre'],
                $row['favFilm'],
                $row['favMusic'],
                $row['email'],
                $row['noticeNewChapter'],
                $row['noticeNewComment'],
                $row['noticeNews']);
        echo gzencode ($author->getJSON(), 6);
    }
    else {
        echo gzencode ('{}', 1);
    }
}
else {
    $query = 'SELECT id, REPLACE(IF(name is null, login, name), \'"\',  \'\\\"\') as name,
REPLACE(name2, \'"\',  \'\\\"\') as name2, REPLACE(avatarUrl, \'"\',  \'\\\"\') as avatarUrl, rating,
DATE_FORMAT(birthday, "%d.%m.%Y") as birthday, REPLACE(city, \'"\',  \'\\\"\') as city,
REPLACE(about, \'"\',  \'\\\"\') as about,
REPLACE(education, \'"\',  \'\\\"\') as education, REPLACE(favAuthor, \'"\',  \'\\\"\') as favAuthor,
REPLACE(favBook, \'"\',  \'\\\"\') as favBook, REPLACE(favGenre, \'"\',  \'\\\"\') as favGenre,
REPLACE(favFilm, \'"\',  \'\\\"\') as favFilm, REPLACE(favMusic, \'"\',  \'\\\"\') as favMusic
FROM author
left outer join
(
SELECT
author_id, AVG(mark) as rating
FROM book left outer join
(SELECT book_id, AVG(mark) as mark from mark
GROUP BY book_id) as mark
ON mark.book_id = book.id
group by author_id
) as t1
ON author_id = author.id
WHERE author.id = "' . $_POST["id"] . '" LIMIT 1';

    $query .= '; SELECT SQL_CALC_FOUND_ROWS
book.id, book.name, book.genre, book.author, book.co_author,
book.text, book.rating, book.max_level, date_format(book.public_date,\'%d.%m.%Y\') as public_date,
date_format(book.update_date,\'%d.%m.%Y\') as update_date, ifnull(fav.book_id,0) as favorite
 FROM booklistview as book
 left outer join
(SELECT bookmark.parent_id, bookmark.book_id FROM bookmark
inner join token
on BINARY token="'.$_COOKIE['token'].'" and bookmark.author_id = token.author_id) as fav
 on book.id=fav.parent_id
WHERE (book.authorId = "' . $_POST['id'] . '" OR book.co_author like \'%"id":"' . $_POST['id'] . '"%\')
AND book.note = 0
ORDER BY book.authorId <> "' . $_POST['id'] . '", book.update_date desc, book.name';

    $sql = new SQL();
    $resArray = $sql->getResult($query . "; SELECT FOUND_ROWS() as count", true);
    $res = $resArray[0];
    $res1 = $resArray[1];
    $res2 = $resArray[2];

    $count = 0;
    if ($res2) {
        $row = $res2->fetch_assoc();
        $count = $row['count'];
    }

    if ($res) {
        $row = $res->fetch_assoc();
        $author =
            new Author(
                $row['id'],
                $row['name'],
                $row['name2'],
                $row['avatarUrl'],
                $row['rating'],
                $row['birthday'],
                $row['city'],
                $row['education'],
                $row['about'],
                $row['favAuthor'],
                $row['favBook'],
                $row['favGenre'],
                $row['favFilm'],
                $row['favMusic']);

        $book = Array();

        $i = 0;
        while ($row = $res1->fetch_assoc()) {
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

        $result = '{"user":' . $author->getJSON() .
            ',"book":{"count":"' . $count . '",
    "items":[';
        $first = true;
        foreach ($book as &$value) {
            if (!$first) {
                $result .= ',';
            }
            $result .= $value->getJSON();
            $first = false;
        }
        $result .= ']}}';
        echo gzencode ($result, 6);

    } else {
        echo gzencode ('{"book":{"count":"0","items":[]}}', 1);
    }
}