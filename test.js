  // randomly generates a meal based on MEAL NAME
  var randomMealName = "https://themealdb.com/api/json/v1/1/random.php?search.php?s=milk&1";
  // generate meal based on ID
  var mealIdSearch = "https://themealdb.com/api/json/v1/1/lookup.php?i=";
  // base URL
  var baseUrl = "https://themealdb.com/api/json/v1/1/";




  // generate ALL possible INGREDIENTS
  var allIng = 'https://www.themealdb.com/api/json/v2/9973533/list.php?i=list';
  // generate meal(s) based on INGREDIENT
  var mealIngSearch = "https://themealdb.com/api/json/v1/1/filter.php?i=";


  // <input> element 
  var inputEl = document.getElementById("ing-search");
  // <button> element
  var searchBtnEl = document.getElementById("search-btn");
  // ingredient list holder
  var ingListEl = document.getElementById("ingList");
  // recipe list holder
  var recipeListEl = document.getElementById("recipeList");


// this list will hold all possible ingredient NAME's
ingList = [];
// this list will hold all possible ingredient ID's
ingId = [];

// this list will hold only ingredients that contain the user's search term 
validIng = [];
validIngId = [];

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

// finds all ingredients that CONTAIN the user's search term
function displayIng(searchTerm){
    for(i=0; i<ingList.length; i++){
        // checks if the all lower case USER INPUT is contained in the INGREDIENT LIST
        if(ingList[i].toLowerCase().includes(searchTerm.toLowerCase())){
            // stores all SIMILAR ingredients in the var "validIng"
            validIng.push(ingList[i]);
            validIngId.push(ingId[i]);
        }
    }
    console.log(validIng);
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
        // console.log(data);
        displayRecipes(data,ingredient);
      });
    } 
  })
  .catch(function(error) {
    alert("Unable to connect");
  });
}

function clearRecipes(){
  recipeListEl.innerHTML = "";
  var recH2El = document.createElement("h2");
  recH2El.textContent = "Recipes";
  recipeListEl.appendChild(recH2El);
}

function displayRecipes(apiData, ingredient){
  clearRecipes();
  recipeList = [];
  console.log(apiData);
  if(apiData.meals == null){
    var recipe = document.createElement("div");
  
    var recipeName = document.createElement("p");
    ingredient = ingredient.replace("_"," ");
    recipeName.textContent = "There are presently no recipes including " + ingredient + ".";

    recipe.appendChild(recipeName);
    recipeListEl.appendChild(recipe);
  }

  else{
    for(i=0; i<apiData.meals.length; i++){
      recipeList.push(apiData.meals[i].strMeal);
    }
    console.log(recipeList.length);
    console.log(ingredient);
    if(recipeList.length < 6){
      for(i=0; i<recipeList.length; i++){
        var recipe = document.createElement("div");
  
        var recipeName = document.createElement("p");
        recipeName.textContent = recipeList[i];
  
        var recipeBtnEl = document.createElement("button");
        recipeBtnEl.textContent = "Get Details";
  
        recipe.appendChild(recipeName);
        recipe.appendChild(recipeBtnEl);
        recipeListEl.appendChild(recipe);
      } 
    }
    else {
      var recFormEl = document.createElement("div");

      var recTextEl = document.createElement("p");
      recTextEl.textContent = "There are " + recipeList.length + " recipes that use " + ingredient + ". How many would you like to display?";
      
      var recSelectEl = document.createElement("select");
      for(i=1; i<recipeList.length+1; i++){
        recSelectEl.options[recSelectEl.options.length] = new Option(i, i);
      }
      

      var recBtnEl = document.createElement("button");
      recBtnEl.classList.add("recipe-num")
      recBtnEl.textContent = "Generate desired recipes"

      recFormEl.appendChild(recTextEl);
      recFormEl.appendChild(recSelectEl);
      recFormEl.appendChild(recBtnEl);
      recipeListEl.appendChild(recFormEl);

    }
  }
}

function selectRecNum(event){
  console.log("click");
};

  // maybe delete this
  function createIndex() {
    var indexSelect = [];
    for(i=0; i<5; i++){
      var x = Math.floor(Math.random()*40)+1;
      indexSelect.push(x);
    }
    
    var y = new Set(indexSelect);
    console.log(y);
    if(indexSelect.length > y.size){
      createIndex();
    }
    else{
    console.log("DONE");
    console.log(indexSelect);
    z = indexSelect;
    }
    return z;
  }

// listens for user "click" on submit button
searchBtnEl.addEventListener("click", ingSearch);
// listens for user "click" on ingrediet element
$(ingListEl).on("click", "button", selectIng);
// listens for recipe # select button
$(recipeListEl).on("click", "button.recipe-num", selectRecNum);

