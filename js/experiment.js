'use strict';

// Location of data files
const trialsFile1 = "./data/experiments1.csv"
const trialsFile2 = "./data/experiments2.csv"
const trialsFile3 = "./data/experiments3.csv"
const trialsFile4 = "./data/experiments4.csv"
const menuL1B4File = "./data/menu_depth_1_breadth_4.csv"
const menuL2B4File = "./data/menu_depth_2_breadth_4.csv"
const menuL3B4File = "./data/menu_depth_3_breadth_4.csv"
const menuL1B2File = "./data/menu_depth_1_breadth_2.csv"
const menuL2B2File = "./data/menu_depth_2_breadth_2.csv"
const menuL3B2File = "./data/menu_depth_3_breadth_2.csv"

// Global variables
var menu;
var partiID = 7;
var trialsData = [];
var numTrials = 0;
var currentTrial = 1;
var markingMenuL1 = [];
var markingMenuL2 = [];
var markingMenuL3 = [];
var markingMenuL1B4 = [];
var markingMenuL2B4 = [];
var markingMenuL3B4 = [];
var markingMenuL1B2 = [];
var markingMenuL2B2 = [];
var markingMenuL3B2 = [];
var radialMenuTree = null;
var radialMenuL1 = [];
var radialMenuL2 = [];
var radialMenuL3 = [];
var radialMenuL1B4 = [];
var radialMenuL2B4 = [];
var radialMenuL3B4 = [];
var radialMenuL1B2 = [];
var radialMenuL2B2 = [];
var radialMenuL3B2 = [];
var tracker = new ExperimentTracker();
var markingMenuSubscription = null;
var radialMenuSvg = null;
var trialsFile = [];





// Load CSV files from data and return text
function getData(relativePath) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", relativePath, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}

function setInformationToTracker(alldata) {
	partiID = alldata['Participator ID'];
	tracker.partiName = alldata['Name'];
	tracker.age = alldata['Age'];
	tracker.gender = alldata['Gender'];
	tracker.faculty = alldata['Faculty'];
	tracker.degree = alldata['Degree'];
	tracker.major = alldata['Major'];
	tracker.usingTime = alldata['Using Time'];
}

// Loads the CSV data files on page load and store it to global variables
function initExperiment() {
	trialsFile = [trialsFile1, trialsFile2, trialsFile3, trialsFile4, trialsFile1, trialsFile2, trialsFile3, trialsFile4];
	document.getElementById("partiId").innerHTML = partiID;
	tracker.partiId = partiID;
	// Get Trails
	var data = getData(trialsFile[partiID - 1]);

	var records = data.split("\n");
	numTrials = records.length - 1;
	for (var i = 1; i <= numTrials; i++) {
		var cells = records[i].split(",");
		var menuType = cells[0].trim();
		var menuDepth = cells[1].trim();
		var menuBreadth = cells[2].trim();
		var targetItem = cells[3].trim();
		var trialNo = cells[4].trim();
		trialsData[i] = {
			'Menu Type': menuType,
			'Menu Depth': menuDepth,
			'Menu Breadth': menuBreadth, 
			'Target Item': targetItem,
			'Trial': trialNo
		};
	}

	// Get Menus
	var menuL1B4Data = getData(menuL1B4File);
	var menuL2B4Data = getData(menuL2B4File);
	var menuL3B4Data = getData(menuL3B4File);

	var menuL1B2Data = getData(menuL1B2File);
	var menuL2B2Data = getData(menuL2B2File);
	var menuL3B2Data = getData(menuL3B2File);
	
	// Format CSV Menu to respective Menu structures
	markingMenuL1B4 = formatMarkingMenuData(menuL1B4Data);
	markingMenuL2B4 = formatMarkingMenuData(menuL2B4Data);
	markingMenuL3B4 = formatMarkingMenuData(menuL3B4Data);
	radialMenuL1B4 = formatRadialMenuData(menuL1B4Data);
	radialMenuL2B4 = formatRadialMenuData(menuL2B4Data);
	radialMenuL3B4 = formatRadialMenuData(menuL3B4Data);

	markingMenuL1B2 = formatMarkingMenuData(menuL1B2Data);
	markingMenuL2B2 = formatMarkingMenuData(menuL2B2Data);
	markingMenuL3B2 = formatMarkingMenuData(menuL3B2Data);
	radialMenuL1B2 = formatRadialMenuData(menuL1B2Data);
	radialMenuL2B2 = formatRadialMenuData(menuL2B2Data);
	radialMenuL3B2 = formatRadialMenuData(menuL3B2Data);
	
	//Start the first trial
	nextTrial();
}

// Wrapper around nextTrial() to prevent click events while loading menus
function loadNextTrial(e){
	e.preventDefault();
	nextTrial();
	
}

