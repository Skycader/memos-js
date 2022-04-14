
function vibrate(){
	window.navigator.vibrate(500)
	}
	
$("#stick").on("click tap touch touchmove touchend touchstart mousedown", function( event ) {
     event.stopPropagation();
    
    
}); 

$("#editMenu").on("click tap touch touchmove touchend touchstart mousedown", function( event ) {
     event.stopPropagation();
    
    
});

var globalScreen = 1;
var anim = false;
var dir = false;
function a(){
anim = false;
}
function moveScreenController(screen){
if ((screen<5)&&(screen>0)) {

document.querySelector("#slide-item-"+screen).checked = true

	var delay = (400/Math.abs(globalScreen-screen));
	if ((anim)&&((globalScreen<screen)==dir)) {
	var delay = (200/Math.abs(globalScreen-screen));
	}
	dir = (globalScreen<screen)
	for (var i = 1; i<=4; i++) {
	 
	document.querySelector("#screen-"+i).style.transition = "linear "+delay+"ms";
	}
	
	 if (Math.abs(globalScreen-screen) == 1) {
	 document.querySelector("#screen-"+globalScreen).style.transition = "ease-in-out "+(delay)+"ms";
	 document.querySelector("#screen-"+screen).style.transition = "ease-in-out "+(delay)+"ms";
	 
	 setTimeout(a,400)
	 } else {
	 setTimeout(a,530)
	 console.log("ETO")
	  
	 document.querySelector("#screen-"+screen).style.transition = "ease-out "+(delay+130)+"ms"; 
     }	 
			anim = true;
			moveScreen(screen,delay);
			}  
}

function moveScreen(screen,delay){
try {clearTimeout(globalTimeout)} catch(e){};
console.log("Delay: " + delay);
console.log(globalScreen<screen);
console.log("TRANSITION: " + document.querySelector("#screen-"+globalScreen).style.transition);
if (globalScreen<screen) {
		 
	     
		document.querySelector("#screen-"+globalScreen).classList.toggle('hidden-left');
		
		 
		globalScreen++;
		document.querySelector("#screen-"+globalScreen).classList.toggle('hidden-right');
		var delayme = delay;
		
		globalTimeout = setTimeout(moveScreen, delayme,screen, delayme); 
	 

} else if (globalScreen>screen) {
		 
		document.querySelector("#screen-"+globalScreen).classList.toggle('hidden-right');
		 
		 
		
		globalScreen--;
		var delayme = delay;
		document.querySelector("#screen-"+globalScreen).classList.toggle('hidden-left');
		globalTimeout = setTimeout(moveScreen, delayme,screen, delayme); 
	 

}
}
 
keyboard.opened = false;
keyboard.open = () => {
 
 
function inner0(){
document.getElementById("textarea").focus();
}
setTimeout(inner0,600)
function inner(){
document.getElementById("textarea").classList.remove("opacity0")
document.getElementById("textarea").classList.add("td5")
}

setTimeout(inner,800)
}

check = {}
check.toggleed = false;
check.exit = () => {


document.getElementById("textarea").classList.remove("td5")
document.getElementById("textarea").classList.add("opacity0")
 
document.getElementById("textarea").value = ""
document.getElementById("textarea").blur();
cards.close()

inititated=false;
document.querySelector("#textarea").value = "";
document.querySelector("#textarea").classList.remove("padding")
setTimeout(check.toggle,550)
}

cards = {}
cards.init = () => {



function p1(){
try {
document.querySelector(".pos4").classList.add("work")
document.querySelector(".work").classList.remove("pos4")
document.querySelector(".work").classList.add("pos3")
document.querySelector(".pos3").classList.remove("work")
} catch(e) {}
}
function p2(){
try {
document.querySelector(".pos4").classList.add("work")
document.querySelector(".work").classList.remove("pos4")
document.querySelector(".work").classList.add("pos2")
document.querySelector(".pos2").classList.remove("work")
} catch(e) {}
}

function p3(){
try {
document.querySelector(".pos4").classList.add("work")
document.querySelector(".work").classList.remove("pos4")
document.querySelector(".work").classList.add("pos1")
document.querySelector(".pos1").classList.remove("work")
} catch(e) {}
}
 

p3();
next();
setTimeout(p2,100)
setTimeout(p1,200)
 
}

