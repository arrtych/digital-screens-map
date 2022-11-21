var rooms = {};
var roomsImages = [];
var TSMdata = [];
// Canvas
var mouseDown = false;
var mousePos = [0, 0];
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.width = 1432;
canvas.height = 850;
var globalRoomId = 0;
var globalVesselId = 0;

// const tsmUrl = "http://tsm.fleet.zone:8080/api/monitoring/objects/?groups=";
const tsmUrl = "https://tsm.fleet.zone/api/api_proxy/?api=/monitoring/objects/?groups=";



const getVesselsData = async () => {
  var key = "vessels";
  if (!localStorageContains(key)) {
    const response = await fetch(url + "/api/vessels/all");
    vessels = await response.json();
    saveToLocalStorage(key, vessels);
  } else {
    vessels = getFromLocalStorage(key);
  }
  renderVessels();
};


function renderVessels() {
  console.log("vessels", vessels);
  for (var i = 0; i < vessels.length; i++) {
    var item = vessels[i];
    var selectBox = document.getElementById("select-vessel-box");
    selectBox.innerHTML =
      selectBox.innerHTML +
      "<option value=" +
      item.vesselId +
      ">" +
      item.name +
      "</option>";
  }
}

/**
 * Gets Room Objects from API and shows on main page select option
 */
const showRooms = async (vesselId) => {
  var key = "rooms";
  if (!localStorageContains(key)) {
    const response = await fetch(url + "/api/rooms/all");
    rooms = await response.json();

    saveToLocalStorage(key, rooms);
  } else {
    rooms = getFromLocalStorage(key);
  }
  console.log("Rooms", rooms);
  for (var i = 0; i < rooms.length; i++) {
    var item = rooms[i];
    var selectBox = document.getElementById("select-room-box");
    if (item.vesselId == vesselId) {
      selectBox.innerHTML =
        selectBox.innerHTML +
        "<option value=" +
        item.roomId +
        ">" +
        item.name +
        "</option>";
    }
  }
  createImageObjects(rooms);
};

/**
 * Gets Monitor objects from API and shows necessary data.
 * @param {any} id - Room Id
 */
const getMonitorsByRoom = async (id) => {
  var monitors = {};
  var key = "monitors-by-roomId-" + id;
  if (!localStorageContains(key)) {
    const response = await fetch(
      url + "/api/monitors/all/room/" + id
    );
    monitors = await response.json();
    saveToLocalStorage(key, monitors);
  } else {
    monitors = getFromLocalStorage(key);
  }
  console.log("Monitors", monitors);
  var roomMonitors = document.getElementById("room-monitors");
  roomMonitors.innerHTML = "";
  var listDiv = document.createElement("div");
  roomMonitors.appendChild(listDiv);
  //console.log("monitors form room", monitors);

  for (var i = 0; i < monitors.length; i++) {
    var itemDiv = document.createElement("div");
    itemDiv.classList.add("current-monitor", "current-monitor-" + monitors[i].monitorId);

    var btnShow = document.createElement("button");
    var btnHide = document.createElement("button");
    var btnLogin = document.createElement("button");

    let monitorID = monitors[i].monitorId;
    let monitorIP = monitors[i].ipAddress;
    let monitorCode = monitors[i].code;

    btnShow.id = "show-monitor-" + monitorID;
    btnShow.classList.add("btn", "btn-primary", "btn-sm");
    btnShow.innerHTML = "Show";
    btnShow.addEventListener(
      "click",
      function () {
        showCurrentMonitor(monitorID, true);
      }, false
    );

    btnHide.id = "hide-monitor-" + monitorID;
    btnHide.classList.add("btn", "btn-primary", "btn-sm");
    btnHide.innerHTML = "Hide";
    btnHide.addEventListener(
      "click",
      function () {
        showCurrentMonitor(monitorID, false);
      }, false
    );

    btnLogin.id = "login-monitor-" + monitorIP;
    btnLogin.classList.add("btn", "btn-warning", "btn-sm");
    btnLogin.innerHTML = "Login";
    btnLogin.addEventListener(
      "click",
      function () {
        remoteLogin(monitorIP);
      }, false
    );

    var hasPositions = hasPositionsOrNot(monitors[i].monitorId);
    var positionsText = "Yes";
    if (!hasPositions) {
      positionsText = "No";
    }

    itemDiv.innerHTML =
      "<i class='fas fa-circle' id='mappage-monitor-circle-icon-" + monitors[i].monitorId + "'></i>  <i class='fas fa-tv mappage-monitor-icon'></i><a href='#' id=" +
      monitorID +
      "> " +
      monitors[i].code +
      "</a>" +
      "<br>" +
      "<div id='monitorID-" +
      monitorID +
      "-info'><span>" +
      monitors[i].name +
      "</span><br>" +
      "<span> <b>IP:</b>" +
      monitors[i].ipAddress +
      "</span><br>" +
      "<span> <b>MAC:</b>" +
      monitors[i].macAddress +
      "</span><br>" +
      "<span><b>Coordinates:</b>" + positionsText +
      "</span><br>" +
      monitors[i].info +
      "</span>" +
      "</div>";
    itemDiv.appendChild(btnShow);
    itemDiv.appendChild(btnHide);
    itemDiv.appendChild(btnLogin);
    listDiv.appendChild(itemDiv);
  }
  for (var j = 0; j < monitors.length; j++) {
    getPositionsByMonitor(monitors[j].monitorId, monitors[j].roomId);
  }
  roomMonitors.appendChild(listDiv);
};


