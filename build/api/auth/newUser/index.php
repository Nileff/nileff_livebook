<?php
header('Content-Type: application/json; charset=utf-8');
header("Content-Encoding: gzip");

include_once '../../class/Menu.php';
include_once '../../class/SQL.php';

if(strlen($_POST['login']) > 5 && strlen($_POST['pass']) > 7 &&
    $_POST['pass'] == $_POST['pass2'] && strlen($_POST['email']) > 3){

    $sql = new SQL();

    $login = $sql->escape($_POST['login']);
    $pass = $sql->escape($_POST['pass']);
    $pass2 = $sql->escape($_POST['pass2']);
    $email = $sql->escape($_POST['email']);

    $res = $sql->getResult('SELECT id FROM author WHERE Login = "'.$login.'" or EMail = "'.$email.'"');
    if ($res) {
        if($res->num_rows > 0){
            echo gzencode ('[{"error":"user", "user":"'.$login.'"}]', 1);
        }
        else{
            $sql = new SQL();
            $res = $sql->getResult('INSERT INTO author(Login, EMail, Password, Name, RegDate, EnterDate) VALUES
    ("'.$login.'","'.$email.'",PASSWORD("'.$pass.'"),"'.$login.'",NOW(), NOW())');

            if ($res) {
                echo gzencode ('[{"success":"'.addcslashes ($_POST['login'], "\r\n\"\t").'"}]', 1);
            } else {
                echo gzencode ('[{"error":"connection"}]',1);
            }
        }
    } else {
        echo gzencode ('[{"error":"connection"}]',1);
    }
}
else{
    echo gzencode ('[{"error":"noData"}]',1);
}