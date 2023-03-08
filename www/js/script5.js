 
var globalBarAnim = 0;
var interval;

document.addEventListener('mousedown', e => {
   document.querySelector(".bar").classList.remove("bar-anim")
});
document.addEventListener('mouseup', e => {
   document.querySelector(".bar").classList.add("bar-anim")
  
});

document.addEventListener('touchstart', e => {
 interval = setInterval(setBar,10)
 document.querySelector(".bar").classList.remove("bar-anim")
  
    
});
document.addEventListener('touchend', e => {
  setTimeout(clearIntervl,1000)
   
  document.querySelector(".bar").classList.add("bar-anim")
  
});

document.addEventListener('touchmove', e => {
   //setTimeout(setBar,200)
});


document.addEventListener('mousemove', e => {
	setBar()
});
function clearIntervl(){
clearInterval(interval);
}
function addAnim(){
document.querySelector(".bar").classList.add("bar-anim")
}
function removeAnim(){
 
document.querySelector(".bar").classList.remove("bar-anim")
}

 
function setBar(){
var leave;
leave = true;
if ((p()>-1)&&(p()<1)) {
$("#editor").blur()
document.querySelector("#slide-item-"+1).checked = true
leave=false;
}
if ((p()>24)&&(p()<26)) {
 leave=false;
document.querySelector("#slide-item-"+2).checked = true
}
if ((p()>49)&&(p()<51)) {
$("#editor").blur()
document.querySelector("#slide-item-"+3).checked = true
leave=false;
}
if ((p()>74)&&(p()<76)) {
$("#editor").blur()
document.querySelector("#slide-item-"+4).checked = true
leave=false;
}

/*
if (leave) {
document.querySelector("#slide-item-"+1).checked = false
document.querySelector("#slide-item-"+2).checked = false
document.querySelector("#slide-item-"+3).checked = false
document.querySelector("#slide-item-"+4).checked = false

}
*/
document.querySelector(".bar").style = "margin-left: " + p() + "%"
 
}
 function p(){
var a = 25*((-1*(document.querySelector(".owl-stage").style.transform.split("(")[1].split("px")[0]*1))/(document.querySelector(".owl-item").offsetWidth)) 
/*
if (a<-2.8) {
a = -2.8
}
if (a>77.8) {
a = 77.8
}
*/
if (a<0) {
a = 0
}
if (a>75) {
a = 75
}

return a;
}

var t = true;
function goTo(x){

 
//simplex2()
//vibrate(x*100)
//console.log(window.innerWidth + " | " + window.innerHeight)
var a = Math.abs(Math.ceil(p())-x);
 
if ((a==3)||(a==75)) {
 
document.querySelector(".bar").classList.add("bar-anim2")
$('.owl-carousel').trigger('to.owl.carousel', x)
setBar()
  
} else if ((a==2)||(a==22)||(a==50)||(a==74)) {
 
 document.querySelector(".bar").classList.remove("bar-anim2")
document.querySelector(".bar").classList.add("bar-anim3")
$('.owl-carousel').trigger('to.owl.carousel', x)
setBar()
} else
 {
 document.querySelector(".bar").classList.remove("bar-anim2")
document.querySelector(".bar").classList.remove("bar-anim3")
$('.owl-carousel').trigger('to.owl.carousel', x)
setBar()
}
}

 