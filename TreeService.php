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
            $expanded = true; // нужно ли раскрывать папку
            if (count($expandedBranches) > 0) {
                $expanded = false;
                if (in_array($node->id, $expandedBranches)) {
                    $expanded = true;
                }
            }
            if ($node->type == "branch" && $expanded) {
                $childs = $this->getTree($expandedBranches, $node->id, $level + 1);
            }
            $tree[] = new TreeDomain($node->id, $node->name, $node->type, $node->parentId, $expanded, $childs, $level);
        }
        return $tree;
    }
    
    public function updateTreeNode($node) {
        $this->repository->updateTreeNode($node);
    }
}

?>
