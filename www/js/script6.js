 
 el = document.querySelector("#simplex")
 el.addEventListener("scroll", simplex, false);
 
$("#simplex").on( "touchstart", aboveAll);
$("#stick").on( "touchstart", aboveAll);

function aboveAll(){
	document.querySelector("#menu").classList.remove("aboveAll") 
 
}
//$("#simplex").on( "touchend", simplex2);
//$("#stick").on( "touchend", simplex2 );

function setTimer(){
setTimeout(simplex3,1000)
}  
 

function simplex(){
 
	
	if (document.querySelector("#simplex").scrollTop>10) {
	document.querySelector("#menu").classList.remove("aboveAll") 
	document.querySelector("#stat1").classList.add("opacity1i")
	//el.removeEventListener("scroll", simplex, false);
		//document.querySelector("#tasktable").classList.remove("hideSimplex")
		document.querySelector("#stat3").classList.remove("hideSimplex")
		document.querySelector("#stat2").classList.remove("hideSimplex")
		document.querySelector("#stick").classList.add("shadowSimplex");
	} else {
	document.querySelector("#menu").classList.add("aboveAll") 
		el.addEventListener("scroll", simplex, false);
		//document.querySelector("#tasktable").classList.add("hideSimplex")
		document.querySelector("#stat3").classList.add("hideSimplex")
		document.querySelector("#stat2").classList.add("hideSimplex")
		 document.querySelector("#stat1").classList.remove("opacity1i")
		document.querySelector("#stick").classList.remove("shadowSimplex");
	}
}

function simplex3(){
var maxTop = 0;
var maxTop2 = 0;
 
			maxTop = document.querySelector("#simplex").scrollTop;
			console.log(maxTop + " " + maxTop2)
			document.querySelector("#simplex").scrollBy(0,1000);
			console.log(maxTop + " " + maxTop2)
			
			function wait(){
			maxTop2 = document.querySelector("#simplex").scrollTop;
			if (maxTop==maxTop2) { document.querySelector("#simplex").scrollBy(0,-1000);  }
			}
			
			setTimeout(wait,100)
	
 
}

var maxheight = null;
function upIt(){
if (document.querySelector("#simplex").scrollTop>=0) {
document.querySelector("#simplex").scrollBy(0,1000000);

}
}
function checkSimplex(){


if (!((document.querySelector("#simplex").scrollTop == 0)||(document.querySelector("#simplex").scrollTop == maxheight))) {
lock = !lock;
simplex2();
clearInterval(checkSimplexInterval);
}
}
function checkSimplex2(){

//console.log(document.querySelector("#simplex").scrollTop)
//console.log(currentPos)
if (document.querySelector("#simplex").scrollTop == currentPos) {
//console.log("NOT MOVING")
checkSimplex()
} else {
//console.log("MOVING")
}
currentPos = document.querySelector("#simplex").scrollTop;
}
var checkSimplexInterval;
var lock = false;
var currentPos = null;
function simplex2(){
	 //document.querySelector("#test").innerHTML = ((!lock)&&(document.querySelector("#simplex").scrollTop>0));
	clearInterval(checkSimplexInterval); 
	function inner() {
	if ((!lock)&&(document.querySelector("#simplex").scrollTop>0)) {
		lock=true;
		document.querySelector("#simplex").scrollBy(0,1000000);
		//console.log("UP")
	} else if (document.querySelector("#simplex").scrollTop < maxheight) {
		lock=false;
		document.querySelector("#simplex").scrollBy(0,-1000000);
		document.querySelector("#menu").classList.add("aboveAll") 
		document.querySelector("#stat1").classList.remove("opacity1i")
		//console.log("DOWN")
	}
	
	}
	
	setTimeout(inner, 50)
	currentPos = document.querySelector("#simplex").scrollTop;
	checkSimplexInterval = setInterval(checkSimplex2,50)
	//checkSimplexInterval = setInterval(checkSimplex,100)
	//setTimeout(checkSimplex,1000)
	 
}
 var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//Make the DIV element draggagle:
//dragElement(document.getElementById("stick"));
//document.querySelector("#stick").addEventListener("touchmove",elementDrag,false)
function lol(){
	alert()
	}
	document.touchstart = lol;
	
function dragElement(elmnt) {
  
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    //document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
	//document.getElementById(elmnt.id + "header").touchstart = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
     elmnt.onmousedown = dragMouseDown;
	 elmnt.touchstart = dragMouseDown;
	 elmnt.addEventListener("touchstart", dragMouseDown, false);
	  
  }

  




}
var first = 1;
 
