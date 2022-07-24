
let terminal = {};
terminal.e = document.querySelector("#terminalCommands");
terminal.value = terminal.lastLine = "";
terminal.command = "";
terminal.lock = 2;
terminal.lines = 0;
terminal.historyLength = 1;
terminal.lastTwo = ""
terminal.init = () => {

  mem.terminalCommand(terminal.lastLine)
  mem.browser(path[path.length - 1]);
};
terminal.run = () => {
  terminal.lastLine = terminal.e.value.split("\n")[terminal.e.value.split("\n").length - 2];
  terminal.lastTwo = terminal.e.value[terminal.e.value.length-2]+terminal.e.value[terminal.e.value.length-1]
  if (terminal.e.value.indexOf("\n") != -1) {
    terminal.e.value = ""
    mem.terminalCommand(terminal.lastLine)
  }
  
   
};

$("#terminalCommands").on("keyup", function (e) {
   
  terminal.run()
 
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
