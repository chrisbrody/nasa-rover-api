// jQuery UI datepicker
var datepicker = document.getElementById("datepicker");
$(datepicker).datepicker();

// variables to track stuff
var pageCounter, prevCounter, oldDate;

// Current Date Display
var datedisplay = document.getElementById('datedisplay');
// select element for rover data
var roverContent = document.getElementById('roverContent');
// curiosity next button
var curiosityNextBtn = document.getElementById('curiosityNextBtn');
// curiosity previous button
var curiosityPrevBtn = document.getElementById('curiosityPrevBtn');

// store current date info
var today        = new Date();
var currentDay   = today.getDate() - 2;
var currentMonth = today.getMonth() + 1;
var currentYear  = today.getFullYear();
var date         = currentYear + '-' + currentMonth + "-" + currentDay;
var dateDisplay  = currentMonth + "/" + currentDay + "/" + currentYear

// update datepicker element with current date
datepicker.value = dateDisplay;

// show the date minus 1
datedisplay.textContent = dateDisplay;

// show curiosity rover images
function curiosity() {
	// update page count
	pageCounter = 1;
	// update previous count
	prevCounter = 0;

	// show next button for curiosity
	curiosityNextBtn.style.visibility = 'hidden';

	// call ajax function
	ajaxCall(pageCounter, prevCounter);
}

// show previous curiosity pics
function prevCuriosity() {
	prevAjaxCall();
	// animate to the top
	$("html, body").animate({ scrollTop: 0 }, "slow");
}

// show next curiosity pics
function nextCuriosity() {
	ajaxCall();
}

function ajaxCall(){
	console.log('pagecount: ' + pageCounter + ' : previous count: ' + prevCounter, date, oldDate);

	// url for data request
	var urlMarsRover = "https://api.nasa.gov/mars-photos/api/v1/rovers/" + "curiosity" + "/photos?earth_date=" + date + "&page=" + pageCounter + "&api_key=gxkH8IkRyc7qWyqj731fxKQfJotxLJfky0cwTDz6";

	// http data call
	$.ajax({
		url: urlMarsRover,
		success: handleRequest,
		json: "callback",
    dataType: "json"
	});

	// animate to the top
	$("html, body").animate({ scrollTop: 0 }, "slow");

	// show previous button when needed
	if(prevCounter >= 1) {
		curiosityPrevBtn.style.visibility = 'visible';
	} else {
		curiosityPrevBtn.style.visibility = 'hidden';
	};

	// update page count
	pageCounter++;
	// update previous count
	prevCounter++;
}

function prevAjaxCall(){
	// reduce previous count by 1
	prevCounter--;
	// reduce page count by 1
	pageCounter--;
	// url for data request
	var urlMarsRover = "https://api.nasa.gov/mars-photos/api/v1/rovers/" + "curiosity" + "/photos?earth_date=" + date + "&page=" + prevCounter + "&api_key=gxkH8IkRyc7qWyqj731fxKQfJotxLJfky0cwTDz6";

	// hide previous button if there is no need for one
	if(prevCounter == 1) {
		curiosityPrevBtn.style.visibility = 'hidden';
	};

	// tell the user the messed up
	if(prevCounter < 1) {
		return alert('No Images This Way');
	};

	// make AJAX request
	$.ajax({
		url: urlMarsRover,
		success: handleRequest,
		json: "callback",
    dataType: "json"
	});
};

function handleRequest(data) {
	// console return data
	console.log(data);

	// stop if there are no images
	if ( !data.photos.length ) {
		// console.log("no photos");

		// clear out any previous data
		roverContent.innerHTML = '';
		// update if errors
		document.getElementById("errors").innerHTML =  "<h2 class='text-uppercase'>" + 'No Images, Blame the Robit' + "</h2>" + "<img src='img/bad.jpg' alt='Robot Doing Running Incorrect Code'>";

	} else if (data.photos.length == 25) {
		// console.log("data.photos.length == 25");

		// show next button
		curiosityNextBtn.style.visibility = 'visible';

		// clear out any previous data
		document.getElementById("errors").innerHTML = ""
		roverContent.innerHTML = '';
	} else if (data.photos.length < 25) {
		// console.log("data.photos.length < 25");

		// hide next button
		curiosityNextBtn.style.visibility = 'hidden';

		// clear out any previous data
		document.getElementById("errors").innerHTML = "";
		roverContent.innerHTML = '';
	};

	// loop through new photos
	for (var i = 0; i < data.photos.length; i++) {
		// console.log(data.photos[i].camera.full_name);

		// create elements
		var newA    = document.createElement('a');
		var newWrap = document.createElement("div");
		var newP    = document.createElement("p");
		var newImg  = document.createElement('img');
		var newSpan = document.createElement('span');

		// set attribute on elements
		newA.className      = "col-md-4 col-sm-6";
		newA.href           = data.photos[i].img_src;
		newA.setAttribute("data-lightbox", "gallery1");
		newA.setAttribute("data-title", data.photos[i].camera.full_name);

		newWrap.className   = "wrapper"

		newP.innerHTML      = "<i class='fa fa-camera'></i> " + data.photos[i].camera.full_name

		newImg.src          = data.photos[i].img_src;
		newImg.className    = "img-responsive nasaImg";

		newSpan.id          =  data.photos[i].id;
		newSpan.textContent = "Image #: " + data.photos[i].id;

		// add elements to display data to the user
		newWrap.appendChild(newImg);
		newWrap.appendChild(newP);
		newWrap.appendChild(newSpan);

		newA.appendChild(newWrap);

		roverContent.appendChild(newA);
	};
};

// call yesterdays images
curiosity();

// when the date is changed
datepicker.onchange = function() {
	// update the datedisplay
	datedisplay.textContent = this.value;

	// store old date
	oldDate = date;

	// reset counter
	prevCounter = 0;
	pageCounter = 1;

	// build new date form user
	var x = this.value;
	var newDay = x.slice(3, 5);
	var newMonth = x.slice(0, 2);
	var newYear = x.slice(6, 10);

	// update date to new date
	date = newYear + "-" + newMonth + "-" + newDay;

	console.log(pageCounter, prevCounter)
	// call function, passing in new date
	ajaxCall(date);
};

// hide or display headline on scroll
window.onscroll = function() {
	var fullpage = document.getElementById("fullpageimg");
	// scrolled a bit down
	if (window.pageYOffset > 100) {
		$("h1").slideUp();
	} else {
		$("h1").slideDown();
	}
}
