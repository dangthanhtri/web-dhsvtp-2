
async function showInfo(){
    let name = document.getElementById("name");
    let schoolnameInput = document.getElementById("schoolname-input");
    let nameInput = document.getElementById("name-input");
    let schoolname = document.getElementById("schoolname");
    let id = document.getElementById("id");
    let shift = document.getElementById("shift");
    let room = document.getElementById("room");
    
    let count = false;
    try {
        await db.ref("users/").on('value',(snapshot)=>{
            snapshot = snapshot.val();
            for(let i in snapshot){
                if(snapshot[i].schoolname === schoolnameInput.value){
                    for(let j in snapshot[i].members){
                        if(snapshot[i].members[j].name === nameInput.value){
                            name.innerHTML = snapshot[i].members[j].name;
                            id.innerHTML = snapshot[i].members[j].id;
                            schoolname.innerHTML = snapshot[i].members[j].school;
                            room.innerHTML = snapshot[i].members[j].room;
                            shift.innerHTML = snapshot[i].members[j].shift;
                            count = true;
                            document.getElementById("qrcode").src = `https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=${snapshot[i].members[j].id}`;
                            break;
                        }
                    }
                }
                if(count)break;
            }
            if(!count){
                alert("Không tìm thấy, vui lòng nhập lại!");
            }
        })    
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


