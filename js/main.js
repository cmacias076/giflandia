// Get references to HTML elements
const results = document.getElementById('results'); 
const searchForm = document.getElementById('search-form');
const searchInput = document.querySelector('input[type="search"]');

if (!searchInput) {
    console.error('Search input not found.');
}

// Giphy API key
const apiKey = 'REMOVED_KEY';

//Function to fetch multiple random GIFs
async function fetchRandomGifs(count = 9) {
    const randomGifs = [];

    for (let i = 0; i < count; i++) {
        const endpoint = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&rating=g`;
        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            randomGifs.push(data.data); //Push the random GIF into the array
        } catch (error) {
            console.error('Error fetching random GIF:', error);
        }
        }

        displayGifs(randomGifs); //Display the collected random GIFs
    }


// Function to fetch GIF based on user input
async function fetchGifs(query) {
    const endpoint = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=12&rating=g`;
    try {
        const response = await fetch(endpoint); //Fetch data from Giphy API
        const data = await response.json(); // Parse JSON response

        displayGifs(data.data);  //Call function to show GIFs
    } catch (error) {
        console.error('Error fetching GIFs:', error); // Log any errors
    }
}


// Function to display GIFs in grid
function displayGifs(gifs) { 
    results.innerHTML = ''; // Clear previous results

//Create grid container
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid');

//Loop through gifs array 
    gifs.forEach(gif => {
        const img = document.createElement('img');
        img.src = gif.images.fixed_height.url; // Get gif URL from API response
        img.alt = gif.title || 'GIF';
        img.classList.add('grid-item');
        gridContainer.appendChild(img);
    });

//Append grid to results section
    results.appendChild(gridContainer);
}

// Listen for form submission
searchForm.addEventListener('submit', function (event) {
    event.preventDefault(); //Stops form from reloading the page

    const searchTerm = searchInput && searchInput.value ? searchInput.value.trim() : '';
    
    if (searchTerm) {
        fetchGifs(searchTerm);
    } 
});      
document.addEventListener('DOMContentLoaded', () => {
    fetchRandomGifs(9);
});
// Fetch random GIFs when the page loads