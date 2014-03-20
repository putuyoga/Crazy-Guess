var bestScore;
var bestTime;

var indexArray = [];
var selectedIndex;
var heartPoint;
var guessPoint;
var startDate;

$(document).on("pageinit", "#mainPage", function () {
	if(typeof(Storage)!=="undefined") {
		if(localStorage.bestScore) {
			bestScore = localStorage.bestScore;
			bestTime = localStorage.bestTime;
			var totalSeconds = bestTime;
			var seconds = totalSeconds % 60;
			var minutes = Math.floor(totalSeconds / 60);
			//update the main menu
			$("#timeRecord").html( minutes +" minute(s) and " + seconds + " second(s)" );
			$("#wordRecord").html( bestScore + " word(s)" );
		} else {
			bestScore = 0;
			bestTime = 0;
		}
	} else {
		alert("Local storage not found");
	}
});


$(document).on("pageshow", "#guessPage", function () {
    initGuessPage();
	
	$("#guessButton").click(function() {
	
		console.log("trying guess : ");
		var input = $("#guessInput").val();
		if(!isBlank(input)) {
			var wordObj = getCurrentWord();
			console.log(wordObj);
			if(wordObj.word === input) {
				console.log("correct guess");
				selectedIndex++;
				guessPoint++;
			} else {
				console.log("wrong guess");
				heartPoint--;
				
				if(heartPoint == 0) {
					lose();
				}
			}
			updateUI();
		}
	});
});

function initGuessPage() {
	//shuffle array of index
	indexArray = shuffle(generateIndex());
	
	//reset point
	heartPoint = 3;
	guessPoint = 0;
	selectedIndex = 0;
	
	updateUI();
	startDate = new Date();
}

function generateIndex() {
	var arr = [];
	for(var i = 0; i < wordList.length; i++) {
		arr.push(i);
	}
	return arr;
}

function getCurrentWord() {
	return wordList[indexArray[selectedIndex]];
}

function clearInput() {
	$("#guessInput").val("");
}

function updateUI() {
	console.log("update UI");
	var wordObj = getCurrentWord();
	console.log(selectedIndex);
	$("#guessQuestion").html(shuffleString(wordObj.word));
	$("#heartPt").html(heartPoint);
	$("#scorePt").html(guessPoint);
	clearInput();
}

function lose() {
	
	var correctAns = $("#correctAnswer");
	correctAns.html("<b>" + getCurrentWord().word + "</b> is the right answer");
	correctAns.show();
	
	var elapsed = Math.abs(new Date() - startDate);
	var totalSeconds = Math.floor(elapsed / 1000);
	
	updateMainUI(totalSeconds);
	$("body").pagecontainer("change", "#mainPage");
}

function updateMainUI(totalSeconds) {

	//component time
	var seconds = totalSeconds % 60;
	var minutes = Math.floor(totalSeconds / 60);
	if(isBestScore(totalSeconds)) {
		$("#note").html("you beat your last record !");
		$("#note").addClass("green");
	} else {
		$("#note").html("you failed beat your record, last record : " + bestScore);
		$("#note").addClass("red");
	}
	$("#note").show();
	//update the main menu
	$("#timeRecord").html( minutes +" minute(s) and " + seconds + " second(s)" );
	$("#wordRecord").html( guessPoint + " word(s)" );
}

function isBestScore(time) {
	if(bestScore < guessPoint) {
		bestScore = guessPoint;
		bestTime = time;
		localStorage.setItem("bestScore", bestScore);
		localStorage.setItem("bestTime", bestTime);
		return true;
	} else {
		return false;
	}
}

//------------------------------------------------
//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function shuffleString(s) {
    var a = s.split(""),
        n = a.length;
	
    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
	var result = a.join("");
	if(s == result) {
		return shuffleString(s);
	} else {
		return result;
	}
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}