// Class used to track experiment
class ExperimentTracker {


	constructor() {
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
		var csvFile = "Order,Participant ID,Technique,Menu Depth,Menu Breadth,Trial,Target Item,Selected Item,Attempt,Start Time, End Time, Response Time\n";
		for (var i = 0; i < this.trials.length; i++) {
			csvFile += this.trials[i].join(',');
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