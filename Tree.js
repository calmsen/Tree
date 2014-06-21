define("Tree", ["jquery"], function($) {
    var JQUERY_PLUGIN_NAME = "tree";
    
    function Tree() {
        this.init.apply(this, arguments);
    }
    
    $.extend(Tree.prototype, {
        defaults: {
            baseUrl: location.protocol + "//" + location.host + "/Tree/"
            , element: $()
            , helpers: {
                selectors: {
                    treeNode: ".tree-node"
                    , treeNodeInner: ".tree-node-inner"
                    , treeNodeImgBranch: ".tree-node-img-branche"
                }
                , classes: {
                    treeNodeImgLoading: ".tree-node-img-loading"
                    , treeNodeImgEmpty: ".tree-node-img-empty"
                }
                , templates: {
                    treeNodeImgEmpty: "<span class=\"tree-node-img tree-node-img-empty\"></span>"
                }
            }                
        }
        , init: function(options) {
            $.extend(true, this, this.defaults);            
        }
        , descendantChilds: function(nodeId) {
            var $childsElem = this.element.find(this.helpers.selectors.treeNode +"[data-parent-id='" + nodeId + "']");
            var childs = [];
            var treeObj = this;
            $childsElem.each(function() {
                var $childElem = $(this);
                var childId = $childElem.data("id");
                childs.push(childId);
                if ($childElem.data("type") == "branche") {
                    childs = childs.concat(treeObj.descendantChilds(childId));
                }
            });
            return childs;
            
        }
        , descendantChildExsists: function(nodeId, childId) {
            console.log(this.descendantChilds(nodeId));
            if (this.descendantChilds(nodeId).indexOf(childId) != -1) {
                return true;
            }
            return false;
        }
        , targetFolderIsChild: function(nodeId, parentId) {
            return this.descendantChildExsists(nodeId, parentId);
        }
        , replaceNodeIfOnlyNeed: function(nodeId, parentId) {
            var $targetFolderElem = this.element.find(this.helpers.selectors.treeNode +"[data-id='" + parentId + "']");
            var $nodeElem = this.element.find(this.helpers.selectors.treeNode +"[data-id='" + nodeId + "']");
            if ($targetFolderElem.data("type") == "leaf") {
                return;
            }
            if ($targetFolderElem.data("id") == $nodeElem.data("parentId")) {
                return;
            }
            if (this.targetFolderIsChild(nodeId, parentId)) {
                return;
            }
            this.replaceNode(nodeId, parentId);
        }
        
        , replaceNode: function(nodeId, parentId) {
            var $targetFolderElem = this.element.find(this.helpers.selectors.treeNode +"[data-id='" + parentId + "']");
            var $brancheImgElem = $targetFolderElem.find(this.helpers.selectors.treeNodeImgBranche);
            var $nodeElem = this.element.find(this.helpers.selectors.treeNode +"[data-id='" + nodeId + "']");
            
            this.replaceNodeElem(nodeId, parentId);
            var treeObj = this;
            $.ajax({
                url: this.baseUrl + "replaceNode.php"
                , data: {nodeId: nodeId, parentId: parentId}
                , type: "POST"
                , success: function(data) {
                    $brancheImgElem.removeClass(treeObj.helpers.classes.treeNodeImgLoading);
                    $nodeElem.show()
                }
                , error: function(xhr, status) {
                    console.error("TODO: Нужно сделать обработку ошибок.");
                }
            });
        }
        , replaceNodeElem: function(nodeId, parentId) {
            var $targetFolderElem = this.element.find(this.helpers.selectors.treeNode +"[data-id='" + parentId + "']");
            var $brancheImgElem = $targetFolderElem.find(this.helpers.selectors.treeNodeImgBranche);
            var $nodeElem = this.element.find(this.helpers.selectors.treeNode +"[data-id='" + nodeId + "']");
            
            $nodeElem.hide()
                    .insertAfter($targetFolderElem).data("parentId", $targetFolderElem.data("id"))
                    .find(this.helpers.classes.treeNodeImgEmpty).remove();
            
            var nodeLevel = $targetFolderElem.data("level") + 1;
            var $nodeInnerElem = $nodeElem.find(this.helpers.selectors.treeNodeInner);
            for (var i = 1; i < nodeLevel; i++) {
                $nodeInnerElem.prepend(this.helpers.templates.treeNodeImgEmpty);
            }
            $nodeElem.data("level", nodeLevel);
            
            var nodeType = $nodeElem.data("type");
            if (nodeType == "leaf") {
                $nodeElem.prepend(this.helpers.templates.treeNodeImgEmpty);
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