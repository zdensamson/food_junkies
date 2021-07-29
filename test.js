// generate ALL possible INGREDIENTS
var allIng = 'https://www.themealdb.com/api/json/v2/9973533/list.php?i=list';
// generate meal(s) based on INGREDIENT
var mealIngSearch = "https://themealdb.com/api/json/v1/1/filter.php?i=";
// generate meal DETAILS based on meal NAME
var mealNameSearch = "https://themealdb.com/api/json/v1/1/search.php?s=";

// <input> element 
var inputEl = document.getElementById("ing-search");
// <button> element
var searchBtnEl = document.getElementById("search-btn");
// ingredient list holder
var ingListEl = document.getElementById("ingList");
// recipe list holder
var recipeListEl = document.getElementById("recipeList");
// <body> element
var bodyEl = document.getElementById("app");
// <table> element
var tabEl = document.getElementById("table");
// h1 element in modal 
var recTitle = document.getElementById("rec-header");
// save button in modal
var saveBtn = document.getElementById("save-rec");
// load saved recipe's button
var loadBtn = document.getElementById("get-saved-rec");

// this list will hold all possible ingredient NAME's
ingList = [];
// this list will hold all possible ingredient ID's
ingId = [];
// this list will hold all recipe's associated with selected ingredient
recipeList =[];

saveSingleRec = "";
savedRecipes = [];

// this list will hold only ingredients that contain the user's search term 
validIng = [];
validIngId = [];

// pings the Foodish API to generate a random image of food
function randomImg(){
  var randomImgDiv = document.querySelector("#randomImg")
    randomImgDiv.innerHTML = ""
  fetch('https://foodish-api.herokuapp.com/api/')
    .then(function(response){
    response.json()
    .then(function(data){
      var randomImgEl = document.createElement("img")
      randomImgEl.setAttribute("src", data.image)
      randomImgEl.setAttribute("class", "random-img")
      randomImgDiv.appendChild(randomImgEl)
    })
    })
}

// function that triggers when user clicks on search button
function ingSearch(event){
  ingList = [];
  validIng = [];
  ingListEl.innerHTML = "";
  clearRecipes();
  var ingH2El = document.createElement("h2");
  ingH2El.textContent = "Ingredients";
  ingListEl.appendChild(ingH2El);

  var userIng = inputEl.value;
  inputEl.value = "";
  getIngredients(userIng);
}

// pings the MealDB api to grab all ingredients
function getIngredients(searchTerm){
  fetch(allIng)
  .then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        // passes along all ingredients and user's desired ingredient
        ingStore(data.meals, searchTerm);
      });
    } 
  })
  .catch(function(error) {
    alert("Unable to connect");
  });
}

// creates a list of all ingredients STORED IN "ingList"
function ingStore(apiData, searchTerm){
    for(i=0; i<apiData.length; i++){
        ingList.push(apiData[i].strIngredient);
        ingId.push(apiData[i].idIngredient);
    }
    //passes along the user search term
    displayIng(searchTerm);
}

// appends all ingredient's related to user input to the DOM
function displayIng(searchTerm){
    for(i=0; i<ingList.length; i++){
        // checks if the all lower case USER INPUT is contained in the INGREDIENT LIST
        if(ingList[i].toLowerCase().includes(searchTerm.toLowerCase())){
            // stores all SIMILAR ingredients in the var "validIng"
            validIng.push(ingList[i]);
            validIngId.push(ingId[i]);
        }
    }
    // alerts the user that their ingredient didn't result in a successful search 
    if(validIng == ""){
      var ingEl = document.createElement("div");
      ingEl.textContent = "There are no recipe's in our database with " + searchTerm + ".";
      ingListEl.appendChild(ingEl);
    }
    else{
      // dynamically generates list of ingredients
      for(i=0; i<validIng.length; i++){
        var ingEl = document.createElement("div");
        ingEl.setAttribute("id", i);
        ingEl.classList.add("ingredient");
        ingEl.setAttribute("data-ingId", validIngId[i]);

        var ingName = document.createElement("p");
        ingName.classList.add("ingredient-name")
        ingName.textContent = validIng[i];
      
        var ingBtnEl = document.createElement("button");
        ingBtnEl.textContent = "Get recipe(s)";

        ingEl.appendChild(ingName);
        ingEl.appendChild(ingBtnEl);
        ingListEl.appendChild(ingEl);
      }
    }
}

