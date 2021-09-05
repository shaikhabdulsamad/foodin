firebase.auth().onAuthStateChanged((user) => {
    if (user) {

    } else {
        window.location = "../index.html"
    }
});



let logout = () => {
    firebase.auth().signOut()
        .then(() => {
            window.location = "../index.html"
        })
}

let uploadFiles = (file) => {
    return new Promise((resolve, reject) => {

        let storageRef = firebase.storage().ref(`images/${file.name}`);

        let loader = document.getElementById('loader')
        let text = document.getElementById('text')
        loader.style.display = "block"
        text.style.display = "none"
        let uploading = storageRef.put(file)
        uploading.on('state_changed',
            (snapshot) => {

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


let submit = async () => {
    let Itemname = document.getElementById('name')
    let price = document.getElementById('price')
    let category = document.getElementById('category')
    let deliveryType = document.getElementById('deliveryType')
    let profile = document.getElementById("image");
    let image = await uploadFiles(profile.files[0]);
    let loader = document.getElementById('loader')
    let text = document.getElementById('text')
    loader.style.display = "block"
    text.style.display = "none"

    let redAlert = document.getElementById('redAlert')
    let greenAlert = document.getElementById('greenAlert')



    let data = {
        Itemname: Itemname.value,
        price: price.value,
        category: category.value,
        deliveryType: deliveryType.value,
        profile: image
    }



    firebase.auth().onAuthStateChanged((user) => {
        if (user) {




            firebase.database().ref(`Items/${user.uid}`).push(data)
                .then((res) => {
                    loader.style.display = "none"
                    text.style.display = "block"
                    greenAlert.innerHTML = "Item added successfully"
                    greenAlert.style.display = "block"


                    Itemname.value = ""
                    price.value = ""
                    category.value = "Select Item"
                    deliveryType.value = "Delivery Type"
                    profile.value = ""




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

    });
}



firebase.auth().onAuthStateChanged((user) => {
    if (user) {

        var uid = user.uid;
    

        firebase.database().ref(`Items/${uid}`).on('child_added', (data) => {
            console.log(data.val())

            var a = data.val()
            let tbody = document.getElementById('tbody');


            tbody.innerHTML += `
                    <tr>
                
                    <td>${a.Itemname}</td>
                    <td> <img src="${a.profile}" style="width:50px"></td>
                    <td>${a.category}</td>
                    <td>${a.deliveryType}</td>
                    <td>${a.price}</td>
                   
                  </tr>`

        })
        
    }
});
