// Class used to track experiment
class ExperimentTracker {


	constructor() {
		this.partiName = null;
		this.age = null;
		this.gender = null;
		this.faculty = null;
		this.degree = null;
		this.major = null;
		this.usedMarking = null;
		this.usedRadial = null;
		this.usingTime = null;
		this.handType = null;

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
		this.clickNum = 0;
	}
	
	resetTimers(){
		this.startTime = null;
		this.endTime = null;
	}

	startTimer() {
		this.startTime = Date.now();
	}

	recordSelectedItem(selectedItem) {
		this.selectedItem = selectedItem;
		this.stopTimer();
	}

	startCollectClick(){
		this.clickNum = 0;
	}

	addClickNum(){
		this.clickNum++;
	}

	stopTimer() {
		
		this.endTime = Date.now();
		this.trials.push([this.order, this.partiId, this.menuType, this.menuDepth, this.menuBreadth, this.trial, this.targetItem, this.selectedItem, this.attempt, this.startTime, this.endTime, this.clickNum])
		this.resetTimers();
		this.attempt++;

	}

	newTrial() {
		this.attempt = 1;
	}

	toCsv() {
		this.personalData.push([this.partiName,this.age,this.gender,this.faculty,this.degree,this.major,this.usedMarking,this.usedRadial,this.usingTime,this.handType]);
		var csvFile2 = "Name,Age,Gender,Faculty,Degree,Major,Have used Marking,Have used Radial,Using Time,Hand Type\n";
		for (var i = 0; i < this.personalData.length; i++) {
			csvFile2 += this.personalData[i].join(',');
			csvFile2 += "\n";
		}
		csvFile2 += "\n";

		var csvFile = "";
		csvFile += "Order,Participant ID,Technique,Menu Depth,Menu Breadth,Trial,Target Item,Selected Item,Attempt,Start Time, End Time, Click Numbers\n";
		for (var i = 0; i < this.trials.length; i++) {
			csvFile += this.trials[i].join(',');
			csvFile += "\n";
		}

		csvFile2 += "\nRate of Marking,Rate of Radial,Preference,Difficulties of Marking,Difficulties of Radial,Suggestion of Marking,Suggestion of Radial\n";
		this.postData.push([this.rom,this.ror,this.prefer,this.dom,this.dor,this.som,this.sor]);
		for (var i = 0; i < this.postData.length; i++) {
			csvFile2 += this.postData[i].join(',');
			csvFile2 += "\n";
		}

		var hiddenLink = document.createElement('a');
		hiddenLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvFile);
		hiddenLink.target = '_blank';
		hiddenLink.download = 'experiment_result_' + this.partiId + '.csv';
		document.body.appendChild(hiddenLink);
		hiddenLink.click();

		var hiddenLink2 = document.createElement('a');
		hiddenLink2.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvFile2);
		hiddenLink2.target = '_blank';
		hiddenLink2.download = 'experiment_information_' + this.partiId + '.csv';
		document.body.appendChild(hiddenLink2);
		hiddenLink2.click();
	}


}