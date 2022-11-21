// const mainUrl = "https://dev-digital-screens-map.fleet.zone";
const vesselList = document.getElementById("vessel-list");
const roomList = document.getElementById("room-list");
const monitorsTable = document.getElementById("monitor-list-data");
const container = document.getElementById("main-container");
const secondContainer = document.getElementById("second-container");
const addVesselContainer = document.getElementById("add-vessel-container");
const editVesselForm = document.getElementById("edit-vessel-div");
const imageContainer = document.getElementById("image-container");
const showImageContainer = document.getElementById("show-image-container");
const showImageEditsContainer = document.getElementById("show-image-edits-container");
var rooms = {};
var monitors = {};
var vessels = {};
var positions = {};

window.onload = function () {
    init();
    refreshData();
};

function init() {
    checkSession();
    loadMenu();
    this.renderVessels();
}

function renderVessels() {
    getVessels();
    var ul = document.createElement("ul");
    ul.classList.add("list-group");
    var counter = 0;
    var firstVesselId = 0;
    for (var i = 0; i < vessels.length; i++) {
        counter++;
        var item = vessels[i];
        var li = document.createElement("li");
        if (counter == 1) {
            firstVesselId = item.vesselId;
            // renderSelectedVessel(firstVesselId);
            renderRoomList(firstVesselId); // to test!

            //Put "Add Vessel" btn at the top of list.
            var btnAdd = document.createElement("button");
            btnAdd.classList.add("btn", "btn-outline-primary", "waves-effect", "add-vessel", "edit-vesselId");// last class for switch color with others buttons.
            btnAdd.id = "btn-add-vessel";
            btnAdd.innerHTML = 'Add vessel <i class="fa fa-plus-square" id="add-vessel" data-toggle="tooltip" title="Add" data-placement="left" style="float: right;"></i>';
            btnAdd.addEventListener('click', renderNewVesselAdding);
            ul.appendChild(btnAdd);
        }

        //Put list of vessels with edit buttons.
        li.classList.add("list-group-item", "list-group-item-action", "admin-vessel-item");
        li.id = "vesselId-" + item.vesselId;
        li.innerHTML = item.name + ' <i id=icon-mons-edit-vesselId-' + item.vesselId + ' class="fas fa-tv"></i>';
        var btn = document.createElement("button");
        btn.classList.add("btn", "btn-outline-primary", "waves-effect", "edit-vesselId");
        btn.id = "btn-edit-vesselId-" + item.vesselId;
        btn.innerHTML = 'Edit ' + item.name + ' <i class="fa fa-edit" id=edit-vesselId-' + item.vesselId + ' data-toggle="tooltip" title="Edit" data-placement="left" style="float: right;"></i>';
        ul.appendChild(li);
        ul.appendChild(btn);
        vesselList.appendChild(ul);
    }

    // highlight current Vessel and switching between them
    var listItems = ul.getElementsByTagName("li");
    var listItemsIcons = ul.getElementsByTagName("i");
    var vesselsList = document.getElementsByClassName("edit-vesselId");
    for (var i = 0; i < listItems.length; i++) {
        // Onclick event for each Vessel.
        listItems[i].addEventListener("click", function () {
            console.log("onclick vessel by id:", this.id);
            var icon = document.getElementById("icon-mons-edit-" + this.id).classList.add("icon-mons-edit-vesselId");
            //change monitors icon color by vessel onclick
            for (let i = 0; i < listItemsIcons.length; i++) {
                var item = listItemsIcons[i];
                if (!item.id.startsWith("icon-mons-edit-" + this.id)) {
                    item.classList.remove("icon-mons-edit-vesselId");
                }
            }
            removeMonitorsOldTable();
            // crudApp.createTable(item.roomId, this.id);
            secondContainer.style.display = "none"; //hide second container
            container.style.display = "inline"; //show main container
            crudImage.CloseImageContainer();//if image opened to close

            //change edit button color
            clearActives(vesselsList, 'btn-outline-default');
            addClassToItems(vesselsList, "btn-outline-primary");

            if (!this.classList.contains('active')) {
                clearActives(listItems, 'active');
                this.classList.toggle('active');
                renderRoomList(this.id.split("-")[1]);
                renderSelectedVessel(this.id.split("-")[1]);

            }
        });

    }
    showEditsForVessels();
}

/**
 * Function that shows input for adding new vessel.
 */
function renderNewVesselAdding(e) {
    clearVesselAndRoomsEdits();
    addVesselContainer.style.display = "inline"; //show container
    container.style.display = "none"; //hide main container
}

/**
 * Function adds click event and changes "Edit Vessel" btn styles.
 */
function showEditsForVessels() {
    var vesselEditBtns = document.getElementsByClassName("edit-vesselId");
    var vesselListGroupItems = document.getElementsByClassName("list-group-item");
    for (var i = 0; i <= vesselEditBtns.length - 1; i++) {
        var item = document.getElementsByClassName("edit-vesselId")[i];
        item.addEventListener("click", function (e) { //Edit Vessel click event.
            //click "Add vessel" event
            if (this.id == "btn-add-vessel") {
                addVesselContainer.style.display = "inline"; //show add-vessel-container
                console.log("add vessel click");
            } else {
                addVesselContainer.style.display = "none"; //hide add-vessel-container
                console.log("edit vessel click");
            }
            crudVessel.CloseInput();
            crudImage.CloseImageContainer();
            //change edit button color
            clearActives(vesselEditBtns, 'btn-outline-default');
            addClassToItems(vesselEditBtns, "btn-outline-primary");

            //change Vessel list item color to default
            clearActives(vesselListGroupItems, "active");

            container.style.display = "none";
            secondContainer.style.display = "inline";

            this.classList.remove("btn-outline-primary");
            this.classList.add("btn-outline-default");

            //cut vesselId from btn-edit-vesselId-X.
            var vesselIdShortened = this.id.split('-')[3];
            renderVesselAndRoomsEdits(vesselIdShortened);
        })
    }
}

