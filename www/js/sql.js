// method = null; //methods like need, set, get ... etc.
var db = openDatabase("MEMODB", "1.0", "OBJECTS DATABASE", null);
db.transaction(function (tx) {
  //rDATA - repeatition DATA; lrepeat - last repeat unix time; dur - duration;
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS OBJECTS (ID unique, PID, DATA, RDATE, LREPEAT, SPEC)"
  ); //PID - PARENT ID
  tx.executeSql("CREATE TABLE IF NOT EXISTS DIRS (ID unique, PID, DATA)");
  tx.executeSql("CREATE TABLE IF NOT EXISTS MEMOROUTES (ID unique, DATA)");
  tx.executeSql("CREATE TABLE IF NOT EXISTS HISTORY (ID unique, DATA)");
  // tx.executeSql("ALTER TABLE DIRS RENAME COLUMN DIRDATA TO DATA;")
  // tx.executeSql("ALTER TABLE OBJECTS RENAME TO ITEMS ")
});

const openConnection = () => {
  db.transaction(function (tx) {
    //rDATA - repeatition DATA; lrepeat - last repeat unix time; dur - duration;
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS OBJECTS (ID unique, PID, DATA, RDATE, LREPEAT, SPEC)"
    ); //PID - PARENT ID
    tx.executeSql("CREATE TABLE IF NOT EXISTS DIRS (ID unique, PID, DATA)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS MEMOROUTES (ID unique, DATA)");
    tx.executeSql("CREATE TABLE IF NOT EXISTS HISTORY (ID unique, DATA)");
    // tx.executeSql("ALTER TABLE DIRS RENAME COLUMN DIRDATA TO DATA;")
    // tx.executeSql("ALTER TABLE OBJECTS RENAME TO ITEMS ")
  });
};

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
        // console.log(query)
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
const prom = new Promise((res, rej) => {});
sql2 = (query) => new Promise((resolve, reject) => {
    db.transaction(function (tx) {
      tx.executeSql(
        query,
        [],
        function (tx, results) {
          resolve(results.rows);
        },
        function (tx, results) {
          console.log(query, tx, results, "ERROR");
          error(arg1, arg2, arg3);
        }
      );
    });
  });

async function sql3(query) {
  let res = await sql2(query);
  console.log(res);
  return res;
}

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
mem.fixLinker = () => {
  sql("select id,spec from objects", (res) => {
    res = Array.from(res);
    res.map((item) => {
      if (JSON.parse(item.SPEC) instanceof Array)
        sql(
          `update OBJECTS set SPEC='{"links": ${item.SPEC},"qfields": []}' WHERE ID='${item.ID}'`
        );
    });
  });
};

//q: write array destructurization for [1,2,3] and take first
//a: const [n1,n2,n3] = [1,2,3]
//---
//q: What is it? const [n1,n2,n3] = [1,2,3]
//a: array destructurization

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

