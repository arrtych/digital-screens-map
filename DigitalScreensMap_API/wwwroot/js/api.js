var pageUrl = window.location.href;
console.log("Page url:" + pageUrl);
var url = "";
if (pageUrl.startsWith("https://dev-")) {
    url = "https://dev-digital-screens-map.fleet.zone";
} else if (pageUrl.startsWith("https://test-")) {
    url = "https://test-digital-screens-map.fleet.zone";
} else {
    url = "https://localhost:44380";
}
const tsmUrlLink = "https://tsm.fleet.zone/?groups=DS%20Screens%20";

function refreshData() {
    window.localStorage.clear();
    getVessels();
    getRooms();
    getPositions();
    for (var i = 0; i < rooms.length; i++) {
        getMonitors(rooms[i].roomId);
    }
    console.log("refreshed data");
}



/**
 * Api GET request for getting all vessels.
 */
const getVessels = async () => {
    var key = "vessels";
    if (!localStorageContains(key)) {
        const response = await fetch(url + "/api/vessels/all");
        vessels = await response.json();
        saveToLocalStorage(key, vessels);
    } else {
        vessels = getFromLocalStorage(key);
    }

};

/**
 * Api GET request for getting Vessel by Id.
 */
const getVesselById = async (vesselId) => {
    var key = "vessel-by-id-" + vesselId;
    var fullUrl = url + "/api/vessels/" + vesselId;
    var vessel = {};
    if (!localStorageContains(key)) {
        const response = await fetch(fullUrl);
        vessel = await response.json();
        saveToLocalStorage(key, vessel);
    }
    else {
        vessel = getFromLocalStorage(key);
    }
};


/**
 * Api POST request for adding new Vessel.
 * @param {*} name 
 */
const postVessel = async (name) => {
    var fullUrl = url + '/api/vessels/add';
    const response = await fetch(fullUrl, {
        method: 'POST',
        body: JSON.stringify({ "name": name }),
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
        }
    });
    const myJson = await response; //extract JSON from the http response
    console.log("response", myJson);
}

/**
 * Api PUT request for updating Vessel by vesselId.
 * @param {*} vesselId 
 * @param {*} obj 
 */
const updateVessel = async (vesselId, obj) => {
    var fullUrl = url + '/api/vessels/update/' + vesselId;
    console.log("updateVessel", obj);
    const response = await fetch(fullUrl, {
        method: 'PUT',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
        }
    });
    const myJson = await response; //extract JSON from the http response
    console.log("response", myJson);
}

/**
 * Api POST request for deleting Vessel.
 * @param {*} vesselId 
 */
const deleteVessel = async (vesselId) => {
    var fullUrl = url + '/api/vessels/remove?id=' + vesselId;
    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    });
    const myJson = await response; //extract JSON from the http response
    console.log("response", myJson);
}

/**
 * Api GET request for getting all rooms.
 */
const getRooms = async () => {
    var key = "rooms";
    if (!localStorageContains(key)) {
        const response = await fetch(url + "/api/rooms/all");
        rooms = await response.json();
        saveToLocalStorage(key, rooms);
    } else {
        rooms = getFromLocalStorage(key);
    }
};

/**
 * Api POST request for adding new Room.
 * @param {*} name 
 */
const postRoom = async (obj) => {
    var fullUrl = url + '/api/rooms/add';
    const response = await fetch(fullUrl, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
        }
    });
    const myJson = await response; //extract JSON from the http response
    console.log("response", myJson);
}



/**
 * Api PUT request for updating Room by roomId.
 * @param {*} roomId 
 * @param {*} obj 
 */
const updateRoom = async (roomId, obj) => {
    var fullUrl = url + '/api/rooms/update/' + roomId;
    console.log("updateRoom", obj);
    const response = await fetch(fullUrl, {
        method: 'PUT',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
        }
    });
    const myJson = await response; //extract JSON from the http response
    console.log("response", myJson);
}


/**
 * Api POST request for deleting Room.
 * @param {*} roomId 
 */
const deleteRoom = async (roomId) => {
    var fullUrl = url + '/api/rooms/remove?id=' + roomId;
    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    });
    const myJson = await response; //extract JSON from the http response
    console.log("response", myJson);
}



/**
 * Api GET request for getting all monitors.
 */
