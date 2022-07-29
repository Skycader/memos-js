method = null; //methods like need, set, get ... etc.
var db = openDatabase("MEMODB", "1.0", "OBJECTS DATABASE", null);
db.transaction(function (tx) {
  //rDATA - repeatition DATA; lrepeat - last repeat unix time; dur - duration;
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS OBJECTS (ID unique, PID, DATA, RDATE, LREPEAT, SPEC)"
  ); //PID - PARENT ID
  tx.executeSql("CREATE TABLE IF NOT EXISTS DIRS (ID unique, PID, DATA)");
  tx.executeSql("CREATE TABLE IF NOT EXISTS MEMOROUTES (ID unique, DATA)");
  tx.executeSql("CREATE TABLE IF NOT EXISTS HISTORY (ID unique, DATA)");
});

//The executeSql method is the following: executeSql(sqlStatement, arguments, callback, errorCallback)

/*
db.transaction(function(tx) {
  tx.executeSql('INSERT INTO contacts(firstname,lastname,phonenumber) VALUES (?,?,?)',[inputFirstName,inputLastName,
   inputPhoneNumber], 
  function(tx) {
    //Success callback get executed if the INSERT statement worked well
    //Get the last contact we just added and dynamically add it to the table displaying the contacts
  });
});
*/

sql = (query, callback, error, arg1, arg2, arg3) => {
  console.log("sql called: ", query);
  mem.query = query;
  db.transaction(function (tx) {
    // console.log(tx)
    tx.executeSql(
      query,
      [],

      function (tx, results) {
        //console.log(tx)
        //console.log(query)
        //console.log(results)

        try {
          callback(results.rows);
        } catch (e) {}

        try {
          // notify(results.rows[0],callback)
        } catch (e) {
          console.log(e);
        }
      },
      function (tx, results) {
        console.log(results, "ERROR");
        error(arg1, arg2, arg3);
      }
    );
  });
};

let mem = {};

mem.list = [];
mem.dirList = [];
mem.idList = [];

mem.dropList = () => {
  mem.list = [];
  mem.dirList = [];
  mem.idList = [];
};
mem.collect = () => {
  sql(
    `SELECT ID, PID, DATA, RDATE, LREPEAT, SPEC FROM OBJECTS WHERE RDATE < '${Date.now()}' LIMIT 10`,
    mem.collectCallback
  );
};

mem.collectCallback = (res) => {
  // mem.list = []
  // mem.idList = []
  // mem.dirList = []
  for (var i = 0; i < res.length; i++) {
    if (mem.idList.indexOf(res[i].ID) == -1) {
      //console.log(mem.list.indexOf(res[i]))
      //console.log("pushing")
      //console.log(res[i])
      mem.list.push(res[i]);
      mem.idList.push(res[i].ID);
      mem.getDirInfo(res[i].PID);
    } else {
      console.log("Already in");
    }
  }

  /*
  for (var i = 0; i < mem.list.length; i++) {
    mem.list[i].DIRID = mem.list[i].PID; //mem.getDir(mem.list[i].ID);
    mem.getDirInfo(i, mem.list[i].DIRID);
    console.log("123");
  }
  */
};

mem.getDirInfo = (dirid) => {
  try {
    sql(`SELECT DATA FROM DIRS WHERE ID = '${dirid}'`, mem.getDirInfoCallback);
  } catch (e) {
    console.log(e);
  }
};
mem.getDirInfoCallback = (res) => {
  try {
    console.log("res:", res[0]);
    mem.dirList.push(res[0].DATA);
  } catch (e) {
    console.log(e);
  }
};

mem.answered = 0; //move forward in a list of files to answer

mem.define = (increment) => {
  if (increment) {
    mem.answered++;
  }
  let DATA;
  let SPEC;
  mem.res.obj = mem.list[mem.answered];
  if (mem.res.obj) {
    mem.res.dir = mem.dirList[mem.answered];
    DATA = JSON.parse(mem.res.obj.DATA);
    SPEC = JSON.parse(mem.res.obj.SPEC);
    let result = mem.linker(SPEC); //calculate links, meaning what field is asked and which field is considered as answer
    let index = result[0];
    mem.res.obj.SPEC = JSON.stringify(result[1]);

    let question = DATA[index[0]];

    mem.res.question = question;
    console.log("Question: " + question);
    let dirData = JSON.parse(mem.res.dir);
    console.log("dirData", dirData);
    //console.log(requestedFieldName)
    let reqFieldName = dirData[1][index[1]];
    console.log("REQ: ", dirData[1][index[1]]);
    mem.res.reqFieldName = reqFieldName;
    console.log(reqFieldName);
    let rightAnswer;

    rightAnswer = DATA[index[1]];
    mem.rightAnswer = rightAnswer;
  } else {
    console.log("No more objects to repeat");
    mem.nothing = 1;
  }
};

