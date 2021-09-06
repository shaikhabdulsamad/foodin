firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        let uid = window.location.hash.slice(1)

        firebase.database().ref(`restaurant/${uid}`).once('value',(data)=>{

       
            let restCover = document.getElementById('rest-cover')
    
            restCover.innerHTML = ` <div class="cover-image mt-50">
            <img src="${data.val().profile}" height="400px" width="100%" alt="">
          </div>`
            
        }).then(()=>{

        
        
        firebase.database().ref(`restaurant/${uid}`).once('value',(data)=>{

       
        let restName = document.getElementById('rest-name')

        restName.innerHTML = `${data.val().username.toUpperCase()}'s dishes`
        
    })
})

        firebase.database().ref(`Items/${uid}`).on('child_added', (data) => {
        console.log(data.val())
        
             
        let a = data.val()
        
        let spiner = document.getElementById('spiner')
        let rest = document.getElementById('rest')
       
        
        
        spiner.style.display = 'none'
        
                    rest.innerHTML += `
          <div class="col-lg-3 col-md-4 col-sm-6 mt-3 mb-5">
                    <div class="card" >
                            <img src="${a.profile}" style="height:200px" class="card-img-top" alt="...">
                                <div class="card-body">
                            <h5 class="card-title">${a.Itemname}</h5>
                            <p>${a.category}</p>
                            <p>${a.deliveryType} delivery</p>
                            <p>Rs. ${a.price}/-</p>
                           
                            
                            <a href="javascript:void(0)"> <button onclick="ordernow('${a.profile}','${a.Itemname}','${a.price}','${data.key}')" type="button" class="btn btn-primary">Buy now</button> </a>
                         
                            </div>
                                </div>
                                </div>`
        
        })
        
        

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

let getUID = () => {
    return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                resolve(user.uid)
            }
        })
    })
}

let ordernow = async (image, name, price, key) => {
    let uid = window.location.hash.slice(1);
    let customerUID = await getUID();
    let order = {
        image,
        name,
        price,
        key,
        status: 'pending',
        uid,
        customerUID
    }
    firebase.database().ref(`orders/${uid}`).push(order)

    
        .then(() => {
        
           
            swal("Congratulation!", "Your order has been places succesfuly!", "success");
        })
}