const getMonitors = async (id) => {
    var key = "monitors-by-roomId-" + id;
    if (!localStorageContains(key)) {
        const response = await fetch(url + "/api/monitors/all/room/" + id);
        monitors = await response.json();
        saveToLocalStorage(key, monitors);
    } else {
        monitors = getFromLocalStorage(key);
    }
    // console.log("mons:", monitors);
}

/**
 * Api PUT request for updating Monitor by Code.
 * @param {*} codeVal 
 * @param {*} obj 
 */
const updateMonitor = async (obj, codeVal) => {
    var fullUrl = url + '/api/monitors/update/' + codeVal;
    console.log("updateMonitor", obj);
    const response = await fetch(fullUrl, {
        method: 'PUT',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
        }
    });
    console.warn("jsonObj after crudMonitor.Edit", obj);
    const myJson = await response; //extract JSON from the http response
    console.log("response", myJson);
}

/**
 * Api POST request for adding new Monitor.
 * @param {*} name 
 */
const postMonitor = async (obj) => {
    var fullUrl = url + '/api/monitors/add';
    const response = await fetch(fullUrl, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
        }
    });
    const myJson = await response; //extract JSON from the http response
    console.log("response", myJson);
}

/**
 * Api POST request for deleting Monitor by code.
 * @param {*} code 
 */
const deleteMonitor = async (code) => {
    var fullUrl = url + '/api/monitors/remove?code=' + code;
    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    });
    const myJson = await response; //extract JSON from the http response
    console.log("response", myJson);
}


/**
 * Api POST request for adding Image by roomId.
 * @param {*} roomId 
 * @param {*} obj 
 */
const postImage = async (roomId, obj) => {
    var fullUrl = url + '/api/ImageUpload/add/image/' + roomId;
    const response = await fetch(fullUrl, {
        method: 'POST',
        body: obj,
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    });
    const myJson = await response; //extract JSON from the http response
    console.log("response", myJson);
}

/**
 * Api POST request for deleting Image by roomId.
 * @param {*} roomId 
 */
const deleteImage = async (roomId) => {
    var fullUrl = url + '/api/ImageUpload/remove/image/' + roomId;
    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    });
    const myJson = await response; //extract JSON from the http response
    console.log("response", myJson);
}


/**
 * Api GET request for getting all positions for monitors.
 */
const getPositions = async () => {
    var key = "positions";
    if (!localStorageContains(key)) {
        const response = await fetch(url + "/api/positions/all");
        positions = await response.json();
        saveToLocalStorage(key, positions);
    } else {
        positions = getFromLocalStorage(key);
    }
}


/**
 * Api POST request for adding positions for Monitor.
 * @param {*} obj 
 */
const postPositions = async (obj) => {
    var fullUrl = url + '/api/positions/add';
    const response = await fetch(fullUrl, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
        }
    });
    const myJson = await response; //extract JSON from the http response
    console.log("response", myJson);
}


/**
 * Api PUT request for updating Monitor Positions  by monitorId.
 * @param {*} monitorId 
 * @param {*} obj 
 */
const updatePositions = async (monitorId, obj) => {
    var fullUrl = url + '/api/positions/update/3' + monitorId;
    console.log("update positions:", obj);
    const response = await fetch(fullUrl, {
        method: 'PUT',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
        }
    });
    const myJson = await response; //extract JSON from the http response
    console.log("response", myJson);
}

/**
 * Api POST request for deleteing positions by MonitorId.
 * @param {*} monitorId 
 */
const deletePositions = async (monitorId) => {
    var fullUrl = url + '/api/positions/remove?id=' + monitorId;
    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    });
    const myJson = await response; //extract JSON from the http response
    console.log("response", myJson);
}


/**
 * Api POST request for user login 
 * @param {*} obj 
 */
const postUser = async (obj) => {
    var fullUrl = url + '/api/users/login';
    //var fullUrl = url + '/api/users/iisauth';
    fetch(fullUrl, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*"
        }
    }).then(response => {
        console.log(response);
        if (response.status != 200) {
            document.getElementById("login-form").classList.add('was-validated');
            document.getElementById("loginFormUsername").value = "";
            document.getElementById("loginFormPassword").value = "";
        } else {
            window.location = "/";
        }
        return response.json();
    }).then(text => {
        //get user token from response.
        var token = text.token;
        // console.log(text.token);
        createSession(token);

    }).catch(function (error) {
        console.warn('Something went wrong.', error);
    });
}

