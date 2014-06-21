<?php
class TreeService {
    private $repository;
    function __construct($repository) {
        $this->repository = $repository;
    }

    
    public function getTree($expandedBranches = [], $parentId = 0, $level = 1) {
        $tree = [];
        $nodes = $this->repository->getTree($parentId);
        foreach($nodes as $node) {
            $childs = [];
            if ($node->type == "branche" && in_array($node->id, $expandedBranches)) {
                $childs = $this->getTree($expandedBranches, $node->id, $level + 1);
            }
            $tree[] = new TreeDomain($node->id, $node->name, $node->type, $node->parentId, in_array($node->id, $expandedBranches), $childs, $level);
        }
        return $tree;
    }
    
    public function updateTreeNode($node) {
        $this->service->updateTreeNode($node);
    }
}

?>
