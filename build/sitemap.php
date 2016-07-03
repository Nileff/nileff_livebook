<?php

include_once (dirname(__FILE__).'/api/class/SQL.php');

$sitemap = '<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

$query = 'SELECT id, DATE_FORMAT(public_date, \'%Y-%m-%dT%H:%m:%s+03:00\') as date FROM book';
$sql = new SQL();
$res = $sql->getResult($query);

if($res) {
    while ($row = $res->fetch_assoc()) {
        $id = $row["id"];
        $date = $row["date"];
        $sitemap .= "<url>
                    <loc>http://livebook.pro/#!/book/$id</loc>
                    <lastmod>$date</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>1</priority>
                    </url>";
    }
}

$sitemap .= '</urlset> ';

file_put_contents (dirname(__FILE__).'/sitemap.xml', $sitemap);