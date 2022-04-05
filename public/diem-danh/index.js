let loginButton = document.getElementById("login-button");
let logout = document.getElementById("log-out");
let mathisinh = document.getElementById("scannedTextMemo");
let wait = document.getElementById("wait");
firebase.auth().onAuthStateChanged(function(user) {
    setupUI(user);
});
  
loginButton.addEventListener("click", login);
logout.addEventListener("click", function(){
    if (confirm("Bạn có chắc muốn đăng xuất?") == true) {
        firebase.auth().signOut();
    } else {
    }
});
function submitCheckIn(){
    wait.innerText = "Đang xử lý...";
    wait.style.color = "black";
    wait.style.display = "block";
    if(mathisinh.value){
        try {
            db.ref("users/").once('value').then(async snapshot=>{
                let isFinded = false;
                snapshot = snapshot.val();
                for(let i in snapshot){
                    let dataDonVi = snapshot[i];
                    if(dataDonVi.members){
                        for(let j in dataDonVi.members){
                            if(j == mathisinh.value){
                                let updates = {};
                                updates['/users/' + i + '/members/' + j + '/checkin'] = 1;
                                await db.ref().update(updates);
                                isFinded = true;
                                document.getElementById('avatar').src = dataDonVi.members[j].avatar;
                                $('#modalTTForm').modal('show');
                                wait.innerText = "Hoàn thành";
                                wait.style.color = "green";
                            }
                        }
                        if(isFinded){
                            mathisinh.value = '';
                            break;
                        }
                    }
                }
                if(!isFinded){
                    wait.style.display = "none";
                    mathisinh.value = '';
                    alert("Không tìm thấy, vui lòng nhập lại!");
                }
            })    
        } catch (error) {
            mathisinh.value = '';
            wait.style.display = "none";
            alert(error)
        }
    }
    else{
        wait.style.display = "none";
        alert("Vui lòng nhập mã thí sinh")
    }
}
const setupUI = (user) => {
  if (user != null) {
        document.getElementById("diem-danh").style.display = "block";
        document.getElementById("login_div").style.display = "none";
        document.getElementById("log-out").style.display = "block";
        jsqrscanner.succeeded = jsqrscanner();
      }
    else{
        document.getElementById("diem-danh").style.display = "none";
        document.getElementById("login_div").style.display = "block";
        document.getElementById("log-out").style.display = "none";
    }
};
function login(event){
  event.preventDefault();
  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

  });
}


// JsQRScanner
function onQRCodeScanned(scannedText)
{
    var scannedTextMemo = document.getElementById("scannedTextMemo");
    if(scannedTextMemo)
    {
        if(scannedTextMemo.value != scannedText){
            scannedTextMemo.value = scannedText;
            submitCheckIn();
        }
    }
    var scannedTextMemoHist = document.getElementById("scannedTextMemoHist");
    if(scannedTextMemoHist)
    {
        scannedTextMemoHist.value = scannedTextMemoHist.value + '\n' + scannedText;
    }
}

function provideVideo()
{
    var n = navigator;

    if (n.mediaDevices && n.mediaDevices.getUserMedia)
    {
        return n.mediaDevices.getUserMedia({
        video: {
            facingMode: "environment"
        },
        audio: false
        });
    } 
    
    return Promise.reject('Your browser does not support getUserMedia');
}

function provideVideoQQ()
{
    return navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
        var exCameras = [];
        devices.forEach(function(device) {
        if (device.kind === 'videoinput') {
            exCameras.push(device.deviceId)
        }
        });
        
        return Promise.resolve(exCameras);
    }).then(function(ids){
        if(ids.length === 0)
        {
            return Promise.reject('Could not find a webcam');
        }
        
        return navigator.mediaDevices.getUserMedia({
            video: {
                'optional': [{
                'sourceId': ids.length === 1 ? ids[0] : ids[1]//this way QQ browser opens the rear camera
                }]
            }
        });        
    });                
}

//this function will be called when JsQRScanner is ready to use
function JsQRScannerReady()
{
    //create a new scanner passing to it a callback function that will be invoked when
    //the scanner succesfully scan a QR code
    var jbScanner = new JsQRScanner(onQRCodeScanned);
    //var jbScanner = new JsQRScanner(onQRCodeScanned, provideVideo);
    //reduce the size of analyzed image to increase performance on mobile devices
    jbScanner.setSnapImageMaxSize(300);
    var scannerParentElement = document.getElementById("scanner");
    if(scannerParentElement)
    {
        //append the jbScanner to an existing DOM element
        jbScanner.appendTo(scannerParentElement);
    }        
}