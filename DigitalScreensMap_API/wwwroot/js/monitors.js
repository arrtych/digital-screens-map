const roomList = document.getElementById("room-list");
const vesselList = document.getElementById("vessel-list");
const monitorList = document.getElementById("monitor-list");
var rooms = {};
var monitors = {};
var vessels = {};
var TSMinfo = [];
const tsmUrl = "https://tsm.fleet.zone/api/api_proxy/?api=/monitoring/objects/?groups=";

window.onload = function () {
  checkSession();
  loadMenu();
  init();
};

function init() {
  this.renderVessels();
  // setTimeout(function () { refreshData(); console.log("test") }, 500);
}


async function renderVessels() {
  await getVessels();
  var ul = document.createElement("ul");
  ul.classList.add("list-group");
  for (var i = 0; i < vessels.length; i++) {
    var item = vessels[i];
    // console.log("item", item);
    var li = document.createElement("li");
    li.classList.add("vessel-item", "list-group-item");
    li.id = "vessel-item-id-" + item.vesselId;
    var anchor = "#vessel-header-" + item.vesselId;
    li.innerHTML =
      "<a class='vessel-item-name'>" + "<i class='fa fa-ship'></i>" + item.name + "</a>";
    ul.appendChild(li);
    vesselList.appendChild(ul);
    await renderRooms(item.vesselId);
    await renderTSMStatus(item.vesselId);
  }
}


async function renderRooms(vesselId) {
  await getRooms(vesselId);
  var vesselDiv = document.getElementById("vessel-item-id-" + vesselId);
  var div = document.createElement("div");
  var ul = document.createElement("ul");
  ul.classList.add("list-group", "list-group-flush");
  for (var i = 0; i < rooms.length; i++) {
    var item = rooms[i];
    //divide rooms by Vessel
    if (item.vesselId == vesselId) {
      var li = document.createElement("li");
      li.classList.add("room-item", "list-group-item");
      li.id = "room-item-id-" + item.roomId;
      var anchor = "#room-header-" + item.roomId;
      li.innerHTML =
        "<a class='room-item-name' href=" + anchor + ">" + "<i class='fa fa-image'></i>  " + item.name + "</a>";
      //Badge with monitors amount by room.
      var amountBadge = document.createElement("span");
      amountBadge.classList.add("badge", "badge-primary", "monitors-amount-badge");
      amountBadge.id = "monitors-amount-badge-" + item.roomId;
      var monitorsAmount = getMonitorsAmountByRoomId(item.roomId);
      amountBadge.innerHTML = monitorsAmount;
      getMonitorsByRoom(item.roomId, item.name);

      li.addEventListener(
        "click",
        function () {
          var currentId = this.id.split("-")[3];
          var currentTable = document.getElementById("room-header-" + currentId);
          //highlight current Room Table by click
          setTimeout(function () {
            currentTable.style.backgroundColor = "#eef1f1bd";
          }, 2500);
          currentTable.style.backgroundColor = "#f9f9c6";
        }, false
      );
      li.appendChild(amountBadge);
      ul.appendChild(li);
      div.appendChild(ul);
      vesselDiv.appendChild(div);
    }
    // roomList.appendChild(ul);
  }


}
function getVesselNameFromMonitor(vesselId) {
  getVessels();
  var obj = {};
  for (var i = 0; i < vessels.length; i++) {
    if (vessels[i].vesselId == vesselId) {
      obj = vessels[i];
    }
  }
  return obj.name;
}


function getVesselNameFromRoom(roomId) {
  getVessels();
  getRooms();
  var obj = {};
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i].roomId == roomId) {
      obj = rooms[i];
    }
  }
  for (var i = 0; i < vessels.length; i++) {
    if (vessels[i].vesselId == obj.vesselId) {
      return obj = vessels[i].name;
    }
  }
  return null;
}

/**
 * Function to showing monitors amount for room
 * @param {*} roomId 
 */
function getMonitorsAmountByRoomId(roomId) {
  var monitorss = getFromLocalStorage("monitors-by-roomId-" + roomId);
  if (monitorss) {
    return monitorss.length;
  }
}


/**
 * Get monitors by roomID and generate table.
 * @param {any} id
 * @param {any} name
 */