function renderVesselAndRoomsEdits(currentVesselId) {
    getVessels();
    getRooms();
    clearVesselAndRoomsEdits(); //remove old elements.
    //-----------------Add new content(vessel)-----------------
    var div = document.createElement("div");
    div.classList.add("vessel-edits-div");

    var vesselHeader = document.createElement("span");
    vesselHeader.classList.add("vessel-current-header");
    vesselHeader.innerHTML = '<i class="fa fa-ship"></i> ';

    var span = document.createElement("span");
    span.id = "vessel-edits-id-" + currentVesselId;
    span.classList.add("vessel-current-span");

    var btnVesselEdit = document.createElement("button");
    btnVesselEdit.classList.add("edit-vesselId", "btn", "btn-sm", "btn-primary");
    btnVesselEdit.id = "btn-submit-edit-vesselId-" + currentVesselId;
    btnVesselEdit.innerHTML = '<i class="fa fa-edit" id=submit-edit-vesselId-' + currentVesselId + ' data-toggle="tooltip" title="Edit vessel" data-placement="left" style="float: right;"></i>';
    //onclick event for edit vessel name
    btnVesselEdit.addEventListener(
        "click",
        function () {
            console.log("edit vessel click-", this.id);
            showEditVesselForm(currentVesselId);
        }, false
    );

    var btnVesselDelete = document.createElement("button");
    btnVesselDelete.classList.add("delete-vesselId", "btn", "btn-sm", "btn-danger");
    btnVesselDelete.id = "btn-submit-delete-vesselId-" + currentVesselId;
    btnVesselDelete.innerHTML = '<i class="fa fa-trash-alt" id=submit-delete-vesselId-' + currentVesselId + ' data-toggle="tooltip" title="Delete vessel" data-placement="left" style="float: right;"></i>';
    //onclick event to delete vessel
    btnVesselDelete.addEventListener(
        "click",
        function () {
            console.log("delete vessel click-", this.id);
            crudVessel.Delete(currentVesselId);
        }, false
    );

    for (var i = 0; i < vessels.length; i++) {
        if (vessels[i].vesselId == currentVesselId) {
            span.innerHTML = vessels[i].name;
        }
    }

    //showing buttons for all vesselsItems except for first(Add vessel button)
    if (currentVesselId > 0) {
        div.appendChild(vesselHeader);
        div.appendChild(span);
        div.appendChild(btnVesselEdit);
        div.appendChild(btnVesselDelete);
    }
    secondContainer.appendChild(div);

    //-----------------adding rooms-edits-div-----------------  
    var roomEditsDiv = document.createElement("div");
    roomEditsDiv.classList.add("rooms-edits-div");
    roomEditsDiv.id = "rooms-edits-div";

    var roomListHeader = document.createElement("span");
    roomListHeader.classList.add("room-edits-span");
    roomListHeader.innerHTML = '<i class="fa fa-image"></i> Rooms';

    //-----------------adding "Add room" btn-----------------    
    var btnRoomAdd = document.createElement("button");
    btnRoomAdd.classList.add("btn", "btn-outline-primary", "waves-effect", "add-room");
    btnRoomAdd.id = "btn-add-room";
    btnRoomAdd.innerHTML = '<i class="fa fa-plus-square" id="add-vessel" data-toggle="tooltip" title="Add room" data-placement="left"></i>';
    //onclick event to add room
    btnRoomAdd.addEventListener(
        "click",
        function () {
            console.log("add room click to vessel with id-" + currentVesselId);
            showAddRoomForm(currentVesselId);
        }, false
    );

    //-----------------Add new content(room list)-----------------
    var ul = document.createElement("ul");
    ul.classList.add("room-edits-ul", "list-group");
    for (var i = 0; i < rooms.length; i++) {
        let item = rooms[i];
        if (item.vesselId == currentVesselId) {
            var li = document.createElement("li");
            var span = document.createElement("span");
            span.innerHTML = item.name;
            li.appendChild(span);
            li.id = "room-edits-id-" + item.roomId;
            li.classList.add("list-group-item", "list-group-item-action");
            // add edit button to room item.
            var btnRoomEdit = document.createElement("button");
            btnRoomEdit.classList.add("edit-roomId", "btn", "btn-sm", "btn-primary", "right");
            btnRoomEdit.id = "btn-submit-edit-roomId-" + item.roomId;
            btnRoomEdit.innerHTML = '<i class="fa fa-edit" id=submit-edit-roomId-' + item.roomId + ' data-toggle="tooltip" title="Edit room" data-placement="left" style="float: right;"></i>';
            //onclick event for edit room
            btnRoomEdit.addEventListener(
                "click",
                function () {
                    console.log("edit room click-", item.roomId + ", for vessel-" + currentVesselId + " this.id " + this.id);
                    showEditRoomForm(currentVesselId, item.roomId, this.id);
                }, false
            );

            var btnRoomDelete = document.createElement("button");
            btnRoomDelete.classList.add("delete-roomId", "btn", "btn-sm", "btn-danger", "right");
            btnRoomDelete.id = "btn-submit-delete-roomId-" + item.roomId;
            btnRoomDelete.innerHTML = '<i class="fa fa-trash-alt" id=submit-delete-roomId-' + item.roomId + ' data-toggle="tooltip" title="Delete room" data-placement="left" style="float: right;"></i>';
            //onclick event for delete room
            btnRoomDelete.addEventListener(
                "click",
                function () {
                    console.log("delete room click-", item.roomId);
                    crudRoom.Delete(item.name, item.roomId);
                    refreshData();
                }, false
            );

            var btnShowRoomImage = document.createElement("a");
            btnShowRoomImage.classList.add("showRoomImage", "btn", "btn-sm", "btn-default", "right");
            btnShowRoomImage.id = "btn-submit-show-image-by-roomId-" + item.roomId;
            btnShowRoomImage.href = "#show-image-edits-container";
            btnShowRoomImage.innerHTML = '<i class="fa fa-eye" id=submit-show-image-by-roomId-' + item.roomId + ' data-toggle="tooltip" title="Show room image" data-placement="left" style="float: right;"></i>';
            //onclick event for delete room
            btnShowRoomImage.addEventListener(
                "click",
                function () {
                    console.log("show room image click-", item.roomId);
                    showRoomImageContainer(item.roomId, item.name);
                    // crudRoom.showImage(item.roomId);
                }, false
            );

            //add edit & delete buttons to view for each room
            li.appendChild(btnRoomDelete);
            li.appendChild(btnRoomEdit);
            li.appendChild(btnShowRoomImage);
            ul.appendChild(li);
        }
    }

    roomEditsDiv.appendChild(roomListHeader);
    roomEditsDiv.appendChild(btnRoomAdd);
    roomEditsDiv.appendChild(ul);

    //showing Room Edits for all vesselsItems except for first(Add vessel button)
    if (currentVesselId > 0) {
        secondContainer.appendChild(roomEditsDiv);
    }
}



