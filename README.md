Модель:  название таблицы – Tree
Атрибуты: id(long), name(string), type(enums – branch, leaf), parentId

Маршруты:  /tree?expandedBranches[]=Id& expandedBranches[]=Id, GET запрос

/tree/replace-node?nodeId=Id&parentId=Id POST запрос

Контроллер:  Catalog – методы getTree и replaceNode соответсвенно маршрутам. Выходные данные:  tree = [
    {id, name, type,parentId, expanded/** Boolean*/,childs, level}

    // и тп
];

Expanded принимается соответсвенно параметрам GET  запроса.  childs заполняется для ветвей, соответсвенно параметру expanded 