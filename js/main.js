// Get references to HTML elements
const results = document.getElementById('results');
const searchForm = document.getElementById('search-form');
const searchInput = searchForm.querySelector('input[type="text"]');

// Giphy API key
const apiKey = 'pY1rEREdUlzfy2f8J9xrzkqyes07tJZ0';

//Sample GIF URLs for testing
const sampleGifs = [
    'https://media.giphy.com/media/3o7aD2saq1d0b4z5s8/giphy.gif',
    'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
    'https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif',
];

// Function to display sample GIFs in grid
function displaySampleGifs() {
    if (!results) return; // Prevent errors if #result isn't found
    
    results.innerHTML = ''; // Clear any existing content

//Create a div with class 'grid' to hold the images
const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid');

//Loop over sample GIF URLs and create image elements
sampleGifs.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Sample GIF';
    img.classList.add('grid-item');
    gridContainer.appendChild(img);
});

//Add the grid to the page
results.appendChild(gridContainer);
}

// run function after DOM has loaded
document. addEventListener('DOMContentLoaded', () => {
    displaySampleGifs();

});