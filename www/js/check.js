 
function vibrate(){
	window.navigator.vibrate(500)
	}
	
$("#stick").on("click tap touch touchmove touchend touchstart mousedown", function( event ) {
     event.stopPropagation();
    
    
}); 

$("#editMenu").on("click tap touch touchmove touchend touchstart mousedown", function( event ) {
     event.stopPropagation();
    
    
});

function addField(){
if (document.querySelector(".idsearch").value.length > 0) { 
 
b = "<div class='field' style='display: flex; flex-direction: row; justify-content: center; '> <div id='id' class='input' data-text='ID' placeholder='ID' style='height: 59px; font-family: Round; font-size: 25px; text-align: center; width: 285px; color: white; background: #444444' >FIELD "+(Object.keys(document.querySelectorAll(".field")).length+1)+"</div> </div> <div id='idsearch'> <div id='idsearch2' style=' margin: 0 auto; margin-top: 10px; margin-bottom: 10px; border-radius: 10px; width: 285px; border: 3px solid #444444; '> <textarea oninput='auto_grow(this)' class='input fieldarea' id='editor_input' style='font-family: Round; font-size: 25px; padding-top: 10px !important; color: white; width: 100%; background: transparent; border: 0px; outline: none; resize: none; height: 34px; height: 49px; overflow: hidden'></textarea> </div> </div>"


document.querySelector("#idsearch").insertAdjacentHTML("beforeend", b);
 
if ((Object.keys(document.querySelectorAll(".field")).length)==1) {

b = "<div class='sets' style='display: flex; flex-direction: row; justify-content: center; '> <div id='id' class='input' data-text='ID' placeholder='ID' style='height: 59px; font-family: Round; font-size: 25px; text-align: center; width: 285px; color: white; background: #444444' >REPEAT HISTORY</div> </div> <div id='idsearch'> <div class='sets' id='idsearch2' style=' margin: 0 auto; margin-top: 10px; margin-bottom: 10px; border-radius: 10px; width: 285px; border: 3px solid #444444; '> <textarea oninput='auto_grow(this)' class='input history' id='editor' style='font-family: Round; font-size: 25px; padding-top: 10px !important; color: white; width: 100%; background: transparent; border: 0px; outline: none; resize: none; height: 34px; height: 49px; overflow: hidden'></textarea> </div> </div>"
document.querySelector("#plusbuttonmain").insertAdjacentHTML("afterend", b);

b = "<div class='sets' style='display: flex; flex-direction: row; justify-content: center; '> <div id='id' class='input' data-text='ID' placeholder='ID' style='height: 59px; font-family: Round; font-size: 25px; text-align: center; width: 285px; color: white; background: #444444' >FIELD SEQUENCE</div> </div> <div id='idsearch'> <div class='sets' id='idsearch2' style=' margin: 0 auto; margin-top: 10px; margin-bottom: 10px; border-radius: 10px; width: 285px; border: 3px solid #444444; '> <textarea oninput='auto_grow(this)' class='input sequence' id='editor' style='font-family: Round; font-size: 25px; padding-top: 10px !important; color: white; width: 100%; background: transparent; border: 0px; outline: none; resize: none; height: 34px; height: 49px; overflow: hidden'></textarea> </div> </div>"
document.querySelector("#plusbuttonmain").insertAdjacentHTML("afterend", b);

b = "<div class='sets' style='display: flex; flex-direction: row; justify-content: center; '> <div id='id' class='input' data-text='ID' placeholder='ID' style='height: 59px; font-family: Round; font-size: 25px; text-align: center; width: 285px; color: white; background: #444444' >MAX ENDURANCE</div> </div> <div id='idsearch'> <div class='sets' id='idsearch2' style=' margin: 0 auto; margin-top: 10px; margin-bottom: 10px; border-radius: 10px; width: 285px; border: 3px solid #444444; '> <textarea oninput='auto_grow(this)' class='input endurance' id='editor' style='font-family: Round; font-size: 25px; padding-top: 10px !important; color: white; width: 100%; background: transparent; border: 0px; outline: none; resize: none; height: 34px; height: 49px; overflow: hidden'></textarea> </div> </div>"
document.querySelector("#plusbuttonmain").insertAdjacentHTML("afterend", b);

b = "<div class='sets' style='display: flex; flex-direction: row; justify-content: center; '> <div id='id' class='input' data-text='ID' placeholder='ID' style='height: 59px; font-family: Round; font-size: 25px; text-align: center; width: 285px; color: white; background: #444444' >REPEAT EFFICIENCY</div> </div> <div id='idsearch'> <div class='sets' id='idsearch2' style=' margin: 0 auto; margin-top: 10px; margin-bottom: 10px; border-radius: 10px; width: 285px; border: 3px solid #444444; '> <textarea oninput='auto_grow(this)' class='input efficiency' id='editor' style='font-family: Round; font-size: 25px; padding-top: 10px !important; color: white; width: 100%; background: transparent; border: 0px; outline: none; resize: none; height: 34px; height: 49px; overflow: hidden'></textarea> </div> </div>"
document.querySelector("#plusbuttonmain").insertAdjacentHTML("afterend", b);

b = "<div class='sets' style='display: flex; flex-direction: row; justify-content: center; '> <div id='id' class='input' data-text='ID' placeholder='ID' style='height: 59px; font-family: Round; font-size: 25px; text-align: center; width: 285px; color: white; background: #444444' >LAST PING</div> </div> <div id='idsearch'> <div class='sets' id='idsearch2' style=' margin: 0 auto; margin-top: 10px; margin-bottom: 10px; border-radius: 10px; width: 285px; border: 3px solid #444444; '> <textarea oninput='auto_grow(this)' class='input lastping' id='editor' style='font-family: Round; font-size: 25px; padding-top: 10px !important; color: white; width: 100%; background: transparent; border: 0px; outline: none; resize: none; height: 34px; height: 49px; overflow: hidden'></textarea> </div> </div>"
document.querySelector("#plusbuttonmain").insertAdjacentHTML("afterend", b);

b = "<div class='sets' style='display: flex; flex-direction: row; justify-content: center; '> <div id='id' class='input' data-text='ID' placeholder='ID' style='height: 59px; font-family: Round; font-size: 25px; text-align: center; width: 285px; color: white; background: #444444' >AVG PING</div> </div> <div id='idsearch'> <div class='sets' id='idsearch2' style=' margin: 0 auto; margin-top: 10px; margin-bottom: 10px; border-radius: 10px; width: 285px; border: 3px solid #444444; '> <textarea oninput='auto_grow(this)' class='input avgping' id='editor' style='font-family: Round; font-size: 25px; padding-top: 10px !important; color: white; width: 100%; background: transparent; border: 0px; outline: none; resize: none; height: 34px; height: 49px; overflow: hidden'></textarea> </div> </div>"
document.querySelector("#plusbuttonmain").insertAdjacentHTML("afterend", b);

b = "<div class='sets' style='display: flex; flex-direction: row; justify-content: center; '> <div id='id' class='input' data-text='ID' placeholder='ID' style='height: 59px; font-family: Round; font-size: 25px; text-align: center; width: 285px; color: white; background: #444444' >REPEAT LIMIT</div> </div> <div id='idsearch'> <div class='sets' id='idsearch2' style=' margin: 0 auto; margin-top: 10px; margin-bottom: 10px; border-radius: 10px; width: 285px; border: 3px solid #444444; '> <textarea oninput='auto_grow(this)' class='input repeatlimit' id='editor' style='font-family: Round; font-size: 25px; padding-top: 10px !important; color: white; width: 100%; background: transparent; border: 0px; outline: none; resize: none; height: 34px; height: 49px; overflow: hidden'></textarea> </div> </div>"
document.querySelector("#plusbuttonmain").insertAdjacentHTML("afterend", b);

b = "<div class='sets' style='display: flex; flex-direction: row; justify-content: center; '> <div id='id' class='input' data-text='ID' placeholder='ID' style='height: 59px; font-family: Round; font-size: 25px; text-align: center; width: 285px; color: white; background: #444444' >REPEAT MODE</div> </div> <div id='idsearch'> <div class='sets' id='idsearch2' style=' margin: 0 auto; margin-top: 10px; margin-bottom: 10px; border-radius: 10px; width: 285px; border: 3px solid #444444; '> <textarea oninput='auto_grow(this)' class='input repeatmode' id='editor' style='font-family: Round; font-size: 25px; padding-top: 10px !important; color: white; width: 100%; background: transparent; border: 0px; outline: none; resize: none; height: 34px; height: 49px; overflow: hidden'></textarea> </div> </div>"
document.querySelector("#plusbuttonmain").insertAdjacentHTML("afterend", b);


 b = "<div class='sets' style='display: flex; flex-direction: row; justify-content: center; '> <div id='id' class='input' data-text='ID' placeholder='ID' style='height: 59px; font-family: Round; font-size: 25px; text-align: center; width: 285px; color: white; background: #444444' >REPEAT IN</div> </div> <div id='idsearch'> <div class='sets' id='idsearch2' style=' margin: 0 auto; margin-top: 10px; margin-bottom: 10px; border-radius: 10px; width: 285px; border: 3px solid #444444; '> <textarea oninput='auto_grow(this)' class='input repeatin' id='editor' style='font-family: Round; font-size: 25px; padding-top: 10px !important; color: white; width: 100%; background: transparent; border: 0px; outline: none; resize: none; height: 34px; height: 49px; overflow: hidden'></textarea> </div> </div>"
document.querySelector("#plusbuttonmain").insertAdjacentHTML("afterend", b);

 b = "<div class='sets' style='display: flex; flex-direction: row; justify-content: center; '> <div id='id' class='input' data-text='ID' placeholder='ID' style='height: 59px; font-family: Round; font-size: 25px; text-align: center; width: 285px; color: white; background: #444444' >LAST REPEAT</div> </div> <div id='idsearch'> <div class='sets' id='idsearch2' style=' margin: 0 auto; margin-top: 10px; margin-bottom: 10px; border-radius: 10px; width: 285px; border: 3px solid #444444; '> <textarea oninput='auto_grow(this)' class='input lastrepeat' id='editor' style='font-family: Round; font-size: 25px; padding-top: 10px !important; color: white; width: 100%; background: transparent; border: 0px; outline: none; resize: none; height: 34px; height: 49px; overflow: hidden'></textarea> </div> </div>"
document.querySelector("#plusbuttonmain").insertAdjacentHTML("afterend", b);


 b = "<div class='sets' style='display: flex; flex-direction: row; justify-content: center; '> <div id='id' class='input' data-text='ID' placeholder='ID' style='height: 59px; font-family: Round; font-size: 25px; text-align: center; width: 285px; color: white; background: #444444' >NEXT REPEAT</div> </div> <div id='idsearch'> <div class='sets' id='idsearch2' style=' margin: 0 auto; margin-top: 10px; margin-bottom: 10px; border-radius: 10px; width: 285px; border: 3px solid #444444; '> <textarea oninput='auto_grow(this)' class='input nextrepeat' id='editor' style='font-family: Round; font-size: 25px; padding-top: 10px !important; color: white; width: 100%; background: transparent; border: 0px; outline: none; resize: none; height: 34px; height: 49px; overflow: hidden'></textarea> </div> </div>"
document.querySelector("#plusbuttonmain").insertAdjacentHTML("afterend", b);


document.querySelector(".nextrepeat").value = md()
document.querySelector(".lastrepeat").value = md()
}
}

 }
 
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

 

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                
 
