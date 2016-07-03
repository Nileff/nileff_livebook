<?php

class GenreItem
{
    public $id;
    public $text;
    public $name;
    public $book_count;

    function __construct($id, $text, $name, $book_count = 0)
    {
        $this->id = $id;
        $this->text = addcslashes ($text, "\r\n\t");
        $this->name = addcslashes ($name, "\r\n\t");
        $this->book_count = $book_count;
    }

    function getJSON()
    {
        return '{"id":"' . $this->id . '","text":"' . $this->text . '","name":"' . $this->name .
        '","book_count":"' . $this->book_count . '"}';
    }
}