let addMemberButton = document.getElementById('add-member-button');
let row = document.getElementById("row");
let loginUrl = "https://anhsangthoidai.harrisstudio.org/login/index.html";
let logout = document.getElementById('log-out');
let editMemberButton = document.getElementById('edit-member-button');
let wait = document.getElementsByClassName("wait");
let schoolname = '';
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/idid/image/upload";
const CLOUDINARY_UPLOAD_PRESET = 'preset1';
const CLOUDINARY_URL_CERS = "https://api.cloudinary.com/v1_1/dcgqmpr78/image/upload";
const CLOUDINARY_UPLOAD_PRESET_CERS = 'preset2';
// ---------------initial webpage----------------------------------------------------
document.getElementById('them-thanh-vien-btn').style.display = 'none';
const setupUI = (user) => {
    if (user) {  
        // toggle user UI elements
        let user = firebase.auth().currentUser;
        useremail = user.email;
        if(user != null){
            //show information in dashboard
            db.ref('users/' + user.uid).on('value', (snapshot) => {
                schoolname = snapshot.val().schoolname;
                if(schoolname){
                    document.getElementById("school-name").innerHTML = schoolname;
                    document.getElementById('them-thanh-vien-btn').style.display = 'block';
                    document.getElementById('them-thanh-vien-btn').classList.add("animation-example");
                }
                //If does not have school name, prompt user to update school name
                else{
                    $('#modalEditSchoolNameForm').modal({backdrop: 'static', keyboard: false});
                    $('#modalEditSchoolNameForm').modal('show');
                    document.getElementById("add-school-name").addEventListener('click', function(event){
                        event.preventDefault();
                        let update = {};
                        if(document.getElementById("schoolname").value != "Khac"){
                            update["users/" + user.uid + "/schoolname"] = document.getElementById("schoolname").value;
                            db.ref().update(update)
                            .then((res)=>{
                                document.getElementById('them-thanh-vien-btn').style.display = 'block';
                                document.getElementById('them-thanh-vien-btn').classList.add("animation-example");
                                $("#modalEditSchoolNameForm").modal("hide");
                            })
                        }else{
                            alert("Cần chọn tên trường!");
                        }
                    })
                    document.getElementById("schoolname").addEventListener("change", function(event){
                        if(event.target.value == 'Khac'){
                            $('#modalAnotherSchoolNameForm').modal({backdrop: 'static', keyboard: false});
                            $('#modalAnotherSchoolNameForm').modal('show');
                            document.getElementById("add-another-school-name").addEventListener("click", function(event){
                                event.preventDefault();
                                let update = {};
                                if(document.getElementById("another-schoolname").value){
                                    update["users/" + user.uid + "/schoolname"] = document.getElementById("another-schoolname").value;
                                    db.ref().update(update)
                                        .then((res)=>{
                                        document.getElementById('them-thanh-vien-btn').style.display = 'block';
                                        document.getElementById('them-thanh-vien-btn').classList.add("animation-example");
                                        $("#modalEditSchoolNameForm").modal("hide");
                                        $("#modalAnotherSchoolNameForm").modal("hide");
                                    })
                                }else{
                                    alert("Cần nhập tên trường!");
                                }
                            })
                        }
                    })
                }
            });           
        }
        else window.location.href = loginUrl;
    }
    else {
    // redirect to login page
    window.location.href = loginUrl;
    }
};
firebase.auth().onAuthStateChanged(async function(user) {
    setupUI(user);
    //LOG OUT
    logout.addEventListener("click", async function(){
        await firebase.auth().signOut();
    })
    renderCurrentMember(user);
    addMemberButton.addEventListener('click',function(event){
        event.preventDefault();
        addMemberDbByClickingButton(user);
    });
    editMemberButton.addEventListener("click", function(event){
        event.preventDefault();
        editImformationMemberDbByClickingButton(user);
    })
    
});

//Render current members
function renderCurrentMember(user){
    db.ref("users/" + user.uid + "/members").on('value', (snapshot)=>{
        let docs = snapshot.val();
        for(let doc in docs){
            addingCardMem(docs[doc], user);
        }
    })
    
}


//Modify Card Render