function showTotalMonitorsNumber(monitors, greenMonitors, redMonitors) {
  var monitorsTotal = document.getElementById("monitors-total");
  var greenBadge = document.createElement("span");
  var redBadge = document.createElement("span");
  var totalBadge = document.createElement("span");
  var greenBadgeText = document.createElement("span");
  var redBadgeText = document.createElement("span");
  greenBadge.classList.add("badge", "badge-success");
  greenBadge.innerHTML = greenMonitors.length;
  greenBadgeText.innerHTML = " OK: ";

  redBadge.classList.add("badge", "badge-danger");
  redBadge.innerHTML = redMonitors.length;
  redBadgeText.innerHTML = " NOT OK: ";

  totalBadge.classList.add("badge", "badge-primary");
  totalBadge.innerHTML = monitors.length;

  monitorsTotal.innerHTML = "Total: ";
  monitorsTotal.appendChild(totalBadge);
  monitorsTotal.appendChild(greenBadgeText);
  monitorsTotal.appendChild(greenBadge);
  monitorsTotal.appendChild(redBadgeText);
  monitorsTotal.appendChild(redBadge);
}

function clearTotalMonitorsNumber() {
  var monitorsTotal = document.getElementById("monitors-total");
  monitorsTotal.innerHTML = "";
}




/**
 * Gets coordinates by MonitorID and puts them to localStorage.
 * @param {any} monitorId
 * @param {any} roomId
 */
const getPositionsByMonitor = async (monitorId, roomId) => {
  var key = "positions-by-roomId-" + roomId + "-monitorID-" + monitorId;
  if (!localStorageContains(key)) {
    const response = await fetch(
      url + "/api/positions/all/monitor/" + monitorId
    );
    var coordinates = await response.json();
    saveToLocalStorage(key, coordinates);
  }
};

//----------------------------------------Help functions--------------------------------------------

function isEmptyObject(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  console.log("Object is empty");
  return true;
}

// function getEventTarget(e) {
//   e = e || window.event;
//   return e.target || e.srcElement;
// }

function setGlobalRoomId(roomId) {
  this.globalRoomId = roomId;
}
function setGlobalVesselId(vesselId) {
  this.globalVesselId = vesselId;
}

//function detectMonitor(e) {
//  posx = 0;
//  posy = 0;
//  if (!e) {
//    var e = window.event;
//  }
//  if (e.pageX || e.pageY) {
//    posx = e.pageX;
//    posy = e.pageY;
//  } else if (e.clientX || e.clientY) {
//    posx = e.clientX;
//    posy = e.clientY;
//  }

//  console.warn("X mouse is: " + posx + " Y mouse is: " + posy);
//  if (ctx.isPointInStroke(e.offsetX, e.offsetY)) {
//    console.log("in stroke");
//  }
//}

//----------------------------------------Help functions--------------------------------------------

//--------------Start--------------

window.onload = function () {
  checkSession();

  loadMenu();
  init();
};

function init() {
  // showDefaultPicture();
  trackTransforms(ctx);
  getVesselsData();
  refreshData();
  // showRooms();
  redraw();
}

function redraw() {
  clearAll();
  var id = this.globalRoomId;
  drawImage(id);
  drawMonitors(id);
}


//------------------------------------Canvas start------------------------------------

function clearAll() {
  var p1 = ctx.transformedPoint(0, 0);
  var p2 = ctx.transformedPoint(canvas.width, canvas.height);
  ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
}

