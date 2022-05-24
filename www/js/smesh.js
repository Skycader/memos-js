var turn = -1;
var tries;
var timer;
var theInterval;
theTime = 0;
function timeout() {
    alert("Time is up!")
    playTheGame();
}
function playTheGame() {
    theInterval = setInterval(loop,1000)
    tries=3;
    try {
    clearTimer(timer)
    } catch(e) {}
timer = setTimeout(timeout,60000);
turn++;
//document.querySelectorAll(".html5-main-video")[document.querySelectorAll(".html5-main-video").length-1].click();
document.querySelectorAll(".html5-main-video")[document.querySelectorAll(".html5-main-video").length-1].style.display = "none"
//theInterval = setInterval(checker,1000)
theTime = Math.floor(Math.random()*341+20)
document.querySelectorAll(".playlist-items")[1].children[Math.floor(Math.random()*201)].children[0].click()
//setTimeout(rewind,5000,theTime)
}
var video;
function rewind(arg) {
document.querySelectorAll(".html5-main-video")[document.querySelectorAll(".html5-main-video").length-1].currentTime = arg;
document.querySelectorAll(".html5-main-video")[document.querySelectorAll(".html5-main-video").length-1].pause();
}

var answer;
var players = [0,0]
function guess(ans) {
answer = ""
arr = document.querySelector("title").innerHTML.split(" ")
 
if (ans.toLowerCase() == arr[0].toLowerCase()) {
    
clearTimeout(timer);
alert("Верно! + "+tries+ " очков!")
 
players[turn%2]+=tries;
if (players[turn%2]>=10) {
    alert("Player number " + turn%2 + " wins!")
}
 playTheGame();   
} else {
tries--;
alert("Не угадал! Попробуй-ка ещё раз! Осталось " + tries + " попыток!")
theTime = Math.floor(Math.random()*341+20)
if (tries<1) {
    playTheGame()
    }
 
}
}
 
var log = [];
function checker() {
if (theTime != document.querySelectorAll(".html5-main-video")[document.querySelectorAll(".html5-main-video").length-1].currentTime) {
    rewind(theTime)
   log.push("Rewinding")
} else {
//document.querySelectorAll(".html5-main-video")[document.querySelectorAll(".html5-main-video").length-1].click();
log.push("Clearing" + theTime + " " + document.querySelectorAll(".html5-main-video")[document.querySelectorAll(".html5-main-video").length-1].currentTime)
document.querySelectorAll(".html5-main-video")[document.querySelectorAll(".html5-main-video").length-1].style.display = "block"
clearInterval(theInterval)
rewind(theTime)
}
}

function loop() {
//document.querySelectorAll(".html5-main-video")[document.querySelectorAll(".html5-main-video").length-1].style.display = "none"
    document.querySelectorAll(".html5-main-video")[document.querySelectorAll(".html5-main-video").length-1].click();
document.querySelectorAll(".html5-main-video")[document.querySelectorAll(".html5-main-video").length-1].pause();
document.querySelectorAll(".html5-main-video")[document.querySelectorAll(".html5-main-video").length-1].currentTime = theTime
document.querySelector(".ytp-cued-thumbnail-overlay-image").remove();
}

