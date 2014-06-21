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

$controller->replaceNode($nodeId, $parentId);

?>
