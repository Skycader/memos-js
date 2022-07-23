document.querySelector("#terminal").value = "";
let terminal = {};
terminal.e = document.querySelector("#terminal");
terminal.value = terminal.lastLine = "";
terminal.command = "";
terminal.lock = 2;
terminal.lines = 0;
terminal.historyLength = 1;
terminal.init = () => {
  document.querySelector("#terminal").value = "Memos Terminal v 0.1.5 \n";
  mem.browser(path[path.length - 1]);
};
terminal.run = () => {
   
  terminal.lastLine = terminal.e.value.split("\n")[terminal.e.value.split("\n").length - 1];
  if (terminal.lastLine == '') {
    terminal.e.value =  terminal.e.value.slice(0,-1)
    terminal.run()
  }
};

$("#terminal").on("keyup", function (e) {
  var key = e.keyCode;

  // If the user has pressed enter
  if (key == 13) {
    
    //    terminal.e.value += "New line \n"
   
    // alert(terminal.lastLine)
    if (terminal.lastLine == '') {
        alert(terminal.e.value.split("\n"))
        alert(  terminal.lines)
    }
    mem.terminalCommand(terminal.lastLine)
    
     
    
  } else {
    terminal.run();
  }
});

terminal.init();

/*
 var key = e.keyCode;
    
    // If the user has pressed enter
    if (key == 13) {
        return false;
    }
    else {
        return true;
    }*/
