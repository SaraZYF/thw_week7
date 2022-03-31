//assigning global variables 
const cocktailApi = 'https://www.thecocktaildb.com/api/json/v1/1/';
const locationApi = {
    key: 'f40fdbed4ce6f49a21c55972b85d4f67',
    uri: 'https://api.openweathermap.org/data/2.5/'
};
//array of popular cocktails for search autocomplete
var atuoCocktails = ['Martini', 'Old Fashioned', 'Margarita', 'Cosmopolitan', 'Negroni', 'Moscow Mule', 'Martini', 'Mojito', 'Whiskey Sour', 'French 75', 
    'Manhattan', 'Spritz', 'Gimlet', 'Sazerac' ,"Pimm's Cup", 'Vesper', 'Mimosa', 'Tom Collins', 'Daiquiri', 'Dark & Stormy', 'Martinez',];
var drinkRecipe = {
    id: 0,
    name: "",
    alcoholic: false,
    ingredients: [],
    steps: []
} 
var favouriteDrinks = [drinkRecipe];

//for saving and retrieving localstorage data
function localStorageFavourites(){
    localStorage.setItem('FavouriteDrinks', JSON.stringify(favouriteDrinks));
    return JSON.parse(localStorage.getItem('FavouriteDrinks'));
}

//where query is the search request and param is the parameters
async function searchRequest(query, param){
    let data;
    await fetch(`${cocktailApi}${param}${query}`)
        .then(response => response.json())
        .then(result => {
            data = result;
        })
        //TODO add error conditions
        .catch(err => console.log(err))
        return data;
}

//location is the desired location of weather
async function locationRequest(location){
    let data;
    await fetch(`${locationApi.uri}weather?q=${location}&units=metric&APPID=${locationApi.key}`)
        .then(response => response.json())
        .then(result => {
            data = result
        })
        //TODO add error conditions
        .catch(err => console.log(err))
        return data;
}


//logging for verfication that funcations work
console.log(searchRequest('martini', 'search.php?s='));
console.log(locationRequest('melbourne'));
console.log(localStorageFavourites());