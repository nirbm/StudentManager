var mainList;

$(document).ready(function () {
		if (localStorage.getItem("list") == undefined) // if its first time in site or the user choose to clean all 
		{	
		    localStorage.setItem('list',JSON.stringify([]));
		}	
		if (localStorage.getItem("status") == undefined) // if its first time in site or the user choose to clean all 
		{	
			localStorage.setItem('status',JSON.stringify(true));
		}	
    	var itemsStr = localStorage.getItem("list");
        var itemsObj = JSON.parse(itemsStr);
		fromLocalstrToList();
		displayList();
});

function iframeToMission(){
	document.getElementById('mainFrame').src = "mesimot.html";
}
function iframeToGrades(){	
	document.getElementById('mainFrame').src = "grades.html";
}
function iframeToCalendar(){
	document.getElementById('mainFrame').src = "calendar.html";
}
function insertClick(){	
	 var txtCourseName=$("#CourseName").val();
	 var txtMissionId=$("#MissionId").val();
	 var txtFinalDate=$("#FinalDate").val();

	if(txtCourseName != "" && txtMissionId != "" && txtFinalDate != "")
	{
		item  = new ToDoItem(txtCourseName,txtMissionId,txtFinalDate);	//create new object

		if (localStorage.getItem("list") == undefined) // if its first time in site or the user choose to clean all 
		{	
		    localStorage.setItem('list',JSON.stringify([]));
		}				
		var itemsStr = localStorage.getItem("list");
        var itemsObj = JSON.parse(itemsStr);
		itemsObj.push(item);
		localStorage.setItem("list", JSON.stringify(itemsObj));
		fromLocalstrToList();
		displayList();
	}	
	else{
			alert("You have to insert all the data");
	}

}
function fromLocalstrToList()
{
	if(localStorage.getItem("list") == undefined)
        return;
	mainList = new ToDoList();
	var list = JSON.parse(localStorage.getItem("list"));
	$.each(list, function(i, item) {
		var newItem = new ToDoItem(item.CourseName, item.MissionId, item.FinalDate);
		newItem.grade = item.grade;
		newItem.iscChecked = false;
		newItem.done = item.done;
		newItem.readyDelete = item.readyDelete;
		mainList.addItem(newItem);
	});	
	console.log(mainList.toString());
}

function update()
{
	localStorage.setItem("list", JSON.stringify(mainList.itemList));
}
//-----------------------------------------------------------------------------------------

