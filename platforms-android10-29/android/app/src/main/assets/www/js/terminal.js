
let terminal = {};
terminal.e = document.querySelector("#terminalCommands");
terminal.eOutput = document.querySelector("#terminal");
terminal.value = terminal.lastLine = "";
terminal.output = ""
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
  // terminal.eOutput.value = `\n ${terminal.e.value}`
  terminal.lastLine = terminal.e.value.split("\n")[terminal.e.value.split("\n").length - 2];
  terminal.lastTwo = terminal.e.value[terminal.e.value.length-2]+terminal.e.value[terminal.e.value.length-1]
  if (terminal.e.value.indexOf("\n") != -1) {
    terminal.e.value = ""
    mem.terminalCommand(terminal.lastLine)
  }
  
   
};

terminal.focus = () => {
  terminal.e.focus()
}

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
