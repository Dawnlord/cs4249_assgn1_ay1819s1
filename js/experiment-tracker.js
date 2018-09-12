// Class used to track experiment
class ExperimentTracker {


	constructor() {
		this.partiName = null;
		this.age = null;
		this.gender = null;
		this.faculty = null;
		this.degree = null;
		this.major = null;
		this.usingTime = null;

		this.personalData = [];

		this.rom = null;
		this.ror = null;
		this.prefer = null;
		this.dom = null;
		this.dor = null;
		this.som = null;
		this.sor = null;

		this.postData = [];

		this.trials = [];
		this.order = null;
		this.partiId = null;
		this.attempt = 0;
		this.trial = null;
		this.attempt = null;
		this.menuType = null;
		this.menuDepth = null;
		this.menuBreadth = null;
		this.targetItem = null;
		this.selectedItem = null;
		this.startTime = null;
		this.endTime = null;
		this.loadStartTime = null;
		this.loadEndTime = null;
		this.loadTime = null;
	}
	
	resetTimers(){
		this.startTime = null;
		this.endTime = null;
	}

	startTimer() {
		this.startTime = Date.now();
	}

	loadStartTimer() {
		this.loadStartTime = Date.now();
	}

	loadEndTimer() {
		this.loadEndTime = Date.now();
		this.loadTime = this.loadEndTime - this.loadStartTime;
	}

	recordSelectedItem(selectedItem) {
		this.selectedItem = selectedItem;
		this.stopTimer();
	}

	stopTimer() {
		
		this.endTime = Date.now();
		this.trials.push([this.order, this.partiId, this.menuType, this.menuDepth, this.menuBreadth, this.trial, this.targetItem, this.selectedItem, this.attempt, this.startTime, this.endTime, this.loadTime])
		this.resetTimers();
		this.attempt++;

	}

	newTrial() {
		this.attempt = 1;
	}

	toCsv() {
		this.personalData.push([this.partiName,this.age,this.gender,this.faculty,this.degree,this.major,this.usingTime]);
		var csvFile = "Name,Age,Gender,Faculty,Degree,Major,Using Time\n";
		for (var i = 0; i < this.personalData.length; i++) {
			csvFile += this.personalData[i].join(',');
			csvFile += "\n";
		}
		csvFile += "\n";

		csvFile += "Order,Participant ID,Technique,Menu Depth,Menu Breadth,Trial,Target Item,Selected Item,Attempt,Start Time, End Time, Response Time\n";
		for (var i = 0; i < this.trials.length; i++) {
			csvFile += this.trials[i].join(',');
			csvFile += "\n";
		}

		csvFile += "\nRate of Marking,Rate of Radial,Preference,Difficulties of Marking,Difficulties of Radial,Suggestion of Marking,Suggestion of Radial\n";
		this.postData.push([this.rom,this.ror,this.prefer,this.dom,this.dor,this.som,this.sor]);
		for (var i = 0; i < this.postData.length; i++) {
			csvFile += this.postData[i].join(',');
			csvFile += "\n";
		}

		var hiddenLink = document.createElement('a');
		hiddenLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvFile);
		hiddenLink.target = '_blank';
		hiddenLink.download = 'experiment_result_' + this.partiId + '.csv';
		document.body.appendChild(hiddenLink);
		hiddenLink.click();
	}


}