function addingCardMem(data, user){
    let img = "";
    if(!data.avatar){
        img = "./img/default-user-image.png";
    }
    else{img = data.avatar}
    let newCard = 
    `
        <!-- Card image -->
        <div class="card-header">
        <img class="card-img-top" src="${img}" alt="Card image cap">
        </div>
        <!-- Card content -->
        <div class="card-body">
            <!-- Text -->
            <p class="member-name">${data.name}</p>
            <!-- Button -->
            <button name="btn-${data.id}" class="btn btn-primary edit-member" data-toggle="modal" data-target="#modalEditForm">Chỉnh sửa</button>

        </div>`;
    //create new div container card
    let divContainerNewCard = document.createElement('div');
    divContainerNewCard.classList.add("card");
    divContainerNewCard.classList.add("col-sm-3");
    divContainerNewCard.innerHTML = newCard;
    
    row.appendChild(divContainerNewCard); 
    //create removing button
    let removeButton = document.createElement('button');
    removeButton.classList.add("remove-member");
    removeButton.classList.add(data.id);
    removeButton.innerText = "X";
    divContainerNewCard.insertBefore(removeButton, divContainerNewCard.firstChild);
    removeButton.addEventListener("click", function(event){
        if(confirm("Are you sure") == true)
        removeMemberDbByClickingButton(user, event);
    })
    //add event edit button
    let editButton = document.getElementsByName(`btn-${data.id}`)[0];
        editButton.addEventListener("click", function(){
            showInfoToEditMember(user, data.id);
        })
    
}

// ----------------------------Modify Member on DB------------------------------------------------------------
function formValidation(formName){
    let name = document.forms[formName]["name"].value;
    let typeOfMem = formName == "edit-mem-form" ? document.forms[formName]["edit-typeofmem"].value : document.forms[formName]["typeofmem"].value;
    let DOB = document.forms[formName]["DOB"].value;
    let typeofgroup = document.forms[formName]["typeofgroup"].value;
    let faculty = document.forms[formName]["faculty"].value;
    if (!name || !DOB || !typeOfMem || !typeofgroup || !faculty) {
      return false;
    }
    if(formName != "edit-mem-form"){
        let fileImg = document.forms[formName]["file-upload"].files[0];
        let cerImg = document.forms[formName]["cers-upload"].files[0];
        if(!fileImg || !cerImg) return false;
    }
    return true;
}
function clearInputField(){
    let name = document.getElementById("name");
    let DOB = document.getElementById("DOB");
    let avatar = document.getElementById("avatar");
    let typeOfMem = document.getElementById("typeofmem");
    let typeOfGroup = document.getElementById("typeofgroup");
    let faculty = document.getElementById("faculty");
    let certificates = document.getElementById("edit-cers");
    avatar.src = "./img/default-user-image.png";
    name.value = "";
    DOB.value = "";
    typeOfMem.value = "";
    typeOfGroup.value = "";
    faculty.value = "";
    certificates.innerHTML = "";
}
function GenerateRandomId(){
    let max = 999;
    let min = 100;
    return `${Date.now()%1000000}${Math.floor(Math.random()*(max-min)+min)}`;
}
function uploadInforMem(res, user, dataInput){
    db.ref("users/" + user.uid + "/members/" + dataInput.id).set({
        name: dataInput.name,
        id: dataInput.id,
        type_of_mem: dataInput.typeOfMem,
        DOB: dataInput.DOB,
        school: schoolname,
        type_of_group: dataInput.typeOfGroup,
        faculty: dataInput.faculty,
        avatar: res.avatar,
        certificates: res.certificates,
        checkin: 0
    })
    return res.avatar;
}

function addMemberDbByClickingButton(user){
    //kiểm tra điền thông tin đầy đủ
    let checkValidation = formValidation("add-mem-form");
    if(checkValidation){
        //upload vào cloudinary trước
        wait[0].style.display = "block";
        let file = document.getElementById("file-upload").files[0];
        let certificates = document.getElementById("cers-upload").files;
        let name = document.getElementById("name");
        let id = GenerateRandomId();
        let DOB = document.getElementById("DOB");
        let typeOfMem = document.getElementById("typeofmem");
        let typeOfGroup = document.getElementById("typeofgroup");
        let faculty = document.getElementById("faculty");
        let dataInput = {
            certificates: certificates,
            file: file,
            name: name.value,
            id: id,
            DOB: DOB.value,
            typeOfMem: typeOfMem.value,
            typeOfGroup: typeOfGroup.value,
            faculty: faculty.value
        }
        uploadImgToCloudinary(user, dataInput);
        }
        else {
            window.alert("Form must be filled out");
        }
}

