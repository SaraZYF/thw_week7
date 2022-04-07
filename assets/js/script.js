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
    {
        id: 11007,
        name: "Margarita",
        img: "https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg"
    },
    {
        id: 11118,
        name: "Blue Margarita",
        img: "https://www.thecocktaildb.com/images/media/drink/bry4qh1582751040.jpg"
    },
    {
        id: 13196,
        name: "Long vodka",
        img: "https://www.thecocktaildb.com/images/media/drink/9179i01503565212.jpg"
    },
    {
        id: 16967,
        name: "Vodka Fizz",
        img: "https://www.thecocktaildb.com/images/media/drink/xwxyux1441254243.jpg"
    },
]

//TODO function that adds user's selected drink to favourites 
var favouriteDrinks = [];

const search = $('#search');

//for saving and retrieving localstorage data
function localStorageFavourites(){
    localStorage.setItem('FavouriteDrinks', JSON.stringify(favouriteDrink));
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
        //decide whether we display only 4 objects or as many as the users adds
        favData.forEach(element => {
            $('#favourite').append(
                `
                    <div class="item-col">
                        <div class="item-content">
                            <div class="fav-img">
                                <img class="pre-img" src="${element.img}" alt="${element.name}">
                            </div>
                            <div class="item-content-text">
                                <div class="">
                                    <h5>${element.name}</h5>
                                    </div>
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
            $('#popular').append(
                `
                <div class="item-col">
                    <div class="item-content">
                        <div class="pop-img">
                            <img class="pre-img" src="${popData[i].strDrinkThumb}" alt="">
                        </div>
                        <div class="item-content-text">
                            <div class="">
                                <h5>${popData[i].strDrink}</h5>
                            </div>
                        </div>
                    </div>
                </div>
                `
            )        
        }
        
    })
    
}

//on load funcations calls

//search autocomplete, which is working. however, there is a css object the is blocking the display.
search.autocomplete({
    source: autoCocktails
});

window.onload = () => {
// currently saving the favourite drinks object into localstorage, just for display purposes
localStorageFavourites();
//loading objects into the favourites section
favouriteCocktail();
//loading objects into the popular section
popularDrinks(4);

//loading objects into the browse section
browseDrinks(8);
}


$('#popularView').click(() =>{
    popularDrinks(8);
})
//eventlisteners

//globally listening for an enter keypress and loading search results into console
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


//browse section, reuse cocktailRequest function

//  append detail for browse card, limit to 8 blocks
async function browseDrinks (index) {
    $('#browse').html('');
    await cocktailRequest('','search.php?f=a')
    .then (result => {
        console.log(result)
        var browseData = result.drinks;
        for (let i=0; i < index; i++){
    
    $('#browse').append(
        `
    <div class="item-col">
                <div class="item-content">
                <div class="browse-img">
                    <img class="pre-img" src="${browseData[i].strDrinkThumb}" alt="">
                  </div>
                  <div class="item-content-text">
                    <div class="">
                      <h5>${browseData[i].strDrink}</h5>
                    </div>
                  </div>
                </div>
              </div>
              `
    )
    }
})
}

// //click ALL load objects to browse section
// $('#browseAll').click(() => {
//    browseDrinks(8);
// })


// append detail for GIN on browse card, limit to 8
async function browseGin (index) {
    $('#browse').html('');
    await cocktailRequest('','search.php?f=a')
    .then (result => {
        console.log(result)
        var browseData = result.drinks;
        var ginData = browseData.filter((drink) => {
            for (keys in drink){
                if(drink[keys] === "Gin"){
                    return drink;
                }
            }
        });
        console.log(ginData);
        for (let i=0; i < index; i++){
    
    $('#browse').append(
        `
    <div class="item-col">
                <div class="item-content">
                <div class="browse-img">
                    <img class="pre-img" src="${ginData[i].strDrinkThumb}" alt="">
                  </div>
                  <div class="item-content-text">
                    <div class="">
                      <h5>${ginData[i].strDrink}</h5>
                    </div>
                  </div>
                </div>
              </div>
              `
    )
    }
})
}



// click ALL load objects to browse section
$('#browseGin').click(() => {
   browseGin(8);
})

// TODO go to pdp page on button click


