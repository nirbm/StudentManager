var gradesList;
var sigmaScores;
var naz;

$(function() {

	sigmaScores = 0;
		if (localStorage.getItem("grades") == undefined) // if its first time in site or the user choose to clean all 
		{	
		    localStorage.setItem('grades',JSON.stringify([]));
		}		
    	var itemsStr = localStorage.getItem("grades");
        var itemsObj = JSON.parse(itemsStr);
		fromLocalstrToList();
		displayList();
});


function insertClick(){

	 var txtCourseName=$("#CourseName").val();
	 var txtFinalGrade=$("#FinalGrade").val();
	 var txtCredits=$("#Credits").val();
	if(txtCourseName != "" && txtFinalGrade != "" && txtCredits != "")
	{
		if (!isNumber(txtCredits) ||!isNumber(txtFinalGrade) ) {
			alert("please enter numbers only for grade and credits!");
			return;
		}
		var newNaz =parseFloat(txtCredits);
		var newGrade = parseFloat(txtFinalGrade);
		if(newNaz< 0 || newGrade <0 || newNaz > 25 || newGrade > 100)
		{
			alert("invalid numbers!");
			return;
		}
		newItem  = new ToDoItem(txtCourseName,txtFinalGrade,txtCredits);	//create new object

		if (localStorage.getItem("grades") == undefined) // if its first time in site or the user choose to clean all 
		{	
		    localStorage.setItem('grades',JSON.stringify([]));
		}		
		
		var itemsStr = localStorage.getItem("grades");
        var itemsObj = JSON.parse(itemsStr);
		itemsObj.push(newItem);
		localStorage.setItem("grades", JSON.stringify(itemsObj));
		fromLocalstrToList();
		displayList();
	}	
	else{
			alert("You have to insert all the data");
	}	
}


function fromLocalstrToList()
{
	if(localStorage.getItem("grades") == undefined)
        return;
	gradesList = new ToDoList();
	var grades = JSON.parse(localStorage.getItem("grades"));
	$.each(grades, function(i, item) {
		var newItem = new ToDoItem(item.CourseName, item.FinalGrade, item.Credits, item.isChecked);
		newItem.grade = item.grade;
		newItem.Credits = item.Credits;
		newItem.isChecked = item.isChecked;
		
		gradesList.addItem(newItem);
	});	
	console.log(gradesList.toString());
}

function update()
{
	localStorage.setItem("grades", JSON.stringify(gradesList.itemList));
}

//-----------------------------------------------------------------------------------------

function ToDoItem(CourseName, FinalGrade, credits)
{
	this.CourseName = CourseName;  	
	this.FinalGrade = FinalGrade;	
	this.Credits = credits;	
	this.isChecked = true;
	if(typeof ToDoList.prototype.addItem != "function")
	{
		ToDoItem.prototype.toString = function()
		{
			var res = "test: "+this.CourseName+", score " + this.FinalGrade + ". credits: " + this.Credits + "isChecked : " + this.isChecked;
			return res;
		};
	}
}



//------------------------------------------------------------------------------------------
// ToDoList Object
function ToDoList()
{
	this.itemList = [];
	
	if(typeof ToDoList.prototype.addItem != "function")
	{
		//this function return string with the list details:
		ToDoList.prototype.toString = function()
		{
			if(this.itemList.length == 0)
				return "No items in the list";
			var res = "The list:\n";
			for(var i=0; i<this.itemList.length; i++)
				res = res + (i+1) + "." + this.itemList[i].toString() + "\n";
			return res;
		};
		ToDoList.prototype.addItem = function(item)	//add item to the list
		{
			if(!(item instanceof ToDoItem))
			{
				console.log("item is not a 'ToDoItem'");
				return;
			}
			this.itemList.push(item);
		};
	}
}
function ClearLocalStorage()
{
	localStorage.removeItem('grades');
	window.location.reload();
}



