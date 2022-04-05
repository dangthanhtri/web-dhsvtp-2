const listMemberUrl = "http://localhost:4000/list-member/";
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