function clearVesselAndRoomsEdits() {
    var oldDivs = secondContainer.getElementsByClassName("vessel-edits-div");
    var oldUls = secondContainer.getElementsByClassName("rooms-edits-div");
    // Remove old content(vessel name).
    removeFromDOM(oldDivs, "vessel-edits-div");
    // Remove old content(room list).
    removeFromDOM(oldUls, "rooms-edits-div");
}

/**
 * Function that shows form for adding new room for current vessel. 
 * @param {*} currentVesselId 
 */
function showAddRoomForm(currentVesselId) {
    var roomsEditsDiv = document.getElementById("rooms-edits-div");

    var formDiv = document.createElement("div");
    formDiv.classList.add("md-form");

    var form = document.createElement("form");
    form.method = "POST";
    form.action = "javascript:void(0);";
    form.id = "saveAddRoom";
    form.classList.add = "add-room-form";

    var formInput = document.createElement("input");
    formInput.type = "text";
    formInput.placeholder = "Room name";
    formInput.classList.add = "add-room-for-VesselID-" + currentVesselId;
    formInput.id = "input-add-room";

    var formHeader = document.createElement("h3");
    formHeader.classList.add("add-room-header");
    formHeader.innerHTML = "Add room";

    var submitInput = document.createElement("button");
    submitInput.classList.add("btn", "btn-sm", "btn-default");
    submitInput.setAttribute('type', 'submit');
    submitInput.innerHTML = "<i class='far fa-plus-square' data-toggle='tooltip' title='Save Room' data-placement='left'></i>";

    var closeBtn = document.createElement("a");
    closeBtn.innerHTML = "&#10006";
    // Close form event. // after change CloseInput to CloseForm
    closeBtn.addEventListener(
        "click",
        function () {
            crudRoom.CloseAddRoomForm();
        }, false
    );
    form.appendChild(formHeader);
    form.appendChild(formInput);
    form.appendChild(submitInput);
    form.appendChild(closeBtn);
    formDiv.appendChild(form);
    // if page not contains form than add it
    if (!document.getElementById("saveAddRoom")) {
        roomsEditsDiv.prepend(formDiv);
    }


    form.addEventListener("submit", function (evt) { // submit saveAddRoom form(Add room)
        evt.preventDefault();
        crudRoom.Add(currentVesselId);
        refreshData();
        console.log("add room form submitted");
    });
}


/**
 * Function that shows input for edit vessel and collects data for request.
 * @param {*} currentVesselId 
 */
function showEditVesselForm(currentVesselId) {
    var form = document.createElement("form");
    form.method = "PUT";
    // form.action = "javascript:void(0);";
    form.id = "saveEdit";
    form.classList.add = "edit-vessel-form";

    //TODO: fix input id to showing room Name in current input
    //TODO: delete unnecessary edit forms by default.
    var formInput = document.createElement("input");
    formInput.type = "text";
    formInput.classList.add = "edit-vessel-input"
    formInput.id = "edit-vessel-" + currentVesselId;
    formInput.name = "edit-vessel-name";

    var formHeader = document.createElement("h3");
    formHeader.classList.add("edit-vessel-header");
    formHeader.innerHTML = "Edit Vessel";

    var submitInput = document.createElement("button");
    submitInput.classList.add("btn", "btn-sm", "btn-default");
    submitInput.setAttribute('type', 'submit');
    submitInput.innerHTML = "<i class='far fa-save' data-toggle='tooltip' title='Save vessel' data-placement='left'></i>";
    // submitInput.value = "Edit";

    var closeBtn = document.createElement("a");
    closeBtn.innerHTML = "&#10006";
    closeBtn.addEventListener(  // Close form event.
        "click",
        function () {
            crudVessel.CloseInput();
        }, false
    );
    //add inputs and form to view to edit vessel.
    form.appendChild(formHeader);
    form.appendChild(formInput);
    form.appendChild(submitInput);
    form.appendChild(closeBtn);
    // if page not contains form than add it
    if (!document.getElementById("saveEdit")) {
        editVesselForm.appendChild(form);
    }


    //data prepare to request.
    var vesselNametoSend = "";
    for (var i = 0; i < vessels.length; i++) {
        if (vessels[i].vesselId == currentVesselId) {
            vesselNametoSend = vessels[i].name;
        }
    }
    //showing vessel name on form
    var el = document.getElementById("edit-vessel-" + currentVesselId);
    el.id = "edit-vessel-" + currentVesselId;
    el.value = vesselNametoSend;

    form.addEventListener("submit", function (evt) { // submit saveEdit form(Edit vessel)
        evt.preventDefault();
        console.log("edit vessel form submitted");
        crudVessel.Edit(currentVesselId, el.value.trim());
        refreshData(); //from api.js 
    });
}


