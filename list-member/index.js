let addMemberButton = document.getElementById('add-member-button');
let row = document.getElementById("row");
let loginUrl = "http://localhost:4000/login/index.html";
let logout = document.getElementById('log-out');
let editMemberButton = document.getElementById('edit-member-button');
let wait = document.getElementsByClassName("wait");
let schoolname = '';
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/idid/image/upload";
const CLOUDINARY_UPLOAD_PRESET = 'preset1';
// ---------------initial webpage----------------------------------------------------
const setupUI = (user) => {
    if (user) {  
        // toggle user UI elements
        let user = firebase.auth().currentUser;
        useremail = user.email;
        if(user != null){
            //show information in dashboard
            db.collection(useremail).doc("init").get().then((doc) => {
                schoolname = doc.data().schoolname;
                document.getElementById("school-name").innerHTML = schoolname;

            });           
        }
        else window.location.href = loginUrl;
    }
    else {
    // redirect to login page
    window.location.href = loginUrl;
    }
};
// Show School's name
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
    db.collection(user.email).get().then((querySnapshot)=>{
        querySnapshot.forEach((doc)=>{
            if(doc.data().name) addingCardMem(doc.data(), user);
        })
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
    let major = document.forms[formName]["major"].value;
    let email = document.forms[formName]["email"].value;
    let DOB = document.forms[formName]["DOB"].value;
    let phone = document.forms[formName]["phone"].value;
    let classInput = document.forms[formName]["phone"].value;
    let faculty = document.forms[formName]["phone"].value;
    if (!name || !major || !DOB || !email || !phone || !classInput || !faculty) {
      return false;
    }
    if(formName != "edit-mem-form"){
        let fileImg = document.forms[formName]["file-upload"].files[0];
        if(!fileImg) return false;
    }
    return true;
}
function clearInputField(){
    let name = document.getElementById("name");
    let major = document.getElementById("major");
    let email = document.getElementById("email");
    let id = document.getElementById("email");
    let DOB = document.getElementById("DOB");
    let phone = document.getElementById("phone");
    let classInput = document.getElementById("class");
    let faculty = document.getElementById("faculty");
    let avatar = document.getElementById("avatar");
    avatar.src = "./img/default-user-image.png";
    name.value = "";
    major.value = "";
    email.value = "";
    id.value = "";
    DOB.value = "";
    phone.value = "";
    classInput.value = "";
    faculty.value = "";
}
function GenerateRandomId(major){
    let max = 99;
    let min = 10;
    return `${major}${Date.now()%10000}${Math.floor(Math.random()*(max-min)+min)}`;
}
function uploadInforMem(res, user, dataInput){
    db.collection(user.email).doc(dataInput.id).set({
        name: dataInput.name,
        major: dataInput.major,
        email: dataInput.email,
        id: dataInput.id,
        phone: dataInput.phone,
        class: dataInput.class,
        faculty: dataInput.faculty,
        DOB: dataInput.DOB,
        school: schoolname,
        avatar: res.data.url,
        checkin: 0
    })
    return res.data.url;
}

function addMemberDbByClickingButton(user){
    //kiểm tra điền thông tin đầy đủ
    let checkValidation = formValidation("add-mem-form");
    if(checkValidation){
        //upload vào cloudinary trước
        wait[0].style.display = "block";
        let file = document.getElementById("file-upload").files[0];
        let name = document.getElementById("name");
        let major = document.getElementById("major");
        let email = document.getElementById("email");
        let id = GenerateRandomId(major.value);
        let DOB = document.getElementById("DOB");
        let phone = document.getElementById("phone");
        let classInput = document.getElementById("class");
        let faculty = document.getElementById("faculty");
        let dataInput = {
            file: file,
            name: name.value,
            major: major.value,
            email: email.value,
            id: id,
            DOB: DOB.value,
            phone: phone.value,
            class: classInput.value,
            faculty: faculty.value
        }
        uploadImgToCloudinary(user, dataInput);
        }
        else {
            window.alert("Form must be filled out");
        }
}

function uploadImgToCloudinary(user, dataInput){
    
    var formData = new FormData();
    formData.append('file', dataInput.file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    axios({
        url: CLOUDINARY_URL,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
    }).then(function(res){
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
    db.collection(user.email).doc(documentId).delete().then(function() {
        console.log("Member successfully deleted!");
        window.alert("Xóa thành công!");
        row.innerHTML = '';
        renderCurrentMember(user);
    }).catch(function(error) {
        console.error("Error removing document: ", error);
        window.alert("Lỗi: "+ error);
    });
}
//edit member
function showInfoToEditMember(user, docId){
    let name = document.getElementById("edit-name");
    let major = document.getElementById("edit-major");
    let email = document.getElementById("edit-email");
    let DOB = document.getElementById("edit-DOB");
    let id = document.getElementById("edit-id");
    let phone = document.getElementById("edit-phone");
    let classInput = document.getElementById("edit-class");
    let faculty = document.getElementById("edit-faculty");
    let avatar = document.getElementById("avatar");

    db.collection(user.email).doc(docId).get().then((doc)=>{
        name.value = doc.data().name;
        major.value = doc.data().major;
        email.value = doc.data().email;
        DOB.value = doc.data().DOB;
        id.value = doc.data().id;
        phone.value = doc.data().phone;
        classInput.value = doc.data().class;
        faculty.value = doc.data().faculty;
        avatar.src = doc.data().avatar;
    })
}
function editImformationMemberDbByClickingButton(user){
    let name = document.getElementById("edit-name");
    let major = document.getElementById("edit-major");
    let email = document.getElementById("edit-email");
    let DOB = document.getElementById("edit-DOB");
    let id = document.getElementById("edit-id");
    let phone = document.getElementById("edit-phone");
    let classInput = document.getElementById("edit-class");
    let faculty = document.getElementById("edit-faculty");
    let avatar = document.getElementById("avatar");
    let checkValidation = formValidation("edit-mem-form");
    if(checkValidation){
        wait[1].style.display = "block";
        db.collection(user.email).doc(id.value).set({
                name: name.value,
                major: major.value,
                email: email.value,
                DOB: DOB.value,
                id: id.value,
                phone: phone.value,
                class: classInput.value,
                faculty: faculty.value,
                avatar: avatar.src
            })
            .then(function() {
                console.log("Edit Document successfully updated!");
                //clearing input field
                clearInputField();
                avatar.src = './img/default-user-image.png';
                row.innerHTML = '';
                renderCurrentMember(user);
                wait[1].style.display = "none";
                window.alert("Editing member successfully!");
            })
            .catch(function(error) {
                // The document probably doesn't exist.
                wait[1].style.display = "none";
                window.alert("Đã xảy ra lỗi vui lòng thử lại")
                console.error("Error updating document: ", error);
            });

        }
        else {
            window.alert("Form must be filled out");
        }
       
}



//------------------------------ Responsive---------------------------------------------------------------------
