function allowStats() {
  document.querySelector("#simplex").classList.remove("noScroll");
}

let timerAllow = 0;
function disallowStats() {
  setTimeout(() => {
    let check = document
      .querySelector("#stat2")
      .classList.contains("hideSimplex");
    if (check) {
      document.querySelector("#simplex").classList.add("noScroll");
    }
  }, 1000);
}

let circle = {}
circle.leftBulb = {}
circle.leftBulb.green = () => {
  document.querySelector("#left-bulb").style.fill  = 'rgb(30,255,0)'
  document.querySelector("#left-bulb").style.filter = 'drop-shadow(rgb(30, 255, 0) 0px 0px 2px)'
}
circle.leftBulb.yellow = () => {
  document.querySelector("#left-bulb").style.fill  = 'rgb(255,255,0)'
  document.querySelector("#left-bulb").style.filter = 'drop-shadow(rgb(255, 255, 0) 0px 0px 2px)'
}
circle.leftBulb.orange = () => {
  document.querySelector("#left-bulb").style.fill  = 'rgb(255,128,0)'
  document.querySelector("#left-bulb").style.filter = 'drop-shadow(rgb(255, 128, 0) 0px 0px 2px)'
}
circle.leftBulb.red = () => {
  document.querySelector("#left-bulb").style.fill  = 'rgb(255,0,0)'
  document.querySelector("#left-bulb").style.filter = 'drop-shadow(rgb(255,0, 0) 0px 0px 2px)'
}

circle.rightBulb = {}
circle.rightBulb.green = () => {
  document.querySelector("#right-bulb").style.fill  = 'rgb(30,255,0)'
  document.querySelector("#right-bulb").style.filter = 'drop-shadow(rgb(30, 255, 0) 0px 0px 2px)'
}
circle.rightBulb.yellow = () => {
  document.querySelector("#right-bulb").style.fill  = 'rgb(255,255,0)'
  document.querySelector("#right-bulb").style.filter = 'drop-shadow(rgb(255, 255, 0) 0px 0px 2px)'
}
circle.rightBulb.orange = () => {
  document.querySelector("#right-bulb").style.fill  = 'rgb(255,128,0)'
  document.querySelector("#right-bulb").style.filter = 'drop-shadow(rgb(255, 128, 0) 0px 0px 2px)'
}
circle.rightBulb.red = () => {
  document.querySelector("#right-bulb").style.fill  = 'rgb(255,0,0)'
  document.querySelector("#right-bulb").style.filter = 'drop-shadow(rgb(255,0, 0) 0px 0px 2px)'
}

// $(document).ready(() => {
//   $("#stick").on("touchstart", allowStats);
//   $("#stick").on("touchend", disallowStats);
// });
