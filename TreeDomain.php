<?php
class TreeDomain {
    public $id;
    public $name;
    public $type;
    public $parentId;
    public $expanded;
    public $childs;
    public $level;
    public function __construct($id, $name, $type, $parentId, $expanded, $childs, $level) {
        $this->id = $id;
        $this->name = $name;
        $this->type = $type;
        $this->parentId = $parentId;
        $this->expanded = $expanded;
        $this->childs = $childs;
        $this->level = $level;
    }

}

?>
