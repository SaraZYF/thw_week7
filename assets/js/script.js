
//assigning global variables
const cocktailApi = 'https://www.thecocktaildb.com/api/json/v2/9973533/';
const locationApi = {
    key: 'f40fdbed4ce6f49a21c55972b85d4f67',
    uri: 'https://api.openweathermap.org/data/2.5/'
};
const search = $('#search');
//array of popular cocktails for search autocomplete
var autoCocktails = ['Martini', 'Old Fashioned', 'Margarita', 'Cosmopolitan', 'Negroni', 'Moscow Mule', 'Martini', 'Mojito', 'Whiskey Sour', 'French 75',
    'Manhattan', 'Spritz', 'Gimlet', 'Sazerac' ,"Pimm's Cup", 'Vesper', 'Mimosa', 'Tom Collins', 'Daiquiri', 'Dark & Stormy', 'Martinez',];
//drink recipe object to save favourites
var drinkRecipe = {
    id: 0,
    name: "",
    img: "",
}
//reusable template of the drink card
const cocktailCard = (id, name, img) =>{
    return(
        `
        <div class="item-col" >
            <div class="item-content">
                <div class="item-img" onclick='productPageRequest(${id})'>
                <div class="content-overlay"></div>
                    <img src="${img}" alt="">
                    <div class="content-details fadeIn-bottom">
                    <p class="content-text">View ${name}</p>
                  </div>
                </div>
                <div class="item-content-text">
                        <div class="item-content-title">
                            <h5>${name}</h5>
                        </div
                        <div class="item-content-favourite">
                            <a class="btn-add-favourite" onclick="addFav('${id}', '${name}', '${img}')"></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
    )
}

//for saving and retrieving localstorage data
function localStorageFavourites(){
    //localStorage.setItem('FavouriteDrinks', JSON.stringify(favouriteDrink));
    return JSON.parse(localStorage.getItem('FavouriteDrinks'));
}

//where query is the search request and param is the parameters
async function cocktailRequest(query, param){
    let data;
    await fetch(`${cocktailApi}${param}${query}`)
        .then(response => response.json())
        .then(result => data = result)
        //TODO add error conditions
        .catch(err => console.log(err))
        return data;
}

//location is the desired location of weather
async function locationRequest(location){
    let data;
    await fetch(`${locationApi.uri}weather?q=${location}&units=metric&APPID=${locationApi.key}`)
        .then(response => data = response.json())
        //TODO add error conditions
        .catch(err => console.log(err))
        return data;
}

//change window url
function redirect(location){
    window.location.href = location;
}

//push data to window location to pass data along
async function productPageRequest(id){
    redirect(`product.html?id=${id}`)
}

//removing favourited cocktails
function removeFav(index){
    let favData = JSON.parse(localStorage.getItem('FavouriteDrinks'));
    let newFavData = [];
    favData.forEach(element =>{
        if(element.id != index){
            newFavData.push(element);
        }
    })
    localStorage.setItem('FavouriteDrinks', JSON.stringify(newFavData));
    favouriteCocktail();
}

//adding favourited cocktails if it doesn't already exist
function addFav(id,name,img){
    console.log(id + '\n' + name + '\n' + img);
    let favData =[];
    if(JSON.parse(localStorage.getItem('FavouriteDrinks')) == null){
        favData = [{id: id, name: name,img: img}]
    }else{
        favData = JSON.parse(localStorage.getItem('FavouriteDrinks'));
        if(!favData.filter(element => element.id == id).length > 0){
          favData.push({id: id, name: name,img: img});
        }
    }
    localStorage.setItem('FavouriteDrinks', JSON.stringify(favData));
    favouriteCocktail();
}

//mapping data from a random drink to featured card
async function favouriteCocktail(){
    var favData = JSON.parse(localStorage.getItem('FavouriteDrinks'));
    if(favData == null){
        $('#favouriteATag').text("add a recipe")
    }else{
        $('#favourite').html('');
        $('#favouriteATag').text("browse more")
        //decide whether we display only 4 objects or as many as the users adds
        let count = 0;
        favData.forEach(element => {
            $('#favourite').append(
                `
                    <div class="item-col">
                        <div class="item-content">
                            <div class="item-img" onclick='productPageRequest(${element.id})'>
                            <div class="content-overlay"></div>
                                <img src="${element.img}" alt="${element.name}">
                                <div class="content-details fadeIn-bottom">
                                    <p class="content-text">View ${element.name}</p>
                                </div>
                            </div>

                            <div class="item-content-text">
                            <div class="item-content-title">
                                <h5>${element.name}</h5>
                            </div
                            <div class="item-content-favourite">
                                <a class="btn-remove-favourite" onclick='removeFav(${element.id})'></a>
                            </div>
                        </div>

                        </div>
                    </div>
                `
                )
        })
    }
}

//mapping popular drinks to the home page, the index is the number of items you want returned
async function popularDrinks(index){
    $('#popular').html('');
    await cocktailRequest('', 'popular.php')
    .then(result => {
        var popData = result.drinks;
        for(let i = 0; i < index; i++){
            $('#popular').append(cocktailCard(popData[i].idDrink , popData[i].strDrink, popData[i].strDrinkThumb))
        }
    })
}

//search autocomplete, which is working. however, there is a css object the is blocking the display.
search.autocomplete({
    source: autoCocktails
});

//on load funcations calls

//main onload call
function homePageLoad() {
// currently saving the favourite drinks object into localstorage, just for display purposes
localStorageFavourites();
//loading objects into the favourites section
favouriteCocktail();
//loading objects into the popular section
popularDrinks(4);
//loading objects into browse section
browseDrinks(8);
browseGin(8);
browseVodka(8);
browseTequila(8);

weatherRequest();
}

//search onload call
async function searchPageLoad(){
  favouriteCocktail();
  let query = window.location.search;
  let searchParam
  query = query.split('=')[2];
  if(window.location.search.split('=')[1].includes('cocktail')){
    searchParam = 'search.php?s=';
    $('#result-query').text(`Search results for... ${query}`);
  }else if (window.location.search.split('=')[1].includes('Ingredient')) {
    searchParam = 'filter.php?i=';
    $('#result-query').text(`Search results for... ${query}`);
  }else if (window.location.search.split('=')[1].includes('popular')) {
    searchParam = 'popular.php';
    $('#result-query').text(`Search results for... Popular`);
  }
  await cocktailRequest(query, searchParam)
    .then((result) => {
      let ret = result.drinks;
      console.log(ret);
      if(ret == 'None Found'){
        $('#search-amount').text(`No results found`)
      }else{
        $('#search-amount').text(`${ret.length} results found`)
      }
      ret.forEach((element) => {
          $('#results').append(cocktailCard(element.idDrink, element.strDrink, element.strDrinkThumb))
      });
    })
}

//recipe onload call
async function productPageLoad(){
    favouriteCocktail();
    let id = window.location.search;
    let drink;
    let Ingredient;
    id = id.split('=')[1];
    await cocktailRequest(id, 'lookup.php?i=')
    .then(result => drink = result.drinks[0])
    await cocktailRequest(drink.strIngredient1, 'search.php?i=')
    .then( result => Ingredient = result.ingredients[0]);
    if (Ingredient.strDescription != null) {
      var alpha = Ingredient.strDescription
    }else {
      alpha = ""
    }
    var beta = alpha.substring(0, 300);
    var method = drink.strInstructions;
    var ingredients = [];
    var measurements = [];
    method = method.split('.');
    method.pop();
    $('.method-items').html('')
    method.forEach((element) => {
      $('.method-items').append(`<li>${element}</li>`)
    });

    for(let i = 1; i <= 15; i++){
      let ingredient = `drink.strIngredient${i}`
      let measurement = `drink.strMeasure${i}`;
      if(eval(ingredient) != null && eval(ingredient) != ""){
        ingredients.push(eval(ingredient));
        measurements.push(eval(measurement))
      }
    }
    $('#ingredients').html('');
    for (let i = 0; i < ingredients.length; i++) {
      $('#ingredients').append(
        `
        <li><span class="measurement-item">${measurements[i]}</span><span class="ingredient-item">${ingredients[i]}</span></li>
        `)
    }
    $('#productTitle').text(drink.strDrink);
    $('#ingredientTitle').text(`Based Ingrediant: ${Ingredient.strIngredient}`);
    $('#ingredientDesc').text(`${beta}...`);
    $('.product-img').attr('src', drink.strDrinkThumb);
    $('#key-features-glass').text(drink.strGlass);
    $('#key-features-base').text(Ingredient.strIngredient);
    $('#key-features-category').text(drink.strCategory);
    $('.base-img').attr('src', 'https://www.thecocktaildb.com/images/ingredients/' + Ingredient.strIngredient + '.png');

    favData = JSON.parse(localStorage.getItem('FavouriteDrinks'));
    if(favData.filter(element => element.id == id).length > 0){
      $('#productFav').text('Remove from favourites');
      $('#productFav').addClass('btn-active');
    }
}

//onclick events
$('#search-popular').click(() =>{
  redirect('./recipes.html?option=popular?search=')
})

// //click ALL load objects to browse section
$('#productFav').click(async (e) => {
  let id = window.location.search;
  id = id.split('=')[1];
  await cocktailRequest(id, 'lookup.php?i=')
  .then(result => {
    favData = JSON.parse(localStorage.getItem('FavouriteDrinks'));
    if(!favData.filter(element => element.id == id).length > 0){
      addFav(result.drinks[0].idDrink, result.drinks[0].strDrink, result.drinks[0].strDrinkThumb)
    }else {
      removeFav(id);
      $('#productFav').html('Add to my favourites');
      $('#productFav').css({'background': '#ebebeb', 'color': '#b9b9b9'})
    }

  })
})

//eventlisteners

//globally listening for an enter keypress and loading search results into console
window.addEventListener('keypress', (e) => {
    if(e.key == "Enter"){
        redirect(`./recipes.html?option=${$('.search-select').val()}?search=${e.target.value}`);

    }
})

// //location, Melbourne, Weather of the day, openweather API
async function weatherRequest(){
    $('#featured').html('');
    await locationRequest('melbourne, au')
    .then(result => {
        var daily = result.main.feels_like;
        var weather = $('#weather-condition');
        if(daily > 25) {
          browseMint();
        }else{
          browseCinnamon();
        }
      })
    }

const featureCard = (id, name, img, weather)  =>{
    return(
      `
 
  <div id="featured" class="container">
    <div class="row featured-col">
      <div class="featured-text">
            <h3 id="weather">The weather outside is <span id="weather-condition">${weather}</span>, can we suggest a...</h3>
            <div class="featured-name">${name}</div>
            <p>Who doesn't love a Margarita, right? Hailing from Mexico, this refreshing, Tequila-based cocktail has long been a darling of the global bar scene.</p>
            <a class="btn" onclick='productPageRequest(${id})'>Read more</a>
      </div>
      <div class="featured-image-col">
            <img class="featured-img" onclick='productPageRequest(${id})'>
            <img src="${img}" alt="">
      </div>
    </div>
  </div>

    `
  )
}

//function search mintCoctail, return 1 result
async function browseMint (index) {
    $('#featured').html('');
    await cocktailRequest('','filter.php?i=mint')
    .then (result => {
        var browseData = result.drinks;
    $('#featured').append( featureCard(browseData[0].idDrink, browseData[0].strDrink, browseData[0].strDrinkThumb, 'warm'))
})
}

//function search cinnamonCoctail, return 1 result
async function browseCinnamon() {
    $('#featured').html('');
    await cocktailRequest('','filter.php?i=cinnamon')
    .then (result => {
        var browseData = result.drinks;
    $('#featured').append( featureCard(browseData[0].idDrink, browseData[0].strDrink, browseData[0].strDrinkThumb, 'cold'))
})
}



//  append detail for browse card, limit to 8 blocks
async function browseDrinks (index) {
    await cocktailRequest('','latest.php')
    .then (result => {
        console.log(result)
        var browseData = result.drinks;
        for (let i=0; i < index; i++){
    $('#browse-all').append( cocktailCard(browseData[i].idDrink , browseData[i].strDrink, browseData[i].strDrinkThumb))
    }
})
}

// append detail for GIN on browse card, limit to 8
async function browseGin (index) {
    await cocktailRequest('','filter.php?i=gin')
    .then (result => {
        console.log(result)
        var browseData = result.drinks;

        console.log(browseData);
        for (let i=0; i < index; i++){

    $('#browse-gin').append( cocktailCard(browseData[i].idDrink, browseData[i].strDrink, browseData[i].strDrinkThumb))
    }
})
}

// append detail for VODKA on browse card, limit to 8
async function browseVodka (index) {
    await cocktailRequest('','filter.php?i=vodka')
    .then (result => {
        console.log(result)
        var browseData = result.drinks;

        console.log(browseData);
        for (let i=0; i < index; i++){

    $('#browse-vodka').append( cocktailCard(browseData[i].idDrink, browseData[i].strDrink, browseData[i].strDrinkThumb))
    }
})
}


// append detail for Tequila on browse card, limit to 8
async function browseTequila (index) {
    await cocktailRequest('','filter.php?i=tequila')
    .then (result => {
        console.log(result)
        var browseData = result.drinks;

        console.log(browseData);
        for (let i=0; i < index; i++){

    $('#browse-tequila').append( cocktailCard(browseData[i].idDrink, browseData[i].strDrink, browseData[i].strDrinkThumb))
    }
})
}

// Toggles browse section by type
$('#browseAll').click(() => {
    show('browse-all-col');
    $('#browseAll').addClass('active');
    $('#browseGin, #browseVodka, #browseTequila').removeClass('active');
 })
 
$('#browseVodka').click(() => {
    show('browse-vodka-col');
    $('#browseVodka').addClass('active');
    $('#browseGin, #browseAll, #browseTequila').removeClass('active');
 })

 $('#browseGin').click(() => {
    show('browse-gin-col');
    $('#browseGin').addClass('active');
    $('#browseAll, #browseVodka, #browseTequila').removeClass('active');
 })

$('#browseTequila').click(() => {
    show('browse-tequila-col');
    $('#browseTequila').addClass('active');
    $('#browseGin, #browseVodka, browseAll').removeClass('active');
})


var divs = ['browse-all-col', 'browse-gin-col', 'browse-vodka-col', 'browse-tequila-col'];
var visibleId = null;
function show(id) {
  if(visibleId !== id) {
    visibleId = id;
  } 
  hide();
}
function hide() {
  var div, i, id;
  for(i = 0; i < divs.length; i++) {
    id = divs[i];
    div = document.getElementById(id);
    if(visibleId === id) {
      div.style.display = "flex";
      } else {
      div.style.display = "none";
    }
  }
}  