// grabs the name of the ingredient where users clicked "GET RECIPE(S)"
function selectIng(event){
  var selectedIng = $(this)
    .closest(".ingredient");
  var ingName = selectedIng.children(".ingredient-name")
    .text();
  getRecipes(ingName);
}

// takes the ingredient name from the user's selected ingredient and FETCHes corresponding recipes
function getRecipes(ingredient){
  ingredient = ingredient.replace(" ","_");
  var ingUrl = mealIngSearch + ingredient;
  fetch(ingUrl)
  .then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        displayRecipes(data,ingredient);
      });
    } 
  })
  .catch(function(error) {
    alert("Unable to connect");
  });
}

// deletes all currently displayed recipes
function clearRecipes(){
  recipeListEl.innerHTML = "";
  var recH2El = document.createElement("h2");
  recH2El.textContent = "Recipes";
  recipeListEl.appendChild(recH2El);
}

// displays all recipe names associated with user ingredient (if there are less than 6)
function displayRecipes(apiData, ingredient){
  clearRecipes();
  recipeList = [];
 
  // gives the user a message if no recipes return from ingredient search
  if(apiData.meals == null){
    var recipe = document.createElement("div");
    recipe.id = "recipe-card";
  
    var recipeName = document.createElement("p");
    recipeName.id = "rec-name";
    ingredient = ingredient.replace("_"," ");
    recipeName.textContent = "There are presently no recipes including " + ingredient + ".";

    recipe.appendChild(recipeName);
    recipeListEl.appendChild(recipe);
  }
  else{
    for(i=0; i<apiData.meals.length; i++){
      recipeList.push(apiData.meals[i].strMeal);
    }
    // automatically displays all recipes if there are less than 6 associated with an ingredient
    if(recipeList.length < 6){
      for(i=0; i<recipeList.length; i++){
        var recipe = document.createElement("div");
        recipe.id = "recipe-card";
  
        var recipeName = document.createElement("p");
        recipeName.id = "rec-name";
        recipeName.textContent = recipeList[i];
  
        var recipeBtnEl = document.createElement("button");
        recipeBtnEl.id = "rec-detail-btn";
        recipeBtnEl.textContent = "Get Details";
  
        recipe.appendChild(recipeName);
        recipe.appendChild(recipeBtnEl);
        recipeListEl.appendChild(recipe);
      } 
    }
    else {
      largeRecNum(ingredient);
    }
  }
}

// displays desired # of recipe names to user
function largeRecNum(ingredient){
  clearRecipes();
  
  var recFormEl = document.createElement("div");
  recFormEl.id = "recipe-card";

  var recTextEl = document.createElement("p");
  recTextEl.id = "rec-name";
  recTextEl.textContent = "There are " + recipeList.length + " recipes that contain " + ingredient + ". How many would you like to display?";

  var recSelectEl = document.createElement("select");
  recSelectEl.id = "rec-select-num";
  for(i=1; i<recipeList.length+1; i++){
    recSelectEl.options[recSelectEl.options.length] = new Option(i, i);
  }


  var recBtnEl = document.createElement("button");
  recBtnEl.classList.add("recipe-num")
  recBtnEl.textContent = "Generate desired # of recipes"

  recFormEl.appendChild(recTextEl);
  recFormEl.appendChild(recSelectEl);
  recFormEl.appendChild(recBtnEl);
  recipeListEl.appendChild(recFormEl);
};

// gives the user the option to choose how many recipes to view if more than 6 exist
function selectRecNum(event){
  var selectNum = document.getElementById("rec-select-num");
  largeRecNum();

  for(i=0; i<selectNum.value; i++){
    var recipe = document.createElement("div");
    recipe.id = "recipe-card";

    var recipeName = document.createElement("p");
    recipeName.id = "rec-name";
    recipeName.textContent = recipeList[i];

    var recipeBtnEl = document.createElement("button");
    recipeBtnEl.id = "rec-detail-btn";
    recipeBtnEl.textContent = "Get Details";

    recipe.appendChild(recipeName);
    recipe.appendChild(recipeBtnEl);
    recipeListEl.appendChild(recipe);
  } 
  
};

// grabs the recipe name when a user clicks on details for that respective recipe
function getRecName(event){
  var recipeCard = $(this).closest("#recipe-card");
  var recName = recipeCard.children("#rec-name").text();
  saveSingleRec = recName;
  getRecDetail(recName);
}

