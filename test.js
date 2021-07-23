// // yelp API test
    // var settings = {
    //   "url": "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=restaurants&location=Arizona",
    //   "method": "GET",
    //   "timeout": 0,
    //   "headers": {
    //     "Authorization": "Bearer joFwy_-VZxRWMjwGDywKD-RdbNNUCz2rKI5TeSYJ9QaoDXUNJAzgP8dE7xjMVgJxDUFokND5MPW8bWN6MfquM1bcm37LotJcGqbp9U6LRVJ82crMw_9b8fEY58_4YHYx"
    //   },
    // };
    
    // $.ajax(settings).done(function (response) {
    //   console.log(response);
    // });


  // randomly generates a meal based on MEAL NAME
  var randomMealName = "https://themealdb.com/api/json/v1/1/random.php?search.php?s=milk&1";
  // generat meal based on INGREDIENT
  var ingredientName = "https://themealdb.com/api/json/v1/1/filter.php?i=eggs"
  // generate meal based on ID
  var mealIdSearch = "https://themealdb.com/api/json/v1/1/lookup.php?i=53049"



  // <input> element 
  var ingSearch = document.getElementById("ing-search");
  // <button> element
  var searchBtnEl = document.getElementById("search-btn");

  // base URL
  var baseUrl = "https://themealdb.com/api/json/v1/1/";

  // var userIng = "eggs";
  // var ingredient = "filter.php?i=" + userIng;
  // var ingUrl = baseUrl + ingredient;
  // console.log(ingUrl);

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
        });
      } else {
        alert('This food does not exist');
      }
    })
    .catch(function(error) {
      alert("Unable to connect");
    });

  };
  


  searchBtnEl.addEventListener("click", getRecipes);

