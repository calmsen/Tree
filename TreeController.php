<?php
class TreeController {
    private $service;
    
    public function __construct($service) {
        $this->service = $service;
    }

    public function getTree($expandedBranches) {
        $tree = $this->service->getTree($expandedBranches);
        include "treeLayoutTemplate.php";
    }
    
    public function replaceNode($nodeId, $parentId) {
        if ((!isset($nodeId) && intval($nodeId) == 0) 
                || (!isset($parentId) && intval($parentId) == 0) ) {
            //throw new BadRequestException("Не правильно переданы параметры.");
            return;
        }
        $node = new TreeModel();
        $node->id = $nodeId;
        $node->parentId = $parentId;
        
        $tree = $this->service->updateTreeNode($node);
    }
}
?>
