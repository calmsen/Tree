<?php
try {
    # MySQL через PDO_MYSQL  
    Env::$DBH = new PDO("mysql:host=localhost;dbname=Tree", "root", "123456");
} catch (PDOException $e) {
    echo $e->getMessage();
}
?>