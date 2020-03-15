// signup
const loginUrl = "http://localhost:4000/login/";
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['email_field'].value;
  const password = signupForm['password_field'].value;
  const schoolname = signupForm['schoolname_field'].value;
  // sign up the user
  auth.createUserWithEmailAndPassword(email, password).then(async cred => {
    //add user's imformation to firestore
    try{
      await db.collection(email).doc('init').set({
        schoolname: schoolname,
        email: email,
        password: password,
      })
    }catch(error){
      console.error("Error adding document: ", error);
    };
    
    
    // redirect to user's dashboard
     window.location.href = loginUrl;
  }).catch(err=>{
    alert(err.message);
  });
});