const getMonitorsByRoom = async (id, name) => {
  // console.log("Rooms", rooms);
  var key = "monitors-by-roomId-" + id;
  if (!localStorageContains(key)) {
    const response = await fetch(url + "/api/monitors/all/room/" + id);
    monitors = await response.json();
    saveToLocalStorage(key, monitors);
  } else {
    monitors = getFromLocalStorage(key);
  }
  // console.log("Monitors by room: " + name, monitors);
  //print Monitor length for each room
  var monitorsAmount = document.getElementById("monitors-amount-badge-" + id);
  if (monitorsAmount) {
    monitorsAmount.innerHTML = monitors.length;
  }

  var arrHead = [
    "#",
    "Code",
    "Name",
    "Vessel",
    "IP address",
    "MAC address",
    "Info",
    "Login(AMT)"
    // "Login(RDP)"
  ];
  var monitorBlock = document.createElement("div");
  monitorBlock.setAttribute("id", "room-header-" + id);
  monitorBlock.classList.add("room-header");
  var roomHeader = document.createElement("h3");
  roomHeader.classList.add("h3-responsive");
  var monitorTable = document.createElement("div");
  monitorTable.classList.add("table-responsive");
  var table = document.createElement("table");
  table.classList.add("table", "table-striped", "table-sm", "table-hover", "monitors-table");
  table.id = "table-room-" + id;
  var tr = table.insertRow(-1);

  //Prepare TSM link for each room
  var TSMRoomUrl = document.createElement('a');
  var link = document.createTextNode(" (TSM)");
  TSMRoomUrl.id = "tsm-url-room-" + id;
  TSMRoomUrl.appendChild(link);

  //roomHeader.setAttribute("id", "room-header" + name);
  roomHeader.innerHTML = "<i class='fa fa-image'></i> " + name;
  roomHeader.appendChild(TSMRoomUrl)

  // TABLE HEADER.
  for (var h = 0; h < arrHead.length; h++) {
    var th = document.createElement("th");
    th.innerHTML = arrHead[h];
    tr.appendChild(th);
    tr.classList.add("header-color", "white-text");
  }

  for (var i = 0; i < monitors.length; i++) {
    var tr = table.insertRow(i + 1);
    for (var h = 0; h < arrHead.length; h++) {
      var td = document.createElement("td");
      var btnLogin = document.createElement("button");
      let monitorIP = monitors[i].ipAddress;
      btnLogin.classList.add("btn", "btn-warning", "btn-sm");
      btnLogin.innerHTML = "AMT";
      btnLogin.id = "login-monitor-" + monitorIP;
      btnLogin.addEventListener(
        "click",
        function () {
          remoteLogin(monitorIP);
        }, false
      );
      var btnRDP = document.createElement("button");
      btnRDP.classList.add("btn", "btn-warning", "btn-sm");
      btnRDP.innerHTML = "RDP";
      btnRDP.id = "login-rdp-monitor-" + monitorIP;
      btnRDP.addEventListener(
        "click",
        function () {
          remoteLoginRDP(monitorIP);
        }, false
      );
      //fill the table
      switch (h) {
        case 0:
          tr.id = "monitorId-" + monitors[i].monitorId;
          td.innerHTML = '<i class="fas fa-circle" id="monitors-page-circle-icon-' + monitors[i].monitorId + '"></i> <i class="fa fa-tv"></i>';
          tr.appendChild(td);
          break;
        case 1:
          td.innerHTML = monitors[i].code;
          tr.appendChild(td);
          break;
        case 2:
          td.innerHTML = monitors[i].name;
          tr.appendChild(td);
          break;
        case 3:
          var currentMonitorVesssel = getVesselNameFromMonitor(monitors[i].vesselId);

          td.innerHTML = currentMonitorVesssel;
          tr.appendChild(td);
          break;
        case 4:
          td.innerHTML = monitors[i].ipAddress;
          tr.appendChild(td);
          break;
        case 5:
          td.innerHTML = monitors[i].macAddress;
          tr.appendChild(td);
          break;
        case 6:
          td.innerHTML = monitors[i].info;
          td.vAlign = "bottom";
          td.width = "30%";
          tr.appendChild(td);
          break;
        case 7:
          td.appendChild(btnLogin);
          tr.appendChild(td);
          break;
        // case 8:
        //   td.appendChild(btnRDP);
        //   tr.appendChild(td);
        //   break;
        default:
          td.innerHTML = "N/A";
          tr.appendChild(td);
      }
    }
  }
  if (monitors.length > 0) {
    monitorTable.appendChild(table);
    monitorBlock.appendChild(roomHeader);
    monitorBlock.appendChild(monitorTable);
  }


  monitorList.appendChild(monitorBlock);
  renderTMSLinksForRoom(id, name);
};



async function renderTSMStatus(vesselId) {
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].vesselId == vesselId) {
      await getDataFromTSM(vesselId, rooms[i].roomId, TSMinfo);
      await getMonitors(rooms[i].roomId);
      let monitorsData = getFromLocalStorage("monitors-by-roomId-" + rooms[i].roomId);
      // console.log("------testData", TSMinfo.length);
      // console.log("------testData", TSMinfo);
      for (let j = 0; j < monitorsData.length; j++) {
        var check_status = TSMinfo.filter(item => (item.id === monitorsData[j].name));
        if (check_status.length) {
          console.log("Monitor founded: " + check_status[0].id, " with id:" + monitorsData[j].monitorId + " and status " + check_status[0].status);
          var monitorCircleIcon = document.getElementById("monitors-page-circle-icon-" + monitorsData[j].monitorId);
          var colorName = "";
          if (check_status[0].status === "1") {
            colorName = "#00c851";
          } else if (check_status[0].status === "-1") {
            colorName = "red";
          } else {
            colorName = "#004152";
          }
          monitorCircleIcon.style.color = colorName;
        }
      }
    }
  }
}


function renderTMSLinksForRoom(roomId, roomName) {
  var vessel = getVesselNameFromRoom(roomId);
  var link = document.getElementById("tsm-url-room-" + roomId);
  var urlString = tsmUrlLink + vessel + "%20-%20" + roomName;
  link.setAttribute('target', "_blank");
  link.setAttribute('href', urlString);
}

