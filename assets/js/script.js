
//assigning global variables
const cocktailApi = 'https://www.thecocktaildb.com/api/json/v2/9973533/';
const locationApi = {
    key: 'f40fdbed4ce6f49a21c55972b85d4f67',
    uri: 'https://api.openweathermap.org/data/2.5/'
};
//array of popular cocktails for search autocomplete
var autoCocktails = ['Martini', 'Old Fashioned', 'Margarita', 'Cosmopolitan', 'Negroni', 'Moscow Mule', 'Martini', 'Mojito', 'Whiskey Sour', 'French 75',
    'Manhattan', 'Spritz', 'Gimlet', 'Sazerac' ,"Pimm's Cup", 'Vesper', 'Mimosa', 'Tom Collins', 'Daiquiri', 'Dark & Stormy', 'Martinez',];
//drink recipe object to save favourites
var drinkRecipe = {
    id: 0,
    name: "",
    img: "",
}

//favourite drinks is an array of objects
//TODO add function that add's and removes objects on user input
var favouriteDrink =
[

]

//TODO function that adds user's selected drink to favourites
var favouriteDrinks = [];

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
                        </div>
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

const search = $('#search');

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


///location is the desired location of weather
async function locationRequest(location){
    let data;
    await fetch(`${locationApi.uri}weather?q=${location}&units=metric&APPID=${locationApi.key}`)
        .then(response => data = response.json())
        //TODO add error conditions
        .catch(err => console.log(err))
        return data;
}

function redirect(location){
    window.location.href = location;
}


async function searchPageLoad(){
  favouriteCocktail();
  let query = window.location.search;
  query = query.split('=')[1];
  console.log(query)
  await cocktailRequest(query, 'filter.php?i=')
  .then((result) => {
    let ret = result.drinks;
    console.log(ret.length)
    ret.forEach((element) => {
        $('#results').append(cocktailCard(element.idDrink, element.strDrink, element.strDrinkThumb))
    });

  })
}

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

    console.log(drink)
    console.log(Ingredient)
    var alpha = Ingredient.strDescription.toString()
    var beta = alpha.substring(0, 300);

    $('#productTitle').text(drink.strDrink);
    $('#ingredientTitle').text(`Based Ingrediant: ${Ingredient.strIngredient}`);
    $('#ingredientDesc').text(`${beta}...`);
    $('.product-img').attr('src', drink.strDrinkThumb);
    $('#key-features-glass').text(drink.strGlass);
    $('#key-features-base').text(Ingredient.strIngredient);
    $('#key-features-category').text(drink.strCategory);
    $('.base-img').attr('src', 'https://www.thecocktaildb.com/images/ingredients/' + Ingredient.strIngredient + '.png');

}

async function productPageRequest(id){
    redirect(`product.html?id=${id}`)
}

function removeFav(index){
    let favData = JSON.parse(localStorage.getItem('FavouriteDrinks'));
    let newFavData = [];
    favData.forEach(element =>{
        if(element.id != index){
            newFavData.push(element);
        }
    })
    localStorage.setItem('FavouriteDrinks', JSON.stringify(newFavData));
}

function addFav(id,name,img){
    console.log(id + '\n' + name + '\n' + img);
    let favData =[];
    if(JSON.parse(localStorage.getItem('FavouriteDrinks')) == null){
        favData = [{id: id, name: name,img: img}]
    }else{
        favData = JSON.parse(localStorage.getItem('FavouriteDrinks'));
        favData.push({id: id, name: name,img: img});
    }
    localStorage.setItem('FavouriteDrinks', JSON.stringify(favData));
}

