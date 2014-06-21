<tr class="tree-node tree-node-<?php echo $node->type;?> tree-node-<?php echo ($node->expanded ? "expanded" : "collapse");?>"
    data-id="<?php echo $node->id;?>" data-type="<?php echo $node->type;?>">
    <td class="tree-node-inner tree-node-inner-<?php echo $node->type;?>">
        <?php
        for ($i = 0; $i < $node->level; $i++) {
            ?>
            <span class="tree-node-img tree-node-img-empty"></span>
            <?php
        }
        ?>
        
        <?php
        if ($node->type == "branche") {
            ?>
            <span class="tree-node-img tree-node-img-arrow tree-node-img-arrow-<?php echo ($node->expanded ? "expanded" : "collapse");?>" ></span>
            <span class="tree-node-img tree-node-img-branche tree-node-img-branche-<?php echo ($node->expanded ? "expanded" : "collapse");?>"></span>
            <?php
        } else {
            ?>
            <span src="tree-node-img-empty.png" class="tree-node-img tree-node-img-empty"></span>
            <span src="tree-node-img-leaf.png" class="tree-node-img tree-node-img-leaf"></span>
            <?php
        }
        ?>
        <span class="tree-node-name tree-node-<?php echo $node->type;?>-name"><?php echo $node->name;?></span>
    </td>
</tr>
<?php
if (count($node->childs) > 0) {
    $outerNode = $node;
    //
    foreach($node->childs as $node) {
        include "nodeTemplate.php";
    }
    //
    $node = $outerNode;
}
?>