function showEditRoomForm(currentVesselId, currentRoomId, elementId) {
    // TODO: by click change room-edits-id-X color.
    var roomsEditsDiv = document.getElementById("rooms-edits-div");
    var formDiv = document.createElement("div");
    formDiv.classList.add("md-form");

    var form = document.createElement("form");
    form.method = "PUT";
    form.action = "javascript:void(0);";
    form.id = "saveEditRoom";
    form.classList.add = "edit-room-form";

    var formHeader = document.createElement("h3");
    formHeader.classList.add("edit-room-header");
    formHeader.innerHTML = "Edit Room";

    var formInput = document.createElement("input");
    formInput.type = "text";
    formInput.classList.add = "edit-room-input";
    formInput.id = "edit-room-" + currentRoomId;

    var submitInput = document.createElement("button");
    submitInput.classList.add("btn", "btn-sm", "btn-default");
    submitInput.setAttribute('type', 'submit');
    submitInput.innerHTML = '<i class="far fa-save" data-toggle="tooltip" title="Save Room" data-placement="left"></i>';

    var closeBtn = document.createElement("a");
    closeBtn.innerHTML = "&#10006";
    // Close input event.
    closeBtn.addEventListener(
        "click",
        function () {
            crudRoom.CloseForm();
            console.log("close edit room form click");
        }, false
    );

    //add inputs and form to view to edit vessel.
    form.appendChild(formHeader);
    form.appendChild(formInput);
    form.appendChild(submitInput);
    form.appendChild(closeBtn);
    formDiv.appendChild(form);
    // if page not contains form than add it
    if (!document.getElementById("saveEditRoom")) {
        roomsEditsDiv.prepend(formDiv);
    }

    // get room Name
    var roomNametoSend = "";
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].roomId == currentRoomId) {
            roomNametoSend = rooms[i].name;
        }
    }

    //showing room name on form
    var el = document.getElementById("edit-room-" + currentRoomId);
    el.id = "edit-room-" + currentRoomId;
    el.value = roomNametoSend;

    form.addEventListener("submit", function (evt) { // submit saveEditRoom form(Edit room)
        evt.preventDefault();
        console.log("edit room form submitted");
        crudRoom.Edit(currentVesselId, currentRoomId, el.value.trim());
        refreshData();
    });
}

/**
 * Function that shows image for currrent room.
 * @param {*} roomId 
 */
function showRoomImageContainer(roomId, roomName) {
    // crudImage.CloseImage(roomId);
    crudImage.CloseImageContainer();

    var oldImgs = document.getElementsByClassName("show-room-image");
    removeFromDOM(oldImgs, "show-room-image");//remove old images

    showEditsForImage(roomId, roomName);
    //get image from api by roomId
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].roomId == roomId) {
            var img = document.createElement("img");
            var canvasObj = document.createElement("canvas");
            canvasObj.id = "canvas-image-by-roomId-" + roomId;
            canvasObj.width = 1200;
            canvasObj.height = 800;
            canvasObj.classList.add("canvas-image-edit");

            img.classList.add("show-room-image");
            img.id = "image-by-roomId-" + roomId;
            var customUrl = crudImage.getImageUrl(roomId);
            img.src = customUrl;
            //event if image url 404.
            img.addEventListener(
                "error",
                function () {
                    showAddImageForm(roomId);
                }, false
            );
            img.addEventListener( //load image into canvas if response ok.
                "load",
                function () {
                    showImageOnCanvas(roomId, img);
                }, false
            );
        }

    }
    var closeBtn = document.createElement("a");
    closeBtn.innerHTML = "&#10006";
    closeBtn.id = "show-room-image-close-icon";
    // Close input event.
    closeBtn.addEventListener(
        "click",
        function () {
            crudImage.CloseImage(roomId);
            console.log("close room image click");
        }, false
    );

    var btnImageDelete = document.createElement("button");
    btnImageDelete.classList.add("delete-image-by-roomId", "btn", "btn-sm", "btn-danger");
    btnImageDelete.id = "btn-submit-delete-image-by-roomId-" + roomId;
    btnImageDelete.innerHTML = '<i class="fa fa-trash-alt" id=submit-delete-image-by-roomId-' + roomId + ' data-toggle="tooltip" title="Delete image" data-placement="left" style="float: right;"></i>';
    //onclick event for delete room
    btnImageDelete.addEventListener(
        "click",
        function () {
            console.log("delete image click-", roomId);
            crudImage.Delete(roomId);
            showImageEditsMessage(roomId, "delete");
            refreshData();
        }, false
    );

    //Creating two columns and put into image and close/delete btns.
    var divRow = document.createElement("div");
    divRow.classList.add("row");
    var divColImg = document.createElement("div");
    divColImg.classList.add("col-md-11");
    divColImg.id = "canvas-image-parentDiv";
    var divColBtn = document.createElement("div");
    divColBtn.classList.add("col-md-1");
    // divColImg.appendChild(img);
    divColImg.appendChild(canvasObj);
    divColBtn.appendChild(closeBtn);
    divColBtn.appendChild(btnImageDelete);
    divRow.appendChild(divColImg);
    divRow.appendChild(divColBtn);
    imageContainer.classList.add("image-container-style");
    showImageContainer.appendChild(divRow);
    console.log("shown image", customUrl);

}

