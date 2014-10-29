<?php
try {
    # MySQL через PDO_MYSQL  
    Env::$DBH = new PDO("mysql:host=localhost;dbname=Tree", "root", "");
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>