function go(){
through([1]);
return 0;
}

function through(ids){
 
if (ids) {


if (localStorage.getItem(ids.join(".")) !== null) {
console.log(ids.join(".") + " : " + localStorage.getItem(ids.join(".")))
through(omni(ids,2))
}
if (localStorage.getItem(ids.join(".")) !== null) {
console.log(ids.join(".") + " : " + localStorage.getItem(ids.join(".")))
through(omni(ids,1))
}
if (localStorage.getItem(ids.join(".")) == null) {

through(omni(ids,0))
}
}
return 0;
}



var time;
var random_letter;
var random_letter_num;
var idcheck;
var random_text;
function question(id) {

if (id == 0) {
random_letter = ""
return "";
}
time = Date.now();
obj = JSON.parse(localStorage.getItem(id));

random_field = Math.floor(Math.random()*obj.f.length);
field_text = obj.f[random_field]
random_letter_num = Math.floor(Math.random()*field_text.length)
random_letter = field_text[random_letter_num]

random_field+=1;
random_letter_num+=1;
console.log(id + "." + random_field + "." + random_letter_num);

idcheck=id;

return (id + "." + random_field + "." + random_letter_num);
}

var lastchecked = Date.now()
function check(ans){
ans = ans.toLowerCase()

if (document.querySelector("#textarea").value.length >= 24) {
	document.querySelector("#textarea").classList.add("padding")
} else {
	document.querySelector("#textarea").classList.remove("padding")
}
if (random_letter != "") {
if (lastchecked < Date.now()-1000) {
lastchecked=Date.now()


//document.querySelector("#textarea").value = "";
	if (ans == random_letter) {
		console.log("RIGHT! " + (Date.now()-time));
		time = null;
		obj.nr = (Date.now()+(Date.now()-obj.lr)*2)
		obj.lr = Date.now();
		localStorage.setItem(idcheck,JSON.stringify(obj));
		document.querySelector("#textarea").value = "";
		
		if (obj.id == document.querySelector(".idsearch").value) {
			get(); //автообновление если вкладка с объектом была открыта
		}
		next();
		return true;
	} else {
		console.log("Wrong!")
		wrong()
		document.querySelector("#textarea").value = "";
		return false;
}	
} else {
document.querySelector("#textarea").value = "";
}
}
}
function timeToRepeat(ids){
 
	if (ids) {


		if (localStorage.getItem(ids.join(".")) !== null) {
			console.log(JSON.parse(localStorage.getItem(ids.join("."))).nr*1);
			if (JSON.parse(localStorage.getItem(ids.join("."))).nr*1 < Date.now()) {
				console.log(ids.join("."))
				return ids.join(".");
			} else {
			timeToRepeat(omni(ids,2))
			}
		}
		if (localStorage.getItem(ids.join(".")) !== null) {
		    console.log(JSON.parse(localStorage.getItem(ids.join("."))).nr*1);
			if (JSON.parse(localStorage.getItem(ids.join("."))).nr*1 < Date.now()) {
				console.log(ids.join("."))
				return ids.join(".");
			} else {
			timeToRepeat(omni(ids,1))
			}
		}
		if (localStorage.getItem(ids.join(".")) == null) {

		timeToRepeat(omni(ids,0))
		}
		}
		
	return 0;
}


