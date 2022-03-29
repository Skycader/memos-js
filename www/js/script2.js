 
		function hard(){
		window.location.reload(true);
		}
var obj;
var arr;
function save() {
obj = {}
arr = []
obj.id = document.querySelector(".idsearch").value

countfields = document.querySelectorAll(".fieldarea").length;
for (i=0; i<countfields; i++) {
		if (document.querySelectorAll(".fieldarea")[i].value.length>0){
		arr.push(document.querySelectorAll(".fieldarea")[i].value)
		}
}
obj.f = arr;
obj.nr = md(document.querySelector(".nextrepeat").value)
obj.lr = md(document.querySelector(".lastrepeat").value)
//obj.ri = document.querySelectorAll("repeatin").value
//obj.rm = document.querySelectorAll("textarea")[i+3].value
//obj.rl = document.querySelectorAll("textarea")[i+4].value
//obj.ap = document.querySelectorAll("textarea")[i+5].value

textobj = JSON.stringify(obj)

if (obj.id !== "") {
localStorage.setItem(obj.id,textobj)
}
}
var key = ""
function get2(id){
text = localStorage.getItem(id)
if (text) {
obj = JSON.parse(text)
rf = Math.floor(Math.random()*obj.f.length)
length = obj.f[rf].length;
rl = Math.floor(Math.random()*length)
key= (obj.f[rf][rl])
console.log(rf + " " + rl) 
}
}		
function get(){

count=document.querySelectorAll(".field").length
for (i=0; i<count; i++) {
console.log(i)
document.querySelector("#idsearch2").remove()
document.querySelector(".field").remove()
}
count=document.querySelectorAll(".sets").length;
for (var i = 0; i<count; i++) {
document.querySelector(".sets").remove()
}

text = localStorage.getItem(document.querySelectorAll("textarea")[0].value)
if (text) {
obj = JSON.parse(text)


for (var i = 0; i<obj.f.length; i++) {
 
addField(count)
}

for (i=0; i<obj.f.length; i++) {
	document.querySelectorAll(".fieldarea")[i].value = obj.f[i]
}


document.querySelector(".nextrepeat").value = md(1*obj.nr)
document.querySelector(".lastrepeat").value = md(1*obj.lr)
 
 

/*
arr = []
obj.id = document.querySelectorAll("textarea")[0].value
for (i=1; i<=document.querySelectorAll("textarea").length-7; i++) {
		arr.push(document.querySelectorAll("textarea")[i].value)
}
obj.f = arr;
i = document.querySelectorAll("textarea").length-6
obj.rd = document.querySelectorAll("textarea")[i].value
obj.ri = document.querySelectorAll("textarea")[i+1].value
obj.rm = document.querySelectorAll("textarea")[i+2].value
obj.rl = document.querySelectorAll("textarea")[i+3].value
obj.rs = document.querySelectorAll("textarea")[i+4].value
obj.rh = document.querySelectorAll("textarea")[i+5].value

textobj = JSON.stringify(obj)
localStorage.setItem(obj.id,textobj)
*/
}
} 
   
 function auto_grow(element,type) {
 if (type) {
  get()
 } else {
  
	 save()
	}
    element.style.height = "49px";
    element.style.height = (element.scrollHeight-5)+"px";
}
 


  $(".owl-carousel").owlCarousel(
  {items:1,
  touchDrag  : true,
mouseDrag  : true,
  
  dots: false,
  
  });
   document.querySelector(".menu").style=''
   
var ready = false;  
 $(document).ready(function(){
 
	runApp()
  
});

 //setTimeout(initApp,5000)

window.onerror = function(msg, url, linenumber) {
   //Error alert
    //alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
} 

function runApp(){
  try {
   initApp();
   } catch(e) {
   alert(e)}
   }
function initApp() {
 
 
 
   function innerready(){
  // simplex3();
   
   //maxheight = document.querySelector("#simplex").scrollTop    
   d = document;
   d.q = document.querySelector;
  
	
   
   ready=true;
   document.querySelector("#papers").classList.remove("donotdisplay");
  
   
   	if (window.innerWidth > window.innerHeight) {
	document.querySelector("#simplexPadding").classList.remove("verticalSimplex")
		document.querySelector("#simplexPadding").classList.add("horizontalSimplex")
	} else {
	document.querySelector("#simplexPadding").classList.add("verticalSimplex")
		document.querySelector("#simplexPadding").classList.remove("horizontalSimplex")
	}
	
	if (!shouldShow()) {
		document.querySelector("#stat1").classList.add("opacity0")
	} else {
		document.querySelector("#stat1").classList.remove("opacity0")
	}
	
	 normalize()
   adopt(1)
   }
   innerready();
   setTimeout(innerready,1000)
   setTimeout(above,2000)
   
   function above(){
   document.querySelector("#menu").classList.add("aboveAll") 
   }
   }

function adopt(a){

if (a){
 
 document.querySelector("#thatcircle").style.height =$("#thatcircle").height() + 'px' //Клава ебаная 
 document.querySelector("#simplexPadding").style.height =$("#simplexPadding").height() + 'px'
 document.querySelector(".curtain").style.height = $(".curtain").height() + 'px'
 document.querySelector(".curtainPadding").style.height = $(".curtainPadding").height() + 'px'
 
    //document.querySelector("#stats").style.height =$("#stats").height() + 'px'
   } else {
   //document.querySelector("#thatcircle").style.height = "100vh"
//document.querySelector("#stats").style.height = "auto"
   }
   }
 