//mapping data from a random drink to featured card
async function favouriteCocktail(){
    var favData = JSON.parse(localStorage.getItem('FavouriteDrinks'));
    console.log(JSON.parse(localStorage.getItem('FavouriteDrinks')));
    if(favData == null){
        console.log("none");
        $('#favouriteATag').text("add a recipe")
        //TODO change the placeholder image to a plus image
        $('#favourite').append(
            `
                <div class="item-col">
                    <div class="item-content">
                        <div class="item-img">
                            <img src="./assets/img/cocktail-favourites-background.png" alt="">
                        </div>
                        <div class="item-content-text">
                            <div class="">
                                <h5></h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        )
    }else{
        $('#favourite').html('');
        $('#favouriteATag').text("view more")
        //decide whether we display only 4 objects or as many as the users adds
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
        console.log(result)
        var popData = result.drinks;
        for(let i = 0; i < index; i++){
            $('#popular').append(cocktailCard(popData[i].idDrink , popData[i].strDrink, popData[i].strDrinkThumb))
        }

    })

}

//on load funcations calls

//search autocomplete, which is working. however, there is a css object the is blocking the display.
search.autocomplete({
    source: autoCocktails
});
console.log('1')
function homePageLoad() {
    console.log('1')
// currently saving the favourite drinks object into localstorage, just for display purposes
localStorageFavourites();
//loading objects into the favourites section
favouriteCocktail();
//loading objects into the popular section
popularDrinks(4);
//loading objects into browse section
browseDrinks(8);

weatherRequest()
}


$('#popularView').click(() =>{
    popularDrinks(8);
})

//eventlisteners

//globally listening for an enter keypress and loading search results into console
window.addEventListener('keypress', (e) => {
    if(e.key == "Enter"){
        window.location.href = `./recipes.html?search=${e.target.value}`;
    }
})

//  append detail for browse card, limit to 8 blocks
async function browseDrinks (index) {
    $('#browse').html('');
    await cocktailRequest('','latest.php')
    .then (result => {
        console.log(result)
        var browseData = result.drinks;
        for (let i=0; i < index; i++){
    $('#browse').append( cocktailCard(browseData[i].idDrink , browseData[i].strDrink, browseData[i].strDrinkThumb))
    }
})
}

// //click ALL load objects to browse section
$('#browseAll').click(() => {
   browseDrinks(8);
})


// append detail for GIN on browse card, limit to 8
async function browseGin (index) {
    $('#browse').html('');
    await cocktailRequest('','filter.php?i=gin')
    .then (result => {
        console.log(result)
        var browseData = result.drinks;

        console.log(browseData);
        for (let i=0; i < index; i++){

    $('#browse').append( cocktailCard(browseData[i].idDrink, browseData[i].strDrink, browseData[i].strDrinkThumb))
    }
})
}



// click GIN load objects to browse section
$('#browseGin').click(() => {
   browseGin(8);
})

// append detail for VODKA on browse card, limit to 8
async function browseVodka (index) {
    $('#browse').html('');
    await cocktailRequest('','filter.php?i=vodka')
    .then (result => {
        console.log(result)
        var browseData = result.drinks;

        console.log(browseData);
        for (let i=0; i < index; i++){

    $('#browse').append( cocktailCard(browseData[i].idDrink, browseData[i].strDrink, browseData[i].strDrinkThumb))
    }
})
}



// click VODKA load objects to browse section
$('#browseVodka').click(() => {
   browseVodka(8);
})


// append detail for Brandy on browse card, limit to 8
async function browseBrandy (index) {
    $('#browse').html('');
    await cocktailRequest('','filter.php?i=brandy')
    .then (result => {
        console.log(result)
        var browseData = result.drinks;

        console.log(browseData);
        for (let i=0; i < index; i++){

    $('#browse').append( cocktailCard(browseData[i].idDrink, browseData[i].strDrink, browseData[i].strDrinkThumb))
    }
})
}



// click Brandy load objects to browse section
$('#browseBrandy').click(() => {
   browseBrandy(8);
})




// //weather request
//  async function weatherRequest (lat,lon){
//     let data;
//     await fetch(`${locationApi.uri}weather?lat=${lat}&lon=${lon}$appid=${locationApi.key}`)
//     .then(response =>response.json())
//     .then(result => data = result)
//     .catch(err => console.log(err))
//     return data;
// }

// //location, Melbourne, Weather of the day, openweather API
async function weatherRequest(){
    $('#featured').html('');
    await locationRequest('melbourne, au')
    .then(result => {
        var daily = result.main.feels_like;
        var weather = $('#weather-condition');
        if(daily > 25) {
          browseMint(0);
        }else{
          browseCinnamon(0);
        }
      })
    }

// // if feels like >300, 25C unit=Kelvin, append span text =warm, and coctail api,i=mint
// // if feels like <300, append text =cool, and coctail api, i=cinnamon


//define featurecard
const featureCard = (id, name, img, weather)  =>{
    return(
        `
<div class="row featured-col">
      <!-- <div class="featured-col"> -->
      <div class="featured-text">
      <h3 id="weather">The weather outside is <span id="weather-condition">${weather}</span>, can we suggest a...</h3>
      <div class="featured-name">${name}</div>
      <p>Who doesn't love a Margarita, right? Hailing from Mexico, this refreshing, Tequila-based cocktail has long been a darling of the global bar scene.</p>
      <a class="btn" href="#">Read more</a>
        </div>
        <div class="featured-image-col">
            <img class="featured-img" onclick='productPageRequest(${id})'>
            <img src="${img}" alt="">
        </div>
      <!-- </div> -->
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
