define("Tree", ["jquery"], function($) {
    var JQUERY_PLUGIN_NAME = "tree";
    var TREE_NODE_SELECTOR = ".tree-node";
    var TREE_NODE_INNER_SELECTOR = ".tree-node-inner";
    var TREE_NODE_IMG_BRANCH_SELECTOR = ".tree-node-img-branche";
    var TREE_NODE_IMG_LOADING_CLASS = ".tree-node-img-loading";
    var TREE_NODE_IMG_EMPTY_CLASS = ".tree-node-img-empty";
    var TREE_NODE_IMG_EMPTY_TEMPLATE = "<span class=\"tree-node-img tree-node-img-empty\"></span>";
    
    function Tree() {
        this.init.apply(this, arguments);
    }
    $.extend(Tree.prototype, {
        defaults: {
            baseUrl: location.protocol + "//" + location.host + "/Tree/"
            , element: $()
        }
        , init: function(options) {
            $.extend(true, this, this.defaults);            
        }
        , replaceNodeIfOnlyNeed: function(nodeId, parentId) {
            var $targetFolderElem = this.element.find(TREE_NODE_SELECTOR +"[data-id='" + parentId + "']");
            var $nodeElem = this.element.find(TREE_NODE_SELECTOR +"[data-id='" + nodeId + "']");
            if ($targetFolderElem.data("id") == $nodeElem.data("parentId")) {
                return;
            }
            this.replaceNode(nodeId, parentId);
        }
        
        , replaceNode: function(nodeId, parentId) {
            var $targetFolderElem = this.element.find(TREE_NODE_SELECTOR +"[data-id='" + parentId + "']");
            var $brancheImgElem = $targetFolderElem.find(TREE_NODE_IMG_BRANCH_SELECTOR);
            var $nodeElem = this.element.find(TREE_NODE_SELECTOR +"[data-id='" + nodeId + "']");
            
            this.replaceNodeElem(nodeId, parentId);
            
            $.ajax({
                url: this.baseUrl + "replaceNode.php"
                , data: {nodeId: nodeId, parentId: parentId}
                , type: "POST"
                , success: function(data) {
                    $brancheImgElem.removeClass(TREE_NODE_IMG_LOADING_CLASS);
                    $nodeElem.show()
                }
                , error: function(xhr, status) {
                    console.error("TODO: Нужно сделать обработку ошибок.");
                }
            });
        }
        , replaceNodeElem: function(nodeId, parentId) {
            var $targetFolderElem = this.element.find(TREE_NODE_SELECTOR +"[data-id='" + parentId + "']");
            var $brancheImgElem = $targetFolderElem.find(TREE_NODE_IMG_BRANCH_SELECTOR);
            var $nodeElem = this.element.find(TREE_NODE_SELECTOR +"[data-id='" + nodeId + "']");
            
            $nodeElem.hide()
                    .insertAfter($targetFolderElem).data("parentId", $targetFolderElem.data("id"))
                    .find(TREE_NODE_IMG_EMPTY_CLASS).remove();
            
            var nodeLevel = $targetFolderElem.data("level") + 1;
            var $nodeInnerElem = $nodeElem.find(TREE_NODE_INNER_SELECTOR);
            for (var i = 1; i < nodeLevel; i++) {
                $nodeInnerElem.prepend(TREE_NODE_IMG_EMPTY_TEMPLATE);
            }
            $nodeElem.data("level", nodeLevel);
            
            var nodeType = $nodeElem.data("type");
            if (nodeType == "leaf") {
                $nodeElem.prepend(TREE_NODE_IMG_EMPTY_TEMPLATE);
            }
        }
    });
    
    // Зарегистрируем jquery плагин    
    $.fn[JQUERY_PLUGIN_NAME] = function(method) {
        var params = arguments;
        var result = undefined;
        this.each(function() {
            var element = $(this);
            if (!element.data(JQUERY_PLUGIN_NAME)) {
                element.data(JQUERY_PLUGIN_NAME, new Tree(method));
                element.data(JQUERY_PLUGIN_NAME).element = element;
            }
            else if (element.data(JQUERY_PLUGIN_NAME)[method]) {
                result = element.data(JQUERY_PLUGIN_NAME)[method].apply(element.data(JQUERY_PLUGIN_NAME), Array.prototype.slice.call(params, 1));
                return result !== undefined ? false : true;
            }
            else {
                if (typeof method == "string" && element.data(JQUERY_PLUGIN_NAME)) {
                    $.error('Метод ' + method + ' не существует в jQuery.' + JQUERY_PLUGIN_NAME);
                }
            }
        });
        return result !== undefined ? result : this;
    };
    
    return Tree;
});