mem.ask = (pos) => {
  mem.define()
  cards.set(pos);
};

mem.answered = 0
mem.answer = (answerIsCorrect) => {
  mem.maxRightSymbols = 0
  mem.answered = 1
  if (answerIsCorrect) {
    console.log("OK");

    mem.code = 1; //code OK

    let diff = Date.now() - mem.res.obj.LREPEAT * 1;
    console.log("Different in hours: " + diff / 1000 / 60 / 60);

    diff = 2 * diff + Date.now() + 10 * 1000;
    let repeatIn = diff - Date.now();
    repeatIn = repeatIn / 1000 / 60 / 60;
    console.log("New RDATE: " + new Date(diff));
    console.log(`Repeat in ${repeatIn} hours`);
    mem.update("RDATE", diff, "ID", mem.res.obj.ID);
    mem.update("LREPEAT", Date.now(), "ID", mem.res.obj.ID);

    console.log("SPEC: ", mem.res.obj.SPEC);
    mem.update("SPEC", mem.res.obj.SPEC, "ID", mem.res.obj.ID);
     
  } else {
    mem.update("RDATE", Date.now(), "ID", mem.res.obj.ID);
    mem.update("LREPEAT", Date.now(), "ID", mem.res.obj.ID);
    console.log("ZEROING FILE");
    mem.code = 0;
  }

  
  mem.collect();
  mem.define(1)
  check.next(mem.code);
};

mem.focus = (focus) => {
  if (focus) {
    let save =  document.querySelector("#memosInput").innerHTML
    document.querySelector("#memosInput").innerHTML = ""
    document.querySelector("#memosInput").focus()
    document.querySelector("#memosInput").innerHTML = save
  } else {
    document.querySelector("#memosInput3").focus()
  }
}

mem.maxRightSymbols = 0
mem.percentage = 0
mem.progress = 0
mem.check = (answer) => {
  answer = answer.replaceAll("&nbsp;"," ")

  
  
  answer = answer.replaceAll("</div>", "").split("<div>");
  answer = answer.map((item) => item.replaceAll("&nbsp;", " "));

  let rightSymbols = 0;
  let block = 0
  for (var i = 0; i < answer.length; i++) {
    for (var j = 0; j < answer[i].length; j++) {
        if (answer[i][j] != mem.rightAnswer[0][i][j]) {
          block=1
        } else {
          if (!block)
          rightSymbols++
        }
        if ((!block)&&(answer.join("").length == mem.rightAnswer[0].join("").length)&&( (i+1) == answer.length) && ((j+1) == answer[i].length)) {
          mem.answer(1)
        }
    }
    if (rightSymbols>mem.maxRightSymbols) {
      document.querySelector(".cardTimer").classList.remove("timerStarted")
      clearTimeout(cards.timeout)
      setTimeout(()=>{
        document.querySelector(".cardTimer").classList.add("timerStarted")
        cards.startTimer()
      },500)
      
       
    mem.maxRightSymbols = rightSymbols
    }
    mem.percentage = rightSymbols/mem.rightAnswer[0].join("").length
    document.querySelector(".progressBar").style.width = mem.percentage*100 + "%"
  }
};

