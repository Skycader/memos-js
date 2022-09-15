// method = null; //methods like need, set, get ... etc.
var db = openDatabase("MEMODB", "1.0", "OBJECTS DATABASE", null);
db.transaction(function (tx) {
  //rDATA - repeatition DATA; lrepeat - last repeat unix time; dur - duration;
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS OBJECTS (ID unique, PID, DATA, RDATE, LREPEAT, SPEC)"
  ); //PID - PARENT ID
  tx.executeSql("CREATE TABLE IF NOT EXISTS DIRS (ID unique, PID, DIRDATA)");
  tx.executeSql("CREATE TABLE IF NOT EXISTS MEMOROUTES (ID unique, DATA)");
  tx.executeSql("CREATE TABLE IF NOT EXISTS HISTORY (ID unique, DATA)");
  // tx.executeSql("ALTER TABLE DIRS RENAME COLUMN DIRDATA TO DATA;")
  // tx.executeSql("ALTER TABLE OBJECTS RENAME TO ITEMS ")
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
  // console.log("sql called: ", query);
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

var mem = {};

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
    // `SELECT * FROM OBJECTS  LEFT JOIN DIRS ON OBJECTS.PID=DIRS.ID AND 1*RDATE < ${Date.now()} LIMIT 10`,
    `SELECT OBJECTS.ID, OBJECTS.DATA, RDATE, LREPEAT, SPEC, DIRS.DATA AS DIRDATA FROM OBJECTS JOIN DIRS ON OBJECTS.PID=DIRS.ID AND 1*RDATE < ${Date.now()} LIMIT 10`,
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

      // mem.getDirInfo(res[i].PID);
    } else {
      // console.log("Already in");
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

mem.getDirById = (dirid,callback) => {
  sql(`SELECT * FROM DIRS WHERE ID = '${dirid}'`, callback);
}
mem.getDirInfo = (dirid) => {
  try {
    sql(`SELECT DATA FROM DIRS WHERE ID = '${dirid}'`, mem.getDirInfoCallback);
  } catch (e) {
    console.log(e);
  }
};
mem.getDirInfoCallback = (res) => {
  try {
    // console.log("res:", res[0]);
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
    // mem.res.dir = mem.dirList[mem.answered];
    mem.res.dir = mem.list[mem.answered].DIRDATA;
    DATA = JSON.parse(mem.res.obj.DATA);
    SPEC = JSON.parse(mem.res.obj.SPEC);

    let result = mem.linker(SPEC); //calculate links, meaning what field is asked and which field is considered as answer
    let index = result[0];
    mem.res.obj.result = result;
    // mem.res.obj.SPEC = JSON.stringify(result[1]);

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
  mem.define();
  cards.set(pos);
};

mem.answered = 0;
mem.blockAnswer = 0;
mem.answer = (answerIsCorrect) => {
  if (!mem.blockAnswer) {
    mem.blockAnswer = 1;
    document.querySelector(".cardTimer").classList.add("no-trunsition");
    document.querySelector(".cardTimer").classList.remove("timerStarted");
    document.querySelector(".cardTimer").classList.remove("no-trunsition");

    if (answerIsCorrect) {
      console.log("OK");

      mem.code = 1; //code OK

      let diff = Date.now() - mem.res.obj.LREPEAT * 1;
      console.log("Different in hours: " + diff / 1000 / 60 / 60);

      if (answerIsCorrect != 0.5) {
        diff = 2 * diff + Date.now() + 10 * 1000;
      } else {
        diff = diff + Date.now() + 10 * 1000;
      }
      let repeatIn = diff - Date.now();
      repeatIn = repeatIn / 1000 / 60 / 60;
      console.log("New RDATE: " + new Date(diff));
      console.log(`Repeat in ${repeatIn} hours`);
      mem.update("RDATE", diff, "ID", mem.res.obj.ID);
      mem.update("LREPEAT", Date.now(), "ID", mem.res.obj.ID);
      mem.res.obj.SPEC = JSON.stringify(mem.res.obj.result[1]);
      mem.update("SPEC", mem.res.obj.SPEC, "ID", mem.res.obj.ID);
    } else {
      mem.update("RDATE", Date.now(), "ID", mem.res.obj.ID);
      mem.update("LREPEAT", Date.now(), "ID", mem.res.obj.ID);
      console.log("ZEROING FILE");
      mem.code = 0;
    }

    mem.collect();

    mem.define(1);
    check.next(mem.code);
    setTimeout(() => {
      mem.blockAnswer = 0;
    }, 1000);
  }
  //end of mem.answer
};

mem.focus = (focus) => {
  if (focus) {
    let save = document.querySelector("#memosInput").innerHTML;
    document.querySelector("#memosInput").innerHTML = "";
    document.querySelector("#memosInput").focus();
    document.querySelector("#memosInput").innerHTML = save;
  } else {
    document.querySelector("#memosInput3").focus();
  }
};

mem.maxRightSymbols = 0;
mem.percentage = 0;
mem.progress = 0;
mem.userAnswer = "";
mem.check = (answer) => {
  // answer = answer.replaceAll("&nbsp;", " ");
  answer = answer.replaceAll("&gt;", ">");
  answer = answer.replaceAll("&lt;", "<");
  answer = answer.replaceAll("&amp;", "&");

  answer = answer.replaceAll("<br>", "");

  answer = answer.replaceAll("<div>","\n")
  answer = answer.replaceAll("</div>","")
  mem.userAnswer = answer;

  answer = answer.replaceAll("</div>", "").split("<div>");
  answer = answer.map((item) => item.replaceAll("&nbsp;", " "));
  console.log(answer)
  if (answer == "/right") {
    check.next(1);
  }
  if (answer == "/same") {
    mem.answer(0.5);
  }
  if (answer == "/wrong") {
    check.next(0);
  }
  if (answer == "/skip") {
    mem.answered++;
    check.next(0.5);
  }

  let rightSymbols = 0;
  let block = 0;
  for (var i = 0; i < answer.length; i++) {
    for (var j = 0; j < answer[i].length; j++) {
      if (
        answer[i][j].toLowerCase() != mem.rightAnswer[0][i][j].toLowerCase()
      ) {
        block = 1;
        mem.mistake = 1;
      } else {
        if (!block) rightSymbols++;
      }
      if (
        !block &&
        answer.join("").length == mem.rightAnswer[0].join("").length &&
        i + 1 == answer.length &&
        j + 1 == answer[i].length
      ) {
        if (!cards.animation) {
          mem.answer(1);
        } else {
          document.querySelector(".pos1").classList.add("win");
          setTimeout(() => mem.answer(1), 1000);
        }
      }
    }
    if (rightSymbols > mem.maxRightSymbols) {
      document.querySelector(".cardTimer").classList.remove("timerStarted");

      setTimeout(() => {
        cards.initTimer();
      }, 500);

      mem.maxRightSymbols = rightSymbols;
    }
    mem.percentage = rightSymbols / mem.rightAnswer[0].join("").length;
    document.querySelector(".progressBar").style.width =
      mem.percentage * 100 + "%";
    if (block) {
      document.querySelector(".progressBar").style.background = "red";
    } else {
      document.querySelector(".progressBar").style.background = "";
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

OBJexample = { 1: "Un renard", 2: "A fox" };
mem.res = {};
mem.res.obj = 0;
mem.res.sample = 0;
mem.res.question = null;
mem.res.rightAnswer = null;
mem.res.reqFieldName = null;
mem.code = null;
mem.nothing = null;

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
    // console.log(date);
    timeLeft = (res[0].RDATE * 1 - Date.now()) / 1000;
    if (timeLeft < 0) {
      timeLeft = Math.abs(timeLeft);
    }
    daysLeft = Math.floor(timeLeft / 60 / 60 / 24); //ok
    hoursLeft = Math.floor((timeLeft - daysLeft * 60 * 60 * 24) / 60 / 60);
    minutesLeft = Math.floor(
      (timeLeft - daysLeft * 60 * 60 * 24 - hoursLeft * 60 * 60) / 60
    );
    if (timeLeft > 0 && timeLeft < 60) {
      minutesLeft = 1;
    }
    let result = `${zeroPad(daysLeft, 2)}:${zeroPad(hoursLeft, 2)}:${zeroPad(
      minutesLeft,
      2
    )}`;
    // console.log(result);
    document.querySelector("#info1").innerHTML = result;
  }
};

mem.convertHMS = (seconds) => {
  timeLeft = seconds;
  if (timeLeft < 0) timeLeft = 0;
  daysLeft = Math.floor(timeLeft / 60 / 60 / 24); //ok
  hoursLeft = Math.floor((timeLeft - daysLeft * 60 * 60 * 24) / 60 / 60);
  minutesLeft = Math.floor(
    (timeLeft - daysLeft * 60 * 60 * 24 - hoursLeft * 60 * 60) / 60
  );

  return `${zeroPad(daysLeft, 2)}:${zeroPad(hoursLeft, 2)}:${zeroPad(
    minutesLeft,
    2
  )}`;
};

mem.calcRepeat = (date) => {
  timeLeft = (date * 1 - Date.now()) / 1000;
  if (timeLeft < 0) {
    timeLeft = 0;
  }
  // console.log(timeLeft);
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

mem.circleData = (update) => {
  let res = `${mem.todayAnsweredResult} | ${mem.countResult} | ${mem.countDailyResult}`;
  if (
    mem.todayAnsweredResult != undefined &&
    mem.countResult != undefined &&
    mem.countDailyResult != undefined
  )
    document.querySelector("#info2").innerHTML = res;
  let percentage = Math.floor(
    ((mem.countTotalResult * 1 - mem.countResult * 1) / mem.countTotalResult) *
      1 *
      100
  );
  if (!isNaN(percentage) && Math.abs(percentage) != Infinity) {
    document.querySelector("#info3").innerHTML = percentage;
    document.querySelector("#info4").innerHTML = mem.memoPowerResult;
    document.querySelector("#info5").innerHTML = mem.countTotalResult2;
    if (percentage > 0) {
      document.querySelector("#mycircle").classList.remove("hidden");
    } else {
      document.querySelector("#mycircle").classList.add("hidden");
    }
  }
  document.querySelector("#mycircle").style["stroke-dasharray"] =
    percentage + ", 100";
  if (update) {
    mem.todayAnswered();
    mem.countDaily();
    mem.countTotal();
    mem.count();
    mem.memoPower();
  }
};

mem.countTotalResult = 0;
mem.countTotal = () => {
  sql(`SELECT COUNT(ID) FROM OBJECTS`, mem.countTotal2);
};
mem.countTotalResult2 = "";
mem.countTotal2 = (data) => {
  let toRepeat = data[0]["COUNT(ID)"];
  // console.log(toRepeat);
  let result = zeroPad(toRepeat, 3);
  mem.countTotalResult = result;
  mem.countTotalResult2 = numberWithCommas(zeroPad(result, 9), ".");
  mem.circleData();
};

mem.memoPowerResult = 0;
mem.memoPower = () => {
  sql("SELECT SUM(RDATE-LREPEAT) FROM OBJECTS", mem.memoPower2);
};

mem.memoPower2 = (data) => {
  let res = data[0]["SUM(RDATE-LREPEAT)"];

  res = 1 * res;

  let result = Math.floor(res / 1000 / 60 / 60);
  result = zeroPad(result, 9);
  result = numberWithCommas(result, " · ");
  mem.memoPowerResult = result;
  mem.circleData();
};

function numberWithCommas(num, sep) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

mem.count = () => {
  sql(
    `SELECT COUNT(ID) FROM OBJECTS WHERE 1*RDATE < ${Date.now()}`,
    mem.count2
  );
};

mem.count2 = (data) => {
  let toRepeat = data[0]["COUNT(ID)"];
  // console.log(toRepeat);
  let result = zeroPad(toRepeat, 3);
  mem.countResult = result;
  mem.circleData();
};

function getNewDay(arg = 0) {
  let h = new Date();
  let hours = h.getHours();
  let minutes = h.getMinutes();
  let seconds = h.getSeconds();
  let res =
    Date.now() -
    hours * 60 * 60 * 1000 -
    minutes * 60 * 1000 -
    seconds * 1000 +
    arg * 24 * 60 * 60 * 1000;
  return res;
}

mem.countDaily = () => {
  sql(
    `SELECT COUNT(ID) FROM OBJECTS WHERE 1*RDATE < ${getNewDay(
      1
    )} AND 1*RDATE > ${Date.now()}`,
    mem.countDaily2
  );
};

mem.todayAnswered = () => {
  sql(
    `SELECT COUNT(ID) FROM OBJECTS WHERE (1*LREPEAT > ${getNewDay(
      0
    )}) AND (1*RDATE != 1*LREPEAT)`,
    mem.todayAnswered2
  );
};

mem.todayAnsweredResult = 0;
mem.todayAnswered2 = (data) => {
  let toRepeat = data[0]["COUNT(ID)"];
  // console.log(toRepeat);
  let result = zeroPad(toRepeat, 3);
  mem.todayAnsweredResult = result;
  mem.circleData();
};

mem.countDailyResult = 0;
mem.countDaily2 = (data) => {
  let toRepeat = data[0]["COUNT(ID)"];
  // console.log(toRepeat);

  let result = zeroPad(toRepeat, 3);
  mem.countDailyResult = result;
  mem.circleData();
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
let INFORM_ERROR = 0;
mem.setItem = function (PID, DATA, SPEC) {
  ID = makeid(6);
  console.log(arguments);
  var RDATE = Date.now() + 0 * 60 * 1000;
  var LREPEAT = Date.now();
  if (ITEM_G_COUNT < 1000) {
    ITEM_G_COUNT++;
    sql(
      `INSERT INTO OBJECTS (ID,PID, DATA, RDATE, LREPEAT, SPEC) VALUES ("${ID}","${PID}",'${DATA}',"${RDATE}", "${LREPEAT}", "${SPEC}")`,
      undefined,
      mem.setItemError,
      PID,
      DATA,
      SPEC
    );
  } else {
    alert("CANNOT GENERATE UNIQUE ID");
  }
  //sql(`SELECT ID FROM OBJECTS WHERE ID = '${ID}'`);
};

mem.setItemError = (e) => {
  alert("Error: ", e);
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

mem.get = (ID,callback) => {
  //get
  sql(
    `SELECT OBJECTS.ID, OBJECTS.DATA, RDATE, LREPEAT, SPEC, DIRS.DATA AS DIRDATA FROM OBJECTS JOIN DIRS ON OBJECTS.PID=DIRS.ID AND OBJECTS.ID='${ID}'`,
    callback
  );
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
  try {
    let DATA = {};
    let SPEC = [];
    DATA = ARRAY;
    for (var i = 0; i < ARRAY.length; i++) {
      SPEC.push([]);
    }

    DATA = JSON.stringify(DATA);
    console.log(DATA);
    SPEC = JSON.stringify(SPEC);

    if (ARRAY.length > 1) {
      mem.setItem(ID, DATA, SPEC);
    } else {
      throw new Error("Too small");
    }
  } catch (e) {
    alert("Error: ", e);
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
  console.log(`mem.sublinker(${SPEC})`);
  console.log("RESULT: ", result);
  //console.log(result)
  if (result) {
    return result;
  } else {
    for (var i = 0; i < SPEC.length; i++) {
      SPEC[i] = [];
    }
    console.log("SPEC: ", SPEC);

    return mem.sublinker(SPEC);
    console.log(`mem.linker(${SPEC})`);
  }
};
mem.sublinker = (SPEC) => {
  //@SPEC array of arrays [[],[]]
  //i symbols the 1st field and the numbers inside (j) are field it was asked with
  for (var i = 0; i < SPEC.length; i++) {
    for (var j = 0; j < SPEC.length; j++) {
      if (i != j) {
        if (SPEC[i].indexOf(j) == -1) {
          SPEC[i].push(j);

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

mem.editItem = (ID, DATA, callback) => {

  sql(`UPDATE OBJECTS SET DATA = '${DATA}' WHERE ID = '${ID}'`, callback);
  ARRAY = JSON.parse(DATA);
  let SPEC = [];
  for (let i = 0; i < ARRAY.length; i++) {
    SPEC.push([]);
  }
  SPEC = JSON.stringify(SPEC);
  sql(`UPDATE OBJECTS SET SPEC = '${SPEC}' WHERE ID = '${ID}'`, callback);
};
mem.editDir = (ID, DATA, callback) => {
  sql(`UPDATE DIRS SET DATA = '${DATA}' WHERE ID = '${ID}'`, callback);
};

mem.moveItem = (ID, PID, callback) => {
  sql(`UPDATE OBJECTS SET PID = '${PID}' WHERE ID = '${ID}'`, callback);
};
mem.moveDir = (ID, PID, callback) => {
  sql(`UPDATE DIRS SET PID = '${PID}' WHERE ID = '${ID}'`, callback);
};
mem.cutFile = () => {};

mem.cutDir = () => {};

mem.pasteFile = () => {};

mem.pasteDir = () => {};

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
mem.terminalHelpMessage = "";
mem.setCache = (data) => {
  mem.dropList();
  cached++;
  browserCache.push(data);
  // console.log("BrowserCache: ", browserCache);
  if (cached == 2) {
    mem.cacheCalled++;
    for (let i = 0; i < browserCache[0].length; i++) {
      counter++;
      let diriconName;
      try {
        // diriconName = JSON.parse(browserCache[0][i].DATA)[0]
        diriconName = browserCache[0][i].DATA;
      } catch (e) {
        console.log(e);
        diriconName = "Unable to parse dir";
      }
      let fields;
      //     try {
      //  fields = JSON.parse(browserCache[0][i].DATA)[1]
      //   } catch(e) {
      //     fields = "Unable to parse fields"
      //   }
      browserString +=
        counter +
        ": " +
        diriconName + //diricon and name
        "\n";
    }

    mem.objectsStartAt = counter + 1;
    for (let i = 0; i < browserCache[1].length; i++) {
      memPower = mem.convertHMS(
        (browserCache[1][i].RDATE * 1 - browserCache[1][i].LREPEAT * 1) / 1000
      );

      counter++;
      browserString +=
        counter +
        ": " +
        browserCache[1][i].DATA +
        "\n Repeat in: " +
        mem.calcRepeat(browserCache[1][i].RDATE) +
        "\n Interval: " +
        memPower +
        "\n SPEC: " + //files data
        browserCache[1][i].SPEC +
        "\n";
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
      mem.terminalHelpMessage = "";
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
  browser.render();
};

mem.terminalHelp = () => {
  mem.terminalHelpMessage = `
  List of commands available at the moment:
  - Create a directory: mkdir [["<icon>","<dir name>"],["field 1","field 2","field n"]]
  - Create a file: touch [ [["Line 1","Line 2","Line n"],["Possible second meaning"] ]], 
     [["<Second field]] ]
  An easier example: [ [["Le chat"]], [["The cat"]] ]
  - Edit file/dir: edit <dir/file> <number> <data>
    An example: edit file 3 [ [["A cat"]],[["Un chat"]]]
    An example: edit dir 2 [["FRE","FRENCH"],["Original","Translation","Transcription"]]
  - Remove directory: rm dir <number of a directory> (numbers are displayed by each line)
  - Remove file: rm file <number>
  - Go between directories: cd <number>
  - Go up level: cd ..
  - Restore previous command: --
  - Show directories and files in current directory: ls (usually autamically)
  - Print this message: help
  `;
};

mem.terminalChoice = "";
mem.terminalCommand = (choice) => {
  ITEM_G_COUNT = 0;
  if (pathNames.length == 0) {
    pathNames[0] = "/";
  }
  // alert(choice)
  command = choice.split(" ")[0].toLowerCase();
  switch (command) {
    //0: list content
    case "ls":
      // mem.browser(path[path.length - 1]);
      break;
    case "ls -b":
      // mem.browser(path[path.length - 1]);
      break;
    case "/clear": //clear SPEC
      sql("UPDATE OBJECTS SET SPEC = '[[],[]]' WHERE ID LIKE '%'", console.log);
      break;
    case "/new": //make all objects new (DANGER!)
      let currentDate = Date.now();
      sql(
        `UPDATE OBJECTS SET LREPEAT = '${currentDate}' WHERE ID LIKE '%'`,
        console.log
      );
      sql(
        `UPDATE OBJECTS SET RDATE = '${currentDate}' WHERE ID LIKE '%'`,
        console.log
      );
      break;
    case "--": // //restore previous command
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
      } else if (choice.split(" ")[1] == "/") {
        path = ["/"];
        pathNames = ["/"];
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
        let check = JSON.parse(DATA);
        DATA = DATA.join(" ");

        if (path.length == 0) {
          path.push("/");
        }
        console.log("DATA: ", DATA);
        mem.addDir(path[path.length - 1], JSON.parse(DATA));
        // mem.browser(path[path.length - 1]);
      } catch (e) {
        alert("Error during mkdir");
        console.log(e);
      }
      break;
    case "export":
      mem.export();
      break;
    case "import":
      importData();
      break;
    case "touch":
      // choice = choice.replace("'", '"');
      try {
        let [, ...DATA] = choice.split(" ");
        DATA = DATA.join(" ");
        DATA = DATA.replaceAll("'", "''");
        mem.addItem(path[path.length - 1], JSON.parse(DATA));
      } catch (e) {
        alert("Error during touch");
        console.warn(e);
      }
      mem.collect();
      break;

    case "edit":
      try {
        // choice = choice.replace("'", '"');
        if (choice.split(" ")[1] == "file") {
          let [, , , ...DATA] = choice.split(" ");
          DATA = DATA.join(" ");
          DATA = DATA.replaceAll("'", "''");
          DATA = DATA + "";
          FILID = 1 * choice.split(" ")[2] - 1 - browserCache[0].length;
          UNIQUID = browserCache[1][FILID].ID;
          mem.editItem(UNIQUID, DATA);
        }
        if (choice.split(" ")[1] == "dir") {
          let [, , , ...DATA] = choice.split(" ");
          let check = JSON.parse(DATA);
          DATA = DATA.join(" ");
          DATA = DATA + "";
          DIRID = browserCache[0][1 * choice.split(" ")[2] - 1].ID;
          mem.editDir(DIRID, DATA);
        }
      } catch (e) {
        alert("Erro while editing");
      }
      break;

    case "cut":
      if (choice.split(" ")[1] == "file") {
      }
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
  browser.render();
};

function htmlEntities(str) {
  var str = str.replace(/[\u00A0-\u9999<>\&]/g, function (i) {
    return "&#" + i.charCodeAt(0) + ";";
  });
  return str;
}

mem.exportedData = [];
mem.export = () => {
  mem.exportedData = [];
  sql(`SELECT * FROM OBJECTS`, mem.exportCallback);
  sql(`SELECT * FROM DIRS`, mem.exportDirsCallback);
};

mem.exportCallback = (res) => {
  mem.exportedData.push(res);
};

mem.exportDirsCallback = (res) => {
  mem.exportedData.push(res);
  mem.exportedData = JSON.stringify(mem.exportedData);
  exportData();
};

mem.browserSamplePlus = `<div style="height: 5px"></div><div class="stick"></div>`;
mem.browserDirSample = `<div class="memobject" onclick="mem.terminalCommand('cd $goTo')"><div class="memid">$icon</div><div class="memdata">$dirName</div></div>`;
mem.browserObjSample = `<div class="memobject" onclick="browser.render(1,'$ID')"><div class="memdata-obj">$objData</div></div>`;
mem.currentDir = ``;
let arba = 0;
let browser = {};
browser.focus = (el) => {
let p = el
let s = window.getSelection()
let r = document.createRange()
r.setStart(p, p.childElementCount)
r.setEnd(p, p.childElementCount)
s.removeAllRanges()
s.addRange(r)
}
function auto_grow(element) {
  element.style.height = "71px"
  element.style.height = (element.scrollHeight)+"px";
}

browser.collectInput = () => {
  let arr = []
  for (let item of document.querySelectorAll(".memos-object-input")) {
      if (item.value.length) arr.push([[item.value]])
  }
  return arr
}

browser.editFile = (id) => {
  let rows = JSON.stringify(browser.collectInput())
  rows = rows.replaceAll("'","''")
  if (browser.changeDetected) mem.editItem(id,rows)
  browser.changeDetected = false
  mem.terminalCommand('ls')
}

browser.addFile = () => {
  let currentDirID = path[path.length-1]
  let DATA = JSON.stringify(browser.collectInput())
  DATA = DATA.replaceAll("'","''")
  if (browser.collectInput().length>1)
  mem.addItem(currentDirID, JSON.parse(DATA));
  mem.terminalCommand('ls')

}
browser.newFileInit = () => {
  mem.getDirById(path[path.length-1],browser.newFile)
}
browser.newFile = (obj) => {

  document.querySelector(
    ".objects"
  ).innerHTML = `<div class="memobject" onclick="browser.addFile()"><div class="memdata">←</div></div>`;

  // let fields = JSON.parse(obj[0].DATA) //array of strings
  let fieldNames = JSON.parse(obj[0].DATA)[1] //array of strings
  let index = 0

  for (let field of fieldNames) {
  document.querySelector(
    ".objects"
  ).innerHTML += `<div class="memobject"  style="border-bottom: 5px dotted #151515"><div class="memdata">${field}</div></div>`;
  document.querySelector(
    ".objects"
  ).innerHTML+=`<textarea oninput="auto_grow(this)" class='memos-object-input'></textarea>`
    index++
}

  let items = document.querySelectorAll(".memos-object-input")
  for (let item of items) {
    auto_grow(item)
  }
}
browser.changeDetected = false
browser.triggerChange = () => {browser.changeDetected=true}
browser.renderFile = (obj) => {

  console.log(obj)
  document.querySelector(
    ".objects"
  ).innerHTML = `<div class="memobject" onclick="browser.editFile('${obj[0].ID}')"><div class="memdata">←</div></div>`;

  let fields = JSON.parse(obj[0].DATA) //array of strings
  let fieldNames = JSON.parse(obj[0].DIRDATA)[1] //array of strings
  let index = 0

  for (let field of fieldNames) {
   if (fields[index] == undefined) fields[index]=""
  document.querySelector(
    ".objects"
  ).innerHTML += `<div class="memobject"  style="border-bottom: 5px dotted #151515"><div class="memdata">${field}</div></div>`;
  document.querySelector(
    ".objects"
  ).innerHTML+=`<textarea onclick="setTimeout(()=>{this.scrollIntoView(false)},500)" onchange="browser.triggerChange()" oninput="auto_grow(this)" class='memos-object-input'>${fields[index]}</textarea>`
  
  index++
}

  let items = document.querySelectorAll(".memos-object-input")
  for (let item of items) {
    auto_grow(item)
  }

  // document.querySelector(
  //   ".objects"
  // ).innerHTML += `<div class="memobject" onclick="browser.editFile('${obj[0].ID}')"><div class="memdata">Save file</div></div>`;
  document.querySelector(
    ".objects"
  ).innerHTML += `<div class="memobject" style="border-bottom: 5px dotted #151515"><div class="memdata">Repeat in</div></div>`;
  
  document.querySelector(
    ".objects"
  ).innerHTML+=`<textarea onchange="browser.triggerChange()" oninput="auto_grow(this)" class='memos-object-input'>${mem.calcRepeat(obj[0].RDATE)}</textarea>`
  
  document.querySelector(
    ".objects"
  ).innerHTML += `<div class="memobject" style="border-bottom: 5px dotted #151515"><div class="memdata">Total interval</div></div>`;
  
  memPower = mem.convertHMS(
    (obj[0].RDATE * 1 - obj[0].LREPEAT * 1) / 1000
  );

  document.querySelector(
    ".objects"
  ).innerHTML+=`<textarea onchange="browser.triggerChange()" oninput="auto_grow(this)" class='memos-object-input'>${memPower}</textarea>`
  

  document.querySelector(
    ".objects"
  ).innerHTML += `<div class="memobject" onclick="browser.removeFile('${obj[0].ID}')"><div class="memdata">Delete file</div></div>`;



}
const readFields = (data) => {
  let obj = JSON.parse(data);
  arba = obj;
  let str = "";
  let item;
  let arr = []
  let index = 0
  if (obj.constructor != Array) {
    item = obj[0]
    while (item) {
      arr.push([[obj[index]]])
      index++
      item = obj[index]
    }
   
    obj = arr
  }
  
  for (let item of obj) {
    str += item[0][0] + "<br>";
  }
  return str;
};
browser.removeFile = (id) => {
  let confirm = prompt("Type `delete` to confirm delete")
  if (confirm == "delete") {
    mem.rem(id)
  }
  mem.terminalCommand("ls")
}
browser.movePanel = () => {
  document.querySelector(".memotable-upside").classList.toggle("memotable-upside-down")
}
browser.render = (showFile,id,data) => {

  if (showFile) {
    mem.get(id,browser.renderFile)
  } else {
    document.querySelector(
      ".objects"
    ).innerHTML = `<div class="memobject" onclick="mem.terminalCommand('cd ..')"><div class="memdata">←</div></div>`;
    document.querySelector(
      ".objects"
    ).innerHTML+= `<div class="memobject" onclick="mem.terminalCommand('cd ..')"><div class="memdata">Add directory</div></div>`;
    document.querySelector(
      ".objects"
    ).innerHTML+= `<div class="memobject" onclick="browser.newFileInit()"><div class="memdata">Add file</div></div>`;
    let icons = [];
    let data = [];
    let index = 1;
    for (let item of browserCache[0]) {
      document.querySelector(".objects").innerHTML += mem.browserDirSample
        .replace("$icon", JSON.parse(item.DATA)[0][0])
        .replace("$dirName", JSON.parse(item.DATA)[0][1])
        .replace("$goTo", index);
      index++;
    }

    for (let item of browserCache[1]) {
      document.querySelector(".objects").innerHTML += mem.browserObjSample
        .replace("$objData", readFields(item.DATA))
        .replace("$ID", item.ID)
        // .replace("$DATA", item.DATA)
    }
    document.querySelector(".page2-node4").scrollBy(0, 50);
  }
};

mem.collect(); //collect items to repeat
setInterval(mem.collect, 5000);
mem.when();

mem.todayAnswered();
mem.countDaily();
mem.count();
mem.countTotal();
mem.memoPower();
// const clickHandler = (event) => event.target.focus()
// document.addEventListener('click',clickHandler)
setInterval(mem.when, 5000);
setInterval(() => {
  mem.circleData(1);
}, 5000);

// setTimeout(()=> {
//   document.querySelector("#mycircle").classList.remove("hidden")
// },5000)
/* Examples:
sql("INSERT INTO OBJECTS (ID, DATA, repeat, dir) VALUES ('2.3','DATA',10,'main')")
sql("INSERT INTO LOGS (ID, log) VALUES (3, 'three')")
*/
