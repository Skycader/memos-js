//Manipulating viewport stuff here

const ШDEFAULT = 'width=device-width, initial-scale=1, user-scalable=no, shrink-to-fit=no'

var viewport = document.querySelector("meta[name=viewport]");

let FREEZE = () => {
    viewport.setAttribute("content", viewport.content + ", height=" + window.innerHeight);
}

let UNFREEZE = () => {
    viewport.setAttribute("content", DEFAULT);
}