mem.getDirById = (dirid, callback) => {
  sql(
    `SELECT *,(SELECT COUNT(ID) FROM OBJECTS WHERE PID='${dirid}') AS TOTAL FROM DIRS WHERE ID = '${dirid}'`,
    callback
  );
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
  // console.log("!",mem.list[mem.answered])
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
    mem.res.rightAnswer = rightAnswer;
    //костыль да и х с ним хочу angular учить а не это вот всё
    
    if ((!mem.code)&&(mem.code !== null)) {
      if (!(mem.showAnswer%2)) {
        mem.res.question = rightAnswer
        document.querySelector(".pos2").classList.add("remind");
      }
      mem.showAnswer+=1
    }
    

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
      // console.log('!!!',repeatIn)
      notifier.show(`⌛ +${mem.convertHMS(repeatIn/1000)}`)
      repeatIn = repeatIn / 1000 / 60 / 60;
      // console.log("New RDATE: " + new Date(diff));
      // console.log(`Repeat in ${repeatIn} hours`);
      mem.update("RDATE", diff, "ID", mem.res.obj.ID);
      mem.update("LREPEAT", Date.now(), "ID", mem.res.obj.ID);
      mem.res.obj.SPEC = JSON.stringify(mem.res.obj.result[1])
      mem.update("SPEC", mem.res.obj.SPEC, "ID", mem.res.obj.ID);
      mem.showAnswer = 0
    } else {
      mem.update("RDATE", Date.now(), "ID", mem.res.obj.ID);
      mem.update("LREPEAT", Date.now(), "ID", mem.res.obj.ID);
      if (!(mem.showAnswer%2))
      notifier.show(`⌛ - ${mem.convertHMS((Date.now() - mem.res.obj.LREPEAT * 1)/1000)}`,true)
      console.log("ZEROING FILE");
      mem.res.obj.LREPEAT = Date.now()
      mem.code = 0;
      
    }

    mem.collect();

    if (mem.code) {
    mem.define(1);
    }
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
mem.showAnswer = 0
mem.check = (answer) => {
  if (mem.showAnswer%2) return 0
  // document.querySelector("#memosInput").innerHTML.replaceAll("&nbsp;", " ");
  // document.querySelector("#memosInput").innerHTML = document.querySelector("#memosInput").innerHTML.replaceAll("&nbsp;", "_");
  answer = answer.replaceAll("&nbsp;", " ");
  answer = answer.replaceAll("&gt;", ">");
  answer = answer.replaceAll("&lt;", "<");
  answer = answer.replaceAll("&amp;", "&");

  answer = answer.replaceAll("<br>", "");

  answer = answer.replaceAll("<div>", "\n");
  answer = answer.replaceAll("</div>", "");
  mem.userAnswer = answer;

  answer = answer.replaceAll("</div>", "").split("<div>");
  answer = answer.map((item) => item.replaceAll("&nbsp;", " "));
  console.log(answer);
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
        answer[i][j].toLowerCase() != mem.res.rightAnswer[0][i][j].toLowerCase()
      ) {
        block = 1;
        mem.mistake = 1;

      //   if (j+1 == answer[i].length) {
         
      //     if (!document.querySelector("#memosInput").innerHTML.includes("</span>")) {
      //       if (answer[i][j]==" ") {
      //         // alert()
      //         document.querySelector("#memosInput").innerHTML = document.querySelector("#memosInput").innerHTML.replaceAll("&nbsp;", "_");
      //         document.querySelector("#memosInput").innerHTML = document.querySelector("#memosInput").innerHTML.replace("_", " ");
      //     document.querySelector("#memosInput").innerHTML= document.querySelector("#memosInput").innerHTML.slice(0,-1)+"<span>"+"_"+"</span>"
      //       } else {
      //     document.querySelector("#memosInput").innerHTML= document.querySelector("#memosInput").innerHTML.slice(0,-1)+"<span>"+answer[i][j]+"</span>"
      //       }
      //     document.execCommand('selectAll', false, null);
      //     document.getSelection().collapseToEnd();
      //     }
        
      // }
      } else {
        if (!block) rightSymbols++;
      }
      if (
        !block &&
        answer.join("").length == mem.res.rightAnswer[0].join("").length &&
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
    mem.percentage = rightSymbols / mem.res.rightAnswer[0].join("").length;
    document.querySelector(".progressBar").style.width =
      mem.percentage * 100 + "%";
    if (block) {
      document.querySelector(".progressBar").style.background = "red";
      document.querySelector("#memosInput").classList.add("redColor");

      // document.querySelector(".pos1").classList.add("loose");
      // document.querySelector("#memosInput").classList.add("loose");
    } else {
      document.querySelector(".progressBar").style.background = "";
      document.querySelector("#memosInput").classList.remove("redColor");
      // document.querySelector(".pos1").classList.remove("loose");
      // document.querySelector("#memosInput").classList.remove("loose");
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

mem.nextRepeatInValue = 0
mem.nextRepeatIn = async function() {
  let res = await sql2(`SELECT ID, DATA, MIN(RDATE) AS RDATE, LREPEAT, SPEC FROM OBJECTS WHERE 1*RDATE>${Date.now()} LIMIT 1`);
  mem.nextRepeatInValue = mem.calcRepeat(res[0].RDATE*1)
}


const zeroPad = (num, places) => String(num).padStart(places, "0");

mem.when2 = (res) => {
  if (res[0].RDATE == null) {
   return 0
  }
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
    return result
  }
};

mem.convertHMS = (seconds) => {
  timeLeft = seconds;
  if (timeLeft < 0) timeLeft = 0;
  let yearsLeft = Math.floor(timeLeft / 60 / 60 / 24 / 365); 
  let daysLeft = Math.floor((timeLeft - yearsLeft * 60 * 60 * 24 * 365)/60/60/24);
  let hoursLeft = Math.floor((timeLeft - yearsLeft*60*60*24*365 - daysLeft * 60 * 60 * 24) / 60 / 60);
  let minutesLeft = Math.floor(
    (timeLeft - yearsLeft*60*60*24*365 - daysLeft * 60 * 60 * 24 - hoursLeft * 60 * 60) / 60
  );
  if (yearsLeft>0)
  return `${zeroPad(yearsLeft,2)}:${zeroPad(daysLeft, 2)}:${zeroPad(hoursLeft, 2)}:${zeroPad(minutesLeft,2)}`;
  return `${zeroPad(daysLeft, 2)}:${zeroPad(hoursLeft, 2)}:${zeroPad(minutesLeft,2)}`;
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
  // console.log(arguments);
  var RDATE = Date.now() + 0 * 60 * 1000;
  var LREPEAT = Date.now();
  // console.log(`INSERT INTO OBJECTS (ID,PID, DATA, RDATE, LREPEAT, SPEC) VALUES ("${ID}","${PID}",'${DATA}',"${RDATE}", "${LREPEAT}", "${SPEC}")`)

  if (ITEM_G_COUNT < 1000) {
    ITEM_G_COUNT++;
    sql(
      `INSERT INTO OBJECTS (ID,PID, DATA, RDATE, LREPEAT, SPEC) VALUES ("${ID}","${PID}",'${DATA}',"${RDATE}", "${LREPEAT}", '${SPEC}')`,
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

mem.get = (ID, callback) => {
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

mem.update = (FIELD, DATA, CON1, CON2) => {
  sql(`UPDATE OBJECTS SET ${FIELD} = '${DATA}' WHERE ${CON1} = '${CON2}'`);
};

mem.nullify = (ID) => {
  sql(`UPDATE OBJECTS SET RDATE = '${Date.now()}' WHERE ID = '${ID}'`);
  sql(`UPDATE OBJECTS SET LREPEAT = '${Date.now()}' WHERE ID = '${ID}'`);
}

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
    let SPEC = { links: [], qfields: [] };
    DATA = ARRAY;
    for (var i = 0; i < ARRAY.length; i++) {
      SPEC.links.push([]);
    }

    DATA = JSON.stringify(DATA);
    console.log(DATA);
    SPEC = JSON.stringify(SPEC);
    console.log(ARRAY.length);
    if (ARRAY.length > 1) {
      mem.setItem(ID, DATA, SPEC);
    } else {
      notifier.show(`⚠️ Too little data`, true);
      throw new Error("Too small");
    }
  } catch (e) {
    alert("Error: ", e);
    notifier.show(`⚠️ Error during adding ${e}`, true);
    console.log(e);
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
  //console.log(result)
  if (result) {
    return result;
  } else {
    for (var i = 0; i < SPEC.links.length; i++) {
      SPEC.links[i] = [];
    }
    // console.log("SPEC: ", SPEC);

    return mem.sublinker(SPEC);
    console.log(`mem.linker(${SPEC})`);
  }
};
mem.sublinker = (SPEC) => {
  let LINKS = SPEC.links;
  //@SPEC array of arrays [[],[]]
  //i symbols the 1st field and the numbers inside (j) are field it was asked with
  //i is quiestion and j is answer
  for (var i = 0; i < LINKS.length; i++) {
    for (var j = 0; j < LINKS.length; j++) {
      if (i != j) {
        if (LINKS[i].indexOf(j) == -1 && SPEC.qfields.indexOf(j) == -1) {
          LINKS[i].push(j);
          SPEC.links = LINKS;

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

mem.offset = 0;
mem.show = (DIRID, callback, order) => {
  sql(
    `SELECT *,
    CASE 
    WHEN substr(DATA,2,1) = ',' THEN substr(DATA,3)
    WHEN substr(DATA,3,1) = ',' THEN substr(DATA,4)
    WHEN substr(DATA,4,1) = ',' THEN substr(DATA,5)
    WHEN substr(DATA,5,1) = ',' THEN substr(DATA,6)
    WHEN substr(DATA,6,1) = ',' THEN substr(DATA,7)
    WHEN substr(DATA,7,1) = ',' THEN substr(DATA,8)
    WHEN substr(DATA,8,1) = ',' THEN substr(DATA,9)
    WHEN substr(DATA,9,1) = ',' THEN substr(DATA, 10)
    WHEN substr(DATA,10,1) = ',' THEN substr(DATA,11)
    WHEN substr(DATA,11,1) = ',' THEN substr(DATA,12)
    WHEN substr(DATA,12,1) = ',' THEN substr(DATA,13)
    WHEN substr(DATA,13,1) = ',' THEN substr(DATA,14)
    WHEN substr(DATA,14,1) = ',' THEN substr(DATA,15)
    WHEN substr(DATA,15,1) = ',' THEN substr(DATA,16)
    WHEN substr(DATA,16,1) = ',' THEN substr(DATA,17)
    WHEN substr(DATA,17,1) = ',' THEN substr(DATA,18)
    WHEN substr(DATA,18,1) = ',' THEN substr(DATA,19)
    --- More as required
    ELSE ''
END AS result
     FROM DIRS WHERE PID = "${DIRID}" ORDER BY 
     result
     ASC LIMIT ${mem.offset},10`,
    callback
  );
  // mem.getDirById(DIRID,callback)
  switch (order) {
    case "interval":
      sql(
        `SELECT * FROM OBJECTS WHERE PID = "${DIRID}" GROUP BY ID ORDER BY SUM(RDATE-LREPEAT) LIMIT ${mem.offset},10`,
        callback
      );
      break;
    case "interval backwards":
      sql(
        `SELECT * FROM OBJECTS WHERE PID = "${DIRID}" GROUP BY ID ORDER BY SUM(RDATE-LREPEAT) DESC LIMIT ${mem.offset},10`,
        callback
      );
      break;
    default:
      sql(
        `SELECT * FROM OBJECTS WHERE PID = "${DIRID}" ORDER BY RDATE LIMIT ${mem.offset},10`,
        callback
      );
      break;
  }
};

mem.editItem = async function (ID, DATA) { //strings
  try {
    let RES = await sql2(`SELECT SPEC FROM OBJECTS WHERE ID = '${ID}'`);
    SPEC = RES[0].SPEC;
    SPEC = JSON.parse(SPEC);
    await sql2(`UPDATE OBJECTS SET DATA = '${DATA}' WHERE ID = '${ID}'`);
    ARRAY = JSON.parse(DATA);
    if (ARRAY.length != SPEC.links.length) {
      SPEC.links = []
      for (let i = 0; i < ARRAY.length; i++) {
        SPEC.links.push([]);
      }
      SPEC = JSON.stringify(SPEC);
      await sql2(`UPDATE OBJECTS SET SPEC = '${SPEC}' WHERE ID = '${ID}'`);
    }
  } catch (e) {
    log(e);
    notifier.show(e, true);
  }
};

mem.editItemQFields = async function (ID, ARRAY) {
  let RES = await sql2(`SELECT SPEC FROM OBJECTS WHERE ID = '${ID}'`);
  SPEC = RES[0].SPEC;
  SPEC = JSON.parse(SPEC);
  SPEC.qfields = ARRAY;
  SPEC = JSON.stringify(SPEC);
  return await sql2(`UPDATE OBJECTS SET SPEC = '${SPEC}' WHERE ID = '${ID}'`);
};
mem.getQFields = async function (ID) {
  return await sql2(`SELECT SPEC FROM OBJECTS WHERE ID = '${ID}'`);
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
mem.browser = (goTo, order) => {
  mem.when();
  counter = 0;
  cached = 0;
  browserCache = [];
  browserString = "";
  if (goTo == undefined) {
    goTo = "/";
  }

  mem.show(goTo, mem.setCache, order);
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
      mem.browser(path[path.length - 1]);
      break;
    case "lsi":
      mem.browser(path[path.length - 1], "interval");
      break;
    case "lsib":
      mem.browser(path[path.length - 1], "interval backwards");
      break;
    case "lslim":
      mem.browser(
        path[path.length - 1],
        `limit ${choice.split(" ")[1].toLowerCase()}`
      );
      break;
    case "/clear": //clear SPEC
      // sql("UPDATE OBJECTS SET SPEC = '[[],[]]' WHERE ID LIKE '%'", console.log);
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
      mem.browser(path[path.length - 1]);
      break;
    case "fixlinker":
      mem.fixLinker();
      break;
    //1: going around
    case "cd":
      if (choice.split(" ")[1] == "..") {
        path.pop();
        if (path.length == 0) {
          path.push("/");
        }
        pathNames.pop();
        if (pathNames.length == 0) pathNames.push("/");
        mem.browser(path[path.length - 1]);
      } else if (choice.split(" ")[1] == "/") {
        path = ["/"];
        pathNames = ["/"];
        mem.browser(path[path.length - 1]);
      } else {
        newChoice = 1 * choice.split(" ")[1] - 1;
        DIRID = browserCache[0][newChoice].ID;

        path.push(DIRID);

        pathNames.push(JSON.parse(browserCache[0][newChoice].DATA)[0][0]);
        pathNames[pathNames.length - 1] +=
          " " + JSON.parse(browserCache[0][newChoice].DATA)[0][1];
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
      mem.browser(path[path.length - 1]);
  }
  // mem.browser(path[path.length - 1]);
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
mem.browserDirSample = `<div class="memobject md-ripples md-ripples" onclick="mem.terminalCommand('cd $goTo')"><div class="memid">$icon</div><div class="memdata">$dirName</div></div>`;
mem.browserObjSample = `<div class="memobject md-ripples" onclick="browser.render(1,'$ID')"><div class="memdata-obj">$objData</div></div>`;
mem.currentDir = ``;
let arba = 0;
let browser = {};

browser.focus = (el) => {
  let p = el;
  let s = window.getSelection();
  let r = document.createRange();
  r.setStart(p, p.childElementCount);
  r.setEnd(p, p.childElementCount);
  s.removeAllRanges();
  s.addRange(r);
};
function auto_grow(element) {
  element.style.height = "71px";
  element.style.height = element.scrollHeight + "px";
  element.scrollIntoView(false);
}
function auto_grow2(element) {
  element.style.height = "54px";
  element.style.height = element.scrollHeight + "px";
  element.scrollIntoView(false);
}
const focusElement = (e) => {
  e.scrollIntoView(false);
};
let focusInterval = 0;
const clickHandler = (e) => {
  // console.log(e.target.classList);
  if (e.target.classList.contains("memos-userInput")) {
    clearInterval(focusInterval);
    focusInterval = setInterval(focusElement, 100, e.target);
    setTimeout(() => {
      clearInterval(focusInterval);
    }, 1000);
  }
};
document.addEventListener("click", clickHandler);
browser.collectInput = () => {
  let arr = [];
  //const sentence = '    My string with a    lot   of Whitespace.  '.replace(/\s+/g, ' ').trim()
  for (let item of document.querySelectorAll(".memos-userInput")) {
    if (item.value.length) arr.push([[item.value.replace(/\s+/g, " ").trim()]]);
  }
  return arr;
};

browser.editFile = async function (id) {
  qfields = browser.readLocks();
  let rows = browser.collectInput();
  if (rows.length > 1) {
    rows = JSON.stringify(rows);
    rows = rows.replaceAll("'", "''");
    if (browser.changeDetected) await mem.editItem(id, rows);
    console.log("Q", id, qfields);
    if (browser.lockFieldEngaged) await mem.editItemQFields(id, qfields);
    if (browser.lockFieldEngaged || browser.changeDetected) notifier.show(`📝 Edit successful`);
    browser.lockFieldEngaged=0
    browser.changeDetected = false;

    
  } else {
    notifier.show(`⚠️ Too little data`, true);
  }
  mem.terminalCommand("ls");
};

browser.newDir = () => {
  document.querySelector(
    ".objects"
  ).innerHTML = `<div class="memobject md-ripples" onclick="browser.addDir()"><div class="memdata">←</div></div>`;

  document.querySelector(
    ".objects"
  ).innerHTML += `<div class="memobject md-ripples"  style="border-bottom: 5px dotted #151515"><div class="memdata">Icon</div></div>`;
  document.querySelector(
    ".objects"
  ).innerHTML += `<textarea id='dirIcon'  onchange="browser.triggerChange()" oninput="auto_grow(this)" class='memos-object-input'></textarea>`;

  document.querySelector(
    ".objects"
  ).innerHTML += `<div class="memobject md-ripples"   style="border-bottom: 5px dotted #151515"><div class="memdata">Name</div></div>`;
  document.querySelector(
    ".objects"
  ).innerHTML += `<textarea id='dirName'onchange="browser.triggerChange()" oninput="auto_grow(this)" class='memos-object-input'></textarea>`;

  document.querySelector(
    ".objects"
  ).innerHTML += `<div class="memobject md-ripples" style="border-bottom: 5px dotted #151515"><div class="memdata">Fields</div></div>`;
  document.querySelector(
    ".objects"
  ).innerHTML += `<textarea placeholder="Field1,Field2, ..." id='dirFields' onchange="browser.triggerChange()" oninput="auto_grow(this)" class='memos-object-input'></textarea>`;
};

browser.addDir = () => {
  let icon = document.querySelector("#dirIcon").value;
  let name = document.querySelector("#dirName").value;
  let fields = document.querySelector("#dirFields").value.split(",");
  let arr = [[icon, name], fields];
  if (arr.length * name.length * arr.length > 0) {
    mem.addDir(path[path.length - 1], arr);
    notifier.show("📁 Added catalog")
  } else {
    notifier.show("📁 Too little data",true)
  }
  mem.terminalCommand("ls");
};

browser.addFile = () => {
  let currentDirID = path[path.length - 1];
  let DATA = JSON.stringify(browser.collectInput());
  DATA = DATA.replaceAll("'", "''");
  if (browser.collectInput().length > 1) {
    notifier.show(`📝 Card added`);
    mem.addItem(currentDirID, JSON.parse(DATA));
  } else {
    notifier.show(`⚠️ Too little data`, true);
  }
  mem.terminalCommand("ls");
};
browser.newFileInit = () => {
  mem.getDirById(path[path.length - 1], browser.newFile);
};
browser.editDirInit = () => {
  mem.getDirById(path[path.length - 1], browser.editDir);
};
browser.editDir = (obj) => {
  try {
    console.log(obj);
    let DATA = JSON.parse(obj[0].DATA);
    console.log(DATA);
    let dirIcon = DATA[0][0];
    let dirName = DATA[0][1];
    let dirFields = DATA[1].join();
    document.querySelector(
      ".objects"
    ).innerHTML = `<div class="memobject md-ripples" onclick="browser.editDirAPI()"><div class="memdata">←</div></div>`;

    document.querySelector(
      ".objects"
    ).innerHTML += `<div class="memobject md-ripples"  style="border-bottom: 5px dotted #151515"><div class="memdata">Icon</div></div>`;
    document.querySelector(
      ".objects"
    ).innerHTML += `<textarea id='dirIcon' onchange="browser.triggerChange()" oninput="auto_grow(this)" class='memos-object-input'>${dirIcon}</textarea>`;

    document.querySelector(
      ".objects"
    ).innerHTML += `<div class="memobject md-ripples"   style="border-bottom: 5px dotted #151515"><div class="memdata">Name</div></div>`;
    document.querySelector(
      ".objects"
    ).innerHTML += `<textarea id='dirName' onchange="browser.triggerChange()" oninput="auto_grow(this)" class='memos-object-input'>${dirName}</textarea>`;

    document.querySelector(
      ".objects"
    ).innerHTML += `<div class="memobject md-ripples" style="border-bottom: 5px dotted #151515"><div class="memdata">Fields</div></div>`;
    document.querySelector(
      ".objects"
    ).innerHTML += `<textarea placeholder="Field1,Field2, ..." id='dirFields' onchange="browser.triggerChange()" oninput="auto_grow(this)" class='memos-object-input'>${dirFields}</textarea>`;

    document.querySelector(
      ".objects"
    ).innerHTML += `<div class="memobject md-ripples" onclick="browser.removeDir()"><div class="memdata">Delete direcotry</div></div>`;

    let items = document.querySelectorAll(".memos-object-input");
    for (let item of items) {
      auto_grow(item);
    }
  } catch (e) {
    console.log(e);
  }
};

browser.editDirAPI = () => {
  let icon = document.querySelector("#dirIcon").value;
  let name = document.querySelector("#dirName").value;
  let fields = document.querySelector("#dirFields").value.split(",");
  let arr = [[icon, name], fields];
  if (arr.length * name.length * arr.length > 0)
    mem.editDir(path[path.length - 1], JSON.stringify(arr));
  console.log(JSON.stringify(arr));
  mem.terminalCommand("ls");
};

browser.newFile = (obj) => {
  document.querySelector(
    ".objects"
  ).innerHTML = `<div class="memobject md-ripples" onclick="browser.addFile()"><div class="memdata">←</div></div>`;

  // let fields = JSON.parse(obj[0].DATA) //array of strings
  let fieldNames = JSON.parse(obj[0].DATA)[1]; //array of strings
  let index = 0;

  for (let field of fieldNames) {
    document.querySelector(
      ".objects"
    ).innerHTML += `<div class="memobject md-ripples"  style="border-bottom: 5px dotted #151515"><div class="memdata">${field}</div></div>`;
    document.querySelector(
      ".objects"
    ).innerHTML += `<textarea oninput="auto_grow(this)" class='memos-object-input memos-userInput'></textarea>`;
    index++;
  }

  let items = document.querySelectorAll(".memos-object-input");
  for (let item of items) {
    auto_grow(item);
  }
};
browser.changeDetected = false;
browser.triggerChange = () => {
  browser.changeDetected = true;
};
browser.lockedElement = 0;
browser.lockFieldEngaged = 0
browser.lockField = (elm) => {
  browser.lockFieldEngaged = 1
  browser.lockedElement = elm;
  if (elm.children[0].innerHTML.includes("🔒")) {
    browser.lockedElement.children[0].innerHTML =
      browser.lockedElement.children[0].innerHTML.slice(0, -3);
  } else {
    browser.lockedElement.children[0].innerHTML =
      browser.lockedElement.children[0].innerHTML + " 🔒";
  }
};

browser.readLocks = () => {
  let arr = [];
  Array.from(document.querySelectorAll(".field-name")).map((item, index) => {
    if (item.children[0].innerHTML.includes("🔒")) {
      arr.push(index);
    }
  });
  return JSON.stringify(arr);
};

browser.showLock = (lock) => {
  if (lock) return "🔒";
  return "";
};

browser.obj = 0;
browser.renderFile = (obj) => {
  console.log(obj);
  browser.obj = obj;
  document.querySelector(
    ".objects"
  ).innerHTML = `<div class="memobject md-ripples" onclick="browser.editFile('${obj[0].ID}')"><div class="memdata">←</div></div>`;

  let fields = JSON.parse(obj[0].DATA); //array of strings
  let fieldNames = JSON.parse(obj[0].DIRDATA)[1]; //array of strings
  let index = 0;
  let lock = "";
  try {
    for (let field of fieldNames) {
      if (fields[index] == undefined) fields[index] = "";
      let qfields = JSON.parse(obj[0].SPEC).qfields; //array
      lock = browser.showLock(qfields.indexOf(index) > -1);
      document.querySelector(
        ".objects"
      ).innerHTML += `<div class="memobject md-ripples field-name" onclick="browser.lockField(this)"style="border-bottom: 5px dotted #151515"><div class="memdata">${field} ${lock} </div></div>`;
      document.querySelector(
        ".objects"
      ).innerHTML += `<textarea onchange="browser.triggerChange()" oninput="auto_grow(this)" class='memos-object-input memos-userInput'>${fields[index]}</textarea>`;

      index++;
    }
  } catch (e) {
    notifier.show(e);
  }

  document.querySelector(
    ".objects"
  ).innerHTML += `<div class="memobject md-ripples" style="border-bottom: 5px dotted #151515"><div class="memdata">SPEC</div></div>`;

  document.querySelector(
    ".objects"
  ).innerHTML += `<textarea onchange="browser.triggerChange()" oninput="auto_grow(this)" class='memos-object-input'>${obj[0].SPEC}
  )}</textarea>`;

  let items = document.querySelectorAll(".memos-object-input");
  for (let item of items) {
    auto_grow(item);
  }

  // document.querySelector(
  //   ".objects"
  // ).innerHTML += `<div class="memobject md-ripples" onclick="browser.editFile('${obj[0].ID}')"><div class="memdata">Save file</div></div>`;
  document.querySelector(
    ".objects"
  ).innerHTML += `<div class="memobject md-ripples" style="border-bottom: 5px dotted #151515"><div class="memdata">Repeat in</div></div>`;

  document.querySelector(
    ".objects"
  ).innerHTML += `<textarea onchange="browser.triggerChange()" oninput="auto_grow(this)" class='memos-object-input'>${mem.calcRepeat(
    obj[0].RDATE
  )}</textarea>`;

  document.querySelector(
    ".objects"
  ).innerHTML += `<div class="memobject md-ripples" style="border-bottom: 5px dotted #151515"><div class="memdata">Total interval</div></div>`;

  memPower = mem.convertHMS((obj[0].RDATE * 1 - obj[0].LREPEAT * 1) / 1000);

  document.querySelector(
    ".objects"
  ).innerHTML += `<textarea onchange="browser.triggerChange()" oninput="auto_grow(this)" class='memos-object-input'>${memPower}</textarea>`;

  document.querySelector(
    ".objects"
  ).innerHTML += `<div class="memobject md-ripples" onclick="browser.nullify('${obj[0].ID}')"><div class="memdata">⏲️ Nullify file</div></div>`;


  document.querySelector(
    ".objects"
  ).innerHTML += `<div class="memobject md-ripples" onclick="browser.removeFile('${obj[0].ID}')"><div class="memdata">🗑️ Delete file</div></div>`;
};
const readFields = (data) => {
  let obj = JSON.parse(data.DATA);
  arba = obj;
  let str = "";
  let item;
  let arr = [];
  let index = 0;
  if (obj.constructor != Array) {
    item = obj[0];
    while (item) {
      arr.push([[obj[index]]]);
      index++;
      item = obj[index];
    }

    obj = arr;
  }

  for (let item of obj) {
    str += item[0][0] + "<br>";
  }

  str += "⌛ " + mem.calcRepeat(data.RDATE) + "<br>"; //<-- repeat in

  str +=
    "💪 " +
    mem.convertHMS(
      (data.RDATE * 1 - data.LREPEAT * 1) / 2 / 1000 //<-- strength
    );

  str +=
    "<br>🚗 " +
    mem.convertHMS(
      (data.RDATE * 1 - data.LREPEAT * 1) / 1000 //<-- now going
    );

  return str;
};

browser.nullify = (id) => {
  let confirm = prompt("Type `nullify` to confirm delete");
  if (confirm == "nullify") {
    mem.nullify(id);
    browser.render(1,id)
  }
};

browser.removeFile = (id) => {
  let confirm = prompt("Type `delete` to confirm delete");
  if (confirm == "delete") {
    mem.rem(id);
  }
  mem.terminalCommand("ls");
};
browser.removeDir = () => {
  let confirm = prompt("Type `delete` to confirm delete");
  if (confirm == "delete") {
    mem.rmdir(path[path.length - 1]);
  }
  mem.terminalCommand("cd ..");
};
browser.movePanel = () => {
  document
    .querySelector(".memotable-upside")
    .classList.toggle("memotable-upside-down");
};
browser.selectOrder = () => {
  let order = document.querySelector("select").value;
  switch (order) {
    case "repeatin":
      mem.terminalCommand("ls");
      break;
    case "interval":
      mem.terminalCommand("lsi");
      break;
    case "intervalb":
      mem.terminalCommand("lsib");
      break;
  }
};

mem.parsedBackup = 0;

mem.dropDatabase = async function () {
  await sql2("DROP TABLE OBJECTS");
  await sql2("DROP TABLE DIRS");
  await sql2("DROP TABLE MEMOROUTES");
  await sql2("DROP TABLE HISTORY");

  await sql2(
    `CREATE TABLE IF NOT EXISTS OBJECTS (ID unique, PID, DATA, RDATE, LREPEAT, SPEC)`
  );
  await sql2(`CREATE TABLE IF NOT EXISTS DIRS (ID unique, PID, DATA)`);
  await sql2(`CREATE TABLE IF NOT EXISTS MEMOROUTES (ID unique, DATA)`);
  await sql2(`CREATE TABLE IF NOT EXISTS HISTORY (ID unique, DATA)`);
};

browser.importProgress = (str) => {
  document.querySelector(".import").innerHTML = `${str}`
  // console.log(str)
}

async function importBackup(data) {
  document.querySelector(".memotable").classList.toggle("noSnap")
  document.querySelector(".memotable-upside").classList.toggle("noSnap")

  browser.importProgress('🎁 Initializing import sequence...')
  notifier.show(`🎁 Inititslizing import...`)
  browser.importProgress('🎁 Clearing database...')

  await sql2("DROP TABLE OBJECTS");
  await sql2("DROP TABLE DIRS");
  await sql2("DROP TABLE MEMOROUTES");
  await sql2("DROP TABLE HISTORY");

  browser.importProgress('🎁 Creating database...')
  await sql2(
    `CREATE TABLE IF NOT EXISTS OBJECTS (ID unique, PID, DATA, RDATE, LREPEAT, SPEC)`
  );
  await sql2(`CREATE TABLE IF NOT EXISTS DIRS (ID unique, PID, DATA)`);
  await sql2(`CREATE TABLE IF NOT EXISTS MEMOROUTES (ID unique, DATA)`);
  await sql2(`CREATE TABLE IF NOT EXISTS HISTORY (ID unique, DATA)`);

  browser.importProgress('Parsing data...')
  let parsed = JSON.parse(data);
  mem.parsedBackup = parsed;

  let object = parsed[0][0];
  let i = 0;
  browser.importProgress('🎁 Inititslizing import...')
  
  browser.importProgress('🎁Counting cards...')
  i = 0
  while (object) {
    object = parsed[0][i]
    i++
  }

  let cardsAmount=i

  i = 0
  object = parsed[0][0];
   
  let time1 = Date.now()
  while (object) {
    object.DATA = object.DATA.replaceAll(`'`, `''`);
    await sql2(
      `INSERT INTO OBJECTS (ID,PID, DATA, RDATE, LREPEAT, SPEC) VALUES ("${object.ID}","${object.PID}",'${object.DATA}',"${object.RDATE}", "${object.LREPEAT}", '${object.SPEC}')`
    );
    browser.importProgress(`🎁 Importing cards (${(i*100/cardsAmount).toFixed(0)}%) ${i} of ${cardsAmount}`)
    i++;
    object = parsed[0][i];
  }

  console.log(Date.now()-time1)
  let dir = parsed[1][0];
  i = 0
  while (dir) {
    dir = parsed[1][i]
    i++
  }

  let foldersAmount=i

  i = 0;
  dir = parsed[1][0];
  while (dir) {
    await sql2(
      `INSERT INTO DIRS (ID, PID, DATA) VALUES ("${dir.ID}", "${dir.PID}", '${dir.DATA}')`
    );
    browser.importProgress(`🎁 Importing dirs (${(i*100/foldersAmount).toFixed(0)}%) ${i} of ${foldersAmount}`)
    i++;
    dir = parsed[1][i];
  }

  browser.importProgress(`🎁 Import data`)
  notifier.show(`🎁 Import complete`)
  document.querySelector(".memotable").classList.toggle("noSnap")
  document.querySelector(".memotable-upside").classList.toggle("noSnap")
  mem.terminalCommand("ls");

  // for (let object of parsed[0]) {
  //   sql2(`INSERT INTO OBJECTS (ID,PID, DATA, RDATE, LREPEAT, SPEC) VALUES ("${object.ID}","${object.PID}",'${object.DATA}',"${object.RDATE}", "${object.LREPEAT}", "${object.SPEC}")`)
  // }
  // for (let dir of parsed[1]) {
  //   sql2(`INSERT INTO DIRS (ID, PID, DATA) VALUES ("${dir.ID}", "${dir.PID}", '${dir.DATA}')`)
  // }
}
var openFile = function (event) {
  try {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function () {
      var text = reader.result;
      importBackup(text);
      // var node = document.getElementById('output');
      // node.innerText = text;
      // alert(text);
      // console.log(reader.result.substring(0, 200));
      // alert(reader.result.substring(0, 200));
    };
    reader.readAsText(input.files[0]);
  } catch (e) {
    console.log(e);
  }
};
browser.toggle = () => {
  browser.showControlPanel = !browser.showControlPanel;
  browser.render();
};
browser.switchPage = (next) => {
  if (next) {
    mem.offset += 10;
  } else {
    mem.offset -= 10;
  }
  mem.terminalCommand("ls");
};
browser.goUp = () => {
  mem.offset = 0;
  mem.terminalCommand("cd ..");
};
browser.showControlPanel = false;
browser.thisDirTotal = 0;
browser.render = (showFile, id, data) => {
  try {
    if (showFile) {
      mem.get(id, browser.renderFile);
    } else {
      document.querySelector(".objects").innerHTML = "";

      if (path.length > 1)
        document.querySelector(
          ".objects"
        ).innerHTML = `<div class="memobject md-ripples" onclick="browser.goUp()"><div class="memdata">←</div></div>`;

      document.querySelector(
        ".objects"
      ).innerHTML += `<div class="memobject md-ripples"><div class="memdata">${pathNames
        .join("/")
        .replace("//", "/")}</div></div>`;

      if (browser.showControlPanel) {
        document.querySelector(
          ".objects"
        ).innerHTML += `<div onclick="browser.toggle()"class="memobject md-ripples"><div class="memdata">⚙️ Hide controls</div></div>`;
      } else {
        document.querySelector(
          ".objects"
        ).innerHTML += `<div onclick="browser.toggle()"class="memobject md-ripples"><div class="memdata">⚙️ Show controls</div></div>`;
      }

      if (browser.showControlPanel) {
        document.querySelector(
          ".objects"
        ).innerHTML += `<div class="memobject md-ripples" onclick="browser.newDir()"><div class="memdata">📁 Add catalog</div></div>`;

        if (path[path.length - 1] != "/")
          document.querySelector(
            ".objects"
          ).innerHTML += `<div class="memobject md-ripples" onclick="browser.editDirInit()"><div class="memdata">🔧 Edit this catalog</div></div>`;

        if (path[path.length - 1] != "/")
          document.querySelector(
            ".objects"
          ).innerHTML += `<div class="memobject md-ripples" onclick="browser.newFileInit()"><div class="memdata">📝 Add card</div></div>`;

          if (path[path.length - 1] == "/")
          document.querySelector(
            ".objects"
          ).innerHTML += `<div class="memobject md-ripples" onclick="mem.export()"><div class="memdata">📨 Export data</div></div>`;

          if (path[path.length - 1] == "/")
          document.querySelector(
            ".objects"
          ).innerHTML += `<div class="memobject md-ripples" onclick="document.querySelector('#import').click()"><div class="memdata import">🎁 Import data</div></div>`;


        if (path[path.length - 1] == "/")
          document.querySelector(
            ".objects"
          ).innerHTML += `<input id="import" type="file" style='display: none' accept='text/plain' onchange='openFile(event)'/>`;
      }
      if (path[path.length - 1] !== "/")
      document.querySelector(
        ".objects"
      ).innerHTML += `<div class="memobject md-ripples"><div class="memdata" id="total-objects"></div></div>`;

      document.querySelector(
        ".objects"
      ).innerHTML += `<label id="label">Select order</label>
      <select onchange="browser.selectOrder()" name="cars" id="order">
      <option value="repeatin">Select order</option>
      <option value="repeatin">By repeat in</option>
      <option value="interval">By interval ASC</option>
      <option value="intervalb">By interval DESC</option>
    </select>
    
    `;

      if (mem.offset != 0)
        document.querySelector(".objects").innerHTML += `
    <div class="memobject md-ripples" onclick="browser.switchPage(0)"><div class="memdata">⬅️ Previous page</div></div>
    `;

      let icons = [];
      let data = [];
      let index = 1;
      for (let item of browserCache[0]) {
        // console.log(item);
        document.querySelector(".objects").innerHTML += mem.browserDirSample
          .replace("$icon", JSON.parse(item.DATA)[0][0])
          .replace("$dirName", JSON.parse(item.DATA)[0][1])
          .replace("$goTo", index);

        index++;
      }

      for (let item of browserCache[1]) {
        document.querySelector(".objects").innerHTML += mem.browserObjSample
          .replace("$objData", readFields(item))
          .replace("$ID", item.ID);

        // .replace("$DATA", item.DATA)
      }

      sql(
        `select COUNT(ID) AS TOTAL FROM OBJECTS WHERE PID = '${
          path[path.length - 1]
        }'`,
        (res) => {
          browser.thisDirTotal = res[0].TOTAL;
          let compare = mem.offset + 10;
          if (compare == 0) compare = 10;
          if (browser.thisDirTotal > compare) {
            document.querySelector(".objects").innerHTML += `
          <div class="memobject md-ripples" onclick="browser.switchPage(1)"><div class="memdata">➡️ Next page</div></div>
          `;
          }

          
          document.querySelector(
            "#total-objects"
          ).innerHTML = `📚 TOTAL:  ${res[0].TOTAL}`;
        }
      );
      document.querySelector(".page2-node4").scrollBy(0, 50);
    }
  } catch (e) {}
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