// Move to next trai and record events
function nextTrial() {

	tracker.loadStartTimer();
	
	if (currentTrial <= numTrials) {

		var menuType = trialsData[currentTrial]['Menu Type'];
		var menuDepth = trialsData[currentTrial]['Menu Depth'];
		var menuBreadth = trialsData[currentTrial]['Menu Breadth'];
		var targetItem = trialsData[currentTrial]['Target Item'];
		var trialNo = trialsData[currentTrial]['Trial'];

		document.getElementById("trialNumber").innerHTML = String(currentTrial) + "/" + String(numTrials);
		document.getElementById("menuType").innerHTML = menuType;
		document.getElementById("menuDepth").innerHTML = menuDepth;
		document.getElementById("menuBreadth").innerHTML = menuBreadth;
		document.getElementById("targetItem").innerHTML = targetItem;
		document.getElementById("selectedItem").innerHTML = "&nbsp;";
		// Set IV3 state over here

		tracker.newTrial();
		tracker.order = currentTrial;
		tracker.trial = trialNo;
		tracker.menuType = menuType;
		tracker.menuDepth = menuDepth;
		tracker.menuBreadth = menuBreadth;
		tracker.targetItem = targetItem;

		if(menuBreadth == 2) {
			markingMenuL1 = markingMenuL1B2;
			markingMenuL2 = markingMenuL2B2;
			markingMenuL3 = markingMenuL3B2;
			radialMenuL1 = radialMenuL1B2;
			radialMenuL2 = radialMenuL2B2;
			radialMenuL3 = radialMenuL3B2;
		} else if(menuBreadth == 4) {
			markingMenuL1 = markingMenuL1B4;
			markingMenuL2 = markingMenuL2B4;
			markingMenuL3 = markingMenuL3B4;
			radialMenuL1 = radialMenuL1B4;
			radialMenuL2 = radialMenuL2B4;
			radialMenuL3 = radialMenuL3B4;
		}

		if (menuType === "Marking") {
				
			initializeMarkingMenu();
			
			if(menuDepth == 1){
				menu = MarkingMenu(markingMenuL1, document.getElementById('marking-menu-container'));
			}
			else if(menuDepth == 2){
				menu = MarkingMenu(markingMenuL2, document.getElementById('marking-menu-container'));
			}else if(menuDepth == 3){
				menu = MarkingMenu(markingMenuL3, document.getElementById('marking-menu-container'));
			}

			markingMenuSubscription = menu.subscribe((selection) => markingMenuOnSelect(selection));

		} else if (menuType === "Radial") {

			initializeRadialMenu();			
			if (menuDepth == 1){
				menu = createRadialMenu(radialMenuL1);
			}
			else if(menuDepth == 2){
				menu = createRadialMenu(radialMenuL2);
			}else if(menuDepth == 3){
				menu = createRadialMenu(radialMenuL3);
			}


		}

		currentTrial++;

		tracker.loadEndTimer();

	} else {
		
	    var nextButton = document.getElementById("nextButton");
	    nextButton.innerHTML = "Done";
	    var expPage = document.getElementById("exp");
	    expPage.style.display = 'none';		
	    var postPage = document.getElementById("postPage");
	    postPage.style.display = 'block';	
	}
}

function sendPostResultToTracker(postData){
	tracker.rom = postData['Rate of Marking'];
	tracker.ror = postData['Rate of Radial'];
	tracker.prefer = postData['Preference'];
	tracker.dom = postData['Difficulties of Marking'];
	tracker.dor = postData['Difficulties of Radial'];
	tracker.som = postData['Suggestion of Marking'];
	tracker.sor = postData['Suggestion of Radial'];
}

function generateResult(){
	tracker.toCsv();
}

/*Functions related to MarkingMenu*/

// Reconstructs marking menu container
function initializeMarkingMenu(){
	
	//Unload Radial Menu
	var radialMenuContainer = document.getElementById('radial-menu-container');
	if(radialMenuContainer != null){
		radialMenuContainer.parentNode.removeChild(radialMenuContainer);
	}
	
	// Load Marking Menu
	var interactionContainer = document.getElementById('interaction-container');
	if (markingMenuSubscription != null) {
		markingMenuSubscription.unsubscribe();
	}
	var markingMenuContainer = document.getElementById('marking-menu-container');
	if(markingMenuContainer == null){
		interactionContainer.innerHTML += "<div id=\"marking-menu-container\" style=\"height:100%;width:100%\" onmousedown=\"markingMenuOnMouseDown()\" oncontextmenu=\"preventRightClick(event)\"></div>";
	}
}

//Formats csv menu data in the structure accepted by radial menu
// Assumes menu csv is sorted by Id and Parent both Ascending
function formatMarkingMenuData(data) {
	var records = data.split("\n");
	var numRecords = records.length;
	var menuItems = {}

	// Parse through the records and create individual menu items
	for (var i = 1; i < numRecords; i++) {
		var items = records[i].split(',');
		var id = items[0].trim();
		var label = items[2].trim();
		menuItems[id] = {
			'name': label,
			'children': []
		};
	}

	for (var i = numRecords - 1; i >= 1; i--) {
		var items = records[i].split(',');
		var id = items[0].trim();
		var parent = items[1].trim();
		if (parent === '0') {
			continue;
		} else {
			var children = menuItems[parent]['children'];
			children.push(menuItems[id]);
			delete menuItems[id]
			menuItems[parent]['children'] = children;
		}
	}

	var menuItemsList = [];
	for (var key in menuItems) {
		menuItemsList.push(menuItems[key]);
	}

	return menuItemsList;
}

