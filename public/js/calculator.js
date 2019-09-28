//
var meanButton, weightedButton, addRowButton, clearButton;
var result;
var grades;
var table;
var numRows = 5;
window.onload=function(){
	//add event listeners for the buttons
	meanButton = document.getElementById("meanButton").addEventListener("click", printMean);
	weightedButton = document.getElementById("weightedButton").addEventListener("click", printWeighted);
	addRowButton = document.getElementById("addRowButton").addEventListener("click", addRow);
	clearButton = document.getElementById("clearButton").addEventListener("click", clearInputs);

	result = document.getElementById("result"); //the <p> tag where results are posted

	grades = document.getElementsByTagName("input"); //node object of all forms

	table = document.getElementById("gradeTable");

	for (var i = 0; i < grades.length; i += 3) {
		//grades[i + 1].addEventListener("change input keyup paste click", printPercent);
		// grades[i + 2].addEventListener("change input keyup paste click", printPercent);
		grades[i].oninput = highlight;
		grades[i + 1].oninput = printPercent;
		grades[i + 2].oninput = printPercent;
	}
}

function clearInputs() {
	grades = document.getElementsByTagName("input");
	var percent = document.getElementsByTagName("td");
	for (var i = 0; i < grades.length; i++) {
		grades[i].value = "";
		grades[i].style.borderColor = '';
	}

	for (var i = 0; i < percent.length; i += 5) {
		percent[i + 4].innerHTML = "";
	}

	result.innerHTML = "";
}

function addRow() {
	table = document.getElementById("gradeTable");
	table.insertAdjacentHTML('beforeend', `<form>
              <tr>
                <td>Activity ${numRows}</td>
                <td>A${numRows}</td>
                <td><input type="number" pattern="\d+"></td>
                <td>
                  <input type="number"><b>/</b>
                  <input type="number" pattern="\d+">
                </td>
                <td></td>
              </tr>
            </form>`);
	grades = document.getElementsByTagName("input");
	grades[3*(Number(numRows)-1)].oninput = highlight;
	grades[3*(Number(numRows)-1) + 1].oninput = printPercent;
	grades[3*(Number(numRows)-1) + 2].oninput = printPercent;
	numRows++;
}

function highlight() {
	grades = document.getElementsByTagName("input");
	for (var i = 0; i < grades.length; i += 3) {
		if (grades[i].value.length != 0 && grades[i].value <= 0) {
			grades[i].style.borderColor = 'red';
		} else grades[i].style.borderColor = '';
	}
}

function printPercent() { 
	grades = document.getElementsByTagName("input");
	var percent = document.getElementsByTagName("td");
	for (var i = 0; i < grades.length; i += 3) {
		grades[i + 2].style.borderColor = '';
		percent[(i/3)*5 + 4].innerHTML = "";

		//check grade total is non-empty and positive
		if (grades[i + 2].value.length == 0) {
			continue;
		} else if (grades[i + 2].value <= 0) {
			grades[i + 2].style.borderColor = 'red';
			percent[(i/3)*5 + 4].innerHTML = `--%`;
			continue;
		}

		//check grade value is non-empty
		if (grades[i + 1].value.length == 0) {
			continue;
		}

		grades[i + 2].style.borderColor = '';
		percent[(i/3)*5 + 4].innerHTML = `${((grades[i + 1].value/grades[i + 2].value)*100).toFixed(2)}%`;
		console.log(`${((grades[i + 1].value/grades[i + 2].value)*100).toFixed(2)}%`);

		// if (grades[i + 1].value.length != 0 && grades[i + 2].value.length != 0) {
		// 	if (grades[i + 2].value <= 0) {
		// 		grades[i + 2].style.borderColor = 'red';
		// 		percent[(i/3)*5 + 4].innerHTML = `--%`;
		// 	}  
		// 	else {
		// 		grades[i + 2].style.borderColor = '';
		// 		percent[(i/3)*5 + 4].innerHTML = `${(grades[i + 1].value/grades[i + 2].value*100).toFixed(0)}%`;
		// 		console.log(`${(grades[i + 1].value/grades[i + 2].value*100).toFixed(0)}%`);
		// 	}
		// } else {
		// 	grades[i + 2].style.borderColor = '';
		// 	percent[(i/3)*5 + 4].innerHTML = "";
		// }
	}
}

