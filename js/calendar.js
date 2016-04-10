
$(document).ready(function() {
	if(localStorage.getItem("Events") == undefined)
    {
		var events = [];
        localStorage.setItem("Events", JSON.stringify(events));
	}
    $('#calendar').fullCalendar({
		header: {
            left: 'next,prev today',
            center: 'title',
            right: 'month,basicWeek,basicDay'
        },
		eventClick: function(calEvent, jsEvent, view){
			var contentBox = "<div id='myModal' class='modal'><div class='modal-content'><span class='close'>×</span><p>" + 
			calEvent.title +"<br/>"+ calEvent.start.startOf('day').fromNow()+ "</p></div></div>";
			$('#calendar').after(contentBox);
			// Get the modal
			var modal = document.getElementById('myModal');

			// Get the button that opens the modal
			var btn = document.getElementById("myBtn");

			// Get the <span> element that closes the modal
			var span = document.getElementsByClassName("close")[0];

			// When the user clicks the button, open the modal 

				modal.style.display = "block";


			// When the user clicks on <span> (x), close the modal
			span.onclick = function() {
				modal.style.display = "none";
			}

			// When the user clicks anywhere outside of the modal, close it
			window.onclick = function(event) {
				if (event.target == modal) {
					modal.style.display = "none";
				}
			}
		},
		lang: 'he',
		isRTL: true,
        editable: false,
		eventLimit: true,
        fixedWeekCount: false,
        //timezone: false,
        events:	getEventsFromStorage()
    });
    $("body").keydown(function(e) {
        if (e.keyCode == 37) {
            $('#calendar').fullCalendar('prev');
        } else if (e.keyCode == 39) {
            $('#calendar').fullCalendar('next');
        }
    });
	
});


/*
$(document).ready(function() {
    $("#calendar").fullCalendar({
        header: {
            left: "prev,next today",
            center: "title",
            right: "month,agendaWeek,agendaDay"
        },
        editable: false,
        fixedWeekCount: false,
        timezone: false,
        events: {
            url: "https://www.hebcal.com/hebcal/?cfg=fc&v=1&i=off&maj=on&min=on&nx=on&mf=on&ss=on&mod=on&lg=s&s=on",
            cache: true
        }
    });
    $("body").keydown(function(e) {
        if (e.keyCode == 37) {
            $('#calendar').fullCalendar('prev');
        } else if (e.keyCode == 39) {
            $('#calendar').fullCalendar('next');
        }
    });
});
*/


function getEventsFromStorage()
{
	var arr = [];
	if(localStorage.getItem("list") == undefined)
        return arr;
                
    var list = JSON.parse(localStorage.getItem("list"));
    $.each(list, function(i, item) {
		var titleOfItem = item.CourseName + ', תרגיל מספר ' + item.MissionId;
		var task = {title : titleOfItem, start: item.FinalDate};
		arr.push(task);
	});
	
	var events = JSON.parse(localStorage.getItem("Events"));
	$.each(events, function(i, item) {
		var event = {title : item.title, start: item.start, end: item.end, color: item.color};
		arr.push(event);
	});
	return arr;
}

function addEventCliked()
{
    var d = new Date($('#endDate').val());
    d.setDate(d.getDate()+1);
	var newEvent = {title: $('#eventName').val(), start: $('#startDate').val(), end: d.toDateString(), color: $(".jscolor").css("background-color")};
	$('#calendar').fullCalendar( 'renderEvent', newEvent );
	var events = JSON.parse(localStorage.getItem("Events"));
	events.push(newEvent);
	localStorage.setItem("Events", JSON.stringify(events));
}