//Funcion for showing monitors for room image.
function showEditsForImage(roomId, roomName) {
    var key = "monitors-by-roomId-" + roomId;
    // var posKey = "positions";
    var header = document.createElement("h4");
    var ul = document.createElement("ul");
    ul.classList.add("positions-list");
    getPositions(); //check after to refresh data.
    var monitors = getFromLocalStorage(key);
    // var positions = getFromLocalStorage(posKey);
    header.innerHTML = "<i class='fa fa-image'></i> Room: " + roomName;

    for (var i = 0; i < monitors.length; i++) {
        let item = monitors[i];
        var li = document.createElement("li");
        var hasPositions = crudMonitor.HasPositions(item.monitorId);
        var btnPosition = document.createElement("button");

        var btnPositionSave = document.createElement("button");
        btnPositionSave.classList.add("btn", "btn-default", "btn-sm", "btn-positions-save");
        btnPositionSave.id = "btn-save-position-by-monitorId-" + item.monitorId;
        btnPositionSave.innerHTML = "Save";
        btnPositionSave.style.display = "none";

        var btnPositionShow = document.createElement("button");
        //TODO: add other button to hide drawn line.
        btnPositionShow.classList.add("btn", "btn-sm", "btn-default", "btn-positions-show");
        btnPositionShow.id = "btn-show-position-by-monitorId-" + item.monitorId;
        btnPositionShow.innerHTML = '<i class="fa fa-eye" data-toggle="tooltip" title="Show monitor positions" data-placement="left" style="float: right;"></i>';
        btnPositionShow.addEventListener( //event to show positions from monitor
            "click",
            function () {
                console.log("click show positions for monitorId-", item.monitorId);
                crudPositions.GetPositions(roomId, item.monitorId);
            }, false
        );

        btnPositionSave.addEventListener( //event to save position
            "click",
            function () {
                console.log("click save position for monitorId-", item.monitorId);
                this.style.display = "none";
                document.getElementById("btn-add-position-by-monitorId-" + item.monitorId).style.display = "inline";
                var obj = saveCoordinates(item.monitorId, mouseXPosFirst, mouseYPosFirst, mouseXPosSecond, mouseYPosSecond);
                crudPositions.Add(obj, item.monitorId);
            }, false
        );

        if (hasPositions) {
            btnPosition.classList.add("btn", "btn-sm", "btn-danger");
            btnPosition.id = "btn-delete-position-by-roomId-" + roomId;
            btnPosition.innerHTML = '<i class="fa fa-trash-alt" id=submit-delete-position-by-monitorId-' + item.monitorId + ' data-toggle="tooltip" title="Delete positions" data-placement="left" style="float: right;"></i>';
            btnPosition.addEventListener( //event to delete position
                "click",
                function () {
                    console.log("click delete position for monitorId-", item.monitorId);
                    crudPositions.Delete(item.monitorId);
                }, false
            );
        } else { // if monitor has No positions set. Add position btn
            btnPositionShow.style.display = "none";
            var showPosBtn = document.getElementById("btn-show-position-by-monitorId-" + item.monitorId);
            console.log("showPosBtn", showPosBtn);
            if (showPosBtn) {
                showPosBtn.style.display = "none"; // To hide show coord btn/.
            }
            btnPosition.classList.add("btn", "btn-sm", "btn-outline-primary", "waves-effect", "add-posision");
            btnPosition.id = "btn-add-position-by-monitorId-" + item.monitorId;
            btnPosition.innerHTML = 'Coord <i class="fa fa-plus-square" data-toggle="tooltip" title="Add coord" data-placement="left"></i>';
            btnPosition.addEventListener( //event to add position
                "click",
                function () {
                    console.log("click add position for monitorId-", item.monitorId);
                    setPositions(roomId, item.monitorId);
                    document.getElementById("btn-save-position-by-monitorId-" + item.monitorId).style.display = "inline";
                    this.style.display = "none";
                    //show error that cant setup monitors if no image.
                    // crudPositions.Add()
                }, false
            );
        }
        li.id = "position-by-monitorId-" + item.monitorId;
        li.innerHTML = "<i class='fas fa-tv'></i>  " + item.code;
        li.appendChild(btnPosition);
        li.appendChild(btnPositionSave);
        li.append(btnPositionShow);
        ul.appendChild(li);
    }
    showImageEditsContainer.appendChild(header);
    showImageEditsContainer.appendChild(ul);
}


/**
 * Function that shows form for adding new image by roomId.
 * @param {*} roomId 
 */
function showAddImageForm(roomId) {
    console.warn("The image with id [" + roomId + "] could not be loaded.");
    //remove image with 404,and other child elements.
    while (showImageContainer.hasChildNodes()) {
        showImageContainer.removeChild(showImageContainer.firstChild);
    }
    var div = document.createElement("div");
    div.classList.add("custom-file", "saveAddImageDiv");

    var form = document.createElement("form");
    form.method = "POST";
    form.action = "javascript:void(0);";
    form.id = "saveAddImage";
    form.classList.add = "add-image-form";
    form.enctype = "multipart/form-data";

    var formInput = document.createElement("input");
    formInput.type = "file";
    formInput.classList.add("custom-file-input", "add-image-by-roomId-input");
    formInput.id = "add-image-by-roomId-" + roomId;

    var label = document.createElement("label");
    label.classList.add("custom-file-label", "custom-file-label-style");
    label.innerHTML = "Select file";
    label.htmlFor = formInput.id;

    var submitInput = document.createElement("button");
    submitInput.classList.add("btn", "btn-default");
    submitInput.setAttribute('type', 'submit');
    submitInput.innerHTML = '<i class="far fa-plus-square"></i>';

    var closeBtn = document.createElement("a");
    closeBtn.innerHTML = "&#10006";
    // Close form event. // after change CloseInput to CloseForm
    closeBtn.addEventListener(
        "click",
        function () {
            crudImage.CloseImage(roomId);
            console.log("close add new room image click");
        }, false
    );

    var file = null;
    var formData = new FormData();
    //when file selected
    formInput.addEventListener('change', function (event) {
        file = event.target.files[0];
        label.innerHTML = file.name;
        formData = new FormData();
        formData.append("uploadedFile", file);
    });
    form.addEventListener("submit", function (evt) { // submit saveAddImage form(Add Image)
        evt.preventDefault();
        if (file == null) {
            alert("Image not selected");
        } else {
            crudImage.Add(roomId, formData);
            showImageEditsMessage(roomId, "add");
            refreshData();
            console.log("add image form submitted");
        }
    });
    form.appendChild(formInput);
    form.appendChild(label);
    form.appendChild(submitInput);
    form.appendChild(closeBtn);
    div.appendChild(form);
    showImageContainer.appendChild(div);
}

