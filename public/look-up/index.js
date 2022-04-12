let data;

// Add others schools
db.ref("users/").once('value').then(async snapshot=>{
    data = snapshot.val();
    let schoolnameInput = document.getElementById("schoolname-input");
    for(let i in data) {
        if(!data[i].members) continue;
        const schoolname = data[i].schoolname
        if(!findSchoolName(schoolnameInput.children, schoolname)) {
            const optionNode = document.createElement("option")
            optionNode.value = schoolname
            optionNode.text = schoolname
            schoolnameInput.appendChild(optionNode)
        }
    }
})
function findSchoolName(listNodes, schoolname) {
    let isFinded = false
    for(let i = 0; i < listNodes.length; i++) {
        const node = listNodes[i]
        if(node.value === schoolname) {
            isFinded = true
        }
    }
    return isFinded
}
async function showInfo(){
    let name = document.getElementById("name");
    let schoolnameInput = document.getElementById("schoolname-input");
    let nameInput = document.getElementById("name-input");
    let schoolname = document.getElementById("schoolname");
    let id = document.getElementById("id");
    let shift = document.getElementById("shift");
    let room = document.getElementById("room");
    let isFinded = false;
    try {
        for(let i in data){
            if(data[i].schoolname === schoolnameInput.value){
                for(let j in data[i].members){
                    if(data[i].members[j].name === nameInput.value){
                        name.innerHTML = data[i].members[j].name;
                        id.innerHTML = data[i].members[j].id;
                        schoolname.innerHTML = data[i].members[j].school;
                        room.innerHTML = data[i].members[j].room || "";
                        shift.innerHTML = data[i].members[j].shift || "";
                        isFinded = true;
                        document.getElementById("qrcode").src = `https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=${data[i].members[j].id}`;
                        break;
                    }
                }
            }
            if(isFinded)break;
        }
        if(!isFinded){
            alert("Không tìm thấy, vui lòng nhập lại!");
        }
    } catch (error) {
        alert(error)
    }
}
document.getElementById("lookup").addEventListener("click", function(){
    if(formValidation("lookup-form")){
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
        showInfo();
    }

    else alert("Điền đầy đủ thông tin!")
    
})
function formValidation(formName){
    let nameInput = document.forms[formName]["name"].value;
    let schoolnameInput = document.forms[formName]["schoolname"].value;
    
    if (!nameInput || !schoolnameInput ) {
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