var lastX = canvas.width / 2,
  lastY = canvas.height / 2;
var dragStart, dragged;
canvas.addEventListener(
  "mousedown",
  function (evt) {
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect =
      "none";
    lastX = evt.offsetX || evt.pageX - canvas.offsetLeft;
    lastY = evt.offsetY || evt.pageY - canvas.offsetTop;
    dragStart = ctx.transformedPoint(lastX, lastY);
    dragged = false;
    redraw();
  }, false
);
canvas.addEventListener(
  "mousemove",
  function (evt) {
    lastX = evt.offsetX || evt.pageX - canvas.offsetLeft;
    lastY = evt.offsetY || evt.pageY - canvas.offsetTop;
    dragged = true;
    if (dragStart) {
      var pt = ctx.transformedPoint(lastX, lastY);
      ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
    }

    redraw();
    // monitorOnMouseOver(evt);
  }, false
);
canvas.addEventListener(
  "mouseup",
  function (evt) {
    dragStart = null;
    if (!dragged) zoom(evt.shiftKey ? -1 : 1);
  }, false
);
var scaleFactor = 1.1;
var zoom = function (clicks) {
  var pt = ctx.transformedPoint(lastX, lastY);
  ctx.translate(pt.x, pt.y);
  var factor = Math.pow(scaleFactor, clicks);
  ctx.scale(factor, factor);
  ctx.translate(-pt.x, -pt.y);
  redraw();
};

var handleScroll = function (evt) {
  var delta = evt.wheelDelta
    ? evt.wheelDelta / 40
    : evt.detail
      ? -evt.detail
      : 0;
  if (delta) zoom(delta);
  return evt.preventDefault() && false;
};
canvas.addEventListener("DOMMouseScroll", handleScroll, false);
canvas.addEventListener("mousewheel", handleScroll, false);

// Adds ctx.getTransform() - returns an SVGMatrix
// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
function trackTransforms(ctx) {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  var xform = svg.createSVGMatrix();
  ctx.getTransform = function () {
    return xform;
  };

  var savedTransforms = [];
  var save = ctx.save;
  ctx.save = function () {
    savedTransforms.push(xform.translate(0, 0));
    return save.call(ctx);
  };
  var restore = ctx.restore;
  ctx.restore = function () {
    xform = savedTransforms.pop();
    return restore.call(ctx);
  };

  var scale = ctx.scale;
  ctx.scale = function (sx, sy) {
    xform = xform.scaleNonUniform(sx, sy);
    return scale.call(ctx, sx, sy);
  };
  var rotate = ctx.rotate;
  ctx.rotate = function (radians) {
    xform = xform.rotate((radians * 180) / Math.PI);
    return rotate.call(ctx, radians);
  };
  var translate = ctx.translate;
  ctx.translate = function (dx, dy) {
    xform = xform.translate(dx, dy);
    return translate.call(ctx, dx, dy);
  };
  var transform = ctx.transform;
  ctx.transform = function (a, b, c, d, e, f) {
    var m2 = svg.createSVGMatrix();
    m2.a = a;
    m2.b = b;
    m2.c = c;
    m2.d = d;
    m2.e = e;
    m2.f = f;
    xform = xform.multiply(m2);
    return transform.call(ctx, a, b, c, d, e, f);
  };
  var setTransform = ctx.setTransform;
  ctx.setTransform = function (a, b, c, d, e, f) {
    xform.a = a;
    xform.b = b;
    xform.c = c;
    xform.d = d;
    xform.e = e;
    xform.f = f;
    return setTransform.call(ctx, a, b, c, d, e, f);
  };
  var pt = svg.createSVGPoint();
  ctx.transformedPoint = function (x, y) {
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(xform.inverse());
  };
}
//------------------------------------Canvas end------------------------------------

function selectPicture() {
  canvas.classList.remove("canvas-show-style");
  document.getElementById("mons-state").classList.remove("canvas-show-style");
  document.getElementById("defaultPicture").style.display = "none";
  clearTotalMonitorsNumber();

  var selectBox = document.getElementById("select-room-box");
  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  // console.log("room id: " + selectedValue);

  setGlobalRoomId(selectedValue);
  getMonitorsByRoom(selectedValue);
  getDataFromTSM(globalVesselId, globalRoomId, TSMdata);

  //set TSM url for Room by selecting.
  var vesselString = getVesselNameById(globalVesselId);
  var roomString = getRoomNameById(globalRoomId)
  var urlString = tsmUrlLink + vesselString + "%20-%20" + roomString;
  document.getElementById("tsm-room-url-a").setAttribute('href', urlString);
  redraw();
  // console.log("GLOBAL: vessel id: " + globalVesselId + "; roomId: " + globalRoomId);
}