// Function to start tracking timer on mouse down
function markingMenuOnMouseDown(){

	tracker.startTimer();
}

//Function to start tracking timer on mouse down
function markingMenuOnSelect(selectedItem){

	tracker.recordSelectedItem(selectedItem.name);
	document.getElementById("selectedItem").innerHTML = selectedItem.name;
}

function preventRightClick(e){
	e.preventDefault();
}


/*Functions related to RadialMenu*/

// Reconstructs radial menu container
function initializeRadialMenu(){
	
	// Unload Marking Menu
	if (markingMenuSubscription != null) {
		markingMenuSubscription.unsubscribe();
	}
	var markingMenuContainer = document.getElementById('marking-menu-container');
	if(markingMenuContainer!=null){
		markingMenuContainer.parentNode.removeChild(markingMenuContainer);
	}
	
	

	// Reload Radial Menu
	var interactionContainer = document.getElementById('interaction-container');
	var radialMenuContainer = document.getElementById('radial-menu-container');
	if(radialMenuContainer == null){
		interactionContainer.innerHTML += "<div id=\"radial-menu-container\" style=\"height:100%;width:100%\" oncontextmenu=\"toggleRadialMenu(event)\"></div>";
	}

}

// Create radial menu svg element
function createRadialMenu(radialMenuL){
	
    var radialmenuElement = document.getElementById('radialmenu');
    if(radialmenuElement != null){
    	radialmenuElement.parentNode.removeChild(radialmenuElement);
    }
	
	
	var w = window.innerWidth;
	var h = window.innerHeight;
	var radialMenuSvgElement = document.getElementById('radial-menu-svg');
	if (radialMenuSvgElement != null){
		radialMenuSvgElement.parentNode.removeChild(radialMenuSvgElement);
	}
	radialMenuSvg = d3.select("#radial-menu-container").append("svg").attr("width", w).attr("height", h).attr("id","radial-menu-svg");
	radialMenuTree = radialMenuL;
	return radialMenuSvg;
}

// Toggle radial menu on right click
function toggleRadialMenu(e) {
	
	if(tracker.startTime == null){
	
		if(radialMenuTree != null){
				menu = module.exports(radialMenuTree, {
					x: e.clientX,
					y: e.clientY
				}, radialMenuSvg);
		
			// Start timing once menu appears
			tracker.startTimer();
		}
	}else{
		
		// Record previous item
		tracker.recordSelectedItem(null);
		
		if(radialMenuTree != null){
			menu = module.exports(radialMenuTree, {
				x: e.clientX,
				y: e.clientY
			}, radialMenuSvg);
	
		// Start timing once menu appears
		tracker.startTimer();
		}
	}
	e.preventDefault();
}

//Callback for radialmenu when a leaf node is selected
function radialMenuOnSelect() {

	tracker.recordSelectedItem(this.id);
	var radialmenu = document.getElementById('radialmenu');
	radialmenu.parentNode.removeChild(radialmenu);
	
	document.getElementById("selectedItem").innerHTML = this.id;
}

//Formats csv menu data in the structure accepted by radial menu
// Assumes menu csv is sorted by Id and Parent both Ascending
function formatRadialMenuData(data) {

	var records = data.split("\n");
	var numRecords = records.length;
	var menuItems = {}



	// Parse through the records and create individual menu items
	for (var i = 1; i < numRecords; i++) {
		var items = records[i].split(',');
		var id = items[0].trim();
		var label = items[2].trim();
		menuItems[id] = {
			'id': label,
			'fill': "#39d",
			'name': label,
			'_children': []
		};
	}

	for (var i = numRecords - 1; i >= 1; i--) {
		var items = records[i].split(',');
		var id = items[0].trim();
		var parent = items[1].trim();
		if (parent === '0') {
			continue;
		} else {
			var _children = menuItems[parent]['_children'];
			if(menuItems[id]['_children'].length == 0){
				menuItems[id]['callback'] = radialMenuOnSelect;	
			}
			_children.push(menuItems[id]);
			delete menuItems[id];
			menuItems[parent]['_children'] = _children;
		}
	}


	var menuItemsList = [];
	for (var key in menuItems) {
		if (menuItems[key]['_children'].length == 0){
			delete menuItems[key]['_children'];
			menuItems[key]['callback'] = radialMenuOnSelect;
		} else{
			delete menuItems[key]['callback'];
		}
		menuItemsList.push(menuItems[key]);
	}

	return {
		'_children': menuItemsList
	};

}
