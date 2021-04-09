let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const create = document.querySelector("form");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetchToys();

  create.addEventListener("submit", (e) => {
    e.preventDefault();
    const toyName = document.querySelector("input.input-text[name='name']").value
    const toyImage = document.querySelector("input.input-text[name='image']").value
    createToy(toyName, toyImage)
  });

  document.addEventListener("click", (e) => {
    if (e.target.nodeName === 'BUTTON'){
      const toy = e.target.parentNode.querySelector("h2").id.slice(3)
      const like = e.target.previousSibling
      const likes = parseInt(like.innerText.slice(0, -6) ,10)
      addLike(toy, likes+1)
      like.innerText = `${likes+1} Likes`
    }
  })

});

function fetchToys(){
  return fetch("http://localhost:3000/toys").then(function(response){
    return response.json();
  }).then(function(json){
    for (const toy of json){
      makeCard(toy)
    }
  })
}

function createToy(name, image){
  let formData = {
    "name": name,
    "image": image, 
    "likes": 0
  };

  let configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  };

  fetch("http://localhost:3000/toys", configObj)
  .then(function(response) {
    return response.json();
  }).then(function(object) {
    makeCard(object);
  }); 
}

function makeCard(toy){
  const collection = document.querySelector("div#toy-collection");
  const div = document.createElement("DIV");
  div.class = "card";

  const name = document.createElement("h2");
  name.innerText = toy["name"];
  name.setAttribute("id",`id-${toy["id"]}`);
  const img = document.createElement("IMG");
  img.class = "toy-avatar";
  img.src = toy["image"];
  img.style.width = "100px"
  const like = document.createElement("p");
  like.innerText = `${toy["likes"]} Likes`;
  const btn = document.createElement("button");
  btn.class = "like-btn";
  btn.innerText = "Like <3";

  div.appendChild(name);
  div.appendChild(img);
  div.appendChild(like);
  div.appendChild(btn);

  collection.appendChild(div);
}

function addLike(toy, like){
  let formData = {
    "id": toy,
    "likes": like
  };

  let configObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  };

  fetch(`http://localhost:3000/toys/${toy}`, configObj)
  .then(function(response) {
    return response.json();
  }).then(function(object) {
    makeCard(object);
  }); 
}