mem.checkWAS = (answer) => {
  answer = answer.replaceAll("&nbsp;","")
  console.log(answer.length, " ", check.answerLength)
  if (answer.length > check.answerLength) {
    check.answerLength = answer.length;
    check.event = 1
    console.log("++")
  } else if (answer.length == check.answerLength) {
      console.log("==")
      check.answerLength = answer.length;
      check.event=1
      check.mistaken=0
  } else 
   {
    check.answerLength = answer.length;
    check.event = -1
    console.log("--")
    if (check.answerLength<check.mistakenPoint) {
      block=0
      check.mistaken = 0
    }
  }
  
  if ((check.event==1)&&(!check.mistaken)) {
  answer = answer.replaceAll("</div>", "").split("<div>");
  answer = answer.map((item) => item.replaceAll("&nbsp;", " "));

  let countSymbols = 0;
  let block = 0
  for (var i = 0; i < answer.length; i++) {
    for (var j = 0; j < answer[i].length; j++) {
      countSymbols++;
      if (answer[i] != "<br>") {
        //there is a <br> tag on empty <enter>
        console.log(i, j, "[",answer[i][j], "] [", mem.rightAnswer[0][i][j],"]");
        if (answer[i][j] != mem.rightAnswer[0][i][j]) {
          // check.mistakes += 1;
           
          // check.mistaken=1
          // check.mistakenPoint = check.answerLength
          // // mem.focus(0)
          // // setTimeout(mem.focus,1000,1)
          // block=1
          // console.log("MISTAKES: ", check.mistakes);

          // check.wrong();
          // if (check.mistakes == 4) {
          //   check.mistakes = 0;
          //   check.mistaken=0
          //   check.answerLength = 0
          //   // check.blocked=1
          //   setTimeout(function(){
          //     check.blocked=0
          //   },1500)
          //   mem.answer(0);
          // }
        }
      }
      console.log(":", ((answer.join("").length == mem.rightAnswer[0].join("").length)&&( (i+1) == answer.length) && ((j+1) == answer[i].length)))
      if ((!block)&&(answer.join("").length == mem.rightAnswer[0].join("").length)&&( (i+1) == answer.length) && ((j+1) == answer[i].length)) {
        check.mistakes = 0;
        check.answerLength = 0
        // check.blocked=1
        //     setTimeout(function(){
        //       check.blocked=0
               
        //     },1500)
        mem.answer(1);
      }
      
    }
  }
}


};

mem.query = null;
mem.test = () => {
  console.log("test");
};
//sql("SELECT ID FROM OBJECTS LIMIT 1") //warmup db so its shown in panel

FIELDsSample = {
  0: "Original",
  1: "Transcription",
  2: "Translation",
};

