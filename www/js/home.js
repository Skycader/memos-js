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

// $(document).ready(() => {
//   $("#stick").on("touchstart", allowStats);
//   $("#stick").on("touchend", disallowStats);
// });