check.wrong = () => {
	document.querySelector(".pos1").classList.add("wrong-animation")
	document.querySelector(".pos1").classList.add("wrongcolor")
	function inner(){
	document.querySelector(".pos1").classList.remove("wrong-animation")
	}
	function inner2(){
	document.querySelector(".pos1").classList.remove("wrongcolor")
	}
	setTimeout(inner2,350)
	setTimeout(inner,500)
	}

	function toggleFullscreen() {
  let elem = document.querySelector("html");

  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen();
  }
}

check.next = (success) => { //Just moves the cards

if (success) {
	m = "win" //mode
} else {
	m = "wrongcolor"
}
	try {
document.querySelector(".pos1").classList.add("work")
document.querySelector(".work").classList.remove("pos1")
document.querySelector(".work").classList.add("pos0")
document.querySelector(".work").classList.add(m)
document.querySelector(".pos0").classList.remove("work")
} catch(e) {}

try {
document.querySelector(".pos2").classList.add("work")
document.querySelector(".work").classList.remove("pos2")
document.querySelector(".work").classList.add("pos1")
document.querySelector(".pos1").classList.remove("work")
} catch(e) {}

try {
document.querySelector(".pos3").classList.add("work")
document.querySelector(".work").classList.remove("pos3")
document.querySelector(".work").classList.add("pos2")
document.querySelector(".pos2").classList.remove("work")
} catch(e) {}

try {
document.querySelector(".pos4").classList.add("work")
document.querySelector(".work").classList.remove("pos4")
document.querySelector(".work").classList.add("pos3")
document.querySelector(".pos3").classList.remove("work")
} catch(e) {}

document.querySelector("#papers").insertAdjacentHTML("afterbegin", " <div class='pos4 card'></div>");

setTimeout(rem,500);
}

function rem(){

try {
document.querySelector(".pos0").remove()
} catch(e){}
}


//document.querySelector(".table").offsetHeight > 100 то пизда (нужно раздеить на 2 карточки)

function next(type,title){
		
		if (type) {
				qst = 1
				if (qst) {
				//document.querySelector(".pos4").innerHTML = cardid.replace("$id",qst)
				document.querySelector(".pos4").innerHTML = cardwin;
				} else {
					document.querySelector(".pos4").innerHTML = cardwin;
				}
		} else {
						qst = 1
				if (qst) {
				let renderedCard = cardSample.replace("$icon","🇫🇷");
				renderedCard = renderedCard.replace("$title",title);
				renderedCard = renderedCard.replace("$subTitle","Translation")
				document.querySelector(".pos1").innerHTML = renderedCard;
				} else {
					document.querySelector(".pos1").innerHTML = cardwin;
				}
		
		}
		}

cardSample = '<div><div class="forpicture">$icon</div> <div class="prepare2"> <div class="prepare3"> <p class="tip">$subTitle</p> </div> </div> </div> <div class="table"> <div class="table2"> <div class="cell prepare0"> <div class="prepare">$title</div>  </div> </div> </div>'
cardSample2 = "<div class='forpicture'>$icon</div> <div class='table'> <div class='table2'> <div class='cell prepare0'> <div class='prepare'>$title</div> <div class='prepare2'> <div class='prepare3'> <p class='tip'>$subTitle</p> </div> </div> </div> </div> </div>"
cardwin = " <div class='forpicture'><img src='assets/medal.svg'></div> <div class='table'> <div class='table2'> <div class='cell prepare0'> <div class='prepare'>All complete!</div> <div class='prepare2'> <div class='prepare3'> <p class='tip'>Pay us a visit in 3 hours.</p> </div> </div> </div> </div> </div> "	

cardid= "<div class='table'> <div class='table2'> <div class='cell pad'> <div> $id </div> </div></div></div> "
cardid2 = "<div class='pos4 card'><div class='table'> <div class='table2'> <div class='cell pad'> <div> $id </div> </div></div></div></div>"
 

