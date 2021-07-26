  // randomly generates a meal based on MEAL NAME
  var randomMealName = "https://themealdb.com/api/json/v1/1/random.php?search.php?s=milk&1";
  // generat meal based on INGREDIENT
  var ingredientName = "https://themealdb.com/api/json/v1/1/filter.php?i=eggs"
  // generate meal based on ID
  var mealIdSearch = "https://themealdb.com/api/json/v1/1/lookup.php?i=53049"

// mustard only give 6 recipes

//TESTER-------------------------------------------------------------//
  // fetch("https://themealdb.com/api/json/v1/1/filter.php?i=mustard")
  // .then(function(response) {
  //   // request was successful
  //   if (response.ok) {
  //     response.json().then(function(data) {
  //       console.log(data);
  //       if(!data.meals){
  //         alert("Didn't find it");
  //       }
  //       // console.log(data.meals.length);
  //       storeRecipes(data);
  //     });
  //   } else {
  //     alert('This food does not exist');
  //   }
  // })
  // .catch(function(error) {
  //   alert("Unable to connect");
  // });
//TESTER END -----------------------------------------------------//


  // <input> element 
  var ingSearch = document.getElementById("ing-search");
  // <button> element
  var searchBtnEl = document.getElementById("search-btn");
  // recipe list holder
  var recipeListEl = document.getElementById("recipeList");

  // base URL
  var baseUrl = "https://themealdb.com/api/json/v1/1/";

// TO UPDATE START
// use get recipes to collect the total count of meals given a specific ingredient && pass to create index
// TO UPDATE END
  function getRecipes(event){
    console.log(ingSearch.value);
    var userIng = ingSearch.value;
    var ingredient = "filter.php?i=" + userIng;
    var ingUrl = baseUrl + ingredient;

    fetch(ingUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          console.log(data);
          if(!data.meals){
            alert("I didn't find that");
          }
          // console.log(data.meals.length);
          storeRecipes(data);
        });
      } else {
        alert('This food does not exist');
      }
    })
    .catch(function(error) {
      alert("Unable to connect");
    });

  };
  
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
  function storeRecipes(data){
    var indexSelect = [];
    indexSelect = createIndex();
    console.log(indexSelect);

    for(i=0; i < indexSelect.length; i++) {
      var mealName = data.meals[indexSelect[i]].strMeal;
      var mealId = data.meals[indexSelect[i]].idMeal;
      console.log(mealName);
      console.log(mealId);
    }
  };




  searchBtnEl.addEventListener("click", getRecipes);