function uploadImgToCloudinary(user, dataInput){
    
    let formData = new FormData();
    formData.append('file', dataInput.file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    let urlImgs = {
        avatar: "",
        certificates: []
    };
    axios({
        url: CLOUDINARY_URL,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
    }).then(async function(res){
        urlImgs["avatar"] = res.data.url;
        for(let i = 0; i < dataInput.certificates.length; i++){
            let formDataCer = new FormData();
            formDataCer.append('file', dataInput.certificates[i]);
            formDataCer.append('upload_preset', CLOUDINARY_UPLOAD_PRESET_CERS);
            let url = await axios({
                url: CLOUDINARY_URL_CERS,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: formDataCer
            })
            urlImgs.certificates.push(url.data.url);
        }
        return urlImgs;
    })
    .then(function(res){
        console.log(res);
        //up hình thành công thì mới up tiếp thông tin lên firestore
        return uploadInforMem(res, user, dataInput);
    })
    .then(function(avatar){
        console.log("Document successfully updated!");
        //clear input field
        clearInputField();
        row.innerHTML = '';
        renderCurrentMember(user);
        wait[0].style.display = "none";
        window.alert("Adding member successfully!");
    })
    .catch(function(err){
        console.log(err);
        wait[0].style.display = "none";
        window.alert("Đã xảy ra lỗi, xin mời nhập lại")
    })
}

//Also add to spreadsheet by script

//Removing Member
function removeMemberDbByClickingButton(user, event){
    let documentId = event.currentTarget.classList[1];
    db.ref("users/" + user.uid + "/members/" + documentId).remove().then(function() {
        console.log("Member successfully deleted!");
        window.alert("Xóa thành công!");
        location.reload();
    }).catch(function(error) {
        console.error("Error removing document: ", error);
        window.alert("Lỗi: "+ error);
    });
}
//edit member
function showInfoToEditMember(user, docId){
    let name = document.getElementById("edit-name");
    let DOB = document.getElementById("edit-DOB");
    let id = document.getElementById("edit-id");
    let typeOfMem = document.getElementById("edit-typeofmem");
    let avatar = document.getElementById("avatar");
    let typeOfGroup = document.getElementById("edit-typeofgroup");
    let faculty = document.getElementById("edit-faculty");
    let certificates = document.getElementById("edit-cers");
    db.ref("users/" + user.uid + "/members/" + docId).once('value').then((snapshot)=>{
        let doc = snapshot.val();
        name.value = doc.name;
        DOB.value = doc.DOB;
        id.value = doc.id;
        typeOfMem.value = doc.type_of_mem;
        typeOfGroup.value = doc.type_of_group;
        faculty.value = doc.faculty;
        let count = 1;
        for(let i in doc.certificates){
            let newTagA = document.createElement('a');
            newTagA.href = doc.certificates[i];
            newTagA.className = "cers";
            newTagA.innerHTML = `Bằng cấp ${count++}`;
            certificates.appendChild(newTagA);
        }
        avatar.src = doc.avatar;
    })
}
function editImformationMemberDbByClickingButton(user){
    let name = document.getElementById("edit-name");
    let DOB = document.getElementById("edit-DOB");
    let id = document.getElementById("edit-id");
    let typeOfMem = document.getElementById("edit-typeofmem");
    let avatar = document.getElementById("avatar");
    let typeOfGroup = document.getElementById("edit-typeofgroup");
    let faculty = document.getElementById("edit-faculty");
    let certificates = document.getElementsByClassName("cers");
    let checkValidation = formValidation("edit-mem-form");
    if(checkValidation){
        let cers=[];
        for(let i = 0; i < certificates.length; i++){
            cers.push(certificates[i].href)
        }
        wait[1].style.display = "block";
        db.ref("users/" + user.uid + "/members/" + id.value).update({
                name: name.value,
                DOB: DOB.value,
                id: id.value,
                type_of_mem: typeOfMem.value,
                avatar: avatar.src,
                type_of_group: typeOfGroup.value,
                faculty: faculty.value,
                certificates: cers
            })
            .then(function() {
                console.log("Cập nhật thành công");
                //clearing input field
                clearInputField();
                avatar.src = './img/default-user-image.png';
                row.innerHTML = '';
                renderCurrentMember(user);
                wait[1].style.display = "none";
                window.alert("Cập nhật thành công");
            })
            .catch(function(error) {
                // The document probably doesn't exist.
                wait[1].style.display = "none";
                window.alert("Đã xảy ra lỗi vui lòng thử lại")
                console.error("Error updating document: ", error);
            });

        }
        else {
            window.alert("Điền đầy đủ thông tin");
        }
       
}



//------------------------------ Responsive---------------------------------------------------------------------
