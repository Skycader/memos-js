function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
const extract = date => date.toISOString().split(/[^0-9]/).slice(0, -1);
function exportData() {
  a = mem.exportedData;
  let fileName = "memos.backup"+Date.now()+".txt"
  try {cordova} catch(e) {download(fileName,a); notifier.show("📨 Export complete")}
  // console.log("EXPORT: ", a)
  var way;
  try {
    var dl = new Download2();
    if (a == "root") {
      way = cordova.file.externalRootDirectory;
    } else {
      way = cordova.file.externalApplicationStorageDirectory;
    }
    dl.Initialize2({
      fileSystem: way,
      folder: "memos",
      unzip: false,
      remove: false,
      timeout: 0,
      success: DownloaderSuccess,
      error: DownloaderError,
    });
    dl.Get(a);
  } catch (e) {
    //alert(e)
  }
}

function DownloaderError(err) {
  // alert("download error: " + err);
  notifier.show(`📨 Export error ${err}`,true)
  
}

function DownloaderSuccess() {
  // alert("yay!");
  notifier.show("📨 Export complete")
}


function read() {
  try {
    window.resolveLocalFileSystemURL(
      cordova.file.externalApplicationStorageDirectory + "memos/backup"+extract(new Date()).join("_")+".txt",
      gotFile,
      fail
    );
  } catch (e) {
    document.querySelector("#terminalCommands").value = e;
  }
}

const importData = read

function fail(e) {
  console.log("FileSystem Error");
  document.querySelector("#terminalCommands").value = "Filesystem error";
  console.dir(e);
}

function gotFile(fileEntry) {
  fileEntry.file(function (file) {
    var reader = new FileReader();

    reader.onloadend = function (e) {
      // console.log("Text is: " + this.result);
      // alert(this.result);
      document.querySelector("#terminalCommands").value = this.result; //<-- this is import
    };

    reader.readAsText(file);
  });
}