OBJexp = { 1: "Un renard", 2: "A fox" };
mem.res = {};
mem.res.obj = 0;
mem.res.sample = 0;
mem.res.question = null;
mem.res.rightAnswer = null;
mem.res.reqFieldName = null;
mem.code = null;
mem.nothing = null;
notify = (res, callback) => {
  //notify is called any time sql is called
  if (!method) {
    try {
      callback(res);
    } catch (e) {}
  }
  if (method == "update") {
    try {
      //alert()
      console.log("update called");
      callback(res);
      // mem.res=res;
    } catch (e) {}
  }
  if (method == "when") {
    console.log(res);
    mem.res = res;
    try {
      callback(res);
    } catch (e) {}
  }
  if (method == "get") {
    try {
      callback(res);
    } catch (e) {}
    mem.res = res;
  }

  if (method == "ask2") {
    mem.res.dir = res;

    method = null; //nullificate method, so it's not checked next sql request

    console.log(mem.res);
    let DATA = JSON.parse(mem.res.obj.DATA);
    let SPEC = JSON.parse(mem.res.obj.SPEC);
    console.log("SPEC: ", SPEC);
    let index = mem.linker(SPEC); //calculate links, meaning what field is asked and which field is considered as answer
    //index looks like this [n,m], where n and m are numbers from 0 to N,M (integers)
    //n -> answer field
    //m -> question field, this needs to be taken from structure table by sql query
    // [DIR] n [data] ---> m [type]
    //example: [FRENCH] un renard -> [translation] would be [1,3] as linker

    //console.log("INDEX: " + index)
    console.log(index);
    let question = DATA[index[0]];
    mem.res.question = question;
    console.log("Question: " + question);
    let dirData = JSON.parse(mem.res.dir.DATA);
    //console.log(requestedFieldName)
    let reqFieldName = dirData[1][index[1] - 1];
    mem.res.reqFieldName = reqFieldName;
    console.log("REQ:", reqFieldName);
    let rightAnswer;
    let answerIsCorrect;
    if (answer) {
      console.log("DATA");
      console.log(DATA[index[1]]);
      try {
        rightAnswer = DATA[index[1]];
        answerIsCorrect = answer.toLowerCase() == rightAnswer.toLowerCase();
      } catch (e) {
        rightAnswer = DATA[index[1]];
        console.log("ARRAY DETECTED");
        rightAnswer = rightAnswer.map(function (e) {
          return e.toLowerCase();
        });

        /*
         const lower = arr.map(element => {
         return element.toLowerCase();
         });
         */

        answer = answer.toLowerCase();
        answerIsCorrect = rightAnswer.indexOf(answer) > -1 ? true : false;
      }
    }
    mem.res.rightAnswer = rightAnswer;
    try {
      callback(mem);
    } catch (e) {}

    //console.log("Right answer: " + rightAnswer)
    if (answer) {
      //if there's any answer provided, then check, else just show question

      if (answerIsCorrect) {
        console.log("OK");
        mem.code = 1; //code OK
        console.log(rightAnswer.indexOf(answer) > -1 ? true : false);
        console.log(rightAnswer);
        console.log(answer);
        console.log(mem.res);
        console.log(mem.res.obj.LREPEAT);

        let diff = Date.now() - mem.res.obj.LREPEAT * 1;
        console.log("Different in hours: " + diff / 1000 / 60 / 60);

        diff = 2 * diff + Date.now();
        console.log("New RDATE: " + new Date(diff));
        mem.update("RDATE", diff, "ID", mem.res.obj.ID);

        SPEC = JSON.stringify(SPEC);
        mem.update("SPEC", SPEC, "ID", mem.res.obj.ID);

        //mem.get(res.ID)
        check.clear();

        function inner() {
          //alert()
          //check.next(mem.code)
        }
      } else {
        check.wrong();
        console.log(rightAnswer.indexOf(answer) > -1 ? true : false);
        console.log(rightAnswer);
        console.log(answer);
        console.log("BAD");
      }
      ask = null;

      answer = null;
    }

    if (mem.code != 0) {
      check.right();
      setTimeout(check.next, 200, mem.code);

      //check.next(mem.code);
      mem.code = 0;
    }
  }
  if (method == "ask") {
    mem.code = 0;
    console.log("ASK");

    if (res) {
      mem.nothing = 0;
      //res is argument given for notify by sql as a result
      console.log("RES:");
      console.log(res);

      if (!mem.res) {
        mem.res = {};
      }
      alert();
      mem.res.obj = res;

      if (mem.res) {
        check.justStarted = 0;
      }
      console.log(mem.res.obj);

      mem.check2(res, callback);
    } else {
      mem.nothing = 1;
      console.error("No objects to repeat");
      console.log(mem.res);
      console.log("No objects to repeat");
      method = null;

      if (check.justStarted == 0) {
        check.next(-1);
      } else {
        check.justStarted = 0;
      }

      try {
        callback();
      } catch (e) {}
    }
  }

  return res;
};

let answer = null;

mem.when = (id) => {
  method = "when";
  if (!id) {
    sql(
      `SELECT ID, DATA, MIN(RDATE) AS RDATE, LREPEAT, SPEC FROM OBJECTS LIMIT 1`,
      mem.when2
    );
  }
};

const zeroPad = (num, places) => String(num).padStart(places, "0");

mem.when2 = (res) => {
  if (res[0]) {
    date = new Date(res[0].RDATE * 1);
    console.log(date);
    timeLeft = (res[0].RDATE * 1 - Date.now()) / 1000;
    if (timeLeft < 0) {
      timeLeft = 0;
    }
    daysLeft = Math.floor(timeLeft / 60 / 60 / 24); //ok
    hoursLeft = Math.floor((timeLeft - daysLeft * 60 * 60 * 24) / 60 / 60);
    minutesLeft = Math.floor(
      (timeLeft - daysLeft * 60 * 60 * 24 - hoursLeft * 60 * 60) / 60
    );
    if ((timeLeft>0)&&(timeLeft<60)) {
      minutesLeft = 1
    }
    let result = `${zeroPad(daysLeft, 2)}:${zeroPad(hoursLeft, 2)}:${zeroPad(
      minutesLeft,
      2
    )}`;
    console.log(result);
    document.querySelector("#info1").innerHTML = result;
  }
};

