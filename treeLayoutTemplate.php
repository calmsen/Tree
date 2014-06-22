<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Tree</title>
        <link rel="stylesheet" type="text/css" href="treeStyles.css"/>
        <script type="text/javascript" src="require-2.1.14.min.js"></script>
        <script type="text/javascript" src="main.js"></script>
    </head>
    <body>
        <div class="tree-wrap">
            <table class="tree">
            <?php
            foreach ($tree as $node) {
                include "nodeTemplate.php";
            }
            ?>
            </table>
        </div>            
        <script>
        require(["Tree"], function(Tree) {
            // Вызываем конструктор как обычно
            // new Tree({element: $(".tree:first")}); 
            // Вызываем конструктор через jquery  плагин
            $(".tree:first").tree();
        });
        </script>
    </body>
</html>