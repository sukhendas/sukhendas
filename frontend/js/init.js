/**
 * 
 * Initial script
 * 
 */

/////////////////////// ////////////////////// /////////////////////

/**
 * 
 * Function to be invoked after page is loaded
 * 
 */
 $(document).ready(function() {
    console.log("---- Page loaded");

    init();
});

/**
 * 
 * Function to call the api with user credential
 * and then check whether the user to move to the
 * "dev-portal" 
 * or to the
 * "my-portal" (user portal)
 * 
 */
function init() {
    gotoDevPortal();
}

/**
 * 
 * Function to open the dev portal
 * and do it's respective task(s)
 * 
 */
function gotoDevPortal() {
    loadHTML("create-project");
}

/**
 * 
 * Function to open the dev portal
 * and do it's respective task(s)
 * 
 */
 function gotoUserPortal() {
    
}

////////////////////// ////////////////////////// ////////////////////

/**
 * 
 * Function to load HTML content from respective file
 * 
 */
function loadHTML(name) {
    $("#page-markup-container").html("");
    $("#page-markup-container").load(`frontend/layout/${name}.html`);
}