mem.calcRepeat = (date) => {
  timeLeft = (date * 1 - Date.now()) / 1000;
  if (timeLeft < 0) {
    timeLeft = 0;
  }
  console.log(timeLeft);
  daysLeft = Math.floor(timeLeft / 60 / 60 / 24); //ok
  hoursLeft = Math.floor((timeLeft - daysLeft * 60 * 60 * 24) / 60 / 60);
  minutesLeft = Math.floor(
    (timeLeft - daysLeft * 60 * 60 * 24 - hoursLeft * 60 * 60) / 60
  );
  let result = `${zeroPad(daysLeft, 2)}:${zeroPad(hoursLeft, 2)}:${zeroPad(
    minutesLeft,
    2
  )}`;
  return result;
};
mem.when();
setInterval(mem.when, 60000);
/*
mem.check = (ans, callback, debug) => {
  //First part of check to find an object in need of repeat
  if (debug) {
    sql(
      `SELECT ID, DATA, RDATE, LREPEAT, SPEC FROM OBJECTS WHERE ID = "${debug}"`,
      callback
    );
  } else {
    //sql(`SELECT ID, DATA, RDATE, LREPEAT, SPEC FROM OBJECTS WHERE RDATE < '${Date.now()}' LIMIT 1`,callback)
  }
  method = "ask";
  answer = ans;
};
*/
mem.count = () => {
  sql(
    `SELECT COUNT(ID) FROM OBJECTS WHERE RDATE < '${Date.now()}'`,
    mem.count2
  );
};

mem.count2 = (data) => {
  console.log(data);
};

mem.getDir = (string) => {
  // return string.split(".").slice(0,2).join(".");
  //return string.split(":")[0]
  return (
    string.split(":")[0].split(".").slice(0, 1).join(".") +
    ":" +
    string.split(":")[0].split(".")[1]
  );
};
/*
mem.check2 = (res, callback) => {
  console.log("DIR RES");
  console.log(res);
  let DIRID = mem.getDir(res.ID);
  console.log("DIRID" + DIRID);
  sql(`SELECT DATA FROM DIRS WHERE ID = '${DIRID}'`, callback);
  method = "ask2";
};
*/

mem.drop = () => {
  sql("DROP TABLE OBJECTS");
  sql("DROP TABLE DIRS");
  sql("DROP TABLE MEMOROUTES");
  sql("DROP TABLE HISTORY");
};

mem.addExample = () => {
  mem.addDir("/", [
    ["FRE", "FRENCH"],
    ["Original", "Transcription", "Translation"],
  ]);
  mem.add(G_ID, ["Un renard", ["А рынар", "123"], "A fox"]);
  // mem.add("1.1:2",["Le temps",["Лю тон","123"],"The time"])
  // mem.add("1.1:3",["Le ciel",["Лю сьель","123"],"The sky"])
};
let ITEM_G_COUNT = 0;
mem.setItem = function (PID, DATA, SPEC) {
  ID = makeid(6);
  console.log(arguments);
  var RDATE = Date.now() + 0 * 60 * 1000;
  var LREPEAT = Date.now();
  if (ITEM_G_COUNT < 1000) {
    ITEM_G_COUNT++
    sql(
      `INSERT INTO OBJECTS (ID,PID, DATA, RDATE, LREPEAT, SPEC) VALUES ("${ID}","${PID}",'${DATA}',"${RDATE}", "${LREPEAT}", "${SPEC}")`,
      undefined,
      mem.setItem,
      PID,
      DATA,
      SPEC
    );
  } else {
    alert("CANNOT GENERATE UNIQUE ID");
  }
  //sql(`SELECT ID FROM OBJECTS WHERE ID = '${ID}'`);
};

let G_PID = 0;
let G_DATA = "";
let G_ID = "";
let G_COUNT = 0;
mem.setDir = (PID, DATA) => {
  //data string type
  let ID = makeid(6);
  G_ID = ID;
  G_PID = PID;
  G_DATA = DATA;
  G_COUNT++;
  //let ID = "tZNZZV"
  if (G_COUNT < 1000) {
    sql(
      `INSERT INTO DIRS (ID, PID, DATA) VALUES ("${ID}", "${G_PID}", '${G_DATA}')`,
      undefined,
      mem.setDir,
      PID,
      DATA
    );
  } else {
    alert("CANNOT GENERATE UNIQUE ID");
  }
};

