//----------------------------------------localStorage start----------------------------------------
function saveToLocalStorage(objName, obj) {
    window.localStorage.setItem(objName, JSON.stringify(obj));
}
function getFromLocalStorage(id) {
    return JSON.parse(window.localStorage.getItem(id));
}
function localStorageContains(key) {
    return key in window.localStorage ? true : false;
}

function saveToLocalStorageByKey(key, obj) {
    window.localStorage.setItem(key, JSON.stringify(obj));
}


//----------------------------------------localStorage end------------------------------------------

//Help function to clear active class of list items.
function clearActives(classlist, className) {
    if (classlist) {
        for (i = 0; i < classlist.length; i++) {
            classlist[i].classList.remove(className);
        }
    }
}

//Help function to add class for list of elements.
function addClassToItems(itemList, className) {
    if (itemList) {
        for (i = 0; i < itemList.length; i++) {
            itemList[i].classList.add(className);
        }
    }
}

//Help function to remove element by className
function removeFromDOM(element, className) {
    for (var i = 0; i < element.length; i++) {
        if (element[i].className.toLowerCase() == className) {
            element[i].parentNode.removeChild(element[i]);
        }
    }
}


// Admin page edit vessel to showing success message
function showVesselEditsMessage(vesselId, vesselName, key) {
    //TODO:remove form and show msg on timer.
    var parentDiv = document.getElementById("edit-vessel-div");
    var msgDiv = document.createElement("div");
    msgDiv.classList.add("alert", "alert-success", "alert-msg-success-style");
    if (key == "edit") {
        msgDiv.innerHTML = vesselName + " was succesfully edited!";
        msgDiv.id = "edit-vessel-" + vesselId + "-msg";
    } else if (key == "add") {
        msgDiv.innerHTML = vesselName + " was succesfully added!";
        msgDiv.id = "add-vessel-" + vesselId + "-msg";
    }
    var closeBtn = document.createElement("a");
    closeBtn.classList.add("close-icon");
    closeBtn.innerHTML = "&#10006";
    msgDiv.appendChild(closeBtn);
    // Close msg element and form
    closeBtn.addEventListener(
        "click",
        function () {
            crudVessel.CloseMsg(msgDiv.id);
            crudVessel.CloseInput();
            refreshData();
            window.location.reload();
        },
        false
    );
    parentDiv.appendChild(msgDiv);
}

// Admin page edit room to showing success message
function showRoomEditsMessage(currentId, roomName, key) {
    //TODO:remove form and show msg on timer.
    var parentDiv = document.getElementById("rooms-edits-div");
    var msgDiv = document.createElement("div");
    msgDiv.classList.add("alert", "alert-success", "alert-msg-success-style");
    if (key == "edit") {
        // currentId -> roomID
        msgDiv.innerHTML = roomName + " was succesfully edited!";
        msgDiv.id = "edit-room-with-roomId-" + currentId + "-msg";
    } else if (key == "add") {
        // currentId -> vesselID
        msgDiv.innerHTML = roomName + " was succesfully added!";
        msgDiv.id = "add-room-with-vesselId-" + currentId + "-msg";
    }
    var closeBtn = document.createElement("a");
    closeBtn.classList.add("close-icon");
    closeBtn.innerHTML = "&#10006";
    msgDiv.appendChild(closeBtn);
    // Close msg element and form
    closeBtn.addEventListener(
        "click",
        function () {
            crudVessel.CloseMsg(msgDiv.id);
            crudRoom.CloseForm();
            // refreshData();
            window.location.reload();
        },
        false
    );
    parentDiv.prepend(msgDiv);
}


// Admin page delete room to showing success message
function showRoomDeleteMessage(name, currentId) {
    var parentDiv = document.getElementById("rooms-edits-div");
    var msgDiv = document.createElement("div");
    msgDiv.classList.add("alert", "alert-danger", "alert-msg-danger-style");
    msgDiv.innerHTML = "Room " + name + " was succesfully deleted!";
    msgDiv.id = "delete-room-with-roomId-" + currentId + "-msg";
    var closeBtn = document.createElement("a");
    closeBtn.classList.add("close-icon");
    closeBtn.innerHTML = "&#10006";
    msgDiv.appendChild(closeBtn);
    // Close msg element and form
    closeBtn.addEventListener(
        "click",
        function () {
            crudVessel.CloseMsg(msgDiv.id);
            crudRoom.CloseForm();
            // refreshData();
            window.location.reload();
        },
        false
    );
    parentDiv.prepend(msgDiv);
}

