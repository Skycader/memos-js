let method = null; //methods like need, set, get ... etc.
var db = openDatabase('MEMODB', '1.0', 'OBJECTS DATABASE', null);
db.transaction(function (tx) { 
   //rDATA - repeatition DATA; lrepeat - last repeat unix time; dur - duration;
   tx.executeSql('CREATE TABLE IF NOT EXISTS OBJECTS (ID unique, DATA, RDATE, LREPEAT, SPEC)');
   tx.executeSql('CREATE TABLE IF NOT EXISTS DIRS (ID unique, DATA)');
   tx.executeSql('CREATE TABLE IF NOT EXISTS MEMOROUTES (ID unique, DATA)');
   tx.executeSql('CREATE TABLE IF NOT EXISTS HISTORY (ID unique, DATA)');
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


let sql = (query,callback) => {
   console.log('sql called: ', query)
   db.transaction(function(tx) {
      console.log(tx)  
      tx.executeSql(query, [], 
         
         function(tx, results) {
         console.log(tx)
         //console.log(query)
         console.log(results)
        
         try {
            notify(results.rows[0],callback)
            
         } catch(e) { 
            console.log(e)
         }
         }, 
         function(tx,results) {
            console.log(results, "ERROR")
         })  
       })
    }

let mem = {};
mem.test = () => {
   console.log("test")
}
//sql("SELECT ID FROM OBJECTS LIMIT 1") //warmup db so its shown in panel

FIELDsSample = {
   0: "Original",
   1: "Transcription",
   2: "Translation"
}

OBJexp = {1:"Un renard",
          2 : "A fox"
          }
mem.res = {};
mem.res.obj = 0;
mem.res.sample = 0;
mem.res.question = null;
mem.res.rightAnswer = null;
mem.res.requestedFieldName = null;
let notify = (res,callback) => { //notify is called any time sql is called
   
   
   if (method=="ask2") {
      mem.res.dir = res;
       method=null; //nullificate method, so it's not checked next sql request

       console.log(mem.res)
       let DATA = JSON.parse(mem.res.obj.DATA)
       let SPEC = JSON.parse(mem.res.obj.SPEC);
      
       
       let index = mem.linker(SPEC) //calculate links, meaning what field is asked and which field is considered as answer
       //index looks like this [n,m], where n and m are numbers from 0 to N,M (integers)
        //n -> answer field
        //m -> question field, this needs to be taken from structure table by sql query
        // [DIR] n [data] ---> m [type]
        //example: [FRENCH] un renard -> [translation] would be [1,3] as linker
 
       
       //console.log("INDEX: " + index)
       console.log(index)
       let question = DATA[index[0]]
       mem.res.question = question;
       console.log("Question: " + question)
       let rightAnswer;
       let answerIsCorrect;
       try {
        rightAnswer = JSON.parse(DATA[index[1]])
        answerIsCorrect = (answer.toLowerCase() == rightAnswer.toLowerCase())
       } catch(e) {
         rightAnswer =  DATA[index[1]]
         answerIsCorrect = ((rightAnswer.indexOf(answer) > -1) ? true : false)
       }
       mem.res.rightAnswer = rightAnswer;
       callback(mem);
       
      let dirData = JSON.parse(mem.res.dir.DATA)
      //console.log(requestedFieldName)
      let requestedFieldName = dirData[1][index[1]-1];
      mem.res.requestedFieldName = requestedFieldName;
      console.log(requestedFieldName)
      //console.log("Right answer: " + rightAnswer)
      if (answer) { //if there's any answer provided, then check, else just show question
         
         
         if (answerIsCorrect) {

             
            console.log("OK")
            console.log(((rightAnswer.indexOf(answer) > -1) ? true : false))
            console.log(rightAnswer)
            console.log(answer)
            
            console.log(mem.res.obj.LREPEAT)
            let diff = Date.now()-mem.res.obj.LREPEAT*1;
            console.log("Different in hours: " + diff/1000/60/60)
            diff=2*diff+Date.now();
            console.log("New RDATE: " + new Date(diff))
            mem.update('RDATE',diff,'ID',mem.res.obj.ID)

            SPEC = JSON.stringify(SPEC);
             mem.update("SPEC",SPEC,"ID",mem.res.obj.ID)

             
            //mem.get(res.ID)
             
         } else {
            console.log(((rightAnswer.indexOf(answer) > -1) ? true : false))
            console.log(rightAnswer)
            console.log(answer)
            console.log("BAD")
         }
         ask=null;
          
         answer= null;
       

         
      }
   }
   if (method=="ask") {
      console.log("ASK");
      console.log(res)
      console.log(mem.res.obj)
      mem.res.obj = res;
      console.log(mem.res.obj)
      if (res) { //res is argument given for notify by sql as a result
      mem.check2(res,callback);
      }  else {
         console.log("No objects to repeat")
      }
}
    
   return res;
}

let answer = null;

mem.check = (ans,callback,debug) => {
   //First part of check to find an object in need of repeat
   if (debug) {
   sql(`SELECT ID, DATA, RDATE, LREPEAT, SPEC FROM OBJECTS WHERE ID = "${debug}"`,callback)
   
   } else {
      sql(`SELECT ID, DATA, RDATE, LREPEAT, SPEC FROM OBJECTS WHERE RDATE < '${Date.now()}' LIMIT 1`,callback)
   }
   method='ask'
   answer = ans;
}

mem.getDir = (string) => {
   return string.split(".").slice(0,2).join(".");
}

mem.check2 = (res,callback) => {
   let DIRID = mem.getDir(res.ID);
   sql(`SELECT DATA FROM DIRS WHERE ID = '${DIRID}'`,callback);
   method = "ask2"
}
 
mem.drop = () => {
   sql("DROP TABLE OBJECTS")
   sql("DROP TABLE DIRS")
   sql("DROP TABLE MEMOROUTES")
   sql("DROP TABLE HISTORY")

}

mem.addExample = () => {
   mem.add("1.1.1",["Un renard",["А рынар","123"],"A fox"])
   mem.addDir('1.1',[["FRE","FRENCH"],["Original","Transcription","Translation"]])
}
mem.set = function(ID,DATA,SPEC) {
   console.log(arguments)
   var RDATE = (Date.now()+0.1*60*1000);
   var LREPEAT = Date.now();
   sql(`INSERT INTO OBJECTS (ID, DATA, RDATE, LREPEAT, SPEC) VALUES ("${ID}",'${DATA}',"${RDATE}", "${LREPEAT}", "${SPEC}")`)
    
   //sql(`SELECT ID FROM OBJECTS WHERE ID = '${ID}'`);
 
}

mem.setDir = (ID,DATA) => {
   sql(`INSERT INTO DIRS (ID, DATA) VALUES ("${ID}", '${DATA}')`)
}

mem.addDir = (ID,ARRAY) => {
   mem.setDir(ID,JSON.stringify(ARRAY))
}

mem.setSample = (ID,DATA) => {
   sql(`INSERT INTO SAMPLES (ID, DATA) VALUES ("${ID}", '${DATA}')`);
}

mem.addSample = (ID,ARRAY) => {
   mem.setSample(ID,JSON.stringify(ARRAY))
}

mem.get = (ID) => 
{
   sql(`SELECT * FROM OBJECTS WHERE ID = '${ID}'`);
}

mem.find = (DATA) =>
{
   sql(`SELECT * FROM OBJECTS WHERE DATA like '%${DATA}%'`)
}

mem.need = (LIMIT) =>
   {
       
      if (!LIMIT) {
         LIMIT = 1
      }
      sql(`SELECT ID, DATA FROM OBJECTS WHERE DATE < '${DATA.now()}' LIMIT ${LIMIT}`)
   }

mem.update = (FIELD,DATA,CON1,CON2) => {
   sql(`UPDATE OBJECTS SET ${FIELD} = '${DATA}' WHERE ${CON1} = '${CON2}'`);
}


mem.add = (ID,ARRAY) => {
   let DATA = {}
   let SPEC = [[[]],[0]]
    


   for (var i = 0; i<ARRAY.length; i++) {
      DATA[i+1] = ARRAY[i];
      SPEC[0].push([]);
       
   }

   DATA = JSON.stringify(DATA);
   SPEC = JSON.stringify(SPEC);
   
   mem.set(ID,DATA,SPEC);
}

mem.rem = (ID) => {
   sql(`DELETE FROM OBJECTS WHERE ID = '${ID}'`);
}

let SPEC_EXAMPLE = [[0,1],[2,3]]

//MEMOS SPEC STANDART (MSS) 
//Array index stays for field number 1;
//Array data stands for fields that has been asked with its index id field
//Example: index 1 has 1,2 means 1:1 and 1:2 has already been linked and asked;
//SPECT[1] stands for limitations, such as 0 - nothing should be asked with 0. no 0:1 nor 0:*, nor *:0.
//* stands for any field.
let SPEC = [[[],[],[],[]],[0]]
mem.linker = (SPEC) => {
   let result = mem.sublinker(SPEC);
   //console.log(result)
   if (result) {
      return result;
   } else {
      for (var i = 0; i<SPEC[0].length; i++) {
         
         SPEC[0][i] = [];
      }
      return mem.linker(SPEC);
   }
}
mem.sublinker = (SPEC) => {
   for (var i = 0; i<4; i++) {
      for (var j = 0; j<4; j++) {
         if ((i != j)&&(SPEC[1].indexOf(i) == -1)&&(SPEC[1].indexOf(j) == -1)) {
               if (SPEC[0][i].indexOf(j) == -1 ) {
               //console.log([i,j])
               SPEC[0][i].push(j)
               return [i,j]
               }
         }
      }
   }
}
 
 
/* Examples:
sql("INSERT INTO OBJECTS (ID, DATA, repeat, dir) VALUES ('2.3','DATA',10,'main')")
sql("INSERT INTO LOGS (ID, log) VALUES (3, 'three')")
*/

 