mem.addDir = (PID, ARRAY) => {
  //array type
  mem.setDir(PID, JSON.stringify(ARRAY));
};

mem.get = (ID) => {
  method = "get";
  sql(`SELECT * FROM OBJECTS WHERE ID = '${ID}'`);
};

mem.find = (DATA) => {
  sql(`SELECT * FROM OBJECTS WHERE DATA like '%${DATA}%'`);
};

mem.need = (LIMIT) => {
  if (!LIMIT) {
    LIMIT = 1;
  }
  sql(
    `SELECT ID, DATA FROM OBJECTS WHERE DATE < '${DATA.now()}' LIMIT ${LIMIT}`
  );
};

mem.update = (FIELD, DATA, CON1, CON2, callback) => {
  method = "update";
  sql(
    `UPDATE OBJECTS SET ${FIELD} = '${DATA}' WHERE ${CON1} = '${CON2}'`,
    callback
  );
};

//Memos item is a lexical unit
//Memos advice: always write down sententes or phrases and never just words alone
mem.itemExample = [
  //field 1
  [
    //Meaning 1
    [["Line 1", "Line 2", "Line 3"]],
    //Possible Meaning 2
    [["A dog"]],
  ],
  [],
];

//a = [ [["a cat","a dog"]], [["кошка","собака"]] ]

mem.itemExample2 = [[["a cat"]], [["кот"]]];
//ID: @String,
//ArRAY: @Array
mem.addItem = (ID, ARRAY) => {
  let DATA = {};
  let SPEC = [[], []];

  for (var i = 0; i < ARRAY.length; i++) {
    DATA[i] = ARRAY[i];
    SPEC[0].push([]);
  }

  DATA = JSON.stringify(DATA);
  console.log(DATA)
  SPEC = JSON.stringify(SPEC);

  if (ARRAY.length > 1) {
    mem.setItem(ID, DATA, SPEC);
  }
};

mem.rem = (ID) => {
  sql(`DELETE FROM OBJECTS WHERE ID = '${ID}'`);
};

mem.move = (type, ID1, ID2) => {
  if (type) {
    //if dir
    sql(`UPDATE DIRS SET PID = "${ID2}" WHERE ID = "${ID1}"`);
  } else {
    sql(`UPDATE OBJECTS SET PID = "${ID2}" WHERE ID = "${ID1}"`);
  }
};

mem.sync = (ID1, ID2) => {
  //syncronize ids of dirs and objects
};

mem.cutId = 0;
mem.cut = (number) => {
  if (number < mem.objectsStartAt) {
    type = 1;
    mem.cutId = browserCache[0][number + 1];
    console.log(mem.cut.id);
  } else {
    type = 0;
  }
};
mem.rmdir = (ID) => {
  //1: set dir data field with ID specified to NULL
  //2: set all subdir data fields to NULL
  //remove all objects from the dir specified
  //remove dir cell specified
  //call function again, if not ID specified first step is skipped

  //return objects of a dir where data = ? (null presumably)
  //sql(`SELECT * FROM DIRS INNER JOIN OBJECTS ON DIRS.ID=OBJECTS.PID WHERE DIRS.DATA='[["GRA","GRAMMAR"],["RULE","MEANING"]]'`,console.log)
  //return subdirs of a dir where data = ? (null presumably)
  //sql(`SELECT * FROM DIRS WHERE PID = (SELECT PID FROM DIRS WHERE DATA = '[["GRA","GRAMMAR"],["RULE","MEANING"]]')`,console.log)

  if (ID) {
    //if ID specified
    sql(`UPDATE DIRS SET DATA = 'NULL' where ID = '${ID}'`); //step 1
    mem.rmdir();
  } else {
    sql(
      `UPDATE DIRS SET DATA = 'NULL' WHERE PID IN (SELECT ID FROM DIRS WHERE DATA = 'NULL')`
    ); //step 2

    sql("SELECT DATA FROM DIRS WHERE DATA = 'NULL'", mem.rmdir2);
    // sql(`DELETE FROM OBJECTS WHERE PID = NULL`)
    // sql(`UPDATE DIRS SET DATA = NULL where PID = NULL`, mem.rmdir);
  }
};