/**
 *  Function render room names for main container.
 * @param {*} vesselId 
 */
function renderRoomList(vesselId) {
    getRooms();
    roomList.innerHTML = "";
    var ul = document.createElement("ul");
    // ul.classList.add("room-list-ul", "nav", "nav-tabs");
    ul.classList.add("room-list-ul", "list-group");
    var counter = 0;
    recreateNoRoomsMessage();

    for (var i = 0; i < rooms.length; i++) {
        let item = rooms[i];
        var subString = "vesselId-";
        if ((subString + item.vesselId) == subString + vesselId) {
            counter++;
            var li = document.createElement("li");
            li.innerHTML = '<i class="fa fa-image"></i>   ' + item.name;
            li.classList.add("room-item", "list-group-item");
            li.id = "room-item-id-" + item.roomId;
            if (counter == 1) { // highlight first room
                li.classList.add("room-active", "room-list-item-bottom");
            }
            li.addEventListener(
                "click",
                function () {
                    console.log("Click room by id: " + item.roomId);
                    getMonitors(item.roomId);
                    showCurrentRoom(item.roomId);
                    crudApp.createTable(item.roomId, item.vesselId);
                }, false
            );
            ul.appendChild(li);
            roomList.appendChild(ul);
            getMonitors(item.roomId);
            // showCurrentRoom(item.roomId);
            crudApp.createTable(item.roomId, vesselId);
        }
        // Show message if vessel has no created rooms. 
        if (counter == 0) {
            document.getElementById("noRoomsTextEl").innerHTML = "The vessel has no created rooms!";
        }
    }
}

function recreateNoRoomsMessage() {
    //remove old 
    var oldNoRoomsText = document.getElementById("noRoomsTextEl");
    if (oldNoRoomsText) {
        oldNoRoomsText.parentNode.removeChild(oldNoRoomsText);
    }
    //create new
    var noRoomsText = document.createElement("div");
    noRoomsText.innerHTML = "";
    noRoomsText.id = "noRoomsTextEl";
    noRoomsText.classList.add("alert", "alert-danger");
    monitorsTable.appendChild(noRoomsText);
}


function renderSelectedVessel(vesselId) {
    var div = document.getElementById("admin-vessel-item-name");
    div.innerHTML = "";
    var currentName = "";
    var header = document.createElement("h2");
    for (var i = 0; i < vessels.length; i++) {
        if (vessels[i].vesselId == vesselId) {
            currentName = vessels[i].name;
        }
    }
    header.innerHTML = '<i class="fa fa-ship"></i> ' + currentName;
    div.appendChild(header);
}

/**
 * Highlight current room (by click)
 * @param {*} roomId 
 */
function showCurrentRoom(roomId) {
    // console.log("by default highligh roomid is ", roomId);
    var element = document.getElementById("room-item-id-" + roomId);
    var div = document.getElementById("room-list");
    var listItems = div.getElementsByTagName("li");
    clearActives(listItems, 'room-active');
    clearActives(listItems, 'room-list-item-bottom');
    if (element) {
        element.classList.add("room-active");
        element.classList.add("room-list-item-bottom");
    }
}