function showImageEditsMessage(roomId, key) {
    var parentDiv = document.getElementById("show-image-container");
    var msgDiv = document.createElement("div");
    msgDiv.classList.add("alert");
    if (key == "add") {
        msgDiv.classList.add("alert-success", "alert-msg-success-style");
        msgDiv.innerHTML = "Image with id [" + roomId + "] was succesfully added!";
        msgDiv.id = "add-image-by-roomId-" + roomId + "-msg";
    } else if (key == "delete") {
        msgDiv.classList.add("alert-danger", "alert-msg-danger-style");
        msgDiv.innerHTML = "Image with id [" + roomId + "] was succesfully deleted!";
        msgDiv.id = "delete-image-by-roomId-" + roomId + "-msg";
    }
    var closeBtn = document.createElement("a");
    closeBtn.classList.add("close-icon");
    closeBtn.innerHTML = "&#10006";
    msgDiv.appendChild(closeBtn);
    // Close msg element and form
    closeBtn.addEventListener(
        "click",
        function () {
            window.location.reload();
        },
        false
    );
    parentDiv.prepend(msgDiv);
}

function showPositionsEditsMessage(monitorId, key) {
    var parentDiv = document.getElementById("show-image-container");
    var msgDiv = document.createElement("div");
    msgDiv.classList.add("alert");
    if (key == "add") {
        msgDiv.classList.add("alert-success", "alert-msg-success-style");
        msgDiv.innerHTML = "Position with monitorId [" + monitorId + "] was succesfully added!";
        msgDiv.id = "add-position-by-monitorId-" + monitorId + "-msg";
    } else if (key == "delete") {
        msgDiv.classList.add("alert-danger", "alert-msg-danger-style");
        msgDiv.innerHTML = "Position with monitorId [" + monitorId + "] was succesfully deleted!";
        msgDiv.id = "delete-position-by-monitorId-" + monitorId + "-msg";
    }
    var closeBtn = document.createElement("a");
    closeBtn.classList.add("close-icon");
    closeBtn.innerHTML = "&#10006";
    msgDiv.appendChild(closeBtn);
    // Close msg element and form
    closeBtn.addEventListener(
        "click",
        function () {
            window.location.reload();
        },
        false
    );
    parentDiv.prepend(msgDiv);

}

// function to show roomImage in canvas.
function showImageOnCanvas(roomId, image) {
    var canvas = document.getElementById("canvas-image-by-roomId-" + roomId);
    var canvasContext = canvas.getContext('2d');
    canvasContext.drawImage(image, 0, 0);
}

function remoteLogin(monitorIp) {
    var remoteUrl = "http://" + monitorIp + ":16992";
    window.open(remoteUrl, '_blank');
}
function remoteLoginRDP(monitorIp) {
    console.log("RDP onclick " + monitorIp);
}

function hasPositionsOrNot(monitorId) {
    var key = "positions";
    var positions = getFromLocalStorage(key);
    if (positions.filter(e => e.monitorId === monitorId).length > 0) {
        return true;
    } else {
        return false;
    }
}


function checkSession() {
    if (sessionStorage.getItem("user") == null || sessionStorage.getItem("user") == undefined) {
        window.location.href = "/login.html";
    }
    // else {
    //     window.location.href = "/";
    // }
}

function logOut() {
    console.log("logged out");
    sessionStorage.clear();
    checkSession();
}