let rmLength = 0;
let rmLength2 = 0;
mem.rmdir2 = (res) => {
  console.log("res:", res);
  if (res.length > rmLength) {
    rmLength = res.length;
    mem.rmdir();
  } else {
    sql(
      `DELETE FROM OBJECTS WHERE PID IN (SELECT ID FROM DIRS WHERE DATA = 'NULL')`
    );
    sql(`DELETE FROM DIRS WHERE DATA = 'NULL'`);
    mem.browser(path[path.length - 1]);
  }
};
//MEMOS SPEC STANDART (MSS)
//Array index stays for field number 1;
//Array data stands for fields that has been asked with its index id field
//Example: index 1 has 1,2 means 1:1 and 1:2 has already been linked and asked;
//SPEC[1] stands for limitations, such as 0 - nothing should be asked with 0. no 0:1 nor 0:*, nor *:0.
//* stands for any field.

mem.linker = (SPEC) => {
  let result = mem.sublinker(SPEC);

  console.log("RESULT: ", result);
  //console.log(result)
  if (result) {
    return result;
  } else {
    for (var i = 0; i < SPEC[0].length; i++) {
      SPEC[0][i] = [];
    }
    console.log("SPEC: ", SPEC);

    return mem.linker(SPEC);
  }
};
mem.sublinker = (SPEC) => {
  for (var i = 0; i < SPEC[0].length; i++) {
    for (var j = 0; j < SPEC[0].length; j++) {
      //console.log(i != j , SPEC[1].indexOf(i) == -1 , SPEC[1].indexOf(j) == -1)
      if (i != j && SPEC[1].indexOf(i) == -1 && SPEC[1].indexOf(j) == -1) {
        if (SPEC[0][i].indexOf(j) == -1) {
          //console.log([i,j])
          SPEC[0][i].push(j);

          return [[i, j], SPEC];
        }
      }
    }
  }
  return null;
};

mem.listDirObj = (DIRID) => {
  sql(`SELECT * FROM DIRS WHERE ID LIKE "${DIRID}:%"`, console.log);
  sql(`SELECT * FROM OBJECTS WHERE ID LIKE "${DIRID}:%"`, console.log);
};

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

mem.show = (DIRID, callback) => {
  sql(`SELECT * FROM DIRS WHERE PID = "${DIRID}" ORDER BY DATA`, callback);
  sql(`SELECT * FROM OBJECTS WHERE PID = "${DIRID}" ORDER BY RDATE`, callback);
};

let browserCache = [];
let browserString = "";
let choice = 0;
let counter = 0;
let path = ["/"];
let pathNames = [];
mem.browser = (goTo) => {
  mem.when();
  counter = 0;
  cached = 0;
  browserCache = [];
  browserString = "";
  if (goTo == undefined) {
    goTo = "/";
  }

  mem.show(goTo, mem.setCache);
  mem.collect();
};
let cached = 0;
mem.objectsStartAt = 0;
mem.cacheCalled = 0;
let quit = false;
mem.terminalHelpMessage = ""
mem.setCache = (data) => {
  mem.dropList();
  cached++;
  browserCache.push(data);
  console.log("BrowserCache: ", browserCache);
  if (cached == 2) {
    mem.cacheCalled++;
    for (let i = 0; i < browserCache[0].length; i++) {
      counter++;
      browserString +=
        counter +
        ": " +
        JSON.parse(browserCache[0][i].DATA)[0] + //diricon and name
        "/" +
        JSON.parse(browserCache[0][i].DATA)[1] + //fields
        "\n";
    }

    mem.objectsStartAt = counter + 1;
    for (let i = 0; i < browserCache[1].length; i++) {
      counter++;
      browserString +=
        counter +
        ": " +
        browserCache[1][i].DATA +
        "/" +
        mem.calcRepeat(browserCache[1][i].RDATE) +
        "\n"; //files data
    }

    if (browserString == "") {
      browserString = "Nothing here yet";
    }
    if (!mem.terminalHelpMessage.length) {
    document.querySelector(
      "#terminal"
    ).value = `Memos Terminal v 0.1.5 \n${pathNames}\n${browserString}\n`;
    } else {
      document.querySelector(
        "#terminal"
      ).value = `Memos Terminal v 0.1.5 \n ${mem.terminalHelpMessage}`;
      mem.terminalHelpMessage = ""
    }

    //help
    /*
      cd -  go to dir (cd .. to go back);  
        mkdir - create dir;  
        touch - create file;  
        edit - edit (number);  
        cut/paste - cut/paste number  
        rm (dir/file) - delete; 
        exit - exit 
        */
    // quit=false
    // choice = prompt(
    //   "Current path: " + pathNames.join("/") + "\n" + browserString
    // );

    // command = choice.split(" ")[0];
    // terminal.e.value += browserString + "\n"
    // command = terminal.lastLine.split(" ")[0]
    // choice = terminal.lastLine
  }
};

