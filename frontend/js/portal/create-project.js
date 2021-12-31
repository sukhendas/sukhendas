/**
 * 
 * A project creation script
 * 
 */

//////////////////// ///////////////////// ///////////////////

/**
 * 
 * Function to create a project,
 * to do so it calls the respective API.
 * 
 * If it's successful then it gets a project ID
 * otherwise it gets respective msg.
 * 
 */
function createProject() {
    let projectTitle = $("#project-title").val().trim();

    if(projectTitle == "") {
        sweetalertOk("Error", "Project title can't be empty.");
        return;
    }

    loadHTML("project-space");
}