const getUser = async (obj) => {
    var fullUrl = url + '/api/users/basic';
    let headers = new Headers();
    headers.append('Authorization', 'NTLM' + (obj["username"] + ":" + obj["password"]));
    fetch(fullUrl, {
        method: 'GET',
        // credentials: 'include'
        // body: JSON.stringify(obj),
        headers: headers
    }).then(response => {

        console.log(response);
        if (response.status === 200) {
            console.log("gud");
            // window.location = "/";
        } else {
            document.getElementById("login-form").classList.add('was-validated');
            document.getElementById("loginFormUsername").value = "";
            document.getElementById("loginFormPassword").value = "";

        }
        console.log("response", response);
        return response;
        // }).then(text => {
        // var token = text.token;
        // console.log(text);
        // createSession(text);

    }).catch(function (error) {
        console.warn('Something went wrong.', error);
    });
}



// const getVessels = async () => {
//     var key = "vessels";
//     if (!localStorageContains(key)) {
//         const response = await fetch(url + "/api/vessels/all");
//         vessels = await response.json();
//         saveToLocalStorage(key, vessels);
//     } else {
//         vessels = getFromLocalStorage(key);
//     }

// };


/**
 * Function that create session by user token.
 * @param {*} token 
 */
function createSession(token) {
    sessionStorage.setItem("user", token);
}





// CRUD functions

var crudVessel = new function () {
    this.Add = function () {
        var el = document.getElementById("input-add-vessel");
        var vessel = el.value;
        if (vessel) {
            //put to DB
            postVessel(vessel);
            el.value = '';
        }
        showVesselEditsMessage(0, vessel, "add");
        console.log("crudVessel.add finished");
        // this.RefreshData();
    };

    this.Edit = function (currentId, name) {
        var el = document.getElementById("edit-vessel-" + currentId);
        el.id = "edit-vessel-" + currentId;
        var key = "edit-vesselID-" + currentId;
        el.value = name;
        var obj = {
            "vesselId": Number(currentId),
            "name": name,
            "rooms": null,
            "monitors": null
        };
        updateVessel(currentId, obj);
        showVesselEditsMessage(currentId, name, "add");
        // this.RefreshData();
    };

    this.CloseInput = function () {
        var div = document.getElementById('saveEdit');
        //remove form from dom
        if (div) {
            div.parentNode.removeChild(div);
        }
    };

    this.Delete = function (currentId) {
        var ask = confirm("do you really want to delete this Vessel?");
        if (ask == true) {
            deleteVessel(currentId);
            refreshData();
            window.location.reload();
            window.location.reload();
            console.log("Vessel was deleted.");
        } else {
            console.log("Not deleted.");
        }
        // window.location.reload();
        // this.RefreshData();
    };

    this.CloseMsg = function (elementId) {
        var div = document.getElementById(elementId);
        //remove form from dom
        if (div) {
            div.parentNode.removeChild(div);
        }
    };

    // this.RefreshData = function () {
    //     window.localStorage.clear();
    //     getVessels();
    // };

};


var crudRoom = new function () {
    this.Add = function (vesselId) {
        var el = document.getElementById("input-add-room");
        var room = el.value;
        if (room) {
            var obj = {
                "name": room,
                "vesselId": Number(vesselId),
                "vessel": null,
                "monitor": null,
                "image": null
            };
            postRoom(obj);
            el.value = '';
        }
        showRoomEditsMessage(vesselId, room, "add");
        console.log("crudRoom.add finished");
    };

    this.CloseForm = function () {
        var div = document.getElementById('saveEditRoom');
        //remove form from dom
        if (div) {
            div.parentNode.removeChild(div);
        }
    };

    this.CloseAddRoomForm = function () {
        var div = document.getElementById('saveAddRoom');
        //remove form from dom
        if (div) {
            div.parentNode.removeChild(div);
        }
    };

    this.Edit = function (currentVesselId, currentId, name) {
        var el = document.getElementById("edit-room-" + currentId);
        el.id = "edit-room-" + currentId;
        el.value = name;
        var obj = {
            "roomId": Number(currentId),
            "name": name,
            "vesselId": Number(currentVesselId),
            "vessel": null,
            "monitor": null,
            "image": null
        };
        updateRoom(currentId, obj);
        showRoomEditsMessage(currentId, name, "edit");
    };

    this.Delete = function (name, currentId) {
        var ask = confirm("do you really want to delete " + name + "?");
        if (ask == true) {
            deleteRoom(currentId);
            showRoomDeleteMessage(name, currentId);
            console.log(name + "was deleted.");
        } else {
            console.log("Not deleted.");
        }

    };

};


