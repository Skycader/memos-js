
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
defaultWindowHeight = 0

 
keyboard.exit = () => {
	if ((keyboard.opened)&&(window.innerHeight == defaultWindowHeight)) {
		keyboard.opened=0
		document.querySelector("#simplex").scrollTo(0,0) //panel opens sometimes due to resizing, so let's just close it every time
		check.exit()
	}
}

window.addEventListener('resize', function(event) {

   // alert(window.innerHeight + " " + defaultWindowHeight)
   if ((!check.toggled)&&(!fullscreenToggling)) {
	   window.location.reload(true)
   }
   keyboard.exit();

  
}, true);


keyboard.open = () => {
		defaultWindowHeight = window.innerHeight
		document.getElementById("memosInput").classList.remove("opacity0")
		document.getElementById("memosInput").classList.add("td5")
		document.getElementById("memosInput").focus();

		inner = () => {
		keyboard.opened = true;
		}

		setTimeout(inner,500)
 
 
}

check = {}
check.toggled = false;

document.querySelector('#memosInput').addEventListener('keypress', function (e) {
	if (e.key === 'Enter') {
	   check.onEnter();
	}
});

check.onEnter = () => {
	 
	mem.check(check.get())
	
	
}
	
check.get = () => {
	return document.querySelector("#memosInput").value

}

check.clear = () => {
	document.querySelector("#memosInput").value = ''

}
check.exit = () => {


document.getElementById("memosInput").classList.remove("td5")
document.getElementById("memosInput").classList.add("opacity0")
 
document.getElementById("memosInput").value = ""
document.getElementById("memosInput").blur();
cards.close()

inititated=false;
document.querySelector("#memosInput").value = "";
document.querySelector("#memosInput").classList.remove("padding")
setTimeout(check.toggle,550)
}

cards = {}
cards.init = () => {

//mem.check time!
//cards.set("Title")
check.justStarted=1;
console.log("!")
mem.check(undefined,cards.set)
 
}

cards.p1 = () => {
	try {
	document.querySelector(".pos4").classList.add("work")
	document.querySelector(".work").classList.remove("pos4")
	document.querySelector(".work").classList.add("pos3")
	document.querySelector(".pos3").classList.remove("work")
	} catch(e) {}
	}
	cards.p2 = () => {
	try {
	document.querySelector(".pos4").classList.add("work")
	document.querySelector(".work").classList.remove("pos4")
	document.querySelector(".work").classList.add("pos2")
	document.querySelector(".pos2").classList.remove("work")
	} catch(e) {}
	}
	
	cards.p3 = () => {
	try {
	document.querySelector(".pos4").classList.add("work")
	document.querySelector(".work").classList.remove("pos4")
	document.querySelector(".work").classList.add("pos1")
	document.querySelector(".pos1").classList.remove("work")
	} catch(e) {}
	}

	cards.call = () => {
	cards.p3();
//cards.set("Title")
setTimeout(cards.p2,100)
setTimeout(cards.p1,200)
	}

cards.insert = (amount) => {
	if (!amount) {
		amount = 1;
	}

	for (var i = 0; i<amount; i++) {
	document.querySelector("#papers").insertAdjacentHTML("afterbegin", " <div class='pos4 card'><div class='table'> <div class='table2'> <div class='cell pad'> <div> </div> </div></div></div></div>");
	}
}
cards.autoSet = () => {
	
	let renderedCard = cardSample.replace("$icon","🇫🇷");
	renderedCard = renderedCard.replace("$title",mem.res.question);
	renderedCard = renderedCard.replace("$subTitle",mem.res.reqFieldName)
	console.log(JSON.stringify(mem.res))
	document.querySelector(".pos4").innerHTML = renderedCard;

	cards.call();

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
fullscreenToggling = 1;
	function toggleFullscreen() {
	 //alert(fullscreenToggling)
  let elem = document.querySelector("html");

  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen();
  }

  function inner() {
	fullscreenToggling=0
	 
  }

  setTimeout(inner,1000)
 
}


