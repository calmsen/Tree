<tr class="tree-node tree-node-<?php echo $node->type;?> tree-node-<?php echo ($node->expended ? "expended" : "collapse");?>">
    <div class="tree-node-inner tree-node-inner-<?php echo $node->type;?>">
        <?php
        while ($node->level - 1) {
            ?>
            <img src="tree-node-img-empty.png" class="tree-node-img tree-node-img-empty"/>
            <?php
        }
        ?>
        
        <?php
        if ($node->type == "branch") {
            ?>
            <img src="tree-node-img-arrow-<?php echo ($node->expended ? "expended" : "collapse");?>.png" class="tree-node-img-arrow tree-node-img-arrow-<?php echo ($node->expended ? "expended" : "collapse");?>" />
            <img src="tree-node-img-branch-<?php echo ($node->expended ? "expended" : "collapse");?>.png" class="tree-node-img-branch tree-node-img-branch-<?php echo ($node->expended ? "expended" : "collapse");?>"/>
            <?php
        } else {
            ?>
            <img src="tree-node-img-empty.png" class="tree-node-img tree-node-img-empty"/>
            <img src="tree-node-img-leaf.png" class="tree-node-img tree-node-img-leaf"/>
            <?php
        }
        ?>
        <span class="tree-node-name tree-node-<?php echo $node->type;?>-name"><?php echo $node->name;?></span>
    </div>
</tr>
