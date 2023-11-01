/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);
 
$( document ).ready(function() {
   
   

    onDeviceReady() 
});
 
function openMemos(){
    document.querySelector("html").classList.remove('simpleblack');
    document.querySelector("html").classList.add('memoscolor');
    document.querySelector(".menu").classList.remove('donotdisplay');
    document.querySelector(".curtain").scrollBy(0,$("#red").height()+100) 

	if (localStorage.getItem('minHours') === null) {
		localStorage.setItem('minHours','24')
	}
    
    
}
function curtain(){
    document.querySelector(".curtain").classList.remove("opacity0");
}
function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    document.querySelector(".curtain").scrollBy(0,$("#red").height()+100) 
    setTimeout(curtain,1000)
   // openMemos()

   
	NavigationBar.backgroundColorByHexString("#242424", false);
   
    
    alert(cordova.platformId)
	if (cordova.platformId == 'android') {

      
        setTimeout(()=>{
            StatusBar.backgroundColorByHexString("#242424");
            StatusBar.overlaysWebView(false)
            alert("SWITCH")
        },2000)
        
   
  
}
    alert('Running cordova-' + cordova.platformId + '@' + cordova.version);
     
}