cards.color = null;
check.next = (success) => { //Just moves the cards
if (success == undefined) {
	success = 1;
}
if (success) {
	cards.color = "win" //mode
} else {
	cards.color = "wrongcolor"
}
 
	if ((success>0)&&(!mem.nothing)) {
	mem.check(undefined,check.subNext)
	} else {
		check.subNext();
	}
 
}
check.right = () => {
	try {
		document.querySelector(".pos1").classList.add("win")
		} catch(e) {}	
}
check.p1 = () => {
	try {
		document.querySelector(".pos1").classList.add("work")
		document.querySelector(".work").classList.remove("pos1")
		document.querySelector(".work").classList.add("pos0")
		document.querySelector(".work").classList.add(cards.color)
		document.querySelector(".pos0").classList.remove("work")
		} catch(e) {}
}

check.p2 = () => {
	try {
		document.querySelector(".pos2").classList.add("work")
		document.querySelector(".work").classList.remove("pos2")
		document.querySelector(".work").classList.add("pos1")
		document.querySelector(".pos1").classList.remove("work")
		} catch(e) {}
}

check.p3 = () => {
	try {
		document.querySelector(".pos3").classList.add("work")
		document.querySelector(".work").classList.remove("pos3")
		document.querySelector(".work").classList.add("pos2")
		document.querySelector(".pos2").classList.remove("work")
		} catch(e) {}
}

check.p4 = () => {
	try {
		document.querySelector(".pos4").classList.add("work")
		document.querySelector(".work").classList.remove("pos4")
		document.querySelector(".work").classList.add("pos3")
		document.querySelector(".pos3").classList.remove("work")
		} catch(e) {}
}
 
check.p5 = () => {
	document.querySelector("#papers").insertAdjacentHTML("afterbegin", " <div class='pos4 card'></div>");
}
check.subNext = () => {
	 
	 console.log("SUBNEXT INFO")
	 console.log(mem.res)
	cards.set(mem,2)

	
		
		setTimeout(check.p1,50)
		setTimeout(check.p2,100)
		setTimeout(check.p3,150)
		setTimeout(check.p4,200)
		setTimeout(check.p5,250)
		
		setTimeout(cards.rem0,300);
	 
	}
 
cards.rem0 = () => {
	try {
		document.querySelector(".pos0").remove()
		} catch(e){}

}
//document.querySelector(".table").offsetHeight > 100 то пизда (нужно раздеить на 2 карточки)
check.justStarted = 0;
cards.set = (data,pos) => {
	try {
	 
	 
	 
				if (!pos) {
					pos = 4;
					
					
				}
				let renderedCard = null;
				console.log(mem)
				if (!mem.nothing) {
					 
				renderedCard = cardSample.replace("$icon","🇫🇷");
				renderedCard = renderedCard.replace("$title",mem.res.question);
				renderedCard = renderedCard.replace("$subTitle",mem.res.reqFieldName)
			} else {
			    
				renderedCard = cardwin;
				 
				check.win = 1;
			}
				console.log("!" + renderedCard)
				document.querySelector(".pos"+pos).innerHTML = renderedCard;
				
				if (pos==4) {
					cards.call();
				}
			  
			} catch(e) {
				console.log(e)
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
 
check.toggled = 0;

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

if (check.toggled) {
check.toggled = 0;
document.querySelector("#keyboard2").classList.add("donotdisplay")
 
} else {
cards.insert(4)
setTimeout(cards.init,450)
check.toggled = 1;

document.querySelector("#keyboard2").classList.remove("donotdisplay")
 
setTimeout(keyboard.open,800);
document.querySelector("svg").onclick = ''
}
 
document.querySelector("#keyboard").classList.toggle("hidekeyboard")
document.querySelector("#menu").classList.toggle("remove-up")
document.querySelector("#simplex").classList.toggle("remove-down")

if (check.toggled) {
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


if (check.toggled) {
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
	  check.win = 0;
	  check.exit();
	}
  })
  
 