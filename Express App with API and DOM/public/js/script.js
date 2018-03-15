/*
Code based on Prof. Lou Nel Tutorials and Sample Code
Assignment done by Oscar Castelblanco
To test:
http://localhost:3000
or
http://localhost:3000/recipes
or
http://localhost:3000/start?ingredients="Ingredient"
*/

/* Function that allows the page to load sample elements into the
page before the webpage is loaded completely
It uses a sample element as cheese for default option and separates
url in case a given element is sent**/
function beforeLoad(){
  // console.log(document.URL);
  var myURL = document.URL;
  var validURL = "http://localhost:3000/start?ingredients=";
  var myIngredient = "";
  var approvedURL = true;
  if(myURL.length>validURL.length){
    for(let i = 0; i<validURL.length; i++){
      if(myURL[i]!=validURL[i]){
        approvedURL = false;
      }
    }
  }else{
    approvedURL = false;
  }
  /** use the getIngredient Function by changing temporarily
      the value in ingredient field, then setting it
      to empty again.
    **/
  if(approvedURL == false){
    document.getElementById('ingredient').value = "cheese";
    getIngredient();
    document.getElementById('ingredient').value = "";
  } else{
    for(let i = validURL.length; i<myURL.length; i++){
      myIngredient = myIngredient + myURL[i];
    }
    console.log("Approved");
    document.getElementById('ingredient').value = myIngredient;
    getIngredient();
  }
}
/** Function to send request to the server for the ingredient **/
function getIngredient() {

  let ingredientName = document.getElementById('ingredient').value;
  console.log("The ingredient is ", ingredientName);
  if(ingredientName === '') {
    return alert('Please enter an Ingredient')
  }

  let ingredientDiv = document.getElementById('Recipes');
  ingredientDiv.innerHTML = '';
  /** variable for comunication **/
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    console.log(xhr.responseText);
    if (xhr.readyState == 4 && xhr.status == 200) {
      let response = JSON.parse(xhr.responseText);
      console.log("The response is: ")
      console.log(response);
      let limit = 10; /** Limit of elements to show**/
      if( response.count < limit) limit = response.count;
      /** Add elements to the DOM by appending it to the Recipies element **/
      for(let i = 0; i< limit; i++){
        ingredientDiv.innerHTML = ingredientDiv.innerHTML + `
        <h3><a href=${response.recipes[i].f2f_url} target="_blank">
        Recipe for ${response.recipes[i].title}</a></h3>

        <p>
        <img src=${response.recipes[i].image_url} alt="food"
        style="width:300px;height:300px">
        </p>
        <p><font color="green">
        ________________________________________________________________________
        </font></a></p>

        `;
      }
    }
  }
  xhr.open('GET', `/start?ingredients=${ingredientName}`, true)
  xhr.send()
}

//Attach Enter-key Handler
const ENTER=13
document.getElementById("ingredient")
.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === ENTER) {
    document.getElementById("submit").click();
  }
});