var crudApp = new function () {
    // this.monitorsData = monitors;
    this.col = [
        "monitorId",
        "code",
        "name",
        "ipAddress",
        "macAddress",
        "info",
    ];
    var arrHead = [
        "monitorId",
        "code",
        "name",
        "ipAddress",
        "macAddress",
        "info",
    ];
    this.createTable = function (roomId, vesselId) {
        refreshData();
        getMonitors(roomId);
        // console.log("monitorList", monitors);
        addVesselContainer.style.display = "none"; //hide add-vessel-container
        // EXTRACT VALUE FOR TABLE HEADER.
        for (var i = 0; i < monitors.length; i++) {
            for (var key in monitors[i]) {
                if (this.col.indexOf(key) === -1) {
                    if (arrHead.includes(key)) {
                        // console.warn("key", key);
                        this.col.push(key);
                    }
                }
            }
        }

        // CREATE A TABLE.
        var table = document.createElement('table');
        table.setAttribute('id', 'monitorsTable');
        table.classList.add("vesselId-" + vesselId, "roomId-" + roomId, "table", "table-striped", "table-sm", "table-hover");
        // CREATE A ROW (FOR HEADER).
        var tr = table.insertRow(-1);
        for (var h = 0; h < this.col.length; h++) {
            // ADD TABLE HEADER.
            var th = document.createElement('th');
            // console.warn("cols", this.col[h]);
            switch (this.col[h]) {
                case 'monitorId':
                    th.innerHTML = "#";
                    break;
                case 'code':
                    th.innerHTML = "Code";
                    break;
                case 'name':
                    th.innerHTML = "Name";
                    break;
                case 'ipAddress':
                    th.innerHTML = "IP";
                    break;
                case 'macAddress':
                    th.innerHTML = "MAC";
                    break;
                case 'info':
                    th.innerHTML = "Info";
                    break;
            }
            tr.classList.add("header-color", "white-text");
            tr.appendChild(th);
        }
        //Add Last column to table header
        var thLast = document.createElement("th");
        thLast.colSpan = "3";
        thLast.innerHTML = "Actions";
        thLast.classList.add("table-actions");
        tr.appendChild(thLast);

        // ADD ROWS USING JSON DATA.
        for (var i = 0; i < monitors.length; i++) {
            tr = table.insertRow(-1);           // CREATE A NEW ROW.
            for (var j = 0; j < this.col.length; j++) {
                var tabCell = tr.insertCell(-1);
                if (j == 0) {
                    //add monitor icon to first column
                    tabCell.innerHTML = '<i class="fas fa-tv"></i>';
                    tabCell.id = "monitorId-" + monitors[i].monitorId;
                } else {
                    tabCell.innerHTML = monitors[i][this.col[j]];
                }
            }

            // DYNAMICALLY CREATE AND ADD ELEMENTS TO TABLE CELLS WITH EVENTS.

            this.td = document.createElement('td');

            // *** CANCEL OPTION.
            tr.appendChild(this.td);
            var lblCancel = document.createElement('label');
            lblCancel.innerHTML = '✖';
            lblCancel.setAttribute('onclick', 'crudApp.Cancel(this)');
            lblCancel.setAttribute('style', 'display:none;');
            lblCancel.setAttribute('title', 'Cancel');
            lblCancel.setAttribute('id', 'lbl' + i);
            this.td.appendChild(lblCancel);

            // *** SAVE.
            tr.appendChild(this.td);
            var btSave = document.createElement('button');


            // btSave.setAttribute('type', 'button');      // SET ATTRIBUTES.

            btSave.setAttribute('type', 'submit');
            btSave.innerHTML = "<i class='far fa-save' data-toggle='tooltip' title='Save monitor' data-placement='left'></i>";

            btSave.setAttribute('id', 'Save' + i);
            btSave.setAttribute('style', 'display:none;');
            btSave.setAttribute('onclick', 'crudApp.Save(this)');       // ADD THE BUTTON's 'onclick' EVENT.
            btSave.classList.add("btn", "btn-success", "btn-sm", "save-monitor-byVesselId-" + monitors[i].vesselId, "save-monitor-byRoomId-" + monitors[i].roomId);
            this.td.appendChild(btSave);

            // *** UPDATE.
            tr.appendChild(this.td);
            var btUpdate = document.createElement('button');

            // btUpdate.setAttribute('type', 'button');    // SET ATTRIBUTES.
            // btUpdate.setAttribute('value', 'Update');
            btUpdate.innerHTML = '<i class="fa fa-edit"  data-toggle="tooltip" title="Edit monitor" data-placement="left"></i>';
            btUpdate.setAttribute('id', 'Edit' + i);
            btUpdate.setAttribute('style', 'background-color:#44CCEB;');
            btUpdate.setAttribute('onclick', 'crudApp.Update(this)');   // ADD THE BUTTON's 'onclick' EVENT.
            btUpdate.classList.add("btn", "btn-primary", "btn-sm", "update-monitor-byVesselId-" + monitors[i].vesselId, "update-monitor-byRoomId-" + monitors[i].roomId);
            this.td.appendChild(btUpdate);

            // *** DELETE.
            this.td = document.createElement('th');
            tr.appendChild(this.td);
            var btDelete = document.createElement('button');
            // btDelete.setAttribute('type', 'button');    // SET INPUT ATTRIBUTE.
            // btDelete.setAttribute('value', 'Delete');
            btDelete.innerHTML = '<i class="fa fa-trash-alt" data-toggle="tooltip" title="Delete monitor" data-placement="left"></i>';
            btDelete.setAttribute('style', 'background-color:#ED5650;');
            btDelete.setAttribute('onclick', 'crudApp.Delete(this)');   // ADD THE BUTTON's 'onclick' EVENT.
            btDelete.classList.add("btn", "btn-danger", "btn-sm", "delete-monitor-byVesselId-" + monitors[i].vesselId, "delete-monitor-byRoomId-" + monitors[i].roomId);
            btDelete.id = "delete-monitor-" + monitors[i].code;
            this.td.appendChild(btDelete);
        }
        // ADD A ROW AT THE END WITH BLANK TEXTBOXES AND A DROPDOWN LIST (FOR NEW ENTRY).
        tr = table.insertRow(-1);           // CREATE THE LAST ROW.

        for (var j = 0; j < this.col.length; j++) {
            var newCell = tr.insertCell(-1);
            if (j >= 1) {
                var tBox = document.createElement('input');          // CREATE AND ADD A TEXTBOX.
                tBox.setAttribute('type', 'text');
                tBox.classList.add("form-control")
                tBox.setAttribute('value', '');
                newCell.appendChild(tBox);
            }
        }
        this.td = document.createElement('td');
        this.td.colSpan = "2";
        tr.appendChild(this.td);

        var btNew = document.createElement('button');
        btNew.innerHTML = '<i class="fa fa-plus-square" data-toggle="tooltip" title="Add monitor" data-placement="left"></i>';
        btNew.setAttribute('id', 'New' + i);
        btNew.setAttribute('style', 'background-color:#207DD1;');
        btNew.setAttribute('onclick', 'crudApp.CreateNew(this)');       // ADD THE BUTTON's 'onclick' EVENT.
        btNew.classList.add("btn", "btn-default", "btn-sm", "new-monitor-btn");
        this.td.appendChild(btNew);

        // var div = document.getElementById('container');
        monitorsTable.innerHTML = '';
        monitorsTable.appendChild(table);    // ADD THE TABLE TO THE WEB PAGE.
    };

    // ****** OPERATIONS START.

    // CANCEL.
    this.Cancel = function (oButton) {
        // HIDE THIS BUTTON.
        oButton.setAttribute('style', 'display:none; float:none;');
        var activeRow = oButton.parentNode.parentNode.rowIndex;
        // HIDE THE SAVE BUTTON.
        var btSave = document.getElementById('Save' + (activeRow - 1));
        btSave.setAttribute('style', 'display:none;');
        // SHOW THE UPDATE BUTTON AGAIN.
        var btUpdate = document.getElementById('Edit' + (activeRow - 1));
        btUpdate.setAttribute('style', ' background-color:#44CCEB;');
        var tab = document.getElementById('monitorsTable').rows[activeRow];
        for (i = 0; i < this.col.length; i++) {
            var td = tab.getElementsByTagName("td")[i];
            td.innerHTML = monitors[(activeRow - 1)][this.col[i]];
        }
    }

    // EDIT DATA.
    this.Update = function (oButton) {
        var activeRow = oButton.parentNode.parentNode.rowIndex;
        var tab = document.getElementById('monitorsTable').rows[activeRow];
        for (i = 1; i < 6; i++) {
            var td = tab.getElementsByTagName("td")[i];
            var ele = document.createElement('input');      // TEXTBOX.
            ele.setAttribute('type', 'text');
            ele.classList.add("form-control");
            ele.setAttribute('value', td.innerText);
            td.innerText = '';
            td.appendChild(ele);
        }
        var lblCancel = document.getElementById('lbl' + (activeRow - 1));
        lblCancel.setAttribute('style', 'cursor:pointer; display:block; width:20px; float:left; position: absolute;');
        var btSave = document.getElementById('Save' + (activeRow - 1));
        btSave.setAttribute('style', 'display:block; margin-left:30px; float:left; background-color:#2DBF64;');
        // HIDE THIS BUTTON.
        oButton.setAttribute('style', 'display:none;');
    };

    // DELETE DATA.
    this.Delete = function (oButton) {
        // var activeRow = oButton.parentNode.parentNode.rowIndex;
        var monitorCodetoDelete = oButton.id.split('-')[2];
        var monitorVesselId = oButton.classList[3].split('-')[3];
        var monitorRoomId = oButton.classList[4].split('-')[3];
        console.warn("monitorVesselId", monitorVesselId);
        console.warn("monitorRoomId", monitorRoomId);
        crudMonitor.Delete(monitorCodetoDelete, monitorRoomId, monitorVesselId);
        // monitors.splice((activeRow - 1), 1);    // DELETE THE ACTIVE ROW.

    };

    // SAVE DATA.
    this.Save = function (oButton) {
        console.log("to save");
        var monitorVesselId = oButton.classList[3].split('-')[3];
        var monitorRoomId = oButton.classList[4].split('-')[3];
        var activeRow = oButton.parentNode.parentNode.rowIndex;
        var tab = document.getElementById('monitorsTable').rows[activeRow];
        //get roomId and vesselId from monitorsTable classes.
        var tableRoomId = document.getElementById("monitorsTable").classList[1].split("-")[1];
        var tableVesselId = document.getElementById("monitorsTable").classList[0].split("-")[1];
        console.warn("tableRoomId", tableRoomId);
        console.warn("tableVesselId", tableVesselId);
        console.warn("monitorVesselId", monitorVesselId);
        console.warn("monitorRoomId", monitorRoomId);

        var monitorIdVal = "",
            codeVal = "",
            nameVal = "",
            ipAddressVal = "",
            macAddressVal = "",
            infoVal = "";
        // UPDATE monitors ARRAY WITH VALUES.
        for (i = 0; i < this.col.length; i++) {
            var td = tab.getElementsByTagName("td")[i];
            // console.log("td", td.value);
            if (i == 0) {
                monitorIdVal = td.id.split('-')[1];
            }
            if (i == 1) {
                codeVal = td.childNodes[0].value;
            }
            if (i == 2) {
                nameVal = td.childNodes[0].value;
            }
            if (i == 3) {
                ipAddressVal = td.childNodes[0].value;
            }
            if (i == 4) {
                macAddressVal = td.childNodes[0].value;
            }
            if (i == 5) {
                infoVal = td.childNodes[0].value;
            }
        }
        //Saving input values to object and prepare to api request.
        var jsonObj = {
            "monitorId": Number(monitorIdVal),
            "code": codeVal,
            "name": nameVal,
            "roomId": Number(monitorRoomId),
            "room": null,
            "vesselId": Number(tableVesselId),
            "vessel": null,
            "ipAddress": ipAddressVal,
            "macAddress": macAddressVal,
            "info": infoVal
        };
        console.warn("jsonObj before crudMonitor.Edit", jsonObj);
        crudMonitor.Edit(jsonObj, codeVal);
        console.log("edited monitor", jsonObj);
        getMonitorsTableMessage("update", codeVal, Number(monitorRoomId));

    }

    // CREATE NEW.
    this.CreateNew = function (oButton) {
        var activeRow = oButton.parentNode.parentNode.rowIndex;
        var tab = document.getElementById('monitorsTable').rows[activeRow];
        var obj = {};
        var tableRoomId = document.getElementById("monitorsTable").classList[1].split("-")[1];
        var tableVesselId = document.getElementById("monitorsTable").classList[0].split("-")[1];
        var codeVal = "",
            nameVal = "",
            ipAddressVal = "",
            macAddressVal = "",
            infoVal = "";

        // ADD NEW VALUE TO ARRAY.
        for (i = 1; i < this.col.length; i++) {
            var td = tab.getElementsByTagName("td")[i];
            if (i == 1) {
                if (td.childNodes[0].value == "") {
                    alert('Cant create monitor with empty code');
                    break;
                } else {
                    codeVal = td.childNodes[0].value;
                }
            }
            if (i == 2) {
                nameVal = td.childNodes[0].value;
            }
            if (i == 3) {
                ipAddressVal = td.childNodes[0].value;
            }
            if (i == 4) {
                macAddressVal = td.childNodes[0].value;
            }
            if (i == 5) {
                infoVal = td.childNodes[0].value;
            }
        }

        //Saving input values to object and prepare to api request.
        var jsonObj = {
            "code": codeVal,
            "name": nameVal,
            "roomId": Number(tableRoomId),
            "room": null,
            "vesselId": Number(tableVesselId),
            "vessel": null,
            "ipAddress": ipAddressVal,
            "macAddress": macAddressVal,
            "info": infoVal
        };

        crudMonitor.Add(jsonObj);
        console.log("added monitor", jsonObj);
        // obj[this.col[0]] = monitors.length + 1;     // NEW ID.
        // if (Object.keys(obj).length > 0) {      // CHECK IF OBJECT IS NOT EMPTY.
        // monitors.push(obj);             // PUSH (ADD) DATA TO THE JSON ARRAY.
        // saveToLocalStorageByKey("monitors-by-roomId-" + tableRoomId, monitors);
        // }
        getMonitorsTableMessage("add", codeVal, Number(tableRoomId));

    }
    // ****** OPERATIONS END.

}
