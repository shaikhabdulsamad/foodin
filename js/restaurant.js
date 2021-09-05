let uid = window.location.hash.slice(1)

firebase.database().ref(`Items/${uid}`).on('child_added', (data) => {
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
                    <h5 class="card-title">${a.Itemname}</h5>
                    <p>${a.category}</p>
                    <p>${a.deliveryType}</p>
                    <p>${a.price}</p>
                   
                    
                    <a href="restaurant.html#${data.key}"> <button type="button" class="btn btn-primary">view dishes</button> </a>
                    </div>
                        </div>
                        </div>`

})

// let restCover = document.getElementById('rest-cover')

// restCover.innerHTML =`
// <img src="../images/cover-image.jpg" width="100%"
//             height="500px" alt="">
// `