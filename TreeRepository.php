<?php
class TreeRepository {
    private $dbh;
    
    function __construct($dbh) {
        $this->dbh = $dbh;
    }
    public function getTree($parentId = 0) {
        $stmt = $this->dbh->query("SELECT * FROM tree WHERE parentId = " . $parentId . ";");
        $stmt->setFetchMode(PDO::FETCH_CLASS, "TreeModel");
        return $stmt->fetchAll();
    }
    
    public function updateTreeNode($node) {
        $stmt = $this->dbh->query("UPDATE tree SET parentId = " . $node->parentId . " WHERE id = " . $node->id . ";");
    }
}

?>
