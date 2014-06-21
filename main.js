require.config({
    baseUrl: "/Tree"
    , paths: {
        jquery: "jquery-2.1.1.min"
        , jqueryUi: "jquery-ui-1.10.4.custom.min" /** draggable and droppable */
        , Tree: "Tree"
    }
    , shim: {
        jqueryUi: {
            deps: ["jquery"]
        }
    }
});