<?php
header('Content-Type: application/json; charset=utf-8');
header("Content-Encoding: gzip");

$rule = '[
{
"name":"Во время использования сайта произошла ошибка (сбой). Что мне делать?",
"text":"На данный момент сайт находится в режиме тестирования. Постарайтесь как можно подробнее описать, что вы делали и что случилось. Отправьте это описание администратору сайта по адресу admin@livebook.pro Мы постараемся как можно быстрее устранить ошибку."
},{
"name":"Почему я не могу отредактировать опубликованную книгу (главу)?",
"text":"Во-первых, редактировать книгу (главу) может только ее автор. Во-вторых, редактирование книги (главы) доступно до тех пор, пока к ней не будет написано продолжение. После этого редактирование невозможно."
},{
"name":"Как опубликовать продолжение книги?",
"text":"Для этого необходимо перейти на страницу той главы, к которой Вы хотите написать продолжение. В правой части любой главы находится блок, по нажатию на который откроется меню. В этом меню будет перечень уже написанных продолжений, а внизу кнопка \"Написать свой вариант\". Нажмите на эту кнопку и пишите."
},{
"name":"Я могу оставить комментарий к книге?",
"text":"На данный момент этой функции нет, но она вскоре появится."
},{
"name":"Я не нашел тут ответ на свой вопрос.",
"text":"Если вашего вопроса нет в списке, то отправьте его администратору сайта по адресу admin@livebook.pro Мы постараемся как можно скорее на него ответить."
}
]';

echo gzencode (str_replace(array("\n", "\r"), "", $rule));