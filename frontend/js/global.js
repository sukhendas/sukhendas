function UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function sweetalertOkCancel(title, msg, successCallback, failureCallback) {
    swal({
        title,
        text: msg,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        dangerMode: true,
    },
    function(isConfirm) {
        if (isConfirm) {
            if(successCallback) {
                successCallback();
            }
          } else {
            if(failureCallback) {
                failureCallback();
            }
          }
    });
}

function sweetalertOk(title, msg, callback) {
    swal(title, msg, "error");

    if(callback) {
        callback();
    }
}