 

function globalScroll(){
document.querySelector("html").classList.toggle("omniflow");
document.querySelector("body").classList.toggle("omniflow");
}

var body = document.getElementsByTagName("BODY")[0];
    var width = body.offsetWidth;
    
    if (window.addEventListener) {  // all browsers except IE before version 9
      window.addEventListener ("resize", onResizeEvent, true);
    } else {
      if (window.attachEvent) {   // IE before version 9
        window.attachEvent("onresize", onResizeEvent);
      }
    }
    
    function onResizeEvent() {
       //callme()
	   //document.querySelector("#papers").classList.toggle("remove-up")
	   if ((ready)&&(globalEx)) {
	   initiate();
	   
	   }
	   
	   	if (window.innerWidth > window.innerHeight) {
	document.querySelector("#simplexPadding").classList.remove("verticalSimplex")
		document.querySelector("#simplexPadding").classList.add("horizontalSimplex")
	} else {
	document.querySelector("#simplexPadding").classList.add("verticalSimplex")
		document.querySelector("#simplexPadding").classList.remove("horizontalSimplex")
	}
	   
    }
	function hideHome(){
		//document.querySelector("#home").classList.add("display-none")
		 
		document.querySelector("#thatcircle").addEventListener('click', toEx); 

	}
document.querySelector("#thatcircle").addEventListener('click', toEx); 

var globalStats = 0;	
 function showStats(){
	 
	globalStats = 1;
	
	
 }
 function disableStats(){
 if (globalStats) {
 globalStats = 0;
 } else {
 toEx();
 }
 }
 
 
 function md(d){
t = typeof(d)
console.log(t)
switch (t) {
    case "undefined": 
        return Date().slice(4,24)
         
        break;
    case "string":
        return Date.parse(d);
        
        break;
    case "number":
        a =  new Date(d).toString().slice(4,24);
        return a;
        
        break;
      
}}
 