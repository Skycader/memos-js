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

    const scrollHeight = 860+window.innerHeight;
    a = 0;
function r() {
    if (document.querySelector(".page2-node4").scrollTop > scrollHeight) {
    document.querySelector(".page2-node4").classList.add("nonScroll")
    document.querySelector(".page2-node4").scrollTop = scrollHeight
    a = setInterval(sc,10)
    }

    
  
}

function sc(){
    if (document.querySelector(".page2-node4").scrollTop == scrollHeight) {

          document.querySelector(".page2-node4").classList.remove("nonScroll")
        clearInterval(a)
    }
    
}
window.addEventListener('touchend', r);
 
})