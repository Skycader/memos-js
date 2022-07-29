 
let scrollHeight = function() {
    return document.querySelector(".page2-node4").scrollHeight - (window.innerHeight-120) - (window.innerHeight-100)

}

$(document).ready(function(){
   
    document.querySelector(".page2-node4").scrollBy(0,100)
 
   

 
})
var scrollInterval;
function clearIfNeeded(){
    

    counti++
   // console.log(document.querySelector(".page2-node4").scrollTop + " " + Date.now())
    document.querySelector("#slide-item-4 span").innerHTML = "interval" + counti
    ;
    console.log(document.querySelector(".page2-node4").scrollTop == scrollHeight())
    if (document.querySelector(".page2-node4").scrollTop == scrollHeight()) {
         
       document.querySelector(".page2-node4").classList.remove("nonScroll")
       counti=0
    } else {
        if (counti<100) {

            setTimeout(clearIfNeeded,10)
        }
        if (counti>100) {
            document.querySelector(".page2-node4").classList.remove("nonScroll")
        }
            
         
      
    }

  
        
}


a = 0;
counti = 0;
currentScroll = 0;
checkScroll = () => {
 if (currentScroll ==  document.querySelector(".page2-node4").scrollTop) {
     document.querySelector(".page2-node4").scrollTop = scrollHeight()
 }
}

let scrollBlocked = 0
function r() {
  
 if (document.querySelector(".page2-node4").scrollTop > scrollHeight()) {
    // document.querySelector("#slide-item-4 span").innerHTML = "touch end"
   //  alert("Touchend")
//  document.querySelector(".page2-node4").classList.add("nonScroll")
if (touchEnd) {
 document.querySelector(".page2-node4").classList.add("nonScroll")
 document.querySelector(".page2-node4").scrollTop = scrollHeight() + 10
 document.querySelector(".page2-node4").classList.remove("nonScroll")
// if ((Date.now()-scrollBlocked)>1000) {
// $(".page2-node4").animate({ scrollTop: scrollHeight()}, 500);
// scrollBlocked=Date.now()
// }

}
 currentScroll =  document.querySelector(".page2-node4").scrollTop
//  setTimeout(checkScroll,20)
 
//  scrollInterval = setInterval(clearIfNeeded, 10)
// setTimeout(clearIfNeeded,10)
 }  
  

}



postCheck = () => {
 r();
}
let touchEnd = false
let scrollEnd = false
function touchEndDetected() {
    touchEnd = true
    r()
}
function touchStartDetected() {
    
    touchEnd = false
}
window.addEventListener('touchstart', touchStartDetected); 
window.addEventListener('touchend', touchEndDetected); 
// window.addEventListener('touchend', r); 
// setInterval(r,600)
var timer = null;
document.querySelector(".page2-node4").addEventListener('scroll', function() {
    if(timer !== null) {
        clearTimeout(timer);        
    }
    timer = setTimeout(function() {
          r()
          console.log("R")
    }, 150);
}, false);