function ToDoItem(CourseName, MissionId, FinalDate)
{
	this.FinalDate = new Date(FinalDate);
	this.CourseName = CourseName;  	
	this.MissionId = MissionId;	
	this.grade = -1;
	this.done = false;
	this.readyDelete = false;
	if(typeof ToDoList.prototype.addItem != "function")
	{
		ToDoItem.prototype.toString = function()
		{
			var res = "task: "+this.CourseName+", ex num " + this.MissionId + ". destination date: " + this.FinalDate.toDateString();
			if(this.done)
				res += ". the task was done."
			else
				res += ". the task was not done."
			return res;
		};       
		ToDoItem.prototype.isOutOfDate = function(now)
		{
			if(!(now instanceof Date))
			{
				console.log("now is not a 'Date'");
				return;
			}
			if(this.FinalDate < now)
				return true;
			return false;
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
		ToDoList.prototype.getForDate = function(date)
		{
			if(!(date instanceof Date))
			{
				console.log("date is not a 'Date'");
				return;
			}
			//if have the same date:
			var res = this.itemList.filter(function(item) {return (item.date.getDate() == date.getDate() && 
																  item.date.getMonth() == date.getMonth() &&
																  item.date.getYear() == date.getYear());
			});
			return res;
		};
		ToDoList.prototype.getOutOfDate = function()
		{
			var res = this.itemList.filter(function(item) {return item.isOutOfDate(new Date())});
            return res;
		};
	}
}
function ClearListLocalStorage()
{
	localStorage.removeItem('list');
	window.location.reload();
}
// --------------------------------------------------------
function displayList()
{
	$("tr:gt(1)").remove();

	mainList.itemList.forEach(function(item,index,mainList){

	var string = "<tr"
		if(item.done )
		{
			string+= " id='completedMission'>"
		}
		else
		{
			string+= "  id='unCompletedMission'>"
		}
		string+="<td><input type='checkbox'  onClick=checkMissionHandler("+index+") id = '"+ index  +"'";
		if(item.done){
			string+=" checked ";
		}
		string+="/></td>";
		var date = item.FinalDate;
		string+= "<td>"+item.CourseName+"</td><td> "+item.MissionId+"</td><td> "+
			date.getFullYear() + " / " + (date.getMonth() + 1)+ " / " +  date.getDate()
			+"</td>"
		string+= "<td><button id ='deleteButton' onclick = deleteClick("+index+")> </button></td> "
		string+= "<td><button id ='editButton' onclick = updateClick("+index+")> </button></td>"
		string+= "</tr>";

		$("#missionTable").append(string);

	});
}

//----------------------------------------------------------
function checkMissionHandler(index)
{
	mainList.itemList[index].done = ! (mainList.itemList[index].done);
	update();
	displayList();
}

function deleteClick(index)
{
	if (confirm("האם אתה בטוח חביבי? ") == true)
	{
		mainList.itemList[index].readyDelete = true;
		update();
		var items = JSON.parse(localStorage["list"]);
		for (var i = 0; i < items.length; i++)
		{
			if (items[i].readyDelete) {
				items.splice(i,1);
			}
		}
		item = JSON.stringify(items);	 //updated
		ClearListLocalStorage();
		localStorage.setItem("list", item);
	}
}
function sort(input)
{	
	var status = JSON.parse(localStorage["status"]);
	if(!status)
	{
		localStorage.setItem('status',true);	
	}
	else
	{
		localStorage.setItem('status',false);	
	}
	var items = JSON.parse(localStorage["list"]);
	var length = items.length;
	
		for(var c = 0; c < (length-1) ; c ++)
		{
		for(var d = 0; d < (length - c -1) ; d++)
		{
			switch (input){
			case 0:
					if(status == true){
						if(items[d].FinalDate < items[d+1].FinalDate ){
							var temp = items[d];
							items[d] = items[d+1];
							items[d+1] = temp;
						}
					}
					else{
						if(items[d].FinalDate > items[d+1].FinalDate ){
							var temp = items[d];
							items[d] = items[d+1];
							items[d+1] = temp;
						}
					}
			break;

			case 3:
				if(status == true){
					if(items[d].CourseName <= items[d+1].CourseName ){
						var temp = items[d];
						items[d] = items[d+1];
						items[d+1] = temp;
					}
				}
				else{
					if(items[d].CourseName >= items[d+1].CourseName){
						var temp = items[d];
						items[d] = items[d+1];
						items[d+1] = temp;
					}
				}
				break;
				case 1:
					if(status == true){
						if(items[d].done ){
							var temp = items[d];
							items[d] = items[d+1];
							items[d+1] = temp;
						}
					}
					else{
						if(!items[d].done){
							var temp = items[d];
							items[d] = items[d+1];
							items[d+1] = temp;
						}
					}
					break;
				case 2:
					if(status == true){
						if(items[d].MissionId <= items[d+1].MissionId ){
							var temp = items[d];
							items[d] = items[d+1];
							items[d+1] = temp;
						}
					}
					else{
						if(items[d].MissionId >= items[d+1].MissionId){
							var temp = items[d];
							items[d] = items[d+1];
							items[d+1] = temp;
						}
					}
					break;
		}
	}
	update();
	item = JSON.stringify(items);	 //updated
	ClearListLocalStorage();
	localStorage.setItem("list", item);
 }

}
function updateClick(index)
{
	var newNameCourse = prompt("הכנס שם קורס חדש", "");
	var newNnumberMission = prompt("הכנס מספר תרגיל חדש" , "");
	var newDate = prompt("הכנס תאריך הגשה חדש לפי הפורמט","dd/mm/yyyy");
	if (newNameCourse != undefined)
	{
		mainList.itemList[index].CourseName = newNameCourse;
		update();
	}
	if (newNnumberMission != undefined)
	{
		mainList.itemList[index].MissionId = newNnumberMission;
		update();
	}
	if (newDate != undefined) {
		if (newDate.isValid) {
			alert("true");
			mainList.itemList[index].FinalDate = newDate;
			update();
		}
		else{
			alert(" תאריך לא חוקי");
		}
	}
	displayList();
}