var crudMonitor = new function () {
    this.Add = function (obj) {
        // var el = document.getElementById("input-add-room");
        postMonitor(obj);
        refreshData();
        // window.location.reload();
        // showMonitorEditsMessage();
        console.log("crudMonitor.add finished");
    };

    this.Edit = function (obj, code) {
        updateMonitor(obj, code);
        refreshData();
        // window.location.reload();
        console.log("crudMonitor.edit finished");
    };

    this.Delete = function (code, monitorRoomId, monitorVesselId) {
        var ask = confirm("do you really want to delete this Monitor?");
        if (ask == true) {
            deleteMonitor(code);
            getMonitorsTableMessage("delete", code, monitorRoomId);
            // refreshData();
            // window.location.reload();
            console.log("Monitor was deleted.");
        } else {
            console.log("Not deleted.");
        }

    };

    this.HasPositions = function (monitorId) {
        var key = "positions";
        var positions = getFromLocalStorage(key);
        if (positions.filter(e => e.monitorId === monitorId).length > 0) {
            return true;
        } else {
            return false;
        }
    }

};


var crudImage = new function () {
    this.getImageUrl = function (roomId) {
        return url + "/api/ImageUpload/get/image/" + roomId;
    };

    this.Add = function (roomId, obj) {
        postImage(roomId, obj);
        console.log("crudImage.add finished");
    }
    this.Delete = function (roomId) {
        var ask = confirm("Do you really want to delete this Image?");
        if (ask == true) {
            deleteImage(roomId);
            console.log("Image with id [" + roomId + "] was deleted.");
        } else {
            console.log("Not deleted.");
        }
    }


    this.CloseImage = function (roomId) {
        var div = document.getElementById("image-by-roomId-" + roomId);
        var closeIcon = document.getElementById("show-room-image-close-icon");
        if (div) {
            div.parentNode.removeChild(div);
        } else {
            var oldImgs = document.getElementsByClassName("show-room-image");
            removeFromDOM(oldImgs, "show-room-image");
        }
        if (closeIcon) {
            closeIcon.parentNode.removeChild(closeIcon);
        }
        this.CloseImageContainer();
    };

    this.CloseImageContainer = function () {
        var div = document.getElementById("show-image-edits-container");
        var div2 = document.getElementById("show-image-container");
        while (div.hasChildNodes()) {
            div.removeChild(div.firstChild);
        }
        while (div2.hasChildNodes()) {
            div2.removeChild(div2.firstChild);
        }
        document.getElementById("image-container").classList.remove("image-container-style");
        console.log("show-image-edits-container closed");
    }
};


var crudPositions = new function () {
    this.GetPositions = function (roomId, monitorId) {
        getPositions();
        var positions = getFromLocalStorage("positions");
        var canvas = document.getElementById("canvas-image-by-roomId-" + roomId);
        var ctx = canvas.getContext("2d");
        for (var i = 0; i < positions.length; i++) {
            //draw positions line on canvas.
            if (positions[i].monitorId == monitorId) {
                let item = positions[i];
                console.warn("item", item);
                // drawLine(item.x1, item.y1, item.x2, item.y2);
                ctx.beginPath();
                ctx.strokeStyle = 'green';
                ctx.lineWidth = 7;
                ctx.moveTo(item.x1, item.y1);
                ctx.lineTo(item.x2, item.y2);
                ctx.stroke();
            }
        }
    }

    this.Add = function (obj, monitorId) {
        postPositions(obj);
        showPositionsEditsMessage(monitorId, "add");
        console.log("crudPositions.add finished");
    }

    this.Delete = function (monitorId) {
        var ask = confirm("do you really want to delete current positions?");
        if (ask == true) {
            deletePositions(monitorId);
            showPositionsEditsMessage(monitorId, "delete");
            console.log("Positions by monitorId " + monitorId + " was deleted.");
        } else {
            console.log("Not deleted.");
        }

    };
}


var crudUser = new function () {
    this.Login = function (obj) {
        postUser(obj);
        refreshData();
        console.log("crudUser.Login finished");
    }

    this.TestLogin = function (obj) {
        getUser(obj);
        console.log("crudUser.GET finished");
    }
}