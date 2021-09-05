
let logIn = () => {
    let email1 = document.getElementById('email1')
    let password1 = document.getElementById('password1')
    let loader1 = document.getElementById('loader1')
    let text1 = document.getElementById('text1')
    loader1.style.display = "block"
    text1.style.display = "none"
  
    let redAlert1 = document.getElementById('redAlert1')
    let greenAlert1 = document.getElementById('greenAlert1')
  
  
    firebase.auth().signInWithEmailAndPassword(email1.value, password1.value)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        // console.log(user)
  
        // firebase.database().ref(`restaurant/${user.uid}`).once('value', (data) => {
  
        //   console.log(data.val())
        // })
        //   .then((res) => {
            loader1.style.display = "none"
            text1.style.display = "block"
            greenAlert1.innerHTML = "Logined successfully"
            greenAlert1.style.display = "block"
  
            email1.value = ""
            password1.value = ""
  
            setTimeout(() => {
              window.location = "pages/home.html"
              
            }, 1000)
          })
    //   })
      .catch((error) => {
        var errorMessage = error.message;
        // console.log(errorMessage)
  
        loader1.style.display = "none"
        text1.style.display = "block"
        
          redAlert1.innerHTML = errorMessage
          redAlert1.style.display = "block"
          
        
       
      })
     
  }
  
  
  window.onkeydown = function(event){
    if(event.keyCode === 13){
      
      logIn()
    }
    
    }