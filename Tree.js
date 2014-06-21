define("Tree", ["jquery", "jqueryUi"], function($) {
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
                    , treeNodeImgBranch: ".tree-node-img-branch"
                    , treeNodeImgEmpty: ".tree-node-img-empty"
                }
                , classes: {
                    treeNodeImgLoading: "tree-node-img-loading"
                }
                , templates: {
                    treeNodeImgEmpty: "<span class=\"tree-node-img tree-node-img-empty\"></span>"
                    , treeDropHelper: 
                        "<div class=\"tree-node-inner\">"+
                            "<span class=\"tree-node-img tree-node-img-drop-no\"></span>"+
                            "<span class=\"tree-node-name\"></span>"+
                        "</div>"
                            
                }
            }
            , currentDraggedNodeId: 0
            , currentTargetNodeId: 0
            , currentDraggedHelper: $()
        }
        , init: function(options) {
            $.extend(true, this, this.defaults, options);            
            this.setTreeEvents();
        }
        , setTreeEvents: function() {
            var treeObj = this;
            $(this.helpers.selectors.treeNode)
                .draggable({
                    revert: true
                    , helper: function(event) {
                        var $helperElem = $(treeObj.helpers.templates.treeDropHelper);
                        $helperElem.find(".tree-node-name").text(this.getAttribute("data-name"))
                        treeObj.currentDraggedHelper = $helperElem;
                        return $helperElem.get(0);
                    }
                    , start: function(event) {
                        treeObj.currentDraggedNodeId = this.getAttribute("data-id");
                    }
                    , stop: function(event) {
                        treeObj.currentDraggedNodeId = 0;
                    }
                })
                .droppable({
                    drop: function() {
                        treeObj.currentDraggedHelper.remove()
                        treeObj.currentDraggedHelper = $();
                        treeObj.replaceNodeIfOnlyNeed(treeObj.currentDraggedNodeId, treeObj.currentTargetNodeId);
                    }
                })
                .on("mouseover", function(event) {
                    treeObj.currentTargetNodeId = this.getAttribute("data-id");
                    if (treeObj.currentDraggedNodeId > 0) {
                        if (treeObj.checkDrop(treeObj.currentDraggedNodeId, treeObj.currentTargetNodeId)) {
                            treeObj.currentDraggedHelper.find(".tree-node-img").removeClass("tree-node-img-drop-no").addClass("tree-node-img-drop-yes");
                        } else {
                            treeObj.currentDraggedHelper.find(".tree-node-img").removeClass("tree-node-img-drop-yes").addClass("tree-node-img-drop-no");
                        }
                    }
                });
            
            this.element
                .on("mouseleave", function(event) {
                    treeObj.currentTargetNodeId = 0;
                    treeObj.currentDraggedHelper.find(".tree-node-img").removeClass("tree-node-img-drop-yes").addClass("tree-node-img-drop-no");
                });
        }
        , descendantChilds: function(nodeId) {
            var $childsElem = this.element.find(this.helpers.selectors.treeNode +"[data-parent-id='" + nodeId + "']");
            var childs = [];
            var treeObj = this;
            $childsElem.each(function() {
                var $childElem = $(this);
                var childId = $childElem.data("id");
                childs.push(childId);
                if ($childElem.data("type") == "branch") {
                    childs = childs.concat(treeObj.descendantChilds(childId));
                }
            });
            return childs;
            
        }
        , descendantChildExists: function(nodeId, childId) {
            if (this.descendantChilds(nodeId).indexOf(parseInt(childId)) != -1) {
                return true;
            }
            return false;
        }
        , targetFolderIsChild: function(nodeId, parentId) {
            return this.descendantChildExists(nodeId, parentId);
        }
        , checkDrop: function(nodeId, parentId) {
            if (nodeId == parentId) 
                return false;
            
            var $targetFolderElem = this.element.find(this.helpers.selectors.treeNode +"[data-id='" + parentId + "']");
            var $nodeElem = this.element.find(this.helpers.selectors.treeNode +"[data-id='" + nodeId + "']");
            
            if ($targetFolderElem.data("type") == "leaf") {
                var parentId = $targetFolderElem.data("parentId");
                return this.checkDrop(nodeId, parentId);
            }
            if (this.targetFolderIsChild(nodeId, parentId)) {
                return false;
            }
            return true;
        }
        , checkReplaceNode: function(nodeId, parentId) {
            if (nodeId == parentId) 
                return false;
            
            var $targetFolderElem = this.element.find(this.helpers.selectors.treeNode +"[data-id='" + parentId + "']");
            var $nodeElem = this.element.find(this.helpers.selectors.treeNode +"[data-id='" + nodeId + "']");
            
            if ($targetFolderElem.data("id") == $nodeElem.data("parentId")) 
                return false;
            if ($targetFolderElem.data("type") == "leaf") {
                var parentId = $targetFolderElem.data("parentId");
                return this.checkReplaceNode(nodeId, parentId);
            }
            if (this.targetFolderIsChild(nodeId, parentId)) {
                return false;
            }
            return true;
        }
        , replaceNodeIfOnlyNeed: function(nodeId, parentId) {
            if (this.checkReplaceNode(nodeId, parentId)) {
                this.replaceNode(nodeId, parentId); 
            }                
        }
        , replaceNode: function(nodeId, parentId) {
            var $targetFolderElem = this.element.find(this.helpers.selectors.treeNode +"[data-id='" + parentId + "']");
            var $branchImgElem = $targetFolderElem.find(this.helpers.selectors.treeNodeImgBranch);
            var $nodeElem = this.element.find(this.helpers.selectors.treeNode +"[data-id='" + nodeId + "']");
            
            $branchImgElem.addClass(this.helpers.classes.treeNodeImgLoading);
            
            this.replaceNodeElem(nodeId, parentId);
            
            var treeObj = this;
            $.ajax({
                url: this.baseUrl + "replaceNode.php"
                , data: {nodeId: nodeId, parentId: parentId}
                , type: "POST"
                , success: function(data) {
                    $branchImgElem.removeClass(treeObj.helpers.classes.treeNodeImgLoading);
                    $nodeElem.show()
                }
                , error: function(xhr, status) {
                    console.error("TODO: Нужно сделать обработку ошибок.");
                }
            });
        }
        , replaceNodeElem: function(nodeId, parentId) {
            var $targetFolderElem = this.element.find(this.helpers.selectors.treeNode +"[data-id='" + parentId + "']");
            var $nodeElem = this.element.find(this.helpers.selectors.treeNode +"[data-id='" + nodeId + "']");
            
            $nodeElem.hide()
                    .insertAfter($targetFolderElem).data("parentId", $targetFolderElem.data("id"))
                    .find(this.helpers.selectors.treeNodeImgEmpty).remove();
            var nodeLevel = $targetFolderElem.data("level") + 1;
            var $nodeInnerElem = $nodeElem.find(this.helpers.selectors.treeNodeInner);
            for (var i = 0; i < nodeLevel; i++) {
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
                method = method || {};
                method.element = element
                element.data(JQUERY_PLUGIN_NAME, new Tree(method));
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