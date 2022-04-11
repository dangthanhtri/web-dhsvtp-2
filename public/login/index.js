const listMemberUrl = "https://anhsangthoidai.com/list-member/";
let loginButton = document.getElementById("login-button");
firebase.auth().onAuthStateChanged(function(user) {
    setupUI(user);
});
  


loginButton.addEventListener("click", login);
  
  
const setupUI = (user) => {
  if (user != null) {
        window.location.href = listMemberUrl;
      }
};
function login(event){
  firebase.auth().signInWithPopup(googleProvider)
    .then((result, error)=> {
      // Handle Errors here.
      if(error){
        //var errorMessage = error.message;
        // The email of the user's account used.
        // var email = error.email;
        // // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        // ...
        throw new handleErrorLogin(error);
      }
      else{
        // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = result.credential.accessToken;
        // // The signed-in user info.
        // var user = result.user;
        // ...
        console.log(result);
        return result;
      }  
    })
    .then((userProfile)=>{
      if(userProfile.additionalUserInfo.isNewUser){
        let userID = userProfile.user.uid;
        let email = userProfile.additionalUserInfo.profile.email;
        let profile_picture = userProfile.additionalUserInfo.profile.picture;
        let fullname = userProfile.additionalUserInfo.profile.name;
        return db.ref('users/' + userID).set({
          id: userID,
          username: email,
          email: email,
          fullname: fullname,
          profile_picture : profile_picture,
          permission: "user",
          members: ''
        })
      }
    })
    .catch((error)=>{
      alert(error.message);
    })
}