function loadMenu() {
    var data = "<li class='nav-item' id='nav-item-1'><a class='nav-link' href='/'><i class='fas fa-map-marked-alt'></i> Map <span class='sr-only'>(current)</span></a></li>" +
        "<li class='nav-item' id='nav-item-2'> <a class='nav-link' href='../views/monitors.html'><i class='fas fa-tv menu-tv'></i> Monitors</a></li>" +
        "<li class='nav-item' id='nav-item-4'><a class='nav-link' href='../views/admin.html'><i class='fas fa-cog'></i> Admin</a></li>";
    // "<li class='nav-item' id='nav-item-3'><a class='nav-link' href='../swagger'>Swagger</a></li>" +
    // "<li class='nav-item'><a id='nav-item-5' class='nav-link' onclick='refreshData()' id='refresh-data-btn' href='#'>Refresh</a></li>";
    var logout = "<li class='nav-item' style=' padding-left: 0.5em;'><a id='log-out' class='nav-link' onclick='logOut()' href='#'>Logout <i class='fas fa-sign-out-alt'></i></a></li>";

    document.getElementById("menu-header").innerHTML = data;
    document.getElementById("menu-header-logout").innerHTML = logout;

    var active = "active";
    const bodyId = document.getElementsByTagName("body")[0].id;
    if (bodyId == "map-page") {
        document.getElementById("nav-item-1").classList.add(active);
    }
    if (bodyId == "monitors-page") {
        document.getElementById("nav-item-2").classList.add(active);
    }
    if (bodyId == "admin-page") {
        document.getElementById("nav-item-4").classList.add(active);
    }

}

/**
 * Get Monitor Status from TSM by vesselId and roomId
 * @param {*} vesselId 
 * @param {*} roomId 
 * @param {*} array 
 */
const getDataFromTSM = async (vesselId, roomId, array) => {
    const vesselName = getVesselNameById(vesselId);
    const roomName = getRoomNameById(roomId);
    const url = tsmUrl + "DS%20Screens%20" + vesselName + "%20-%20" + roomName;
    console.warn("TSM url for " + vesselName + "-" + roomName + ":" + url);
    await fetch(url)
        .then((response) => response.text())
        .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
        .then((data) => {
            const targets = data.querySelectorAll("target");
            targets.forEach((item) => {
                var id = item.querySelector("identity").querySelector("id");
                var status = item
                    .querySelector("monitoring_summary")
                    .querySelector("summary_state");
                array.push({
                    id: id.innerHTML,
                    status: status.innerHTML,
                    vessel: vesselId,
                    room: roomId
                });
            });
            // console.log("TSMdata: ", array);
        });
};

function getVesselNameById(vesselId) {
    for (var i = 0; i < vessels.length; i++) {
        if (vessels[i].vesselId == vesselId) {
            return vessels[i].name.replace(" ", '%20');
        }
    }
}

function getRoomNameById(roomId) {
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].roomId == roomId) {
            return rooms[i].name.replace(" ", '%20');
        }
    }
}

function getRoomNameByIdSimple(roomId) {
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].roomId == roomId) {
            return rooms[i].name;
        }
    }
}

/**
 * Function that remove old monitorsTable for rerendering.
 */
function removeMonitorsOldTable() {
    var oldTable = document.getElementById("monitorsTable");
    if (oldTable) {
        oldTable.parentNode.removeChild(oldTable);
    }
}

/**
 *  Function that show message for MonitorsTable.
 * @param {*} type 
 * @param {*} monitorCode 
 * @param {*} roomId 
 */
function getMonitorsTableMessage(type, monitorCode, roomId) {
    removeMonitorsOldTable();
    // refreshData();
    window.localStorage.clear();
    getMonitors(roomId);
    var alertSuccess = document.createElement("div");
    var msg = "";
    var room = getRoomNameByIdSimple(Number(roomId));
    if (type == "delete") {
        alertSuccess.classList.add("alert", "alert-danger");
        alertSuccess.id = "monitorsTable-delete-alert";
        alertSuccess.classList.add("alert-msg-success-style");
        msg = "Monitor with code <b>" + monitorCode + "</b> in room <b>" + room + "</b> was deleted!";
    } else if (type == "add") {
        alertSuccess.classList.add("alert", "alert-success");
        alertSuccess.id = "monitorsTable-add-alert";
        alertSuccess.classList.add("alert-msg-danger-style");
        msg = "Monitor with code <b>" + monitorCode + "</b> in room <b>" + room + "</b> was succesfully added!";
    } else if (type == "update") {
        alertSuccess.classList.add("alert", "alert-success");
        alertSuccess.id = "monitorsTable-update-alert";
        alertSuccess.classList.add("alert-msg-success-style");
        msg = "Monitor with code <b>" + monitorCode + "</b> in room <b>" + room + "</b> was succesfully modified!";
    }
    alertSuccess.innerHTML = msg;
    document.getElementById("monitor-list-data").appendChild(alertSuccess);
}