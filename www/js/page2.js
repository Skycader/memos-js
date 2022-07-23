/*
let p2n4 = document.querySelector(".page2-node4");
p2n4.addEventListener("scroll", function(e){
    setTimeout(checkP2N4,500)
})

checkP2N4 = () => {
    if (p2n4.scrollTop < 360) {
        p2n4.scrollTo(0,360)
    }
}
*/

$(document).ready(function(){
   
    document.querySelector(".page2-node4").scrollBy(0,100)
 
    let scrollHeight = function() {
        return document.querySelector(".page2-node4").scrollHeight - (window.innerHeight-100) - (window.innerHeight-100)

    }

    a = 0;
   counti = 0;
   currentScroll = 0;
checkScroll = () => {
    if (currentScroll ==  document.querySelector(".page2-node4").scrollTop) {
        document.querySelector(".page2-node4").scrollTop = scrollHeight()
    }
}
function r() {
  
    if (document.querySelector(".page2-node4").scrollTop > scrollHeight()) {
       // document.querySelector("#slide-item-4 span").innerHTML = "touch end"
      //  alert("Touchend")
    document.querySelector(".page2-node4").classList.add("nonScroll")
    document.querySelector(".page2-node4").scrollTop = scrollHeight()
    currentScroll =  document.querySelector(".page2-node4").scrollTop
    setTimeout(checkScroll,20)
    a = setInterval(sc, 10)
    }  else {

    
    setTimeout(postCheck,500)
    }
     
 
}

postCheck = () => {
    r();
}
 
function sc(){
    counti++
   // console.log(document.querySelector(".page2-node4").scrollTop + " " + Date.now())
    //document.querySelector("#slide-item-4 span").innerHTML = "interval" + counti + document.querySelector(".page2-node4").classList.value 
    ;
    if (document.querySelector(".page2-node4").scrollTop == scrollHeight()) {

       document.querySelector(".page2-node4").classList.remove("nonScroll")
     // document.querySelector("#slide-item-4 span").innerHTML = "ACHIVED"
        clearInterval(a)
       
    }

        
}
window.addEventListener('touchend', r);
  
 
  
})

/*
document.getElementById('myID').scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
        });

        */