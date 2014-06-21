<?php
class TreeService {
    private $repository;
    function __construct($repository) {
        $this->repository = $repository;
    }

    
    public function getTree($parentId = 0, $expandedBranchs, $level = 1) {
        $tree = [];
        $nodes = $this->repository->getTree($parentId);
        foreach($nodes as $node) {
            $childs = [];
            if ($node->type == "branch" && isset($expandedBranchs[$node->id])) {
                $childs = $this->getTree($node->id, $expandedBranchs, $level + 1);
            }
            $tree[] = new TreeDomain($node->id, $node->name, $node->type, $node->parentId, isset($expandedBranchs[$node->id]), $childs, $level);
        }
        return $tree;
    }
}

?>
