Модель:  название таблицы – tree
Атрибуты: id(long), name(string), type(enums – branch, leaf), parentId

Маршруты:  /tree?expandedBranchs[]=Id& expandedBranchs[]=Id, GET запрос

/tree/replace-branch-or-leaf?from=Id&to=Id PUT запрос

Контроллер:  Catalog – методы getTree и ReplaceBranchOrLeaf соответсвенно маршрутам. Выходные данные:  tree = [
    {id, name, type,parentId, expanded/** Boolean*/,childs, level}

    // и тп
];

Expanded принимается соответсвенно параметрам GET  запроса.  childs заполняется для ветвей, соответсвенно параметру expanded