function printMean() {
	//re-obtain input values in case more rows are added
	grades = document.getElementsByTagName("input");
	result = document.getElementById("result");

	var gradeValueSum = Number('0');
	var maxGradeSum = Number('0');
	var errorMessage = "";

	//look through the input
	for (var i = 0; i < grades.length; i += 3) {
		grades[i].style.borderColor = "";
		grades[i + 1].style.borderColor = "";
		grades[i + 2].style.borderColor = "";
		if (grades[i + 1].value.length == 0 || grades[i + 2].value.length == 0) { //grade value or max grade not entered
			if (grades[i + 1].value.length != 0) {
				grades[i + 2].style.borderColor = "red";
				errorMessage = "<br/>Note: Invalid and incomplete entries were ignored."
			} 
			if (grades[i + 2].value.length != 0) {
				grades[i + 1].style.borderColor = "red";
				errorMessage = "<br/>Note: Invalid and incomplete entries were ignored."
			} 
			continue; //skip to next activity
		} else  {
			if (Number(grades[i + 2].value) > 0) {
				gradeValueSum += Number(grades[i + 1].value);
				maxGradeSum += Number(grades[i + 2].value);
			} else {
				grades[i + 2].style.borderColor = "red";
				errorMessage = "<br/>Note: Invalid and incomplete entries were ignored."
			}
		}
			
	}

	if (maxGradeSum == 0) {
		console.log('No grades entered.');
		if (errorMessage.length == 0) result.innerHTML = 'No grades entered.';
		else result.innerHTML = "Invalid or incomplete grade values entered.";
	} else {
		console.log(gradeValueSum + " " + maxGradeSum + " " + gradeValueSum/maxGradeSum);
		result.innerHTML = `Mean grade: ${(gradeValueSum/maxGradeSum*100).toFixed(2)}%` + errorMessage;
	}
}

function printWeighted() {
	//re-obtain input values in case more rows are added
	grades = document.getElementsByTagName("input");
	result = document.getElementById("result");

	var gradeValueSum = Number('0');
	var gradeWeightSum = Number('0');
	var errorMessage = "No grades entered.";
	var invalidInput = false;

	//look through the input
	for (var i = 0; i < grades.length; i += 3) {
		invalidInput = false;
		grades[i].style.borderColor = "";
		grades[i + 1].style.borderColor = "";
		grades[i + 2].style.borderColor = "";

		//if row is blank, skip it
		if (grades[i].value.length + grades[i + 1].value.length + grades[i + 2].value.length == 0) continue;

		//check grade weight
		if (grades[i].value.length == 0 || grades[i].value <= 0) {
			grades[i].style.borderColor = "red";
			invalidInput = true;
		}

		//check grade value
		if (grades[i+1].value.length == 0) {
			grades[i+1].style.borderColor = "red";
			invalidInput = true;
		}

		//check max grade value
		if (grades[i+2].value.length == 0 || grades[i+2].value <= 0) {
			grades[i+2].style.borderColor = "red";
			invalidInput = true;
		}

		if (invalidInput) {
			errorMessage = "Invalid or incomplete grade values entered.";
			continue; //skip this row - invalid input present
		} 

		gradeValueSum += (Number(grades[i+1].value)/Number(grades[i+2].value))*Number(grades[i].value);
		gradeWeightSum += Number(grades[i].value);
			
	}

	if (gradeWeightSum == 0) {
		console.log(errorMessage);
		result.innerHTML = errorMessage;
	} else {
		console.log(gradeValueSum + " " + gradeWeightSum + " " + gradeValueSum/gradeWeightSum);
		if (errorMessage == "Invalid or incomplete grade values entered.") {
			result.innerHTML = `Weighted grade: ${(gradeValueSum/gradeWeightSum*100).toFixed(2)}%<br/>Note: Invalid and incomplete entries were ignored.`;
		}
		else result.innerHTML = `Weighted grade: ${(gradeValueSum/gradeWeightSum*100).toFixed(2)}%`;
		
	}
	console.log("print weighted.");
}

