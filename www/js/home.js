let home;

function wrong() {
	document.querySelector(".pos1").classList.add("wrong")
	document.querySelector(".pos1").classList.add("wrongcolor")
	function inner(){
	document.querySelector(".pos1").classList.remove("wrong")
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

	function paper(){
	
	try {
document.querySelector(".pos1").classList.add("work")
document.querySelector(".work").classList.remove("pos1")
document.querySelector(".work").classList.add("pos0")
document.querySelector(".work").classList.add("win")
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


document.addEventListener("keydown", function(event) {
  if (event.which == 27) {
	  //escape key
	exitCheck()
  }
})

//document.querySelector(".table").offsetHeight > 100 то пизда (нужно раздеить на 2 карточки)

function next(type){
		
		if (type) {
				qst = question(timeToRepeat([1]))
				if (qst) {
				document.querySelector(".pos4").innerHTML = cardid.replace("$id",qst)
				} else {
					document.querySelector(".pos4").innerHTML = cardwin;
				}
		} else {
						qst = question(timeToRepeat([1]))
				if (qst) {
				document.querySelector(".pos2").innerHTML = cardid.replace("$id",qst)
				} else {
					document.querySelector(".pos2").innerHTML = cardwin;
				}
		paper();
		}
		}
var inititated = false;
function initiate(){

		if (!inititated) {
		//next();
		inititated=true;
		firststart=true;
		//alert("removed");
		
		
		
		
		} else {
		//alert("added");
		if ( (Date.now() - 1000) > keyboardOpened) {
		exitCheck();
		}
		
		}
}
	
cardwin = " <div class='forpicture'><img src='assets/medal.svg'></div> <div class='table'> <div class='table2'> <div class='cell prepare0'> <div class='prepare'>All complete!</div> <div class='prepare2'> <div class='prepare3'> <p class='tip'>Pay us a visit in 3 hours.</p> </div> </div> </div> </div> </div> "	

cardid= "<div class='table'> <div class='table2'> <div class='cell pad'> <div> $id </div> </div></div></div> "
cardid2 = "<div class='pos4 card'><div class='table'> <div class='table2'> <div class='cell pad'> <div> $id </div> </div></div></div></div>"
 