// grabs all data associated with user selected recipe
function getRecDetail(recName){
  recName = recName.replace(" ", "_");
  var recDetailUrl = mealNameSearch + recName;

  fetch(recDetailUrl)
  .then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        getDetails(data, recName);
      });
    } 
  })
  .catch(function(error) {
    alert("Unable to connect");
  });
}

function getDetails(data, recName){
  var objKeys = Object.keys(data.meals[0]);
  var objVal = Object.values(data.meals[0]);
  
  console.log(data);
  ingIndex = [];
  measIndex = [];
  for(i=0; i<objKeys.length; i++){
    if(objKeys[i].includes("strIngredient")){
      ingIndex.push(i);
    }
    if(objKeys[i].includes("strMeasure")){
      measIndex.push(i);
    }
  }

  ingTableList = [];
  measTableList = [];
  for(i=0; i<ingIndex.length; i++){
    ingTableList.push(objVal[ingIndex[i]]);
    measTableList.push(objVal[measIndex[i]]);
  }

  const ingFilter = ingTableList.filter(el => {
    return el != null && el != '';
  });
  const measFilter = measTableList.filter(el => {
    return el != null && el != '';
  });

  populateModal(ingFilter, measFilter, recName);
}

function populateModal(ing, meas, recName){
  tabEl.innerHTML = "";
  recName = recName.replace("_", " ");
  recTitle.textContent=recName + " recipe";
  recTitle.setAttribute("class", "rec-header");

 
  var topRow = document.createElement("tr");

  var ingHead = document.createElement("th");
  ingHead.textContent = "Ingredient";

  var measHead = document.createElement("th");
  measHead.textContent = "Measure";

  topRow.appendChild(ingHead);
  topRow.appendChild(measHead);
  tabEl.appendChild(topRow);

  for(i=0; i<ing.length; i++){
    var row = document.createElement("tr");

    var ingCol = document.createElement("td");
    ingCol.textContent = ing[i];
    
    var measCol = document.createElement("td");
    measCol.textContent = meas[i];

    row.appendChild(ingCol);
    row.appendChild(measCol);
    tabEl.appendChild(row);

  }
  document.getElementById('id01').style.display='block';
}

randomImg();
document.getElementsByClassName("tablink")[0].click();

// togals modal (rename ish)
function openCity(evt, cityName) {
  var i, x, tablinks;
  x = document.getElementsByClassName("city");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < x.length; i++) {
    tablinks[i].classList.remove("w3-light-grey");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.classList.add("w3-light-grey");
}

function saveRecipe(event){
  console.log("click");
  console.log(saveSingleRec);
  savedRecs = JSON.parse(localStorage.getItem("recipes"));
  if(!savedRecs){
    savedRecs = [];
  }
  savedRecipes = savedRecs;
  savedRecipes.push(saveSingleRec);

  localStorage.setItem("recipes", JSON.stringify(savedRecipes));
  // saveBtn.textContent = "SAVED!"
}

function loadRecipe(event){
  clearRecipes();

  savedRecs = JSON.parse(localStorage.getItem("recipes"));
  if(!savedRecs){
    savedRecs = [];

    var recipe = document.createElement("div");
    recipe.id = "recipe-card";
  
    var recipeName = document.createElement("p");
    recipeName.id = "rec-name";
    recipeName.textContent = "You don't have any saved recipes!";

    recipe.appendChild(recipeName);
    recipeListEl.appendChild(recipe);
  }
  else{
    savedRecipes = savedRecs;

    for(i=0; i<savedRecipes.length; i++){
      var recipe = document.createElement("div");
      recipe.id = "recipe-card";

      var recipeName = document.createElement("p");
      recipeName.id = "rec-name";
      recipeName.textContent = savedRecipes[i];

      var recipeBtnEl = document.createElement("button");
      recipeBtnEl.id = "rec-detail-btn";
      recipeBtnEl.textContent = "Get Details";

      recipe.appendChild(recipeName);
      recipe.appendChild(recipeBtnEl);
      recipeListEl.appendChild(recipe);
    } 
  }
}

// listens for user "click" on submit/search button
searchBtnEl.addEventListener("click", ingSearch);
// listens for user "click" on ingrediet element
$(ingListEl).on("click", "button", selectIng);
// listens for recipe # select button
$(recipeListEl).on("click", "button.recipe-num", selectRecNum);
// listens for recipe detail button
$(recipeListEl).on("click", "button#rec-detail-btn", getRecName)
// listens for save button click
$(saveBtn).on("click",saveRecipe);
// listens for a load button click
$(loadBtn).on("click",loadRecipe);