function selectVessel() {
  var selectBox = document.getElementById("select-vessel-box");
  var selectRoomBox = document.getElementById("select-room-box");
  //remove old options before adding.
  var length = selectRoomBox.options.length;
  for (i = length - 1; i >= 0; i--) {
    selectRoomBox.options[i] = null;
  }
  //add default first option.
  var option = document.createElement('option');
  option.appendChild(document.createTextNode('Choose...'));
  selectRoomBox.appendChild(option);

  var selectedValue = selectBox.options[selectBox.selectedIndex].value;
  setGlobalVesselId(selectedValue);
  showRooms(selectedValue);
}

function createImageObjects(rooms) {
  // var key = "rooms-Images";
  for (var i = 0; i < rooms.length; i++) {
    var img = document.createElement("img");
    img.id = rooms[i].roomId;
    img.src = url + "/api/ImageUpload/get/image/" + img.id;
    roomsImages.push({
      id: img.id,
      image: img,
      source: img.src
    });
    // generateObjForLocalStorage(img.id, img);
  }

  console.warn("roomsImages", roomsImages);
}

function drawImage(id) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // var key = "rooms-Images";
  // roomsImages = getFromLocalStorage(key);
  // var currentImage = getImageFromLocalStorage("image-for-room-" + id);
  //console.log("roomsImages", roomsImages);
  for (var j = 0; j < roomsImages.length; j++) {
    // console.log("roomsImages[j].image", roomsImages[j].image);
    if (roomsImages[j].id == id) {
      // ctx.drawImage(currentImage, 0, 0);
      ctx.drawImage(roomsImages[j].image, 0, 0);
    }
  }
}

function showCurrentMonitor(monitorId, highlight) {
  if (highlight == true) {
    changeMonitorButtonsState(monitorId, true);
  } else {
    changeMonitorButtonsState(monitorId, false);
  }
  redraw();
}

function changeMonitorButtonsState(monitorId, show) {
  var btnHide = document.getElementById("hide-monitor-" + monitorId);
  var btnShow = document.getElementById("show-monitor-" + monitorId);
  if (show == true) {
    console.log("changeMonitorButtonsState: ", monitorId);
    btnShow.disabled = true;
    btnShow.classList.add("disabled");
    btnHide.disabled = false;
    btnHide.classList.remove("disabled");

    btnShow.value = "toHighlight";
  } else {
    btnShow.disabled = false;
    btnShow.classList.remove("disabled");
    btnHide.disabled = true;
    btnHide.classList.add("disabled");

    btnShow.value = "notToHighlight";
  }
}

/**
 * Draw monitor positions on canvas by roomId
 * @param {*} roomId 
 */
function drawMonitors(roomId) {
  var mons = getFromLocalStorage("monitors-by-roomId-" + roomId);

  var greenMonitors = [];
  var redMonitors = [];
  for (var i = 0; i < mons.length; i++) {
    //check monitor status from TSM by monitor Name.
    var MonitorStatus = checkTSMStatus(mons[i].name, mons[i].code)
    var currentPosition = getFromLocalStorage("positions-by-roomId-" + roomId + "-monitorID-" + mons[i].monitorId);
    var monitorId = currentPosition[0].monitorId;

    var x1 = currentPosition[0].x1;
    var x2 = currentPosition[0].x2;
    var y1 = currentPosition[0].y1;
    var y2 = currentPosition[0].y2;
    var btn = document.getElementById("show-monitor-" + monitorId);
    var color = "";
    var monitorCircleIcon = document.getElementById("mappage-monitor-circle-icon-" + monitorId);
    if (MonitorStatus == -1) {
      color = "red";
      redMonitors.push(mons[i].name);
      monitorCircleIcon.style.color = "red";
    } else if (MonitorStatus == 1) {
      greenMonitors.push(mons[i].name);
      color = "#00c851";
      monitorCircleIcon.style.color = "#00c851";
    } else {
      color = "blue";
      monitorCircleIcon.style.color = "blue";
    }
    drawMonitor(x1, x2, y1, y2, color);
    if (btn.value == "toHighlight") {
      drawMonitor(x1, x2, y1, y2, "yellow");
    } else {
      drawMonitor(x1, x2, y1, y2, color);
    }
  }
  // console.log("Mons total: ", mons.length);
  // console.log("greenMonitors", greenMonitors);
  // console.log("redMonitors", redMonitors);
  showTotalMonitorsNumber(mons, greenMonitors, redMonitors);
}

