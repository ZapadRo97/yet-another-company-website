<?php

$MAIN_FILE = "news/news.json";
$NEWS_DIR = "news/";

function getJsonFile($id) {
    global $MAIN_FILE;
    $main_file = fopen($MAIN_FILE, "r") or die("Unable to open file!");
    $json = json_decode(fread($main_file, filesize($MAIN_FILE)));

    foreach($json as $entry) {
        $key = key($entry);
        if($key == $id) {
            return current($entry);
        }

    }

    return "";
}

function deleteFromFile($id) {
    global $MAIN_FILE;
    $main_file = fopen($MAIN_FILE, "r") or die("Unable to open file!");
    $json = json_decode(fread($main_file, filesize($MAIN_FILE)));

    $index = 0;
    foreach($json as $entry) {
        $key = key($entry);
        if($key == $id) {
            break;
        }
        $index++;
    }

    unset($json[$index]);

    fclose($main_file);

    $main_file = fopen($MAIN_FILE, "w") or die("Unable to open file!");
    fwrite($main_file, json_encode(array_values($json)));
    fclose($main_file);
}

switch($_SERVER['REQUEST_METHOD'])
{
    case 'GET': {
        $result = 'get';
        break;
    }
    case 'POST': {
        $result = 'post';
        break;
    }
    case 'PUT': {
        try{
            //should be plain text
            $id = file_get_contents('php://input');
            $file = getJsonFile($id);

            $news_file = fopen($NEWS_DIR . $file, "r") or die("Unable to open file!");
            $json = json_decode(fread($news_file, filesize($NEWS_DIR . $file)));

            $json->expired = !$json->expired;
            $exp = $json->expired;

            fclose($news_file);
            $news_file = fopen($NEWS_DIR . $file, "w") or die("Unable to open file!");
            fwrite($news_file, json_encode($json));
            fclose($news_file);

            if($exp)
                $result = "EXPIRED";
            else
                $result = "NOT_EXPIRED";

        }
        catch(Exception $e)
        {
            $result = $e->getMessage();
        }

        break;
    }
    case 'DELETE': {
        try{
            //should be plain text
            $id = file_get_contents('php://input');
            $file = getJsonFile($id);
            unlink($NEWS_DIR . $file);
            deleteFromFile($id);


            $result = "DELETED";

        }
        catch(Exception $e)
        {
            $result = $e->getMessage();
        }
        break;
    }
    default: {
        //should never happen
        $result = 'ERROR';
    }
}

echo $result;