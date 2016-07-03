<?php

class BookItem
{
    public $id;
    public $name;
    public $genre;
    public $author;
    public $co_author;
    public $text;
    public $rating;
    public $max_level;
    public $publicDate;
    public $updateDate;

    function __construct($id,$favorite,$name,$genre,$author,$co_author,$text,$rating,$max_level,$publicDate,$updateDate){
        if($favorite > 0){
            $this->id = $favorite;
        }
        else {
            $this->id = $id;
        }
        $this->name = addcslashes ($name, "\r\n\t");
        $this->genre = addcslashes ($genre, "\r\n\t");
        $this->author = addcslashes ($author, "\r\n\t");
        $this->co_author = addcslashes ($co_author, "\r\n\t");
        $text = htmlspecialchars_decode(strip_tags(str_replace( '<', ' <', $text)));
        $text = preg_replace('/\s+/', ' ', $text);
        $this->text = addcslashes (mb_strcut($text, 0, 256, 'utf-8'), "\r\n\t");
        $this->rating = $rating;
        $this->max_level = $max_level;
        $this->publicDate = $publicDate;
        $this->updateDate = $updateDate;
    }

    function getJSON(){
        return '{"id":"'.$this->id.'",
        "name":"'.$this->name.'",
        "genre":['.$this->genre.'],
        "author":'.$this->author.',
        "co_author":['.$this->co_author.'],
        "text":"'.$this->text.'",
        "rating":"'.$this->rating.'",
        "max_level":"'.$this->max_level.'",
        "publicDate":"'.$this->publicDate.'",
        "updateDate":"'.$this->updateDate.'"}';
    }
}

class Book{

    public $author;
    public $parent_id;
    public $prev_id;
    public $name;
    public $text;
    public $rating;
    public $readCount;
    public $commentCount;
    public $chapter_name;
    public $chapter_level;
    public $chapter_next;
    public $favorite;

    function __construct($author,$parent_id,$prev_id,$name,$text,$rating,$readCount,$commentCount,$chapter_name,$chapter_level,$chapter_next,$favorite){
        if($author){
            $this->author = addcslashes ($author, "\r\n\t");
        }
        else{
            $this->author = "{}";
        }
        $this->name = addcslashes ($name, "\r\n\t");
        $this->text = addcslashes ($text, "\r\n\t");
        $this->rating = $rating;
        $this->readCount = $readCount;
        $this->commentCount = $commentCount;
        $this->chapter_name = addcslashes ($chapter_name, "\r\n\t");
        $this->chapter_level = $chapter_level;
        $this->chapter_next = addcslashes ($chapter_next, "\r\n\t");
        $this->parent_id=$parent_id;
        $this->prev_id=$prev_id;
        if($favorite > 0){
            $this->favorite="true";
        }
        else{
            $this->favorite="false";
        }
    }

    function getJSON(){
        return '{"author": '.$this->author.',
        "parent_id": "'.$this->parent_id.'",
        "prev_id": "'.$this->prev_id.'",
        "name": "'.$this->name.'",
        "text": "'.$this->text.'",
        "rating": "'.$this->rating.'",
        "readCount": "'.$this->readCount.'",
        "commentCount": "'.$this->commentCount.'",
        "favorite": "'.$this->favorite.'",
        "chapter": {
        "level": "'.$this->chapter_level.'",
        "name": "'.$this->chapter_name.'",
        "items": ['.$this->chapter_next.']
        }}';
    }
}

class BookEditor{

    public $author;
    public $parent_id;
    public $level;
    public $book_name;
    public $chapter_name;
    public $genre;
    public $text;

    function __construct($author,$parent_id,$level,$book_name,$chapter_name,$genre,$text){
        if($author){
            $this->author = addcslashes ($author, "\r\n\t");
        }
        else{
            $this->author = "{}";
        }
        $this->parent_id = $parent_id;
        $this->level = $level;
        $this->book_name = addcslashes ($book_name, "\r\n\t");
        $this->chapter_name = addcslashes ($chapter_name, "\r\n\t");
        $this->text = addcslashes ($text, "\r\n\t");
        $this->genre = $genre;
    }

    function getJSON(){
        return '{"author": '.$this->author.',
        "book": {
        "parent_id": "'.$this->parent_id.'",
        "level": "'.$this->level.'",
        "name": "'.$this->book_name.'",
        "chapter_name": "'.$this->chapter_name.'",
        "text": "'.$this->text.'",
        "genre": ['.$this->genre.']
        },
        "error": ""}';
    }
}

class ChapterItem
{
    public $id;
    public $parent_id;
    public $name;
    public $chapter_name;
    public $text;
    public $rating;
    public $publicDate;

    function __construct($id,$parent_id,$name,$chapter_name,$text,$rating,$publicDate){
        $this->id = $id;
        $this->parent_id = $parent_id;
        $this->name = addcslashes ($name, "\r\n\t");
        $this->chapter_name = addcslashes ($chapter_name, "\r\n\t");
        $text = htmlspecialchars_decode(strip_tags(str_replace( '<', ' <', $text)));
        $text = preg_replace('/\s+/', ' ', $text);
        $this->text = addcslashes (mb_strcut($text, 0, 256, 'utf-8'), "\r\n\t");
        $this->rating = $rating;
        $this->publicDate = $publicDate;
    }

    function getJSON(){
        return '{"id":"'.$this->id.'",
        "parent_id":"'.$this->parent_id.'",
        "name":"'.$this->name.'",
        "chapter_name":"'.$this->chapter_name.'",
        "text":"'.$this->text.'",
        "rating":"'.$this->rating.'",
        "publicDate":"'.$this->publicDate.'"}';
    }
}