function dragMouseDown(e) {
    first = 1;
	
	 
   // e = e || window.event;
    //e.preventDefault();
    // get the mouse cursor position at startup:
    //pos3 = e.clientX;
    //pos4 = e.clientY;
	
	pos3 = e.touches[0].clientX;
      pos4 = e.touches[0].clientY;
    //document.onmouseup = closeDragElement;
	document.touchend = closeDragElement;
    // call a function whenever the cursor moves:
    //document.onmousemove = elementDrag;
	document.touchmove = elementDrag; 
	 
	
	
  }
  
    function closeDragElement() {
 
	//alert()
   //closeStats()
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
	
	document.querySelector("#stick").touchend = null;
    document.querySelector("#stick").touchmove = null;
	
	
  }
var downAchieved = true;
var lastMove = 0;
var block = false;
var globalDown = document.querySelector("#stick").offsetTop
//document.querySelector("#stick").style.top = (globalDown) + "px";

//document.querySelector(".iPhone").classList.add("trs")

document.querySelector("#stick").style.height = "110px"
 
//document.querySelector("#stick").style.top = (window.innerHeight-329) + "px";	
//document.querySelector("#stick").style.top = globalDown + "px";	
  function elementDrag2(e) {
  
  //console.log(e.touches[0].clientY)
  if (window.innerHeight <1366) {
    elmnt = document.querySelector("#stick")
	}
   // e = e || window.event;
    //e.preventDefault();
    // calculate the new cursor position:
	 
	//if (e.touches !== undefined) {
	
	 
     pos1 = pos3 - e.touches[0].clientX;
    pos2 = pos4 - e.touches[0].clientY;
   pos3 = e.touches[0].clientX;
      pos4 = e.touches[0].clientY;
	 
	 if (first) {
	
	pos1 = pos3 - e.touches[0].clientX;
    pos2 = pos4 - e.touches[0].clientY;
   pos3 = e.touches[0].clientX;
      pos4 = e.touches[0].clientY;
	  
	  
	 }
	  
	 first = 0;
	 
	 //console.log(pos2)
	//} else {
	// pos1 = pos3 - e.clientX;
    //pos2 = pos4 - e.clientY;
    // pos3 = e.clientX;
     //pos4 = e.clientY;
	//}
	 
    // set the element's new position:
	//console.log((elmnt.offsetTop - pos2))
	//if (globalDown == undefined) {
		//globalDown = elmnt.offsetTop
	//}
	 
	
	//console.log(pos2)
	//var a = 60
	//if (pos2<-a)  { pos2 = 0}
	 
	//if (pos2>a) {pos2 = 0}
	
	//console.log("Pos2: " + pos2)
	//if (!block) {
     elmnt.style.top = (elmnt.offsetTop - pos2) + "px"; //494 -> 335 | 0 -> -159
	//etta = ((etta - pos2) - 335)*-1;
	//elmnt.style.transform = "translateY(" + etta + "px)"
	
	//console.log(etta)
	//}
	 
	 
	if ((elmnt.offsetTop - pos2)<=(window.innerHeight-329)) {
	elmnt.style.top = (window.innerHeight-329) + "px";	
	//console.log("UP")
	

	}
	
	 
	
	//Down:
	if ((elmnt.offsetTop - pos2)>=(globalDown)) {
	//document.querySelector("#menu").classList.add("aboveAll") 
	downAchieved = true;
	//console.log(elmnt.offsetTop - pos2)
	 elmnt.style.top = (globalDown) + "px";

	//elmnt.style.top = "auto"
	 //console.log("Down")
	//console.log("!!!" + document.querySelector("#stick").style.height)
	 
	  document.querySelector("#stick").classList.remove("shadow");
//document.querySelector("#stick").style.height = "110px"	 
	 
	 
	if (shouldShow()) {
 //document.querySelector("#stat1").classList.remove("hideStats")
	 
	 } else {
	 //document.querySelector("#stat1").classList.add("hideStats")
	  
	 }
		 document.querySelector("#stat1").classList.remove("shine")
		  document.querySelector("#stat2").classList.add("hideStats")
	  document.querySelector("#stat3").classList.add("hideStats")
	 document.querySelector("#thedots").classList.add("hideStats")
	
	 
	 
	
	
	
	 
	 
	 
	} else {
	
	//console.log("NOT DOWN")
	//document.querySelector("#menu").classList.remove("aboveAll") 
	
	downAchieved = false;
	 document.querySelector("#stat1").classList.add("shine")
	  document.querySelector("#stat2").classList.remove("hideStats")
	  document.querySelector("#stat3").classList.remove("hideStats")
	  document.querySelector("#thedots").classList.remove("hideStats")
	 // document.querySelector("#stick").style.height = "410px"
	    document.querySelector("#stick").classList.add("shadow");

	
	  //document.querySelector("#stat1").classList.remove("hideStats")
	  
		
	  
	   
	//document.querySelector("#stick").classList.add("transition"); 
	//document.querySelector("html").classList.add("omniflow");
	//document.querySelector("body").classList.add("omniflow");
	 
	 
	}
	
	
	
    //elmnt.style.left = (elmnt.offsetLeft  ) + "px";
  }
 
