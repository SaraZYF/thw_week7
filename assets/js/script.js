//assigning global variables 
const cocktailApi = 'https://www.thecocktaildb.com/api/json/v1/1/';
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
    alcoholic: false,
    ingredients: [],
    steps: []
}
var popularDrinks = [];
var featuredDrink = {} 
//TODO function that adds user's selected drink to favourites 
var favouriteDrinks = [drinkRecipe];

//
const search = $('#search');

//for saving and retrieving localstorage data
function localStorageFavourites(){
    localStorage.setItem('FavouriteDrinks', JSON.stringify(favouriteDrinks));
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

//mapping data from a random drink to featured card
async function featuredCocktail(){
    await cocktailRequest('','random.php')
    .then(result => {
        featuredDrink.id = result.drinks[0].idDrink;
        featuredDrink.name = result.drinks[0].strDrink;
        featuredDrink.img = result.drinks[0].strDrinkThumb;
    })
    $('.featured_recipe').append(
    `
        <h2>${featuredDrink.name}<h2>
        <img src='${featuredDrink.img}' alt='${featuredDrink.name}' width='200px' href="#${featuredDrink.id}"> 
        <a href="#${featuredDrink.id}">Read More</a>  
    `
    )
}

async function popularDrinks(){
    //TODO update api key so this function works
    await cocktailRequest('', 'popular.php')
    .then(result => {
        JSON.parse(result).forEach(element => {

        })
    })
}

//on load funcations calls
search.autocomplete({
    source: autoCocktails
});

featuredCocktail();

//eventlisteners
window.addEventListener('keypress', (e) => {
    if(e.key == "Enter"){
        cocktailRequest(search.val(), 'search.php?s=')
        .then(result => {
            result.drinks.forEach(element => {
                console.log(element);
            })
        })
    }
})