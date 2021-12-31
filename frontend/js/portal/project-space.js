/**
 * 
 * A project handeling script
 * 
 * 
 * Task can be done for a project --
 * 
 * #1 Creation of new page
 * #2 Deletion of an existing page
 * #3 Writing down the codes
 * #4 Making of default page
 * #5 User management for each page
 * #6 Link between one or multiple pages
 * 
 * and so on...
 * 
 */

////////////////////// ////////////////////////// ////////////////////

/**
 * 
 * Global Variables
 * 
 */
var pageDetailsList = [];
var treeDataList = [];
var codeMirrorObjectList = [];
var codeMirrorObj = null;
var currentTabId = null;
var jstreeRef = null;
var currentIndex = -1;

////////////////////// ////////////////////////// ////////////////////

/**
 * 
 * Function to create a new page
 * 
 */
function createNewPage() {
    let pageName = $("#page-name").val().trim();
    $("#page-name").val("");

    if(pageName == "") {
        $("#imp-field").removeClass("d-none");
        return;
    }

    let pageId = UUID().split("-")[4];
    $("#create-page-modal").modal("hide");

    let newPage = {
        name: pageName,
        id: pageId,
        child: [
            {
                name: "layout.html",
                id: `${pageId}-layout`,
                type: "html"
            },
            {
                name: "layout-style.css",
                id: `${pageId}-style`,
                type: "css"
            },
            {
                name: "layout-script.js",
                id: `${pageId}-script`,
                type: "js"
            }
        ]
    };
    
    reinitializeTreeData();

    pageDetailsList.push(newPage);
    addPage(newPage, true);

    renderTree();
}

/**
 * 
 * Function to delete a page
 * 
 */
function deletePage(pageId) {
    // console.log("---- page id: ", pageId);
    sweetalertOkCancel(
        "Delete Page",
        "Are you sure you want to delete this page?",
        () => {
            let index = pageDetailsList.findIndex(page => page.id == pageId);
            if(index >= 0) {
                pageDetailsList.splice(index, 1);

                reinitializeTreeData();
                renderTree();
            }
        }
    );
}

////////////////////// ////////////////////////// ////////////////////

/**
 * 
 * Function to re-initialize projext explorer data
 * 
 */
function reinitializeTreeData() {
    treeDataList = [];

    pageDetailsList.forEach((page) => {
        addPage(page, false);
    });
}

/**
 * 
 * Function to add page into the project explorer
 * 
 */
function addPage(page, selected) {
    addSubPage(selected, page.id, "#", "", page.name);
    addSubPage(false, page.child[0].id, page.id, page.name, page.child[0].name, page.child[0].type);
    addSubPage(false, page.child[1].id, page.id, page.name, page.child[1].name, page.child[1].type);
    addSubPage(false, page.child[2].id, page.id, page.name, page.child[2].name, page.child[2].type);
}

/**
 * 
 * Function to add sub pages for a page
 * 
 */
function addSubPage(selected, id, parent, parentName, text, type) {
    let icon = "fa fa-folder folder-icon";
    if(type === "html") {
        icon = "fa fa-code html-icon";
    }
    else if(type === "css") {
        icon = "fa fa-paint-brush css-icon";
    }
    else if(type === "js") {
        icon = "fa fa-terminal js-icon";
    }

    treeDataList.push(
        {
            id,
            parent,
            parent_name: parentName,
            text,
            icon,
            type,
            state: {
                opened: true,
                selected
            }
        }
    );
}

/**
 * 
 * Function to render the project explorer
 * 
 */
function renderTree() {
    $('#project-tree').jstree("destroy");

    $('#project-tree')
    .on("loaded.jstree", function() {
        // console.log("----- Tree rendering done!");

        // add delete button for each page
        pageDetailsList.forEach((page) => {
            $(`#${page.id}_anchor`).append(`
                <button class="btn btn-xs btn-default page-del-btn" title="Delete Page" onclick="deletePage('${page.id}')">
                    <i class="fa fa-trash"></i>
                </button>
            `);
        });
    })
    .on("select_node.jstree", function(e, data) {
        console.log(data);
        // console.log(e);
        if(data.selected.length > 1) {
            return;
        }       

        if(data.node.parent != "#") {
            $(".full-path").removeClass("d-none");

            let nodeObject = data.node.original;
            updateCodeMirror(nodeObject);
        }
    })
    .jstree(
        {
            'core' : {
                'data': treeDataList
            }
        }
    );

    jstreeRef = $.jstree.reference("#project-tree");
    // console.log(jstreeRef);
}

