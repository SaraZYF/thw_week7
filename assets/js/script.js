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
var popularDrink = [];
var favouriteDrink = {} 
//TODO function that adds user's selected drink to favourites 
var favouriteDrinks = [drinkRecipe];

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
async function favouriteCocktail(){
    var favData = localStorage.getItem('FavouriteDrinks');
    if(favData == null){
        console.log("none");
        $('#favouriteATag').text("add a recipe")
        $('#favourite').append(
            `
                <div class="item-col">
                    <div class="item-content">
                        <div class="fav-img">
                            <img class="pre-img" src="./assets/img/cocktail-list-placeholder.png" alt="">
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
        $('#favouriteATag').text("view more")
        await cocktailRequest('','random.php')
        .then(result => {
            favouriteDrink.id = result.drinks[0].idDrink;
            favouriteDrink.name = result.drinks[0].strDrink;
            favouriteDrink.img = result.drinks[0].strDrinkThumb;
        })
        $('#favourite').append(
        `
            <div class="item-col">
                <div class="item-content">
                    <div class="fav-img">
                        <img class="pre-img" src="${favouriteDrink.img}" alt="${favouriteDrink.name}">
                    </div>
                    <div class="item-content-text">
                        <div class="">
                            <h5>${favouriteDrink.name}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
        )
    }
}


async function popularDrinks(){
    //TODO update api key so this function works
    await cocktailRequest('', 'popular.php')
    .then(result => {
        console.log(result)
    })
    
}

console.log(cocktailRequest('', 'random.php'));
//on load funcations calls

search.autocomplete({
    source: autoCocktails
});


favouriteCocktail();
popularDrinks();


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