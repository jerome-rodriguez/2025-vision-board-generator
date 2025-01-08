const accessKey = "B_-2UCeI-zQGcZPgB1JZriuiUWjNtJ_7lgGFiyjIUQk";

// Function to search and display images
async function searchImages() {
    const query = document.getElementById("header__search").value;
    if (!query) {
        alert("Please enter a search image.");
        return;
    }
    // Fetching images based on the search query using Axios
    const response = await axios.get("https://api.unsplash.com/search/photos", {
        params: {
            query: query,
            client_id: accessKey,
        },
    });

    const data = response.data; // Axios automatically parses JSON data

    const imageSelectionContent = document.querySelector(".image-selection__content");
    imageSelectionContent.innerHTML = ""; // Clear previous search results

    if (data.results.length > 0) {
        data.results.forEach((image) => {
            const imgElement = document.createElement("img");
            imgElement.src = image.urls.small;
            imgElement.alt = image.alt_description;
            imgElement.onclick = () => addImageToBoard(image.urls.regular);
            imageSelectionContent.appendChild(imgElement);
        });
    } else {
        const pElement = document.createElement("p");
        pElement.textContent = "No images found. Try another search.";
        imageSelectionContent.appendChild(pElement);
    }
}

// Function to add images to the vision board
function addImageToBoard(imageUrl) {
    const board = document.querySelector(".board");

    // Add the image to the vision board
    const newImg = document.createElement("img");
    newImg.src = imageUrl;
    newImg.alt = "Vision Board Image";
    newImg.style.cursor = "pointer"; // Change the cursor to indicate it's clickable

    newImg.onclick = function() {
        removeImageFromBoard(newImg);
    };

    board.appendChild(newImg);

    // Save the image URL to localStorage
    let savedImages = JSON.parse(localStorage.getItem("visionBoardImages")) || [];
    savedImages.push(imageUrl);
    localStorage.setItem("visionBoardImages", JSON.stringify(savedImages));
}

// Function to remove image from the vision board
function removeImageFromBoard(imageElement) {
    const board = document.querySelector(".board");

    // Remove the image element from the board
    board.removeChild(imageElement);

    // Remove the image URL from localStorage
    let savedImages = JSON.parse(localStorage.getItem("visionBoardImages")) || [];
    savedImages = savedImages.filter((url) => url !== imageElement.src); // Remove the specific image URL
    localStorage.setItem("visionBoardImages", JSON.stringify(savedImages));
}

// Function to load saved images from localStorage
function loadSavedImages() {
    const savedImages =
        JSON.parse(localStorage.getItem("visionBoardImages")) || [];
    const board = document.querySelector(".board");

    // Display saved images
    savedImages.forEach((imageUrl) => {
        const imgElement = document.createElement("img");
        imgElement.src = imageUrl;
        imgElement.alt = "Vision Board Image";
        imgElement.style.cursor = "default"; // Remove the click functionality
        board.appendChild(imgElement);
    });
}

// Call loadSavedImages on page load to ensure saved images appear
window.onload = loadSavedImages;

// Function to clear the vision board
function clearBoard() {
    const board = document.querySelector(".board");

    // Clear the board content (remove all images)
    board.innerHTML = "";

    // Clear the saved images in localStorage
    localStorage.removeItem("visionBoardImages");
}

// Call the clearBoard function when needed (e.g., on a button click)
const clearButton = document.querySelector(".button__clear");
clearButton.addEventListener("click", clearBoard);