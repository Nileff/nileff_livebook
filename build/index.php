<?php
header("Cache-Control: no-store, no-cache, must-revalidate");
if(isset($_GET['_escaped_fragment_'])){
    if(preg_match('/book\/([0-9]+)/', $_GET['_escaped_fragment_'], $matches)){
        $id = $matches[1];
        include_once ('api/class/SQL.php');

        $sql = new SQL();
        $res = $sql->getResult('SELECT b.* FROM bookview as b WHERE b.id = "'.$id.'"');

        if($res){
            if($res->num_rows){
                $row = $res->fetch_assoc();

                $bookName = str_replace('\"', '"', $row['name']);
                $chapterName = str_replace('\"', '"', $row['chapter']);
                $chapterLevel = $row['level'];
                $bookText = '<p>' . str_replace("\n", '</p><p>', str_replace('\"', '"', $row['text'])) . '</p>';
                $author = json_decode($row['author'], true);
                $authorName = $author['name'];
                $avatar=$author['avatarUrl'];

                $rating = round($row['rating'], 2);
                $ratingRound = round($rating, 0);

                $ratingClassName = Array();

                for($i = 0; $i < 5; $i++){
                    $ratingClassName[$i] = 'star';
                    if($i<$ratingRound){
                        $ratingClassName[$i] .= ' fill';
                    }
                }
                
                $ratingTpl=
                    "<div class='starRating' data-tooltip='$rating'>
                        <div class='$ratingClassName[0]'></div>
                        <div class='$ratingClassName[1]'></div>
                        <div class='$ratingClassName[2]'></div>
                        <div class='$ratingClassName[3]'></div>
                        <div class='$ratingClassName[4]'></div>
                    </div>";
            }
        }

        include ('bookTpl.html');
    }
}
else{
    readfile('app.html');
    //readfile('constract.html');
}