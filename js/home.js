let logout = () => {
    firebase.auth().signOut()
        .then(() => {
            window.location = "../index.html"
        })
}



firebase.database().ref(`restaurant`).on('child_added', (data) => {
    console.log(data.val())
  
        
    let a = data.val()

let spiner = document.getElementById('spiner')
let rest = document.getElementById('rest')

spiner.style.display = 'none'

            rest.innerHTML += `
  <div class="col-lg-4 col-sm-6 mt-3">
            <div class="card" >
                    <img src="${a.profile}" style="height:200px" class="card-img-top" alt="...">
                        <div class="card-body">
                    <h5 class="card-title">${a.username}</h5>
                    <p>${a.city}, ${a.country}</p>
                   
                    
                    <a href="restaurant.html#${data.key}"> <button type="button" class="btn btn-primary">view dishes</button> </a>
                    </div>
                        </div>
                        </div>`

   
})


