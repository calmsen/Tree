<?php
class TreeController {
    private $service;
    
    public function __construct($service) {
        $this->service = $service;
    }

    public function getTree($expandedBranchs) {
        $tree = $this->service->getTree(0, $expandedBranchs);
        include "treeLayoutTemplate.php";
    }
}
?>
