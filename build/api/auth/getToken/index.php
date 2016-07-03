<?php
header('Content-Type: application/json; charset=utf-8');
header("Content-Encoding: gzip");

include_once '../../class/SQL.php';

function generateRandomString($length = 61)
{
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

if (isset($_POST['login']) && isset($_POST['pass'])) {
    $sql = new SQL();
    $res = $sql->getResult('SELECT id, IFNULL(Name, Login) as Name, Name2, AvatarUrl FROM author
                WHERE Login = "' . $sql->escape($_POST['login']) .
        '" and Password = PASSWORD("' . $sql->escape($_POST['pass']) . '")');

    if ($res) {
        if ($res->num_rows > 0) {
            $row = $res->fetch_assoc();
            $id = $row['id'];
            $name = $row['Name'];
            $name2 = $row['Name2'];
            $avatarUrl = $row['AvatarUrl'];

            $res = $sql->getResult("SELECT * FROM token WHERE author_id='$id'");
            if ($res) {
                if ($res->num_rows > 0) {
                    $row = $res->fetch_assoc();
                    $res = $sql->getResult('UPDATE token SET last_enter=NOW() WHERE BINARY token = "' . $row['token'] . '"');
                    $res = $sql->getResult('UPDATE author SET EnterDate=NOW() WHERE id = "' . $id . '"');
                    echo gzencode ('[{"token":"' . $row['token'] . '",
                    "id":"' . $id . '",
                    "name":"' . addcslashes($name, "\r\n\"\t") . '",
                    "name2":"' . addcslashes($name2, "\r\n\"\t") . '",
                    "avatarUrl":"' . addcslashes($avatarUrl, "\r\n\"\t") . '"}]', 5);
                } else {
                    $token = generateRandomString(64);
                    $res = $sql->getResult("INSERT INTO token (token, author_id, last_enter) VALUES ('$token','$id',NOW())");
                    if ($res) {
                        $res = $sql->getResult('UPDATE author SET EnterDate=NOW() WHERE id = "' . $id . '"');
                        echo gzencode ('[{"token":"' . $token . '",
                        "id":"' . $id . '",
                        "name":"' . addcslashes($name, "\r\n\"\t") . '",
                        "name2":"' . addcslashes($name2, "\r\n\"\t") . '",
                        "avatarUrl":"' . addcslashes($avatarUrl, "\r\n\"\t") . '"}]',5);
                    } else {
                        echo gzencode ('[{"error":"connection"}]', 1);
                    }
                }
            } else {
                echo gzencode ('[{"error":"connection"}]', 1);
            }
        } else {
            echo gzencode ('[{"error":"noUser"}]', 1);
        }
    } else {
        echo gzencode ('[{"error":"connection"}]', 1);
    }
} else if (isset($_COOKIE['token'])) {
    $sql = new SQL();
    $query = 'SELECT id, IFNULL(Name, Login) as Name, Name2, AvatarUrl FROM author
            inner join token on token.author_id = author.id and BINARY token.token = "' . $_COOKIE['token'] . '"';
    if(isset($_POST['oldPass'])){
        $query .= ' and author.password =  PASSWORD("'.$_POST['oldPass'].'") ';
    }
    $res = $sql->getResult($query);

    if ($res) {
        if ($res->num_rows > 0) {
            $row = $res->fetch_assoc();
            $id = $row['id'];
            $name = $row['Name'];
            $name2 = $row['Name2'];
            $avatarUrl = $row['AvatarUrl'];
            $token = $_COOKIE['token'];

            if(isset($_POST['oldPass']) && isset($_POST['newPass'])){
                $token = generateRandomString(64);
                $query = 'UPDATE author SET EnterDate=NOW(), password =  PASSWORD("'.$_POST['newPass'].'") WHERE id = "' . $id . '";';
                $query .= 'DELETE FROM token WHERE author_id = "' . $id . '";';
                $query .= "INSERT INTO token (token, author_id, last_enter) VALUES ('$token','$id',NOW())";
                $res = $sql->getResult($query, true);
            }

            echo gzencode ('[{"token":"' . $token . '",
                "id":"' . $id . '",
                "name":"' . addcslashes($name, "\r\n\"\t") . '",
                "name2":"' . addcslashes($name2, "\r\n\"\t") . '",
                "avatarUrl":"' . addcslashes($avatarUrl, "\r\n\"\t") . '"}]', 5);
            $res = $sql->getResult('UPDATE author SET EnterDate=NOW() WHERE id = "' . $id . '"');
            $res = $sql->getResult('UPDATE token SET last_enter=NOW() WHERE BINARY token = "' . $_COOKIE['token'] . '"');
        } else {
            echo gzencode ('[{"error":"noUser"}]', 1);
        }
    } else {
        echo gzencode ('[{"error":"connection"}]', 1);
    }
} else {
    echo gzencode ('[{"error":"noUser"}]', 1);
}