var globalSearch = [];
var globalPart = [];
var countFound = 0;
var lastFound = 0;

function find(data,limit = 5200000,part=0){
globalSearch = [];
countFound = 0;
	var a = Date.now();
	
 
 
	if (!part) {
	search([1],data,limit);
	
	} else {
		if (!lastFound) {
		lastFound = "";
		}
		var arr = lastFound.split(".")
		arr.push(1);
		
		search(arr,data,limit);	
	}
	lastFound = globalSearch[globalSearch.length-1]
	 
	console.log("Time spent: " + (Date.now()-a) + " ms.");
	return globalSearch;
	 
	 
}
//Сделать limit внутри
//Сделать вывод end вннутри
//Сделать складирвание найденышей внутри аргумента
function search(ids=[1],data="0",limit=5200000){

if ((ids)&&((countFound < limit))) {

if (localStorage.getItem(ids.join(".")) !== null) {
if (localStorage.getItem(ids.join(".")).toLowerCase().includes(data.toLowerCase())) {
if (countFound < limit) {
globalSearch.push(ids.join("."))
countFound++;
}
}
search(omni(ids,2),data,limit)
}
if (localStorage.getItem(ids.join(".")) !== null) {
if (localStorage.getItem(ids.join(".")).toLowerCase().includes(data.toLowerCase())) {
if (countFound < limit) {
globalSearch.push(ids.join("."))
countFound++;
}
}
search(omni(ids,1),data,limit)
}
if (localStorage.getItem(ids.join(".")) == null) {
 
search(omni(ids,0),data,limit)

}
}
return globalSearch;
}

