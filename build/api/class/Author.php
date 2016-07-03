<?php

class AuthorItem
{
    public $id;
    public $name;
    public $avatarUrl;
    public $rating;
    public $book_count;
    public $chapter_count;

    function __construct($id, $name, $avatarUrl, $rating, $book_count, $chapter_count)
    {
        $this->id = $id;
        $this->name = $name;
        $this->avatarUrl = $avatarUrl;
        $this->rating = $rating;
        $this->book_count = $book_count;
        $this->chapter_count = $chapter_count;
    }

    function getJSON()
    {
        return '{"id":"' . $this->id . '","name":"' . $this->name . '","avatarUrl":"' . $this->avatarUrl . '","rating":"' .
        $this->rating . '","book_count":"' . $this->book_count . '","chapter_count":"' . $this->chapter_count . '"}';
    }
}

class Author
{
    public $id;
    public $name;
    public $name2;
    public $avatarUrl;
    public $rating;
    public $birthday;
    public $city;
    public $education;
    public $about;
    public $favAuthor;
    public $favBook;
    public $favGenre;
    public $favFilm;
    public $favMusic;
    public $email;
    public $noticeNewChapter;
    public $noticeNewComment;
    public $noticeNews;

    function __construct($id, $name, $name2, $avatarUrl, $rating, $birthday, $city, $education, $about,
                         $favAuthor, $favBook, $favGenre, $favFilm, $favMusic, $email = '',
                         $noticeNewChapter=0, $noticeNewComment=0, $noticeNews=0)
    {
        $this->id = $id;
        $this->name = addcslashes ($name, "\r\n\t");
        $this->name2 = addcslashes ($name2, "\r\n\t");
        $this->avatarUrl = addcslashes ($avatarUrl, "\r\n\t");
        $this->rating = $rating;
        $this->birthday = $birthday;
        $this->city = addcslashes ($city, "\r\n\t");
        $this->education = addcslashes ($education, "\r\n\t");
        $this->about = addcslashes ($about, "\r\n\t");
        $this->favAuthor = addcslashes ($favAuthor, "\r\n\t");
        $this->favBook = addcslashes ($favBook, "\r\n\t");
        $this->favGenre = addcslashes ($favGenre, "\r\n\t");
        $this->favFilm = addcslashes ($favFilm, "\r\n\t");
        $this->favMusic = addcslashes ($favMusic, "\r\n\t");
        $this->email = addcslashes ($email, "\r\n\t");
        $this->noticeNewChapter=$noticeNewChapter;
        $this->noticeNewComment=$noticeNewComment;
        $this->noticeNews=$noticeNews;
    }

    function getJSON()
    {
        return '{"id":"' . $this->id . '","name":"' . $this->name . '","name2":"' . $this->name2 . '","avatarUrl":"' .
        $this->avatarUrl . '","rating":"' . $this->rating . '","birthday":"' . $this->birthday . '","city":"' .
        $this->city . '","education":"' . $this->education .  '","about":"' .
        $this->about . '","favorite" : { "author":"' . $this->favAuthor . '","book":"' .
        $this->favBook . '","genre":"' . $this->favGenre . '","film":"' . $this->favFilm . '","music":"' .
        $this->favMusic . '" },"email":"' . $this->email . '","notice":{"newChapter":"' . $this->noticeNewChapter . '",
        "newComment":"' . $this->noticeNewComment . '","news":"' . $this->noticeNews . '"}}';
    }
}