function drawMonitor(x1, x2, y1, y2, color) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 7;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function updateData() {
  window.localStorage.clear();
  var selectBox = document.getElementById("select-room-box");
  selectBox.innerHTML = "";
  init();
  console.log("Updated data");
}

function checkTSMStatus(monitorName, monitorCode) {
  //TODO: Check by room name
  // console.log("TSMdata.length: " + TSMdata.length);
  for (var i = 0; i < TSMdata.length; i++) {
    // var lastIndex = TSMdata[i].id.length;
    // var TSMmonitorCode = TSMdata[i].id.substring(lastIndex - 5, lastIndex);

    if (TSMdata[i].id == monitorName) {
      // console.log("Monitor " + monitorCode + "code matches");
      if (TSMdata[i].status == 1) {
        // console.warn("TSM status green");
        return 1;
      } else if (TSMdata[i].status == -1) {
        // console.warn("TSM status red");
        return -1;
      } else {
        console.warn("TSM status not defined");
        return 0;
      }
    }
    // else {
    //   console.log("Cant find monitor " + monitorName);
    // }
  }

}


function pixelOnMouseOver(ctx, callback) {
  var canvas = ctx.canvas;
  var w = canvas.width, h = canvas.height;
  var data = ctx.getImageData(0, 0, w, h).data;
  canvas.addEventListener('mousemove', function (e) {
    var idx = (e.offsetY * w + e.offsetX) * 4;
    var parts = Array.prototype.slice.call(data, idx, idx + 4);
    callback.apply(ctx, parts);
  }, false);
}

/*
function monitorOnMouseOver(e) {
  e.preventDefault();
  e.stopPropagation();
  var line = { x0: 475, y0: 346, x1: 475, y1: 399 };
  x1Val = 475;
  x2Val = 475;
  y1Val = 346;
  y2Val = 399;
  //var tolerance = 5;
  //var m = canvas.getBoundingClientRect();
  var mouseX = parseInt(e.clientX - e.offsetX);
  var mouseY = parseInt(e.clientY - e.offsetY);
  var tolerance = 7;
  var x = e.pageX,
    y = e.pageY;
  // pixelOnMouseOver(ctx, function (x, y) {
  //   // console.log("r:" + r + ", g:" + g + ", b:" + b + ", a:" + a);
  // if (ctx.isPointInStroke(475, 360)) {
  //   console.log("mathed");
  // }

  // });
  // console.log(
  //   "line detected: with x " + x + ",and y" + y + "-" + detectLine(x, y)
  // );
  if (mouseX < x1Val || mouseY > x2Val) {
    console.log("outside");
  }
  var linepoint = linepointNearestMouse(line, mouseX, mouseY);
  var dx = mouseX - linepoint.x;
  var dy = mouseY - linepoint.y;
  var distance = Math.abs(Math.sqrt(dx * dx + dy * dy));
  if (distance < tolerance) {
    console.log("Inside the line");
    // draw(line, mouseX, mouseY, linepoint.x, linepoint.y);
  } else {
    console.log("Outside");
    // draw(line);
  }
}
------------------------
*/

// function linepointNearestMouse(line, x, y) {
//   //
//   lerp = function (a, b, x) { return (a + x * (b - a)); };
//   var dx = line.x1 - line.x0;
//   var dy = line.y1 - line.y0;
//   var t = ((x - line.x0) * dx + (y - line.y0) * dy) / (dx * dx + dy * dy);
//   var lineX = lerp(line.x0, line.x1, t);
//   var lineY = lerp(line.y0, line.y1, t);
//   return ({ x: lineX, y: lineY });
// };


// function detectLine(x, y) {
//   var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
//     inputData = imageData.data,
//     pData = (~~x + ~~y * canvas.width) * 4;

//   if (inputData[pData + 3]) {
//     return true;
//   }

//   return false;
// }


// function linepointNearestMouse(line, x, y) {
//   //
//   lerp = function (a, b, x) { return (a + x * (b - a)); };
//   var dx = line.x1 - line.x0;
//   var dy = line.y1 - line.y0;
//   var t = ((x - line.x0) * dx + (y - line.y0) * dy) / (dx * dx + dy * dy);
//   var lineX = lerp(line.x0, line.x1, t);
//   var lineY = lerp(line.y0, line.y1, t);
//   return ({ x: lineX, y: lineY });
// };

