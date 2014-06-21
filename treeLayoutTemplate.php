<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Tree</title>
        <link rel="stylesheet" type="text/css" href="treeStyles.css"/>
        <script type="text/javascript" src="require-2.1.14.min.js"></script>
        <script type="text/javascript" src="main.js"></script>
    </head>
    <body><img class=" x-tree-elbow-img x-tree-elbow-end-plus x-tree-expander" src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==">
        <table class="tree">
        <?php
        foreach ($tree as $node) {
            include "branchTemplate.php";
        }
        ?>
        </table>
        <script>
        require(["Tree"], function(Tree) {
            new Tree();
        });
        </script>
    </body>
</html>