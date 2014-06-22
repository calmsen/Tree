define("Tree", ["jquery", "jqueryUi"], function($) {
    var JQUERY_PLUGIN_NAME = "tree";
    /**
     * @constructor
     */
    function Tree() {
        this.init.apply(this, arguments);
    }
    
    $.extend(Tree.prototype, {
        defaults: {
            baseUrl: location.protocol + "//" + location.host + "/Tree/"
            , element: $() // если вызывается через jquery плагин, то этот параметр не нужно передавать в конструктор 
            , helpers: {
                selectors: {
                    treeNode: ".tree-node"
                    , treeNodeBranch: ".tree-node-branch"
                    , treeNodeInner: ".tree-node-inner"
                    , treeNodeImgBranch: ".tree-node-img-branch"
                    , treeNodeImgArrow: ".tree-node-img-arrow"
                    , treeNodeImgEmpty: ".tree-node-img-empty"
                }
                , classes: {
                    treeNodeImgLoading: "tree-node-img-loading"
                    , treeNodeExpanded: "tree-node-expanded"
                    , treeNodeImgBranchExpanded: "tree-node-img-branch-expanded"
                    , treeNodeImgArrowExpanded: "tree-node-img-arrow-expanded"
                    , treeNodeCollapse: "tree-node-collapse"
                    , treeNodeImgBranchCollapse: "tree-node-img-branch-collapse"
                    , treeNodeImgArrowCollapse: "tree-node-img-arrow-collapse"
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
            , currentDraggedNodeId: 0 // папка или файл которую захватили для перетаскивания
            , currentTargetNodeId: 0  // папка в которую бросаем наш элемент(папку или файл)
            , currentDraggedHelper: $() // элемент показывающий можно ли перетащить папку(файл)
        }
        /**
         * @private
         */
        , init: function(options) {
            $.extend(true, this, this.defaults, options);            
            this.setTreeEvents();
        }
        /**
         * устанавливает все сбытия для дерева
         * @private
         */
        , setTreeEvents: function() {
            var treeObj = this;
            this.element.find(this.helpers.selectors.treeNode)
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
                        if (treeObj.checkReplaceNode(treeObj.currentDraggedNodeId, treeObj.currentTargetNodeId)) {
                            treeObj.currentDraggedHelper.remove();
                            treeObj.currentDraggedHelper = $();
                            treeObj.replaceNode(treeObj.currentDraggedNodeId, treeObj.currentTargetNodeId);
                        } else {
                            treeObj.currentDraggedHelper = $();
                        }                            
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
                })
                .on("click", function(event) {
                    treeObj.expandOrCollapse(this.getAttribute("data-id"));
                });
            
            this.element
                .on("mouseleave", function(event) {
                    treeObj.currentTargetNodeId = 0;
                    treeObj.currentDraggedHelper.find(".tree-node-img").removeClass("tree-node-img-drop-yes").addClass("tree-node-img-drop-no");
                });
        }
        /**
         * Найдем все дочерние узлы
         * @private
         * @param {number} nodeId ид узла
         * @return {number[]} список id узлов
         */
        , descendantChilds: function(nodeId) {
            var $childsElem = this.element.find(this.helpers.selectors.treeNode)
                    .filter(function() {
                        return $(this).data("parentId") == nodeId ? true : false
                    });
            var childs = [];
            var treeObj = this;
            $childsElem.each(function() {
                var childId = this.getAttribute("data-id");
                childs.push(parseInt(childId));
                
                if (this.getAttribute("data-type") == "branch") {
                    childs = childs.concat(treeObj.descendantChilds(childId));
                }
            });
            return childs;
            
        }
        /**
         * Проверим есть такой дочерний элемент
         * @private
         * @param {number} nodeId
         * @param {number} childId
         * @return {boolen}
         */
        , descendantChildExists: function(nodeId, childId) {
            if (this.descendantChilds(nodeId).indexOf(parseInt(childId)) != -1) {
                return true;
            }
            return false;
        }
        /**
         * Псевдоним для descendantChildExists
         * @private
         * @param {number} nodeId
         * @param {number} parentId
         * @return {boolen}
         */
        , targetFolderIsChild: function(nodeId, parentId) {
            return this.descendantChildExists(nodeId, parentId);
        }
        /**
         * Проверим можно ли перенести папку. Используется при захвате папки для перемещения
         * @private
         * @param {number} nodeId
         * @param {number} parentId
         * @return {boolen}
         */
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
        /**
         * Проверим можно ли перенести папку. Используется перед отправлением запроса на сервер
         * @private
         * @param {number} nodeId
         * @param {number} parentId
         * @return {boolen}
         */
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
        /**
         * Делаем запрос на сервер
         * @private
         * @param {number} nodeId
         * @param {number} parentId
         * @return {boolen}
         */
        , replaceNode: function(nodeId, parentId) {
            var $targetFolderElem = this.element.find(this.helpers.selectors.treeNode +"[data-id='" + parentId + "']");
            var $branchImgElem = $targetFolderElem.find(this.helpers.selectors.treeNodeImgBranch);
            var $nodeElem = this.element.find(this.helpers.selectors.treeNode +"[data-id='" + nodeId + "']");
            
            $branchImgElem.addClass(this.helpers.classes.treeNodeImgLoading);
            
            this.replaceNodeElemAndChilds(nodeId, parentId);
            $branchImgElem.removeClass(this.helpers.classes.treeNodeImgLoading);
            $nodeElem.show();
            return;
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
        /**
         * Перенесем DomElement
         * @private
         * @param {number} nodeId
         * @param {number} parentId
         * @return {boolen}
         */
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
                $nodeInnerElem.prepend(this.helpers.templates.treeNodeImgEmpty);
            }
        }
        , replaceNodeElemAndChilds: function(nodeId, parentId) {
            this.collapse(nodeId);
            this.replaceNodeElem(nodeId, parentId);
            var $childsElem = this.element.find(this.helpers.selectors.treeNode)
                    .filter(function() {
                        return $(this).data("parentId") == nodeId ? true : false
                    });
            var treeObj = this;
            $childsElem.each(function() {
                var childId = this.getAttribute("data-id");
                if (this.getAttribute("data-type") == "branch") {
                    treeObj.replaceNodeElem(childId, nodeId);
                }
            });
        }
        , expandOrCollapse: function(nodeId) {
            var $nodeElem = this.element.find(this.helpers.selectors.treeNodeBranch +"[data-id='" + nodeId + "']");
            if ($nodeElem.length == 0)
                return;
            if ($nodeElem.hasClass(this.helpers.classes.treeNodeExpanded)) {
                this.collapse(nodeId);
            } else {
                this.expand(nodeId);
            }
        }
        , collapse: function(nodeId) {
            this.element.find(this.helpers.selectors.treeNodeBranch +"[data-id='" + nodeId + "']")
                .removeClass(this.helpers.classes.treeNodeExpanded)
                .addClass(this.helpers.classes.treeNodeCollapse)
                .find(this.helpers.selectors.treeNodeImgBranch)
                    .removeClass(this.helpers.classes.treeNodeImgBranchExpanded)
                    .addClass(this.helpers.classes.treeNodeImgBranchCollapse)
                .end()
                .find(this.helpers.selectors.treeNodeImgArrow)
                    .removeClass(this.helpers.classes.treeNodeImgArrowExpanded)
                    .addClass(this.helpers.classes.treeNodeImgArrowCollapse);
            var $childsElem = this.element.find(this.helpers.selectors.treeNode)
                    .filter(function() {
                        return $(this).data("parentId") == nodeId ? true : false
                    });
            var treeObj = this;
            $childsElem.hide().each(function() {
                var childId = this.getAttribute("data-id");
                if (this.getAttribute("data-type") == "branch") {
                    treeObj.collapse(childId);
                }
            });
            
        }
        , expand: function(nodeId) {
            this.element.find(this.helpers.selectors.treeNodeBranch +"[data-id='" + nodeId + "']")
                .removeClass(this.helpers.classes.treeNodeCollapse)
                .addClass(this.helpers.classes.treeNodeExpanded)
                .find(this.helpers.selectors.treeNodeImgBranch)
                    .removeClass(this.helpers.classes.treeNodeImgBranchCollapse)
                    .addClass(this.helpers.classes.treeNodeImgBranchExpanded)
                .end()
                .find(this.helpers.selectors.treeNodeImgArrow)
                    .removeClass(this.helpers.classes.treeNodeImgArrowCollapse)
                    .addClass(this.helpers.classes.treeNodeImgArrowExpanded);
            var $childsElem = this.element.find(this.helpers.selectors.treeNode)
                .filter(function() {
                    return $(this).data("parentId") == nodeId ? true : false
                });
            $childsElem.show();
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