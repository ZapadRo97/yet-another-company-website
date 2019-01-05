<?php

if($_SERVER['REQUEST_METHOD'] != 'POST')
    die("Not post");

$MAIN_FILE = "news/news.json";
$NEWS_DIR = "news/";

$request_body = file_get_contents('php://input');
$data = json_decode($request_body);

$filename = $data->file;
$id = $data->data->id;
$news = $data->data;

$obj = array($id=>$filename);
$obj_json = json_decode(json_encode($obj));

$main_file = fopen($MAIN_FILE, "r") or die("Unable to open file!");
$json = json_decode(fread($main_file, filesize($MAIN_FILE)));
array_push($json, $obj_json);
fclose($main_file);

$main_file = fopen($MAIN_FILE, "w") or die("Unable to open file!");
fwrite($main_file, json_encode(array_values($json)));
fclose($main_file);


$secondary_file = fopen($NEWS_DIR . $filename, "w") or die("Unable to open file!");
fwrite($secondary_file, json_encode($news));
fclose($secondary_file);