// --------------------------------------------------------
function displayList()
{

	$("tr:gt(2)").remove();
	var row;
	var counter=0;
	naz = parseFloat("0.0");
	sigmaScores =  parseFloat("0.0");
    gradesList.itemList.forEach(function(item,index){

	if(index%2 === 0)
		row = "<tr style='background:#002949;'>";
	else
		row ="<tr style='background:#0c4678;'>";
	row+= "<td><div class='squaredOne'>";
	row+="<input type='checkbox' value='None' id='squaredOne" + index +"' name='check'";
	if(gradesList.itemList[index].isChecked){
		row+=" checked ";
		sigmaScores = sigmaScores + parseFloat(item.FinalGrade)*parseFloat(item.Credits);
		naz = naz + parseFloat(item.Credits);
		counter++;
	}

	//add all standard functionality
	row+="onClick=checkGradeHandler("+index+") id = '"+index+"'/> ";
	row+="<label for='squaredOne" + index +"'></label></div></td>";
	row+="<td>"+item.CourseName+"</td><td>"+item.FinalGrade+"</td><td>"+item.Credits+"</td>";
	row+="<td width='30'>";
	//add the delete button
	row+="<button id ='deleteButton' onclick = deleteClick("+index+")></button></td>";
	//add the edit button
	row+="<td width='30'  ><button id ='editButton' onclick = editGrade("+index+")></button></td></tr>";
	//add the line we created
	$("#gradesTable").append(row);
    });
	
	var avg= getAvrage(sigmaScores, counter, naz);
	row = "<tr><td colspan='6' style=' padding-left: 17px; text-align: left; color:white; direction:rtl; border-bottom-left-radius: 50px;'>";
	if (counter!=0){
		row+=" הממוצע שלך: "+  avg.toFixed(2) + "&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;" ;
		row+="נ''ז: " + naz + " </td></tr>"
		
	}
	else
		row+= "&nbsp;&nbsp;לא בחרת אף ציון לכלול בממוצע</td></tr>";
	$("#gradesTable").append(row);

	draw(avg);

}

function getAvrage(sigmaScores, counter, naz) {
	if (naz!= 0)
		return (sigmaScores/naz);
	return 0;
}

function checkGradeHandler(index) {
	gradesList.itemList[index].isChecked = ! (gradesList.itemList[index].isChecked);
	update();
	displayList();
}

function editGrade(index)
{

	var newGrade = prompt("Please enter new grade", "100");
	var newNaz = prompt("please enter new naz" , "5");



	if (newGrade != null &&  newNaz !=null) {
		if(newNaz< 0 || newGrade <0 || newNaz > 25 || newGrade > 100)
		{
			alert("invalid numbers!");
			return;
		}
		gradesList.itemList[index].FinalGrade = newGrade;
		gradesList.itemList[index].Credits = newNaz;
		update();
		displayList();
	}


}
function deleteClick(index)
{
    if (confirm("האם אתה בטוח חביבי? ") == true)
	{
		var itemsStr = localStorage.getItem("grades");
		var itemsObj = JSON.parse(itemsStr);
		itemsObj.splice(index,1);
		localStorage.setItem("grades", JSON.stringify(itemsObj));
		fromLocalstrToList();
		displayList();
    } 	
}

function draw(avg) {

	var ctx = document.getElementById('canvas').getContext('2d');
	var al =0 ;
	var cw = ctx.canvas.width;
	var ch= ctx.canvas.height;
	var score = $("#scoreBoard");
	function progressSim() {
		ctx.clearRect(0,0,cw,ch);
		ctx.lineWidth = 10;
		ctx.fillStyle = colorByAvg(al);
		$("#scoreBoard").css('background-color',  colorByAvg(al));
		ctx.strokeStyle ='#09F';
		ctx.beginPath();
		score.html(" " + stringByGrade(avg));
		ctx.fillRect(0,0,(al/100)*cw,ch);
		ctx.stroke();
		if(al >= avg)
		{
			clearTimeout(sim);
			//add scripting to say the loading is complete...
		}
		al++;
	}
	var sim = setInterval(progressSim, 10);

}

function colorByAvg(avg)
{
	if(avg <10)
		return "#E50500";
	else if(avg>=10 && avg <20)
		return  "#D91700";
	else if(avg>=20 && avg <30)
		return  "#CD2A00";
	else if(avg>=30 && avg <40)
		return  "#C13C00";
	else if(avg>=40 && avg <50)
		return  "#B54F00";
	else if(avg>=50 && avg <60)
		return  "#AA6200";
	else if(avg>=60 && avg <70)
		return  "#9E7400";
	else if(avg>=70 && avg <80)
		return  "#928700";
	else if(avg>=80 && avg <90)
		return  "#869900";
	else
		return "#6FBF00";
}


function stringByGrade(avg)
{
	if(avg <50 )
		return "על הפנים";
	else if(avg>=50 && avg <60)
		return  "מספיק בקושי";
	else if(avg>=60 && avg <70)
		return  "טוב מינוס";
	else if(avg>=70 && avg <80)
		return  "טוב";
	else if(avg>=80 && avg <85)
		return  "אחלה";
	else if(avg>=85 && avg <90)
		return  "טוב מאוד";
	else if(avg>=90 && avg <95)
		return  "מצוין!!";
	else
		return "great!";
}
//----------------------------------------------------------
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}