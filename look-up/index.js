
async function showInfo(){
    let name = document.getElementById("name");
    let nameInput = document.getElementById("name-input");
    let phoneInput = document.getElementById("phone-input");
    let schoolname = document.getElementById("schoolname");
    let id = document.getElementById("id");
    let major = document.getElementById("major");
    let avatar = document.getElementById("avatar");
    let email = document.getElementById("email");
    let count = false;
    try {
        await db.collection(email.value).get().then((querySnapshot)=>{
            querySnapshot.forEach(doc => {
                if(doc.data().name === nameInput.value && doc.data().phone === phoneInput.value ){
                    name.innerHTML = doc.data().name;
                    major.innerHTML = doc.data().major;
                    id.innerHTML = doc.data().id;
                    schoolname.innerHTML = doc.data().school;
                    avatar.src = doc.data().avatar;
                    count=true;
                    document.getElementById("qrcode").src = `https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=${doc.data().id}`;
                }
            });
            
        })
        if(!count){
            alert("Không tìm thấy, vui lòng nhập lại!");
        }
    } catch (error) {
        alert(error)
    }
    
}
document.getElementById("lookup").addEventListener("click", function(){
    let modal = document.getElementById("modalLookUp");
    modal.classList.add("show");
    modal.style.display = "block";
    modal.setAttribute("aria-modal", "true");
    modal.removeAttribute("aria-hidden");
    document.body.classList.add("modal-open");
    let fadeBackground = document.createElement("div");
    fadeBackground.classList.add("modal-backdrop");
    fadeBackground.classList.add("fade");
    fadeBackground.classList.add("show");
    fadeBackground.setAttribute("id", "fade-background");
    document.body.appendChild(fadeBackground);
    if(formValidation("lookup-form"))
    showInfo();
    else alert("Điền đầy đủ thông tin!")
})
function formValidation(formName){
    let nameInput = document.forms[formName]["name"].value;
    let phoneInput = document.forms[formName]["phone"].value;
    let email = document.forms[formName]["email"].value;
    
    if (!nameInput || !phoneInput || !email ) {
      return false;
    }
    
    return true;
}
document.getElementById("close-modal").addEventListener("click", function(){
    let modal = document.getElementById("modalLookUp");
    modal.classList.remove("show");
    modal.style.display = "none";
    modal.removeAttribute("aria-modal", "true");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    document.getElementById("fade-background").remove();
})


