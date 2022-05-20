method = null; //methods like need, set, get ... etc.
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


sql = (query,callback) => {
   console.log('sql called: ', query)
   mem.query = query;
   db.transaction(function(tx) {
     // console.log(tx)  
      tx.executeSql(query, [], 
         
         function(tx, results) {
         //console.log(tx)
         //console.log(query)
         //console.log(results)
         
         try {
            callback(results.rows)
         } catch(e) {}
          
         try {
            
           // notify(results.rows[0],callback)
            
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

mem.list = [];
mem.dirList = [];
mem.idList = [];
mem.collect = () => {
   sql(`SELECT ID, DATA, RDATE, LREPEAT, SPEC FROM OBJECTS WHERE RDATE < '${Date.now()}' LIMIT 10`, mem.collectCallback)
}
let ga = 0;
mem.collectCallback = (res) => {
    
  for (var i = 0; i<res.length; i++) {
      
      if (mem.idList.indexOf(res[i].ID) == -1) {
         //console.log(mem.list.indexOf(res[i]))
         //console.log("pushing")
         //console.log(res[i])
         mem.list.push(res[i])
         mem.idList.push(res[i].ID)
         
      } else {
         console.log("Already in")
      }
     
   }

   for (var i = 0; i<mem.list.length; i++) {
      mem.list[i].DIRID = mem.getDir(mem.list[i].ID);
      mem.getDirInfo(i,mem.list[i].DIRID)
       
   }
   
}

mem.reservedI = null;
mem.getDirInfo = (reservedI,dirid) => {
   try {
    
   mem.reservedI = reservedI;
    
   sql(`SELECT DATA FROM DIRS WHERE ID = '${dirid}'`,mem.getDirInfoCallback);
   } catch(e) {console.log(e)}
}
mem.getDirInfoCallback = (res) => {
   try {
    
   mem.dirList.push(res[0].DATA)
   } catch(e) { console.log(e)}
}

mem.answered = 0;
mem.lastAnswered = null;
mem.checkNew = (answer) => {
   mem.res.obj = mem.list[mem.answered];
   if (mem.res.obj) {
      
      
      
      mem.res.dir = mem.dirList[mem.answered]
       
      mem.lastAnswered = mem.answered;
       
   } else {
      console.log("No more objects to repeat")
      mem.nothing=1;
   }
        
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
   let dirData = JSON.parse(mem.res.dir)
  //console.log(requestedFieldName)
  let reqFieldName = dirData[1][index[1]-1];
  mem.res.reqFieldName = reqFieldName;
  console.log(reqFieldName)
   let rightAnswer;
   let answerIsCorrect;
   rightAnswer = DATA[index[1]]
   mem.rightAnswer = rightAnswer;
   if (answer) {
      console.log("DATA")
      console.log(DATA[index[1]])
   try {
       
    rightAnswer = DATA[index[1]]
    mem.rightAnswer = rightAnswer;
    answerIsCorrect = (answer.toLowerCase() == rightAnswer.toLowerCase())
   } catch(e) {
      console.log(e)
     rightAnswer =  DATA[index[1]]
     
     console.log("ARRAY DETECTED")
     rightAnswer = rightAnswer.map(function(e) {
        return e.toLowerCase();
     })
     mem.rightAnswer = rightAnswer;
     /*
     const lower = arr.map(element => {
     return element.toLowerCase();
     });
     */
        
     answer = answer.toLowerCase();
     answerIsCorrect = ((rightAnswer.indexOf(answer) > -1) ? true : false)
     //alert(answerIsCorrect)
   }
   }
   mem.res.rightAnswer = rightAnswer;
   try {
   callback(mem);
   } catch(e) {}
   
  
  //console.log("Right answer: " + rightAnswer)
  if (answer) { //if there's any answer provided, then check, else just show question
     
     
     if (answerIsCorrect) {

        
        console.log("OK")
        mem.code = 1; //code OK


        console.log(((rightAnswer.indexOf(answer) > -1) ? true : false))
        console.log(rightAnswer)
        console.log(answer)
        console.log(mem.res)
        console.log(mem.res.obj.LREPEAT)
         
        let diff = Date.now()-mem.res.obj.LREPEAT*1;
        console.log("Different in hours: " + diff/1000/60/60)
        
        diff=2*diff+Date.now();
        console.log("New RDATE: " + new Date(diff))
        mem.update('RDATE',diff,'ID',mem.res.obj.ID)

        

        SPEC = JSON.stringify(SPEC);
        mem.update("SPEC",SPEC,"ID",mem.res.obj.ID);
         
        
        //mem.get(res.ID)
        check.clear();
         
     function inner() {
        //alert()
        //check.next(mem.code)
     }
        

     } else {
        
        check.wrong();
        console.log(((rightAnswer.indexOf(answer) > -1) ? true : false))
        console.log(rightAnswer)
        console.log(answer)
        console.log("BAD")
        mem.code = 0;

        
     }
     ask=null;
      
     answer= null;
   

     
  }


if (mem.code != null) {
    
   //check.right();
  // setTimeout(check.next,200,mem.code)
  if (mem.code == 1) {
     //alert("Clearing: " + mem.answered)
     mem.list[mem.answered]=null;
     mem.idList[mem.answered]=null;
     mem.dirList[mem.answered]=null;
    // alert("++", mem.answered)
     mem.answered++;
     //!!! Here should be updating the memos buffer
     mem.collect();
    
   check.next(mem.code)
  }
    

  //check.next(mem.code);
  mem.code = 0;

} 
}

mem.query = null;
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
mem.res.reqFieldName = null;
mem.code = null;
mem.nothing = null;
notify = (res,callback) => { //notify is called any time sql is called
	if (!method) {
	try {
		callback(res)
	} catch(e) {}
	}
	if (method=="update") {
      try {
		  //alert()
		  console.log("update called")
         callback(res)
		 // mem.res=res;
         } catch(e) {}
   }
   if (method=="when") {
      console.log(res)
      mem.res = res;
      try {
          
      callback(res)
      } catch(e) {} 
      
   }
   if (method=="get") {
      try {
         callback(res)
         } catch(e) {} 
      mem.res = res;
   }
   
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
       let dirData = JSON.parse(mem.res.dir.DATA)
      //console.log(requestedFieldName)
      let reqFieldName = dirData[1][index[1]-1];
      mem.res.reqFieldName = reqFieldName;
      console.log(reqFieldName)
       let rightAnswer;
       let answerIsCorrect;
       if (answer) {
          console.log("DATA")
          console.log(DATA[index[1]])
       try {
           
        rightAnswer = DATA[index[1]]
        answerIsCorrect = (answer.toLowerCase() == rightAnswer.toLowerCase())
       } catch(e) {
          
         rightAnswer =  DATA[index[1]]
         console.log("ARRAY DETECTED")
         rightAnswer = rightAnswer.map(function(e) {
            return e.toLowerCase();
         })

         /*
         const lower = arr.map(element => {
         return element.toLowerCase();
         });
         */
            
         answer = answer.toLowerCase();
         answerIsCorrect = ((rightAnswer.indexOf(answer) > -1) ? true : false)
       }
       }
       mem.res.rightAnswer = rightAnswer;
       try {
       callback(mem);
       } catch(e) {}
       
      
      //console.log("Right answer: " + rightAnswer)
      if (answer) { //if there's any answer provided, then check, else just show question
         
         
         if (answerIsCorrect) {

            
            console.log("OK")
            mem.code = 1; //code OK
            console.log(((rightAnswer.indexOf(answer) > -1) ? true : false))
            console.log(rightAnswer)
            console.log(answer)
            console.log(mem.res)
            console.log(mem.res.obj.LREPEAT)
             
            let diff = Date.now()-mem.res.obj.LREPEAT*1;
            console.log("Different in hours: " + diff/1000/60/60)
            
            diff=2*diff+Date.now();
            console.log("New RDATE: " + new Date(diff))
            mem.update('RDATE',diff,'ID',mem.res.obj.ID)


            SPEC = JSON.stringify(SPEC);
            mem.update("SPEC",SPEC,"ID",mem.res.obj.ID);
             
            
            //mem.get(res.ID)
            check.clear();
             
			function inner() {
				//alert()
				//check.next(mem.code)
			}
            

         } else {
            
            check.wrong();
            console.log(((rightAnswer.indexOf(answer) > -1) ? true : false))
            console.log(rightAnswer)
            console.log(answer)
            console.log("BAD")
            
         }
         ask=null;
          
         answer= null;
       

         
      }

   
   if (mem.code != 0) {
       check.right();
       setTimeout(check.next,200,mem.code)


      //check.next(mem.code);
      mem.code = 0;
    
   }  
   }
   if (method=="ask") {
      mem.code = 0;
      console.log("ASK");
      
      if (res) { 
      mem.nothing = 0;
      //res is argument given for notify by sql as a result
      console.log("RES:")
      console.log(res)
      
      if (!mem.res) {
         mem.res = {}
      }
       
       
      mem.res.obj = res;
       

      if (mem.res) {
         check.justStarted = 0;
      }
      console.log(mem.res.obj)
      
      mem.check2(res,callback);
     
      }  else {
        
        
         mem.nothing = 1;
         console.error("No objects to repeat")
         console.log(mem.res)
         console.log("No objects to repeat")
         method=null;

         
         if (check.justStarted == 0) {
         check.next(-1);
         } else {
            check.justStarted = 0;
         }
         
         try {
         callback();
         } catch(e) {}
      }
}
    
   return res;
}

let answer = null;

mem.when = (id) => {
   method="when"
   if (!id) {
   sql(`SELECT ID, DATA, MIN(RDATE) AS RDATE, LREPEAT, SPEC FROM OBJECTS LIMIT 1`,mem.when2)
   }
   
}

mem.when2 = (res) => {
   
   if (res[0]) {
     
   date = new Date(res[0].RDATE*1)
   console.log(date)
   let diff = mem.res.RDATE*1-Date.now();
   if (diff <= 0) {
      diff = 0;
   }
   diff = diff/1000/60/60;
   mem.res.in = diff;
     
   } else {
      mem.res = undefined;
       
  
}
}

mem.check = (ans,callback,debug) => {
 
   
   //First part of check to find an object in need of repeat
   if (debug) {
   sql(`SELECT ID, DATA, RDATE, LREPEAT, SPEC FROM OBJECTS WHERE ID = "${debug}"`,callback)
   
   } else {
      //sql(`SELECT ID, DATA, RDATE, LREPEAT, SPEC FROM OBJECTS WHERE RDATE < '${Date.now()}' LIMIT 1`,callback)
   }
   method='ask'
   answer = ans;
 
}

mem.count = () => {
    
   sql(`SELECT COUNT(ID) FROM OBJECTS WHERE RDATE < '${Date.now()}'`,mem.count2)
}

mem.count2 = (data) => {
   console.log(data)
}


mem.getDir = (string) => {
   return string.split(".").slice(0,2).join(".");
}

mem.check2 = (res,callback) => {
   console.log("DIR RES")
   console.log(res)
   let DIRID = mem.getDir(res.ID);
   console.log("DIRID" + DIRID)
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
   mem.add("1.1.2",["Le temps",["Лю тон","123"],"The time"])
   mem.add("1.1.3",["Le ciel",["Лю сьель","123"],"The sky"])
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


mem.get = (ID) => 
{
   method="get"
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

mem.update = (FIELD,DATA,CON1,CON2,callback) => {
   method="update"
   sql(`UPDATE OBJECTS SET ${FIELD} = '${DATA}' WHERE ${CON1} = '${CON2}'`,callback);
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

mem.collect();
 
 
/* Examples:
sql("INSERT INTO OBJECTS (ID, DATA, repeat, dir) VALUES ('2.3','DATA',10,'main')")
sql("INSERT INTO LOGS (ID, log) VALUES (3, 'three')")
*/

 
