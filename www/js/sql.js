// method = null; //methods like need, set, get ... etc.
var db = 0;
try {
  db = openDatabase("MEMODB", "1.0", "OBJECTS DATABASE", null);
} catch (e) {
  alert("Websql is not supported!");
}
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
        console.log(results, query, "ERROR");
		alert(JSON.stringify(results), JSON.stringify(query), JSON.stringify(tx))
        error(arg1, arg2, arg3);
      }
    );
  });
};
const prom = new Promise((res, rej) => {});
sql2 = (query) =>
  new Promise((resolve, reject) => {
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

mem.find = async (data) => {
  return await sql2(`select * from objects where data like "%${data}%"`);
};
mem.collect = () => {

  sql(
    // `SELECT * FROM OBJECTS  LEFT JOIN DIRS ON OBJECTS.PID=DIRS.ID AND 1*RDATE < ${Date.now()} LIMIT 10`,
    `SELECT OBJECTS.ID, OBJECTS.DATA, RDATE, LREPEAT,  
    (1*RDATE - 1*LREPEAT) AS INTERVAL, SPEC, DIRS.DATA AS DIRDATA, 
    (1*${Date.now()}-1*LREPEAT) AS WAITING, ((1*${Date.now()}-1*LREPEAT)/(1.0*RDATE - 1.0*LREPEAT)-1) AS INTEGRITY 
    FROM OBJECTS JOIN DIRS ON OBJECTS.PID=DIRS.ID AND 1*RDATE < ${Date.now()} AND (1*RDATE - 1*LREPEAT)>=7200000 
    AND INTEGRITY>1
    ORDER BY INTEGRITY DESC LIMIT 100`,
    mem.collectCallback
  );

  sql(
    `SELECT OBJECTS.ID, OBJECTS.DATA, RDATE, LREPEAT, 
    (1*${Date.now()}-1*LREPEAT) AS WAITING, (1*RDATE - 1*LREPEAT) AS INTERVAL, 
    ((1*${Date.now()}-1*LREPEAT)/(1.0*RDATE - 1.0*LREPEAT)-1) AS INTEGRITY, SPEC, 
    DIRS.DATA AS DIRDATA FROM OBJECTS JOIN DIRS ON OBJECTS.PID=DIRS.ID AND 
    (1*RDATE - 1*LREPEAT)<7200000 ORDER BY INTERVAL DESC LIMIT 100`,
    mem.collectCallback
  );

  sql(
    // `SELECT * FROM OBJECTS  LEFT JOIN DIRS ON OBJECTS.PID=DIRS.ID AND 1*RDATE < ${Date.now()} LIMIT 10`,
    `SELECT OBJECTS.ID, OBJECTS.DATA, RDATE, LREPEAT,  
    (1*RDATE - 1*LREPEAT) AS INTERVAL, SPEC, DIRS.DATA AS DIRDATA, 
    (1*${Date.now()}-1*LREPEAT) AS WAITING, ((1*${Date.now()}-1*LREPEAT)/(1.0*RDATE - 1.0*LREPEAT)-1) AS INTEGRITY 
    FROM OBJECTS JOIN DIRS ON OBJECTS.PID=DIRS.ID AND 1*RDATE < ${Date.now()} AND (1*RDATE - 1*LREPEAT)>=7200000 
    ORDER BY INTEGRITY DESC LIMIT 100`,
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
      // if (res[i].hasOwnProperty('INTERVAL')) {
      //   if (res[i].RDATE*1<Date.now()) {
      //     res[i].KID = true
      //     mem.list.push(res[i]);
      //     mem.idList.push(res[i].ID);
      //   }
      // } else {

      mem.list.push(res[i]);
      mem.idList.push(res[i].ID);

      // }

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

mem.define = (increment, comment) => {
  if (increment) {
    mem.answered++;
    console.log("Comment: ", comment, increment);
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
    mem.res.rightAnswer = rightAnswer[0];
    //костыль да и х с ним хочу angular учить а не это вот всё

    if (!mem.code && mem.code !== null) {
      if (!(mem.showAnswer % 2)) {
        mem.res.question = rightAnswer;
        document.querySelector(".pos2").classList.add("remind");
      }
      mem.showAnswer += 1;
    }

    //check for kids in the queue

    console.log(
      "Should you run for ",
      mem.list[mem.answered],
      mem.answered,
      mem.list[mem.answered].INTERVAL < 7200000
    );
    if (mem.list[mem.answered].INTERVAL < 7200000) {
      console.log(
        "Case running for ",
        mem.list[mem.answered],
        mem.answered,
        mem.list[mem.answered].INTERVAL < 7200000
      );

      if (mem.list[mem.answered].RDATE * 1 > Date.now()) {
        mem.define(
          1,
          `This child is not ready yet ${JSON.stringify(
            mem.list[mem.answered]
          )}`
        );
      }
      for (let i = 0; i < mem.answered; i++) {
        item = mem.list[i];

        if (item == undefined) break;

        if (
          item?.INTERVAL < 7200000 &&
          mem.list[mem.answered].INTERVAL < 7200000
        ) {
          console.log("CHILD DETECTED", i);
          console.log(mem.answered);
          mem.define(
            1,
            `Query has a child that didn't become adult ${JSON.stringify(
              mem.list[mem.answered]
            )}`
          );
          break;
        }
      }
    }
  } else {
    console.log("No more objects to repeat");
    mem.nothing = 1;
    mem.dropList();
    mem.collect();
  }
};

mem.showPeople = () => {
  for (let item of mem.list) {
    console.log(item.INTERVAL < 7200000);
  }
};

mem.ask = (pos) => {
  mem.define();
  cards.set(pos);
};

mem.setRDATE = async (id, hours) => {
  await mem.update("RDATE", Date.now() + hours, "ID", id);
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
      console.log("GOT", answerIsCorrect);
      console.log("OK");

      mem.code = 1; //code OK

      let diff = Date.now() - mem.res.obj.LREPEAT * 1;

      console.log("Different in hours: " + diff / 1000 / 60 / 60);
      switch (answerIsCorrect) {
        case 0.5:
          diff = diff + Date.now() + 10 * 1000;
          break; //same
        case 100:
          diff = Date.now() + 1000 * 60 * 60; //+1 hour
          diff = Date.now() + 1000 * 20; //20 seconds
          diff = Date.now() + 1000 * 60 * 10; //10 minutes
          console.log("+1 hour");
          break;
        default:
          diff = 2 * diff + Date.now() + 10 * 1000;
          break;
      }

      let repeatIn = diff - Date.now();
      // console.log('!!!',repeatIn)
      notifier.show(`⌛ +${mem.convertHMS(repeatIn / 1000)}`);
      repeatIn = repeatIn / 1000 / 60 / 60;
      // console.log("New RDATE: " + new Date(diff));
      // console.log(`Repeat in ${repeatIn} hours`);
      mem.update("RDATE", diff, "ID", mem.res.obj.ID);
      mem.list[mem.answered].INTERVAL = diff - Date.now();
      if (answerIsCorrect != 100) {
        //check for postpone
        mem.update("LREPEAT", Date.now(), "ID", mem.res.obj.ID);
        mem.res.obj.SPEC = JSON.stringify(mem.res.obj.result[1]);
        mem.update("SPEC", mem.res.obj.SPEC, "ID", mem.res.obj.ID);
      }
      mem.showAnswer = 0;
    } else {
      mem.update("RDATE", Date.now(), "ID", mem.res.obj.ID);
      mem.update("LREPEAT", Date.now(), "ID", mem.res.obj.ID);
      if (!(mem.showAnswer % 2))
        notifier.show(
          `⌛ - ${mem.convertHMS(
            (Date.now() - mem.res.obj.LREPEAT * 1) / 1000
          )}`,
          true
        );
      console.log("ZEROING FILE");
      mem.res.obj.LREPEAT = Date.now();
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
mem.showAnswer = 0;
mem.check = (answer) => {
  if (mem.showAnswer % 2) return 0;
  // document.querySelector("#memosInput").innerHTML.replaceAll("&nbsp;", " ");
  // document.querySelector("#memosInput").innerHTML = document.querySelector("#memosInput").innerHTML.replaceAll("&nbsp;", "_");
  answer = answer.replaceAll("&nbsp;", " ");
  answer = answer.replaceAll("&gt;", ">");
  answer = answer.replaceAll("&lt;", "<");
  answer = answer.replaceAll("&amp;", "&");

  answer = answer.replaceAll("<br>", "");

  answer = answer.replaceAll("<div>", "\n");
  answer = answer.replaceAll("</div>", "");

  answer = answer.replaceAll("</div>", "");

  // answer = answer.map((item) => item.replaceAll("&nbsp;", " "));
  answer = answer.split("\n");
  mem.userAnswer = answer;

  // console.log(answer);
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
  if (answer == "/postpone") {
    mem.answered++;
    mem.answer(100);
    check.next(-1);
  }

  let rightSymbols = 0;
  let block = 0;
  for (var i = 0; i < answer.length; i++) {
    for (var j = 0; j < answer[i].length; j++) {
      // console.log(
      //   `${answer[i][j].toLowerCase()} == ${mem.res.rightAnswer[i][
      //     j
      //   ].toLowerCase()} ${
      //     answer[i][j].toLowerCase() == mem.res.rightAnswer[i][j].toLowerCase()
      //   }`
      // );
      if (
        answer[i][j].toLowerCase() != mem.res.rightAnswer[i][j].toLowerCase()
      ) {
        block = 1;

        mem.mistake = 1;
      } else {
        if (!block) rightSymbols++;
        // console.log(rightSymbols);
      }
      if (
        !block &&
        answer.join("").length == mem.res.rightAnswer.join("").length &&
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
    mem.percentage = rightSymbols / mem.res.rightAnswer.join("").length;
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

mem.getWeakestItemInRepeat = async function () {
  let interval = await sql2(
    `SELECT *, (RDATE-LREPEAT) AS INTERVAL FROM OBJECTS ORDER BY (RDATE-LREPEAT) ASC LIMIT 1`
  );
  interval = interval[0].INTERVAL;
  mem.weakestItem = mem.convertHMS(interval / 1000);
  return mem.convertHMS(interval / 1000);
};
mem.whenStatus = 0;
mem.when = async (id) => {
  //kids first
  let res;
  let kids = await sql2(
    `SELECT ID, DATA, RDATE, LREPEAT, (1*RDATE-1*LREPEAT) AS INTERVAL, SPEC FROM OBJECTS WHERE INTERVAL<7200000 ORDER BY INTERVAL DESC LIMIT 1`
  );

  let adults = await sql2(
    `SELECT ID, DATA, RDATE, (1*RDATE-1*LREPEAT) AS INTERVAL, LREPEAT, SPEC FROM OBJECTS WHERE (1*RDATE > ${Date.now()}) AND INTERVAL>=7200000 ORDER BY RDATE ASC LIMIT 1`
  );

  // if (kids[0].RDATE*1>Date.now()) kids=null

  if (kids?.length && adults?.length) {
    if (kids[0].RDATE * 1 < adults[0].RDATE) {
      mem.whenStatus = "kids";
      res = kids;
    } else {
      mem.whenStatus = "adults";
      res = adults;
    }
  } else {
    if (kids?.length || adults?.length) {
      if (kids.length) {
        mem.whenStatus = "kids";
        res = kids;
      } else {
        mem.whenStatus = "adults";
        res = adults;
      }
    } else {
      mem.whenStatus = "null";
      res = null;
    }
  }

  if (mem.countResult != "000" && mem.countResult != undefined) {
    //if list has cards
    res = mem.list;
    mem.whenStatus = "mem.list";
  }

  mem.when2(res);
};

mem.nextRepeatInValue = 0;
mem.nextRepeatIn = async function () {
  let res = await sql2(
    `SELECT ID, DATA, MIN(RDATE) AS RDATE, LREPEAT, SPEC FROM OBJECTS WHERE 1*RDATE>${Date.now()} LIMIT 1`
  );
  mem.nextRepeatInValue = mem.calcRepeat(res[0].RDATE * 1);
};

const zeroPad = (num, places) => String(num).padStart(places, "0");

mem.when2 = (res) => {
  // console.log("RES", res);
  let back = 0;
  if (res == null) return 0;
  if (res[0].RDATE == null) {
    return 0;
  }
  if (res[0]) {
    date = new Date(res[0].RDATE * 1);
    // console.log(date);
    timeLeft = (res[0].RDATE * 1 - Date.now()) / 1000;
    // console.log(timeLeft)
    if (timeLeft < 0) {
      timeLeft = Math.abs(timeLeft);
      // back=1
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
    // if (mem.list.length) back=1
    if (mem.whenStatus == "mem.list") result = "+" + result;
    document.querySelector("#info1").innerHTML = result;

    return result;
  }
};

mem.convertHMS = (seconds) => {
  timeLeft = seconds;
  if (timeLeft < 0) timeLeft = 0;
  let yearsLeft = Math.floor(timeLeft / 60 / 60 / 24 / 365);
  let daysLeft = Math.floor(
    (timeLeft - yearsLeft * 60 * 60 * 24 * 365) / 60 / 60 / 24
  );
  let hoursLeft = Math.floor(
    (timeLeft - yearsLeft * 60 * 60 * 24 * 365 - daysLeft * 60 * 60 * 24) /
      60 /
      60
  );
  let minutesLeft = Math.floor(
    (timeLeft -
      yearsLeft * 60 * 60 * 24 * 365 -
      daysLeft * 60 * 60 * 24 -
      hoursLeft * 60 * 60) /
      60
  );
  if (yearsLeft > 0)
    return `${zeroPad(yearsLeft, 2)}:${zeroPad(daysLeft, 2)}:${zeroPad(
      hoursLeft,
      2
    )}:${zeroPad(minutesLeft, 2)}`;
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
    document.querySelector(
      "#info4"
    ).innerHTML = `${mem.deadItems} · ${mem.maxIntegrityValue} · ${mem.averageIntegrityValue}`;

    switch (Math.floor(mem.averageIntegrityValue / 25)) {
      case 0:
        circle.leftBulb.green();
        break;
      case 1:
        circle.leftBulb.yellow();
        break;
      case 2:
        circle.leftBulb.orange();
        break;
      case 3:
        circle.leftBulb.red();
        break;
      default:
        circle.leftBulb.red();
        break;
    }


    switch (Math.floor(mem.minimalIntervalValue / 6)) {
      case 0:
        circle.rightBulb.green();
        break;
      case 1:
        circle.rightBulb.yellow();
        break;
      case 2:
        circle.rightBulb.orange();
        break;
      case 3:
        circle.rightBulb.red();
        break;
      default:
        circle.rightBulb.red();
        break;
    }

    if (mem.children > 0) {
      circle.rightBulb.green();
    }
    // document.querySelector("#info4").innerHTML = mem.memoPowerResult;
    // document.querySelector("#info5").innerHTML = mem.countTotalResult2;
    // document.querySelector("#info5").innerHTML = mem.weakestItem;
    document.querySelector("#info5").innerHTML = numberWithCommas(
      zeroPad(mem.canEarnValue, 9),
      "."
    );

    document.querySelector(".memobase-info-1").innerHTML =
      `Total cards ` + mem.countTotalResult2;

    document.querySelector(".memobase-info-2").innerHTML =
      `Memopower ` + mem.memoPowerResult + "h";

    document.querySelector(".memobase-info-3").innerHTML =
      `Children ` + mem.inQuery;

      document.querySelector(".memobase-info-4").innerHTML =
      `Weakest card ` + mem.minimalIntervalIcon + " " + Math.floor(mem.minimalIntervalValue) + "h";

    if (percentage > 0) {
      document.querySelector("#mycircle").classList.remove("hidden");
    } else {
      document.querySelector("#mycircle").classList.add("hidden");
    }
  }
  document.querySelector("#mycircle").style["stroke-dasharray"] =
    percentage + ", 100";
  if (update) {
    mem.getWeakestItemInRepeat();
    mem.countQuery();
    mem.todayAnswered();
    mem.countDaily();
    mem.countDeadItems();
    mem.countDeadHours();
    mem.countTotal();
    mem.count();
    mem.memoPower();
    mem.maxIntegrity();
    mem.averageIntegrity();
    mem.minimalInterval()
    mem.canEarn();
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

mem.maxIntegrityValue = 0;

mem.maxIntegrity = async () => {
  res = await sql2(
    `SELECT ((1*${Date.now()}-1*LREPEAT)/(1.0*RDATE - 1.0*LREPEAT)-1) AS INTEGRITY,
    (1*RDATE-1*LREPEAT) AS INTERVAL
     FROM OBJECTS
     WHERE (INTERVAL > 7200000) AND (1*RDATE < ${Date.now()})
     ORDER BY INTEGRITY DESC
     LIMIT 1`
  );
  mem.maxIntegrityValue = zeroPad(1 * (res[0].INTEGRITY * 100).toFixed(0), 3);
};

mem.canEarnValue = 0;
mem.canEarn = async () => {
  let res = await sql2(`
  SELECT
  SUM(2*(1*${Date.now()}-1*LREPEAT)) AS CAN_EARN
  FROM OBJECTS
  WHERE (1*RDATE < ${Date.now()})
  `);

  mem.canEarnValue = 1 * (res[0]["CAN_EARN"] / 1000 / 60 / 60).toFixed(0);
};

mem.averageIntegrityValue = 0;

mem.averageIntegrity = async () => {
  let res = await sql2(`
  SELECT
  AVG((1*${Date.now()}-1*LREPEAT)/(1.0*RDATE - 1.0*LREPEAT)-1) AS AVG_INTEGRITY,
  (1*RDATE-1*LREPEAT) AS INTERVAL
  FROM OBJECTS
  WHERE (INTERVAL > 7200000) AND (1*RDATE < ${Date.now()})
  `);
  mem.averageIntegrityValue = zeroPad(
    1 * (res[0]["AVG_INTEGRITY"] * 100).toFixed(),
    3
  );
};
mem.minimalIntervalValue = 0
mem.minimalIntervalIcon = 0
mem.minimalIntervalCard = 0
mem.minimalInterval = async () => {
  let res = await sql2(`

  SELECT (1*RDATE-1*LREPEAT) AS INTERVAL,
  OBJECTS.PID,
  OBJECTS.DATA AS OBJECTS_DATA,
  DIRS.DATA AS DIRS_DATA
  FROM OBJECTS 
  JOIN DIRS ON OBJECTS.PID=DIRS.ID
  WHERE INTERVAL > 0
  ORDER BY INTERVAL ASC
  LIMIT 1
  `)

  mem.minimalIntervalValue = (res[0].INTERVAL/1000/60/60)
  mem.minimalIntervalCard = res[0].OBJECTS_DATA

  mem.minimalIntervalIcon = JSON.parse(res[0].DIRS_DATA)[0][0]
}

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

mem.inQuery = 0;
mem.children = 0
mem.countQuery = async () => {
  let res = await sql2(
    `SELECT COUNT(ID), RDATE, (1*RDATE-1*LREPEAT) AS INTERVAL FROM OBJECTS WHERE (1*RDATE-1*LREPEAT)<7200000`
  );
  res = res[0]["COUNT(ID)"];
  mem.children = res
  res = numberWithCommas(zeroPad(res, 9), ".");
  mem.inQuery = res;
  return res;
};

mem.count = async function () {
  let repeats = await sql2(
    `SELECT COUNT(ID) FROM OBJECTS WHERE 1*RDATE < ${Date.now()} AND (1*RDATE-1*LREPEAT)>7200000`
  );
  repeats = repeats[0]["COUNT(ID)"];
  let kids = await sql2(
    `SELECT ID, DATA, RDATE, (1*RDATE-1*LREPEAT) AS INTERVAL FROM OBJECTS WHERE (1*RDATE-1*LREPEAT)<7200000 ORDER BY INTERVAL DESC LIMIT 1`
  );
  let res = [repeats, kids];
  if (kids.length && kids[0].RDATE * 1 < Date.now()) repeats++;

  let result = zeroPad(repeats, 3);
  mem.countResult = result;
  mem.circleData();
  return res;
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

mem.deadItems = 0;
mem.countDeadItems = async () => {
  let bodies = await sql2(`SELECT
  *,
  COUNT(ID) AS DEAD,
  (1*RDATE-1*LREPEAT) AS INTERVAL,
  (1*${Date.now()}-1*RDATE) AS WT,
  (1*${Date.now()}-1*LREPEAT)/(1.0*RDATE - 1.0*LREPEAT) AS INTEGRITY
  FROM OBJECTS WHERE (INTERVAL<WT) AND (INTERVAL > 0) AND (1*RDATE < ${Date.now()})`);

  mem.deadItems = zeroPad(bodies[0]["DEAD"], 3);
};

mem.deadHours = 0;
mem.countDeadHours = async () => {
  let dhours = await sql2(`SELECT
   (1*${Date.now()}-1*RDATE) AS WT,
   SUM(1*RDATE-1*LREPEAT) AS DHOURS,
   (1*RDATE-1*LREPEAT) AS INTERVAL
   FROM OBJECTS WHERE (INTERVAL<WT) AND (1*RDATE < ${Date.now()})`);
  mem.deadHours = zeroPad(
    ((dhours[0]["DHOURS"] * 1) / 1000 / 60 / 60 / 24 / 30).toFixed(0),
    3
  );
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

  if (ITEM_G_COUNT < 1) {
    ITEM_G_COUNT++;
    sql2(
      `INSERT INTO OBJECTS (ID,PID, DATA, RDATE, LREPEAT, SPEC) VALUES ("${ID}","${PID}",'${DATA}',"${RDATE}", "${LREPEAT}", '${SPEC}')`
    ).then((res) => {
      mem.collect();
    });
    // sql(
    //   `INSERT INTO OBJECTS (ID,PID, DATA, RDATE, LREPEAT, SPEC) VALUES ("${ID}","${PID}",'${DATA}',"${RDATE}", "${LREPEAT}", '${SPEC}')`,
    //   undefined,
    //   mem.setItemError,
    //   PID,
    //   DATA,
    //   SPEC
    // );
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
  if (G_COUNT < 1) {
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

mem.update = async (FIELD, DATA, CON1, CON2) => {
  await sql2(
    `UPDATE OBJECTS SET ${FIELD} = '${DATA}' WHERE ${CON1} = '${CON2}'`
  );
};

mem.nullify = (ID) => {
  sql(`UPDATE OBJECTS SET RDATE = '${Date.now()}' WHERE ID = '${ID}'`);
  sql(`UPDATE OBJECTS SET LREPEAT = '${Date.now()}' WHERE ID = '${ID}'`);
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
mem.addItem = (ID, ARRAY, QFIELDS) => {
  try {
    let DATA = {};
    let SPEC = { links: [], qfields: QFIELDS || [] };
    DATA = ARRAY;
    for (var i = 0; i < ARRAY.length; i++) {
      if (ARRAY[i][0][0] !== "") {
        SPEC.links.push([]);
      } else {
        SPEC.links.push(null);
      }
    }

    DATA = JSON.stringify(DATA);
    // console.log(DATA);
    SPEC = JSON.stringify(SPEC);
    // console.log(ARRAY.length);
    if (ARRAY.length > 1) {
      mem.setItem(ID, DATA, SPEC);
    } else {
      notifier.show(`⚠️ Too little data`, true);
      throw new Error("Too small");
    }
  } catch (e) {
    alert("Error: ", e);
    notifier.show(`⚠️ Error during adding ${e}`, true);
    // console.log(e);
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
      if (SPEC.links[i] !== null) SPEC.links[i] = [];
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
        if (LINKS[i] !== null && LINKS[j] !== null)
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
mem.show = (DIRID, callback, order, SEARCH_DATA) => {
  if (order != "find") {
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
     result`,
      callback //     ASC LIMIT ${mem.offset},1000000`,
    );
  } else {
    sql(`SELECT * FROM DIRS LIMIT 0`, callback);
  }
  // mem.getDirById(DIRID,callback)
  switch (order) {
    case "find":
      sql(
        `
        SELECT * FROM OBJECTS WHERE DATA LIKE '%${SEARCH_DATA}%' 
        LIMIT ${mem.offset},10
      `,
        callback
      );
      break;
    case "intervalAsc":
      sql(
        `SELECT * FROM OBJECTS WHERE PID = "${DIRID}" GROUP BY ID ORDER BY SUM(RDATE-LREPEAT) LIMIT ${mem.offset},10`,
        callback
      );
      break;
    case "intervalDesc":
      sql(
        `SELECT * FROM OBJECTS WHERE PID = "${DIRID}" GROUP BY ID ORDER BY SUM(RDATE-LREPEAT) DESC LIMIT ${mem.offset},10`,
        callback
      );
      break;
    case "integrityDesc":
      sql(
        `SELECT * , (1*${Date.now()}-1*LREPEAT)/(1.0*RDATE - 1.0*LREPEAT) AS INTEGRITY FROM OBJECTS WHERE PID = "${DIRID}" GROUP BY ID ORDER BY INTEGRITY DESC LIMIT ${
          mem.offset
        },10`,
        callback
      );
      break;
    case "lastRepeatDesc":
      sql(
        `SELECT * FROM OBJECTS WHERE PID = "${DIRID}" GROUP BY ID ORDER BY LREPEAT DESC LIMIT ${mem.offset},10`,
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

mem.editItem = async function (ID, DATA) {
  //strings
  mem.dropList();
  try {
    let RES = await sql2(`SELECT SPEC FROM OBJECTS WHERE ID = '${ID}'`);
    SPEC = RES[0].SPEC;
    SPEC = JSON.parse(SPEC);
    await sql2(`UPDATE OBJECTS SET DATA = '${DATA}' WHERE ID = '${ID}'`);
    ARRAY = JSON.parse(DATA);
    browser.ARRAY = ARRAY;
    browser.SPEC = SPEC;
    if (ARRAY.filter((item) => !!item[0][0]).length != SPEC.links.length) {
      SPEC.links = [];
      for (let i = 0; i < ARRAY.length; i++) {
        if (ARRAY[i][0][0] !== "") {
          SPEC.links.push([]);
        } else {
          SPEC.links.push(null);
        }
      }
      SPEC = JSON.stringify(SPEC);
      await sql2(`UPDATE OBJECTS SET SPEC = '${SPEC}' WHERE ID = '${ID}'`);
    }
  } catch (e) {
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
mem.searchData = "";
mem.browser = (goTo, order, SEARCH_DATA) => {
  // console.log("SEARCH_DATA", SEARCH_DATA)
  if (SEARCH_DATA) mem.searchData = SEARCH_DATA;
  mem.when();
  counter = 0;
  cached = 0;
  browserCache = [];
  browserString = "";
  if (goTo == undefined) {
    goTo = "/";
  }

  mem.show(goTo, mem.setCache, browser.order, SEARCH_DATA);
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
	console.log(choice)
  if (mem.searchData !== "") choice = "find "+mem.searchData
  ITEM_G_COUNT = 0;
  G_COUNT = 0;
  if (pathNames.length == 0) {
    pathNames[0] = "/";
  }
  // alert(choice)
  command = choice.split(" ")[0].toLowerCase();

  switch (command) {
    //0: list content
    case "ls":
      mem.browser(path[path.length - 1],browser.order);
      break;
    case "find":
      mem.browser(
        path[path.length - 1],
        "find",
        choice.split(" ").slice(1).join(" ").toLowerCase()
      );
    case "lsi":
      mem.browser(path[path.length - 1], "interval");
      break;
    case "lsib":
      mem.browser(path[path.length - 1], "interval backwards");
      break;
    case "lslrd":
      mem.browser(path[path.length - 1], "lastrepeat desc");
      break;
    case "lsid":
      mem.browser(path[path.length - 1], "integrity desc");
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
      importDainta();
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
browser.movingDirID = "";
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
    items = item.value.split("\n");
    items = items.map((item) => item.replace(/\s+/g, " ").trim());
    arr.push([items]);
  }
  if (arr.filter((item) => item[0][0].length > 0).length < 2) return "ERROR";

  return arr;
};

browser.editFile = async function (id) {
  qfields = browser.readLocks();
  let rows = browser.collectInput();
  if (rows !== "ERROR") {
    rows = JSON.stringify(rows);
    rows = rows.replaceAll("'", "''");

    if (browser.changeDetected) await mem.editItem(id, rows);
    console.log("Q", id, qfields);
    if (browser.lockFieldEngaged) await mem.editItemQFields(id, qfields);
    if (browser.lockFieldEngaged || browser.changeDetected)
      notifier.show(`📝 Edit successful`);
    browser.lockFieldEngaged = 0;
    browser.changeDetected = false;
  } else {
    notifier.show(`⚠️ Too little data`, true);
  }
  mem.terminalCommand("ls");
};

browser.search = () => {
  mem.searchData = ""
  if (mem.terminalChoice.includes("find")) {
    mem.terminalCommand("ls");
    return;
  }
  let search = prompt("Type a word");
  if (search !== "") {
    mem.terminalCommand("find " + search);
  } else {
    mem.terminalCommand("ls");
  }
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
    notifier.show("📁 Added catalog");
  } else {
    notifier.show("📁 Too little data", true);
  }
  mem.terminalCommand("ls");
};

browser.addFile = () => {
  let currentDirID = path[path.length - 1];
  let DATA = JSON.stringify(browser.collectInput());
  DATA = DATA.replaceAll("'", "''");
  if (browser.collectInput() !== "ERROR") {
    notifier.show(`📝 Card added`);
    let qfields = JSON.parse(browser.readLocks());
    mem.addItem(currentDirID, JSON.parse(DATA), qfields);
  } else {
    notifier.show(`⚠️ Too little data`, true);
  }
  browser.lockFieldEngaged = 0;
  mem.terminalCommand("ls");
};
browser.newFileInit = () => {
  mem.getDirById(path[path.length - 1], browser.newFile);
};
browser.editDirInit = () => {
  mem.getDirById(path[path.length - 1], browser.editDir);
};
browser.moveDirInit = (ctx) => {
  browser.movingDirID = path.at(-1);
  browser.goUp();
  notifier.show("🚚 Choose the dir to move to");
};
browser.moveDirFinish = (ctx) => {
  mem.moveDir(browser.movingDirID, path.at(-1));
  notifier.show("🚚 Moving complete");
  browser.movingDirID = "";
  mem.terminalCommand("ls");
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
    ).innerHTML += `<div class="memobject md-ripples field-name" onclick="browser.lockField(this)" style="border-bottom: 5px dotted #151515"><div class="memdata">${field}</div></div>`;
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
browser.lockFieldEngaged = 0;
browser.lockField = (elm) => {
  browser.lockFieldEngaged = 1;
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
browser.fields = 0;
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
      if (fields[index] == undefined) fields[index] = [[""]];
      browser.fields = fields;
      let qfields = JSON.parse(obj[0].SPEC).qfields; //array
      lock = browser.showLock(qfields.indexOf(index) > -1);
      document.querySelector(
        ".objects"
      ).innerHTML += `<div class="memobject md-ripples field-name" onclick="browser.lockField(this)"style="border-bottom: 5px dotted #151515"><div class="memdata">${field} ${lock} </div></div>`;
      if (fields[index][0] == undefined) fields[index][0] = [""];
      document.querySelector(
        ".objects"
      ).innerHTML += `<textarea onchange="browser.triggerChange()" oninput="auto_grow(this)" class='memos-object-input memos-userInput'>${fields[
        index
      ][0].join("\n")}</textarea>`;
      index++;
    }
  } catch (e) {
    console.log(e);
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
  ).innerHTML += `<div class="memobject md-ripples" onclick="browser.postpone('${obj[0].ID}')"><div class="memdata">🕦 Postpone</div></div>`;

  document.querySelector(
    ".objects"
  ).innerHTML += `<div class="memobject md-ripples" onclick="browser.nullify('${obj[0].ID}')"><div class="memdata">⏲️ Nullify file</div></div>`;

  document.querySelector(
    ".objects"
  ).innerHTML += `<div class="memobject md-ripples" onclick="browser.removeFile('${obj[0].ID}')"><div class="memdata">🗑️ Delete file</div></div>`;

  document.querySelector(".page2-node4").scrollTo({
    top: 0, //window.innerHeight-460
    behavoir: "smooth",
  });
};
calculateIntegrity = (value) => {
  if (value < 0) return 0;
  if (value == Infinity) return 0;
  return value;
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
    // console.log(item[0])
    try {
      str += item[0].join("").length
        ? item[0]
            .map((item) => {
              return item.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
            })
            .join("<br>") + "<br>--------------------<br>"
        : "";
    } catch (e) {
      console.error(e);
    }
  }

  str += "⌛ " + mem.calcRepeat(data.RDATE) + "<br>"; //<-- repeat in

  str += //waiting time
    "⏰ " +
    mem.convertHMS(
      (Date.now() - 1 * data.RDATE) / 1000 //<-- strength
    );
  browser.data = data;

  str += //износ
    "<br>🔋 " +
    //integirty
    calculateIntegrity(
      100 *
        ((Date.now() - 1 * data.RDATE) / (1 * data.RDATE - 1 * data.LREPEAT))
    ).toFixed(0) +
    "%";

  str +=
    "<br>💪 " +
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

browser.postpone = async (id) => {
  let hours = 1 * prompt("Enter hours");
  if (isNaN(hours)) {
    alert("Iput is not a number");
    return;
  }
  await mem.setRDATE(id, hours * 1000 * 60 * 60);
  mem.collect();
  browser.render(1, id);
};

browser.nullify = (id) => {
  let confirm = prompt("Type `nullify` to confirm delete");
  if (confirm == "nullify") {
    mem.nullify(id);
    browser.render(1, id);
  }
};

browser.removeFile = (id) => {
  let confirm = prompt("Type `delete` to confirm delete");
  if (confirm == "delete") {
    mem.rem(id);
    notifier.show("🗑️ Card erased");
  }
  mem.terminalCommand("ls");
};
browser.removeDir = () => {
  let confirm = prompt("Type `delete` to confirm delete");
  if (confirm == "delete") {
    mem.rmdir(path[path.length - 1]);
  }

  mem.terminalCommand("ls");
};
browser.movePanel = () => {
  document
    .querySelector(".memotable-upside")
    .classList.toggle("memotable-upside-down");
};
browser.order = "repeat in asc"
browser.selectOrder = () => {
	console.log("ORDER")
  browser.order = document.querySelector("#order").value
  let order = browser.order
  switch (order) {
    case "repeatInAsc":
      mem.terminalCommand("ls repeatIn");
      break; 
    case "intervalAsc":
      mem.terminalCommand("ls intervalAsc");
      break;
    case "intervalDesc":
      mem.terminalCommand("ls intervalDesc");
	   break
    case "lastRepeatDesc":
      mem.terminalCommand("ls lastRepeatDesc");
	  break
    case "integrityDesc":
      mem.terminalCommand("ls integrityDesc");
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
  document.querySelector(".import").innerHTML = `${str}`;
  // console.log(str)
};

async function importBackup(data) {
  document.querySelector(".memotable").classList.toggle("noSnap");
  document.querySelector(".memotable-upside").classList.toggle("noSnap");

  browser.importProgress("🎁 Initializing import sequence...");
  notifier.show(`🎁 Inititslizing import...`);
  browser.importProgress("🎁 Clearing database...");

  await sql2("DROP TABLE OBJECTS");
  await sql2("DROP TABLE DIRS");
  await sql2("DROP TABLE MEMOROUTES");
  await sql2("DROP TABLE HISTORY");

  browser.importProgress("🎁 Creating database...");
  await sql2(
    `CREATE TABLE IF NOT EXISTS OBJECTS (ID unique, PID, DATA, RDATE, LREPEAT, SPEC)`
  );
  await sql2(`CREATE TABLE IF NOT EXISTS DIRS (ID unique, PID, DATA)`);
  await sql2(`CREATE TABLE IF NOT EXISTS MEMOROUTES (ID unique, DATA)`);
  await sql2(`CREATE TABLE IF NOT EXISTS HISTORY (ID unique, DATA)`);

  browser.importProgress("Parsing data...");
  let parsed = JSON.parse(data);
  mem.parsedBackup = parsed;

  let object = parsed[0][0];
  let i = 0;
  browser.importProgress("🎁 Inititslizing import...");

  browser.importProgress("🎁Counting cards...");
  i = 0;
  while (object) {
    object = parsed[0][i];
    i++;
  }

  let cardsAmount = i;

  i = 0;
  object = parsed[0][0];

  let time1 = Date.now();
  while (object) {
    object.DATA = object.DATA.replaceAll(`'`, `''`);
    await sql2(
      `INSERT INTO OBJECTS (ID,PID, DATA, RDATE, LREPEAT, SPEC) VALUES ("${object.ID}","${object.PID}",'${object.DATA}',"${object.RDATE}", "${object.LREPEAT}", '${object.SPEC}')`
    );
    browser.importProgress(
      `🎁 Importing cards (${((i * 100) / cardsAmount).toFixed(
        0
      )}%) ${i} of ${cardsAmount}`
    );
    i++;
    object = parsed[0][i];
  }

  console.log(Date.now() - time1);
  let dir = parsed[1][0];
  i = 0;
  while (dir) {
    dir = parsed[1][i];
    i++;
  }

  let foldersAmount = i;

  i = 0;
  dir = parsed[1][0];
  while (dir) {
    await sql2(
      `INSERT INTO DIRS (ID, PID, DATA) VALUES ("${dir.ID}", "${dir.PID}", '${dir.DATA}')`
    );
    browser.importProgress(
      `🎁 Importing dirs (${((i * 100) / foldersAmount).toFixed(
        0
      )}%) ${i} of ${foldersAmount}`
    );
    i++;
    dir = parsed[1][i];
  }

  browser.importProgress(`🎁 Import data`);
  notifier.show(`🎁 Import complete`);
  document.querySelector(".memotable").classList.toggle("noSnap");
  document.querySelector(".memotable-upside").classList.toggle("noSnap");
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
  if (!mem.terminalChoice.includes("find")) {
    mem.terminalCommand("ls");
  } else {
    mem.terminalCommand("find " + mem.searchData);
  }
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
        ).innerHTML += `<div class="memobject md-ripples" onclick="browser.search()"><div class="memdata">${
          !mem.terminalChoice.includes("find") ? "🔎 Search" : "🚪 Back to list"
        }</div></div>`;

        document.querySelector(
          ".objects"
        ).innerHTML += `<div class="memobject md-ripples" onclick="mem.terminalCommand('ls')"><div class="memdata">🔃 Refresh</div></div>`;

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
          ).innerHTML += `<div class="memobject md-ripples" onclick="browser.moveDirInit(this)"><div class="memdata">🚚 Move this catalog...</div></div>`;

        if (browser.movingDirID !== "")
          document.querySelector(
            ".objects"
          ).innerHTML += `<div class="memobject md-ripples" onclick="browser.moveDirFinish(this)"><div class="memdata">🚚 Move here</div></div>`;

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

	  document.cre
      document.querySelector(
        ".objects"
      ).innerHTML += `<label id="label">Select order</label>
      <select onchange="browser.selectOrder()" name="cars" id="order">
      <option value="${browser.order}">${browser.order}</option>
      <option value="repeatInAsc">By repeat in</option>
      <option value="intervalAsc">By interval ASC</option>
      <option value="intervalDesc">By interval DESC</option>
      <option value="lastRepeatDesc">By last repeat DESC</option>
      <option value="integrityDesc">By integrity DESC</option>
    </select>
	`;
		//console.log(document.querySelector("#order").value)

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
        browser.item = item;
        // console.log("ITEM: ", item)
        document.querySelector(".objects").innerHTML += mem.browserObjSample
          .replace("$objData", readFields(item))
          .replace("$ID", item.ID);

        // .replace("$DATA", item.DATA)
      }

      let command = !mem.terminalChoice.includes("find")
        ? `select COUNT(ID) AS TOTAL FROM OBJECTS WHERE PID = '${
            path[path.length - 1]
          }'`
        : `select COUNT(ID) AS TOTAL FROM OBJECTS WHERE DATA LIKE '%${mem.searchData}%' `;
      // console.log("COMMAND: ", command)
      sql(command, (res) => {
        browser.thisDirTotal = res[0].TOTAL;
        let compare = mem.offset + 10;
        if (compare == 0) compare = 10;
        if (browser.thisDirTotal > compare) {
          if (!document.querySelector(".objects").innerHTML.includes("➡️"))
            document.querySelector(".objects").innerHTML += `
          <div class="memobject md-ripples" onclick="browser.switchPage(1)"><div class="memdata">➡️ Next page</div></div>
          `;
        }

        document.querySelector(
          "#total-objects"
        ).innerHTML = `📚 TOTAL:  ${res[0].TOTAL}`;
      });
      document.querySelector(".page2-node4").scrollBy(0, 50);
    }
  } catch (e) {
    // console.error(e)
  }

  document.querySelector(".page2-node4").scrollTo({
    top: 0, //window.innerHeight-460
    behavoir: "smooth",
  });
};

mem.newAvailable = () => {
  if (mem.nothing && mem.list.length) {
    // notifier.show("New cards available")
    mem.nothing = 0;
    mem.answered = 0;
    setTimeout(mem.setAvailable, 1000);
  }
};

mem.setAvailable = () => {
  // console.error("NEW AVAILABLE!")
  mem.define();
  check.next();
};

mem.collect(); //collect items to repeat
setInterval(mem.collect, 5000);
mem.when();
mem.getWeakestItemInRepeat();
mem.countQuery();
mem.todayAnswered();
mem.countDaily();
mem.count();
mem.countDeadItems();
mem.countDeadHours();
mem.countTotal();
mem.memoPower();
mem.maxIntegrity();
mem.averageIntegrity();
mem.minimalInterval()
mem.canEarn();
// const clickHandler = (event) => event.target.focus()
// document.addEventListener('click',clickHandler)
setInterval(mem.when, 5000);
// setInterval(mem.newAvailable,1000)
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