cards.close = () => {

function p1(){
try {
document.querySelector(".pos1").classList.add("work")
document.querySelector(".work").classList.remove("pos1")
document.querySelector(".work").classList.add("pos00")
document.querySelector(".pos00").classList.remove("work")
} catch(e) {}
}
function p2(){
try {

document.querySelector(".pos2").classList.add("work")
document.querySelector(".work").classList.remove("pos2")
document.querySelector(".work").classList.add("pos00")
document.querySelector(".pos00").classList.remove("work")
document.querySelectorAll(".pos00")[1].classList.remove("work")
} catch(e) {}
}

function p3(){
try {

document.querySelector(".pos3").classList.add("work")
document.querySelector(".work").classList.remove("pos3")
document.querySelector(".work").classList.add("pos00")
document.querySelector(".pos00").classList.remove("work")
} catch(e) {}
}

function rem(){
	 for (var i = 0; i < 58; i++) {
		 document.querySelector(".card").remove()
		 console.log( document.querySelector(".card"))
	 }
}

p1()
setTimeout(p2,35)
setTimeout(p3, 65)
setTimeout(rem,500)

 
}
 
check.toggleed = 0;

check.check = (ans) => {
 
		ans = ans.toLowerCase()
		
		if (document.querySelector("#textarea").value.length >= 24) {
			document.querySelector("#textarea").classList.add("padding")
		} else {
			document.querySelector("#textarea").classList.remove("padding")
		}
}
check.toggle = () => {



 

if ((p()==0)) {
closeStats()

if (check.toggleed) {
check.toggleed = 0;
document.querySelector("#keyboard2").classList.add("donotdisplay")

} else {
	document.querySelector("#papers").insertAdjacentHTML("afterbegin", " <div class='pos4 card'><div class='table'> <div class='table2'> <div class='cell pad'> <div> </div> </div></div></div></div>");
	document.querySelector("#papers").insertAdjacentHTML("afterbegin", " <div class='pos4 card'><div class='table'> <div class='table2'> <div class='cell pad'> <div></div> </div></div></div></div>");
	document.querySelector("#papers").insertAdjacentHTML("afterbegin", " <div class='pos4 card'><div class='table'> <div class='table2'> <div class='cell pad'> <div></div> </div></div></div></div>");
	document.querySelector("#papers").insertAdjacentHTML("afterbegin", " <div class='pos4 card'><div class='table'> <div class='table2'> <div class='cell pad'> <div> </div> </div></div></div></div>");
setTimeout(cards.init,450)
check.toggleed = 1;
document.querySelector("#keyboard2").classList.remove("donotdisplay")
setTimeout(keyboard.open,250);
document.querySelector("svg").onclick = ''
}
 
document.querySelector("#keyboard").classList.toggle("hidekeyboard")
document.querySelector("#menu").classList.toggle("remove-up")
document.querySelector("#simplex").classList.toggle("remove-down")

if (check.toggleed) {
document.querySelector("#info1").classList.add("hideT")
document.querySelector("#info2").classList.add("hideT")
document.querySelector("#info3").classList.add("hideT")
document.querySelector("#info4").classList.add("hideT")
document.querySelector("#info5").classList.add("hideT")

document.querySelector("#info1").classList.remove("hideT2")
document.querySelector("#info2").classList.remove("hideT2")
document.querySelector("#info3").classList.remove("hideT2")
document.querySelector("#info4").classList.remove("hideT2")
document.querySelector("#info5").classList.remove("hideT2")
} else {
document.querySelector("#info1").classList.add("hideT2")
document.querySelector("#info2").classList.add("hideT2")
document.querySelector("#info3").classList.add("hideT2")
document.querySelector("#info4").classList.add("hideT2")
document.querySelector("#info5").classList.add("hideT2")

document.querySelector("#info1").classList.remove("hideT")
document.querySelector("#info2").classList.remove("hideT")
document.querySelector("#info3").classList.remove("hideT")
document.querySelector("#info4").classList.remove("hideT")
document.querySelector("#info5").classList.remove("hideT")
}


if (check.toggleed) {
document.querySelector("html").classList.toggle("omniflow");
document.querySelector("body").classList.toggle("omniflow");
} else {
	setTimeout(globalScroll,500);
}
 

document.querySelector("#thatcircle").classList.toggle("omniscale");
 }
}

	 
 
document.addEventListener("keydown", function(event) {
	if (event.which == 27) {
		//escape key
	  check.exit();
	}
  })
  