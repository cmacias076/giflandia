import '../css/style.scss';

//Default number of GIFs to fetch
const DEFAULT_LIMIT = 9;

document.addEventListener('DOMContentLoaded', () => {
// Access API key from .env (Vite environment variable)
const apiKey = import.meta.env.VITE_GIPHY_API_KEY;

//Check if API key is loaded
if (!apiKey) {
    const results = document.getElementById('results'); 
    if (results) {
        results.innerHTML = 
        '<p style="color:red; font-weight:bold;">Error: Missing Giphy API key. Please create a .env file with your API key.</p>';
    }
    console.error('Giphy API key is not defined. Please add it to your .env file.');
    return; //Stop execution if no key
}

// Get references to HTML elements
const results = document.getElementById('results'); 
const searchForm = document.getElementById('search-form');
const searchInput = document.querySelector('input[type="search"]');

if (!results || !searchForm || !searchInput) {
    console.error('One or more required DOM elements are missing.');
    return;
}

//Heart icons as constants
const EMPTY_HEART = '\u2661'; //Unicode for an empty heart
const FILLED_HEART = '\u2764\uFE0F'; //Unicode for a filled heart

/**
 * Fetch multiple random GIFs from Giphy
 * @param {number} count Number of random GIFs to fetch
 */
async function fetchRandomGifs(count = DEFAULT_LIMIT) {
    const randomGifs = [];

    for (let i = 0; i < count; i++) {
        const endpoint = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&rating=g`;
            try {
            const response = await fetch(endpoint);

            // Handle rate limit error
            if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }

            const data = await response.json();
            if (data && data.data) {
               randomGifs.push(data.data); //Push the GIF into the array
            }
          }  catch (error) {
             console.error('Error fetching random GIF:', error);
          }
        }

        displayGifs(randomGifs); //Display the collected random GIFs
    }


/**
 * Fetch GIFs matching user search query
 * @param {string} query Search keyword
 */
async function fetchGifs(query) {
    const endpoint = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=12&rating=g`;
    try {
        const response = await fetch(endpoint);
        
        if (response.status ===429) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }
            
        const data = await response.json(); // Parse JSON response

        //Display the search results
        if (data && data.data && Array.isArray(data.data)) {
             displayGifs(data.data); 
        }
    } catch (error) {
        console.error('Error fetching GIFs:', error); // Log any errors
        results.innerHTML = `<p style="color:red; font-weight:bold;">Oops! ${error.message}</p>`;
    }
}


/**
 * Display GIFs in a grid layout with favorite buttons
 * @param {Array} gifs Array of GIF objects from Giphy API
 */
function displayGifs(gifs) { 
    results.innerHTML = ''; // Clear previous results

//Create grid container
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid');

//Get favorites from localstorage or initialize empty array
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];    

//Loop through gifs array 
    gifs.forEach(gif => {

        //Safety check to avoid undefined properties
        if (gif && gif.images && gif.images.fixed_height) {

            //Outer container with class grid-item
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');

            const container = document.createElement('div');
            container.classList.add('gif-container');
            container.style.position = 'relative';

            //Create image element
            const img = document.createElement('img');
            img.src = gif.images.fixed_height.url; // Get gif URL from API response
            img.alt = gif.title || 'GIF';

            //Create favorite button
            const favBtn = document.createElement('button');
            favBtn.classList.add('fav-btn');

            //Check if the GIF is already a favorite
            const isFavorited = favorites.some(fav => fav.id === gif.id);
            favBtn.innerText = isFavorited ? FILLED_HEART : EMPTY_HEART;

            //Favorite button click handler
            favBtn.addEventListener('click', () => {
                let updatedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
                
                if (favBtn.innerText === EMPTY_HEART) {
                    //Add to favorites 
                    favBtn.innerText = FILLED_HEART;
                    updatedFavorites.push({ id: gif.id, url: gif.images.fixed_height.url, title: gif.title });
                } else {
                    // Remove from favorites
                    favBtn.innerText = EMPTY_HEART;
                    updatedFavorites = updatedFavorites.filter(fav => fav.id !== gif.id);
                }
                // Save updated favorites to localStorage
                localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            });

            // Append image and button to container
            container.appendChild(img);
            container.appendChild(favBtn);

            // Append the container to the grid
            gridItem.appendChild(container);

            gridContainer.appendChild(gridItem);
        }
    });

    // Append the grid container to the results element
    results.appendChild(gridContainer);
}
// Listen for form submission
searchForm.addEventListener('submit', event => {
    event.preventDefault(); //Stops form from reloading the page
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        fetchGifs(searchTerm);
    } 
});

// Load random GIFs on initial page load
fetchRandomGifs(DEFAULT_LIMIT);
});