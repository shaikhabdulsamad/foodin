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
                    category.value = "Select Category"
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

let myDishes = ()=>{



firebase.auth().onAuthStateChanged((user) => {
    if (user) {

        var uid = user.uid;


        firebase.database().ref(`Items/${uid}`).on('child_added', (data) => {
            // console.log(data.val())

            var a = data.val()
            let tbody = document.getElementById('tbody');

// a === false ? tbody.innerHTML = "Your restaurant is empty" : 
            tbody.innerHTML += `
                    <tr>
                
                    <td>${a.Itemname}</td>
                    <td> <img src="${a.profile}" style="width:50px;  height:40px "></td>
                    <td>${a.category}</td>
                    <td>${a.deliveryType}</td>
                    <td>${a.price}</td>
                   
                  </tr>`

        })

    }
});
}

let getOrder = (status) => {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            var uid = user.uid;


            let orderList = document.getElementById('order-list')

            firebase.database().ref(`orders/${uid}`).on('child_added', (data) => {

               
                
                firebase.database().ref(`users/${data.val().customerUID}`).once('value', (snapshot) => {

                    let orderDetail = { customer: { ...snapshot.val() }, order: { ...data.val() } }
                  
                    if (status === orderDetail.order.status) {

                       

                        orderList.innerHTML += `
                <tr>
                
                <td>${orderDetail.customer.username}</td>
                <td>${orderDetail.customer.email}</td>
                <td>${orderDetail.order.name}</td>
                <td>1</td>
                <td> <button class="btn btn-primary" onClick="${orderDetail.order.status === 'pending' ? accepted(orderDetail.order.key) : delivered(orderDetail.order.key)} ">
                 ${orderDetail.order.status === 'pending' ? "accept" : orderDetail.order.status === 'accepted' ? "deliver" : "delivered" } 
                 </button></td>
               
          
                </tr>
            
              

                 `
            

                    }

                })


            })


        }
    })
}


let accepted = (key)=>{

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            var uid = user.uid;
            firebase.database().ref(`orders/${uid}/${key}`).update({status: "accepted"})


        }

    })
    
}
let delivered = (key)=>{

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            var uid = user.uid;
            firebase.database().ref(`orders/${uid}/${key}`).update({status: "delivered"})


        }

    })
  
}
