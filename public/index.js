db.ref("/users/").on("value", (snapshot)=>{
    let data = snapshot.val();
    let gradeListA = [
        // grade: 10,
        // subGrade: 5,
        // schoolname: "abc"
    ]
    let gradeListB = [
        // grade: 10,
        // subGrade: 5,
        // schoolname: "abc"
    ]
    for(let i in data){
        let schoolname = data[i].schoolname;
        if(schoolname){
            let membersDataOfOneSchool = data[i].members;
            let sum1A = 0;
            let sum1B = 0;
            let sum2A = 0;
            let sum2B = 0;
            let subSum1A = 0;
            let subSum2A = 0;
            let subSum1B = 0;
            let subSum2B = 0;
            let isSum1A = false; 
            let isSum2A = false; 
            let isSum1B = false; 
            let isSum2B = false; 
            let hiendien1A = 0;
            let hiendien2A = 0;
            let hiendien1B = 0;
            let hiendien2B = 0;
            for(let id in membersDataOfOneSchool){
                if(id[1] == 'B'){
                    if(id[0] == '1'){ //1B
                        if(membersDataOfOneSchool[id]["grade"]){
                            sum1B+=Number(membersDataOfOneSchool[id]["grade"]);
                            if(membersDataOfOneSchool[id]["sub-grade"])
                                subSum1B+=Number(membersDataOfOneSchool[id]["sub-grade"]);
                            
                        }
                        isSum1B = true;
                        if(membersDataOfOneSchool[id]["checkin"] && Number(membersDataOfOneSchool[id]["checkin"])){
                            hiendien1B++;
                        }
                    }
                    
                    else if(id[0] == '2'){ //2B
                        if(membersDataOfOneSchool[id]["grade"]){
                            sum2B+=Number(membersDataOfOneSchool[id]["grade"]);
                            if(membersDataOfOneSchool[id]["sub-grade"])
                                subSum2B+=Number(membersDataOfOneSchool[id]["sub-grade"]);
                            
                        }
                        isSum2B = true;
                        if(membersDataOfOneSchool[id]["checkin"] && Number(membersDataOfOneSchool[id]["checkin"])){
                            hiendien2B++;
                        }
                    }
                    
                }
                else if(id[1] == 'A'){ //1A
                    if(id[0] == '1'){
                        if(membersDataOfOneSchool[id]["grade"]){
                            sum1A+=Number(membersDataOfOneSchool[id]["grade"]);
                            if(membersDataOfOneSchool[id]["sub-grade"])
                                subSum1A+=Number(membersDataOfOneSchool[id]["sub-grade"]);
                            
                        }
                        isSum1A = true;
                        if(membersDataOfOneSchool[id]["checkin"] && Number(membersDataOfOneSchool[id]["checkin"])){
                            hiendien1A++;
                        }
                    }
                    else if(id[0] == '2'){ //2A
                        if(membersDataOfOneSchool[id]["grade"]){
                            sum2A+=Number(membersDataOfOneSchool[id]["grade"]);
                            if(membersDataOfOneSchool[id]["sub-grade"])
                                subSum2A+=Number(membersDataOfOneSchool[id]["sub-grade"]);
                            
                        }
                        isSum2A = true;
                        if(membersDataOfOneSchool[id]["checkin"] && Number(membersDataOfOneSchool[id]["checkin"])){
                            hiendien2A++;
                        }
                    }
                }
            }
            if(isSum1A)
                gradeListA.push({
                    grade: sum1A,
                    subGrade: subSum1A,
                    schoolname: `${schoolname} 1`,
                    hiendien: hiendien1A
                })
            if(isSum2A)
                gradeListA.push({
                    grade: sum2A,
                    subGrade: subSum2A,
                    schoolname: `${schoolname} 2`,
                    hiendien: hiendien2A
                })
            if(isSum1B)
                gradeListB.push({
                    grade: sum1B,
                    subGrade: subSum1B,
                    schoolname: `${schoolname} 1`,
                    hiendien: hiendien1B
                })
            if(isSum2B)
                gradeListB.push({
                    grade: sum2B,
                    subGrade: subSum2B,
                    schoolname: `${schoolname} 2`,
                    hiendien: hiendien2B
                })
        }
       
    }
    gradeListA.sort(function(a, b){
        if(b.grade - a.grade === 0)return b.subGrade - a.subGrade;
        else return b.grade - a.grade;
    });
    gradeListB.sort(function(a, b){
        if(b.grade - a.grade === 0)return b.subGrade - a.subGrade;
        else return b.grade - a.grade;
    });
    let textA = "";
    for(let i = 0; i < gradeListA.length; i++){
        if(i < 3){
            textA += `<tr>
                        <td class="rank"><i class="fa fa-star"></i>${i + 1}</td>
                        <td class="team">${gradeListA[i]["schoolname"]}</td>
                        <td class="points">${gradeListA[i]["grade"]}</td>
                        <td class="points">${gradeListA[i]["subGrade"]}</td>
                        <td class="points">${gradeListA[i]["hiendien"]}/6</td>
                    </tr>`
        }else{
            textA += `<tr>
                        <td class="rank">${i + 1}</td>
                        <td class="team">${gradeListA[i]["schoolname"]}</td>
                        <td class="points">${gradeListA[i]["grade"]}</td>
                        <td class="points">${gradeListA[i]["subGrade"]}</td>
                        <td class="points">${gradeListA[i]["hiendien"]}/6</td>
                    </tr>`
        }
        
    }
    let textB = "";
    for(let i = 0; i < gradeListB.length; i++){
        if(i < 3){
            textB += `<tr>
                        <td class="rank"><i class="fa fa-star"></i>${i + 1}</td>
                        <td class="team">${gradeListB[i]["schoolname"]}</td>
                        <td class="points">${gradeListB[i]["grade"]}</td>
                        <td class="points">${gradeListB[i]["subGrade"]}</td>
                        <td class="points">${gradeListB[i]["hiendien"]}/6</td>
                    </tr>`
        }else{
            textB += `<tr>
                        <td class="rank">${i + 1}</td>
                        <td class="team">${gradeListB[i]["schoolname"]}</td>
                        <td class="points">${gradeListB[i]["grade"]}</td>
                        <td class="points">${gradeListB[i]["subGrade"]}</td>
                        <td class="points">${gradeListB[i]["hiendien"]}/6</td>
                    </tr>`
        }
        
    }
    document.getElementById("table-bodyA").innerHTML = textA;
    document.getElementById("table-bodyB").innerHTML = textB;
})
document.getElementById(
    "totalAttendingMem"
  ).innerText = "...";
  document.getElementById(
    "totalAttendingUni"
  ).innerText = "...";

db.ref("users/")
.on("value", (snapshot) => {
    let totalAttendingMem = 0;
    let totalAttendingUni = 0;
    const docs = snapshot.val();
    for (let doc in docs) {
    if(docs[doc]["members"]){
        totalAttendingMem+= Object.keys(docs[doc]["members"]).length;
        totalAttendingUni++;
    }
    }
    document.getElementById(
    "totalAttendingMem"
    ).innerText = totalAttendingMem;
    document.getElementById(
    "totalAttendingUni"
    ).innerText = totalAttendingUni;
});