<?php
include "Env.php";
include "connectdb.php";
include "TreeRepository.php";
include "TreeService.php";
include "TreeController.php";
include "TreeModel.php";
include "TreeDomain.php";

$repository = new TreeRepository(Env::$DBH);
$service = new TreeService($repository);
$controller = new TreeController($service);
if ($_SERVER["REQUEST_URI"] == "/Tree/tree")  {
    $expandedBranches = [];
    if (!isset($_GET["expandedBranches"])) {
        $expandedBranches = $_GET["expandedBranches"];
    }
    $controller->getTree($expandedBranches);
}
?>
