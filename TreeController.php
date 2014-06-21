<?php
class TreeController {
    private $service;
    
    public function __construct($service) {
        $this->service = $service;
    }

    public function getTree($expandedBranches) {
        $tree = $this->service->getTree($expandedBranches);
        // добавим все в корневую папку 
        $tree = [new TreeDomain(0, "home", "branch", -1, "expanded", $tree , 0)];
        include "treeLayoutTemplate.php";
    }
    
    public function replaceNode($nodeId, $parentId) {
        if ((!isset($nodeId) && intval($nodeId) == 0)) {
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