mem.terminalHelp = () => {
  mem.terminalHelpMessage = `
  List of commands available at the moment:
  1. Create a directory: mkdir [["<icon>","<dir name>"],["field 1","field 2","field n"]]
  2. Create a file: touch [ [["Line 1","Line 2","Line n"],["Possible second meaning"] ]], 
     [["<Second field]] ]
  An easier example: [ [["Le chat"]], [["The cat"]] ]
  3. Remove directory: rm dir <number of a directory> (numbers are displayed by each line)
  4. Remove file: rm file <number>
  5. Go between directories: cd <number>
  6. Go up level: cd ..
  7. Restore previous command: --
  8. Show directories and files in current directory: ls (usually autamically)
  8. Print this message: help
  `
}

mem.terminalChoice = ""
mem.terminalCommand = (choice) => {
  if (pathNames.length == 0) {
    pathNames[0] = "/";
  }
  // alert(choice)
  command = choice.split(" ")[0];
  switch (command) {
    //0: list content
    case "ls":
      // mem.browser(path[path.length - 1]);
      break;
      //restore previous command
    case "--":
      document.querySelector("#terminalCommands").value = mem.terminalChoice;
      break;
    case "help":
      mem.terminalHelp();
      break;
    //1: going around
    case "cd":
      if (choice.split(" ")[1] == "..") {
        path.pop();
        if (path.length == 0) {
          path.push("/");
        }
        pathNames.pop();
        mem.browser(path[path.length - 1]);
      } else {
        newChoice = 1 * choice.split(" ")[1] - 1;
        DIRID = browserCache[0][newChoice].ID;

        path.push(DIRID);

        pathNames.push(JSON.parse(browserCache[0][newChoice].DATA)[0][1]);
        // mem.browser(DIRID);
        mem.browser(path[path.length - 1]);
        break;
      }
      break;

    //2: make dir
    case "mkdir":
      try {
        let DATA;
        [, ...DATA] = choice.split(" ");
        DATA = DATA.join(" ");

        if (path.length == 0) {
          path.push("/");
        }
        console.log("DATA: ", DATA);
        mem.addDir(path[path.length - 1], JSON.parse(DATA));
        // mem.browser(path[path.length - 1]);
      } catch (e) {
        console.log(e);
      }
      break;

    case "touch":
      // choice = choice.replace("'", '"');
      try {
      let [, ...DATA] = choice.split(" ");
      DATA = DATA.join(" ");
      mem.addItem(path[path.length - 1], JSON.parse(DATA));
      } catch(e) {console.warn(e)}
      break;

    case "rm":
      if (choice.split(" ")[1] == "file") {
        FILID = 1 * choice.split(" ")[2] - 1 - browserCache[0].length;
        UNIQUID = browserCache[1][FILID].ID;
        mem.rem(UNIQUID);
        // mem.browser(path[path.length - 1]);
      }
      if (choice.split(" ")[1] == "dir") {
        DIRID = browserCache[0][1 * choice.split(" ")[2] - 1].ID;
        mem.rmdir(DIRID);
        // mem.browser(path[path.length - 1]);
      }
      break;
    case "q":
      path = [];
      pathNames = [];
      quit = true;
      break;
    default:
    // mem.browser(path[path.length - 1]);
  }
  mem.browser(path[path.length - 1]);
  mem.terminalChoice = choice;
};
setInterval(mem.collect, 10000);
mem.collect(); //collect items to repeat

/* Examples:
sql("INSERT INTO OBJECTS (ID, DATA, repeat, dir) VALUES ('2.3','DATA',10,'main')")
sql("INSERT INTO LOGS (ID, log) VALUES (3, 'three')")
*/