function omni(x,d){
if (d==1){
if (x[x.length-1]) {x[x.length-1]++}else{x[x.length]=1}
}

if (d==2) {
x[x.length] = 1;
}
if (d==0) {
if (x.length-1>0){
x.pop();
x[x.length-1]++
} else {
return null;
}
}

return x;
} 

var keyboardOpened = null;
function openKeyboard(){
keyboardOpened = Date.now();
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


function exitCheck(){
 
document.getElementById("textarea").classList.remove("td5")
document.getElementById("textarea").classList.add("opacity0")
 
document.getElementById("textarea").value = ""
document.getElementById("textarea").blur();
closeCards()

inititated=false;
document.querySelector("#textarea").value = "";
document.querySelector("#textarea").classList.remove("padding")
setTimeout(toEx,550)
}

function initCards(){

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
setTimeout(p2,100)
setTimeout(p1,200)
}

function closeCards(){
$(".pos00").remove();
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

p1()
setTimeout(p2,35)
setTimeout(p3, 65)
 
 
}
var globalEx = 0;
function toEx(){

document.querySelector("#papers").insertAdjacentHTML("afterbegin", " <div class='pos4 card'><div class='table'> <div class='table2'> <div class='cell pad'> <div> </div> </div></div></div></div>");
document.querySelector("#papers").insertAdjacentHTML("afterbegin", " <div class='pos4 card'><div class='table'> <div class='table2'> <div class='cell pad'> <div></div> </div></div></div></div>");
document.querySelector("#papers").insertAdjacentHTML("afterbegin", " <div class='pos4 card'><div class='table'> <div class='table2'> <div class='cell pad'> <div></div> </div></div></div></div>");
document.querySelector("#papers").insertAdjacentHTML("afterbegin", " <div class='pos4 card'><div class='table'> <div class='table2'> <div class='cell pad'> <div> </div> </div></div></div></div>");

next(1)

if ((p()==0)&&(downAchieved==true)) {
closeStats()

if (globalEx) {
globalEx = 0;
document.querySelector("#keyboard2").classList.add("donotdisplay")

} else {
setTimeout(initCards,450)
globalEx = 1;
document.querySelector("#keyboard2").classList.remove("donotdisplay")
setTimeout(openKeyboard,250);
document.querySelector("svg").onclick = ''
}

 
/*
if (globalEx) {
	setTimeout(hideHome,500);
	
} else {
	document.querySelector("#home").classList.remove("display-none")
}
*/
//document.querySelector("#papers").classList.toggle("remove-up")

document.querySelector("#keyboard").classList.toggle("hidekeyboard")
document.querySelector("#menu").classList.toggle("remove-up")
document.querySelector("#simplex").classList.toggle("remove-down")

if (globalEx) {
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


if (globalEx) {
document.querySelector("html").classList.toggle("omniflow");
document.querySelector("body").classList.toggle("omniflow");
} else {
	setTimeout(globalScroll,500);
}
 

document.querySelector("#thatcircle").classList.toggle("omniscale");
 }
}

	 
 