function normalize(){
	 
 if (shouldShow()) {
 document.querySelector("#stat1").classList.remove("hideStats")
	 
	 } else {
	 document.querySelector("#stat1").classList.add("hideStats")
	  
	 }

	document.querySelector("#stat2").classList.add("hideStats")
	document.querySelector("#stat3").classList.add("hideStats")
	document.querySelector("#thedots").classList.add("hideStats")
	document.querySelector("#thedots").classList.add("hideStats")
    //document.querySelector("#stick").classList.remove("shadow");
	document.querySelector("html").classList.remove("omniflow");
	document.querySelector("body").classList.remove("omniflow");
	//document.querySelector("#stick").style.height = "410px"
		
	 //document.querySelector("#stick").style.height = "110px"
	 //document.querySelector("#stick").style.top = "auto"
	
	//document.querySelector("#stick").style.top = (document.querySelector("#stick").offsetTop) + "px"
	//document.querySelector("#stick").style.height = "410px"
	 
}	
var horizontal = false;
function switchMode2(){
//location.reload();
}
function switchMode(){
 if (shouldShow()) {
 document.querySelector("#stat1").classList.remove("hideStats")
	 
	 } else {
	 document.querySelector("#stat1").classList.add("hideStats")
	  
	 }
	 
//Switch detected?:
	if ((window.innerHeight < window.innerWidth)) {
		//document.querySelector("#stick").classList.remove("shadow");
		horizontal = true; //switchedToAlbumDetected;
		document.querySelector("#stick").style.top = "auto"
		document.querySelector("#stick").style.height = "110px" 
		console.log("toPortrait")
		document.querySelector("#thatcircle").style.height = "100vh"
		//document.querySelector("#thatcircle").style.height =$("#thatcircle").height() + 'px'
		globalDown = document.querySelector("#stick").offsetTop 
		setTimeout(reassignDown,500)
		
		 
		 
	}
	
	if ((window.innerHeight > window.innerWidth)) {
		//document.querySelector("#stick").classList.remove("shadow");
		horizontal = false; //switchedToAlbumDetected;
		document.querySelector("#stick").style.top = "auto"
		document.querySelector("#stick").style.height = "110px" 
		console.log("toAlum")
		document.querySelector("#thatcircle").style.height = "100vh"
		//document.querySelector("#thatcircle").style.height =$("#thatcircle").height() + 'px'
		globalDown = document.querySelector("#stick").offsetTop 
		setTimeout(reassignDown,500)
		
		 
	}
	
}
var width = window.innerWidth
var height = window.innerHeight

function switchMode3(){
if ((window.innerWidth == height)||(window.innerHeight == width)) {
 
}
}

window.addEventListener("orientationchange", function(event) {
window.location.reload(true);
})
	 //window.onresize = function() {normalize()}
	  window.onresize = function() {switchMode3()}
function closeStats(){
 
 
 
//document.querySelector("html").classList.remove("omniflow");
	//document.querySelector("body").classList.remove("omniflow");
	document.querySelector("#stick").style.top = "auto"
	document.querySelector("#stick").style.height = "110px"
	
	
	 
	 
	}
 
function calculateHeight(){
return $("#simplexPadding").height()+$("#stick").height();
}

function shouldShow(){
 
return (calculateHeight()<window.innerHeight) ? true : false} 

function reassignDown(){
		
		document.querySelector("#stick").style.top = "auto"
		document.querySelector("#stick").style.height = "110px"
globalDown = document.querySelector("#stick").offsetTop
//document.querySelector("#stick").classList.remove("shadow");
}

function changeNavigator(){
NavigationBar.backgroundColorByHexString("#ffffff", false);
}

function goWeb(){
window.open("http://www.google.com","_blank")
}

function openEdit(){
 
document.querySelector("#editMenu").scrollBy(0,1000);
d.q("#editMenu").classList.add("aboveAll");
}

function closeEdit() {
document.querySelector("#editMenu").classList.add("remove-left");
//document.querySelector("#menu").classList.add("aboveAll") 
}
  