////////////////////// ////////////////////////// ////////////////////

/**
 * 
 * Function to open a new tab to write down the code
 * 
 */
 function openNewTab(id, name, parentName) {
    $(".nav-link").removeClass("active show");
    $("#tab-list").append(
        `<li><a class="nav-link active show" data-toggle="tab" href="#" id="tab--${id}" onclick="changeTab('tab--${id}')">${name} - ${parentName}</a></li>`
    );
}

/**
 * 
 * Function to getting the tab handle when it's changed
 * from one to another
 * 
 */
function changeTab(tabId) {
    if(currentTabId != tabId) {
        let nodeId = tabId.split("--")[1];
        let node = codeMirrorObjectList.find(page => page.id == nodeId);

        // console.log(nodeObject);
        updateCodeMirror(node.nodeObject);
    }
}

////////////////////// ////////////////////////// ////////////////////

/**
 * 
 * Function to init the codemirror
 * Add it's respective properties
 * 
 */
function initCodeMirror(codeData, mode, htmlMode) {
    // Reset code mirror object
    $(".CodeMirror").remove();
    if(codeMirrorObj) {
        codeMirrorObj.clearHistory();
        codeMirrorObj.setValue("");
        codeMirrorObj = null;
    }

    // initialize code mirror object
    codeMirrorObj = CodeMirror(
        document.getElementById("code-area"),
        {
            mode,
            htmlMode,
            // theme: "eclipse",

            lineNumbers: true,
            lineWrapping: true,
            styleActiveLine: true,

            matchBrackets: true,
            
            smartIndent: true,
            indentWithTabs: true,

            lineWiseCopyCut: true,

            autocorrect: true,
            autoCloseTag: true,
            // autoCloseBrackets: true,
            autofocus: true,

            spellcheck: true,

            showCursorWhenSelecting: true,

            keymap: "sublime",

            // fullScreen: true,
            
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],

            extraKeys: {
                "Ctrl-Q": function(cm){
                    cm.foldCode(cm.getCursor());
                },
                "Ctrl-Space": "autocomplete"
            },
        }
    );
    codeMirrorObj.setSize("100%", "98%");

    codeMirrorObj.on("change", function() {
        $("#btn-text").text("* Save");
        // console.log(arguments);
        // console.log(codeMirrorObj.getValue());
    });
    codeMirrorObj.setValue(codeData);
}

/**
 * 
 * Function to update the codemirror with the existing data
 * 
 */
function updateCodeMirror(nodeObject) {
    let codeData = "";
    if(currentIndex >= 0) {
        // already tab exist, store the current code data
        codeMirrorObjectList[currentIndex].value = codeMirrorObj.getValue();
    }

    let index = codeMirrorObjectList.findIndex(page => page.id == nodeObject.id);
    if(index >= 0) {
        $(".nav-link").removeClass("active show");
        $(`#tab--${nodeObject.id}`).addClass("active show");
        codeData = codeMirrorObjectList[index].value;

        currentIndex = index;
        currentTabId = `tab--${nodeObject.id}`;
    }
    else {
        openNewTab(nodeObject.id, nodeObject.text, nodeObject.parent_name);
        codeMirrorObjectList.push(
            {
                id: nodeObject.id,
                value: "",
                nodeObject
            }
        );
        currentIndex = codeMirrorObjectList.length - 1;
        currentTabId = `tab--${nodeObject.id}`;
    }

    let mode = "xml";
    let htmlMode = nodeObject.type === "html" ? true : false;
    
    $("#parent-name").html(nodeObject.parent_name);
    $("#file-icon").removeClass().addClass(nodeObject.icon);
    $("#file-name").html(nodeObject.text);

    if(nodeObject.type === "css") {
        mode = "css";
    }
    else if(nodeObject.type === "js") {
        mode = "javascript";
    }

    initCodeMirror(codeData, mode, htmlMode);
}