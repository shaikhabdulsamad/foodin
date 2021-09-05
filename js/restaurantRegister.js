let uploadFiles = (file) => {
    return new Promise((resolve, reject) => {
   
        let storageRef = firebase.storage().ref(`images/${file.name}`);
        // let progress1 = document.getElementById("progress");
        // let bar = document.getElementById("bar");
        // progress1.style.display = "block"
        let loader = document.getElementById('loader')
        let text = document.getElementById('text')
        loader.style.display = "block"
        text.style.display = "none"
        let uploading = storageRef.put(file)
        uploading.on('state_changed',
            (snapshot) => {
                // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // bar.style.width = Math.round(progress.toFixed()) + "%";
                // bar.innerHTML = Math.round(progress.toFixed()) + "%";
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED:
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING:
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject(error)
            },
            () => {
                uploading.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    resolve(downloadURL)
                });
            }
        );
    })
}


let signUp = async () => {
    let email = document.getElementById('email')
    let password = document.getElementById('password')
    let country = document.getElementById('country')
    let restaurantName = document.getElementById('name')
    let city = document.getElementById('city')
    let profile = document.getElementById("profile");
    let image = await uploadFiles(profile.files[0]);
    let loader = document.getElementById('loader')
    let text = document.getElementById('text')
    loader.style.display = "block"
    text.style.display = "none"

    let redAlert = document.getElementById('redAlert')
    let greenAlert = document.getElementById('greenAlert')



    let data = {
        username: restaurantName.value,
        email: email.value,
        country: country.value,
        city: city.value,
        profile: image
    }

    
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            // console.log(user)


            firebase.database().ref(`restaurant/${user.uid}`).set(data)
                .then((res) => {
                    loader.style.display = "none"
                    text.style.display = "block"
                    greenAlert.innerHTML = "Registered successfully"
                    greenAlert.style.display = "block"


                    restaurantName.value = ""
                    email.value = ""
                    country.value = ""
                    city.value = ""
                    password.value = ""
                    profile.value = ""

                    setTimeout(() => {
                        firebase.auth().onAuthStateChanged((user) => {
                            if (user) {
                                window.location = "dashboard.html"
                            } else {
                                window.location = "../index.html"
                            }
                        });
                    }, 1000)


                })


        })
        .catch((error) => {

            var errorMessage = error.message;
            // console.log(errorMessage)
            loader.style.display = "none"
            text.style.display = "block"
            redAlert.innerHTML = errorMessage
            redAlert.style.display = "block"
        })



}



window.onkeydown = function (event) {
    if (event.keyCode === 13) {

        signUp()
    }

}


