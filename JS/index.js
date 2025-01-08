// My personal api token for Rverb
const API_KEY = '8087b4cc3e1b804b54d42e652af6a0cd72921f818384e691edf9ee99088f64ec';

// Define the base URL for the Reverb API
const baseUrl = 'https://api.reverb.com/api';

// Function to fetch products
async function fetchListings(searchTerm) {
  const url = `${baseUrl}/listings?query=${encodeURIComponent(searchTerm)}`;
  // const url = `https://api.reverb.com/api/listings/1234`; INDIVIDUAL SEARCH BY ID

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/hal+json',
        'Accept': 'application/hal+json',
        'Accept-Version': '3.0',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching data:', response.statusText);
    } else {
      const data = await response.json();
      console.log(data);
      displayProducts(data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Function to display the fetched products
function displayProducts(data) {
  deleteProducts();
  if (data && data.listings) { // If products exist...
    for (var product of data.listings){
      createElement(product);
    }
  } else {
    alert.log('No listings found.');
  }
}

const mainGrid = document.querySelector('.main__grid');
// Function to create elements for each product
function createElement(product) {
  const newFig = document.createElement('figure');
  newFig.className = 'main__grid-element';
  mainGrid.appendChild(newFig);

  const newDiv = document.createElement('div');
  newDiv.className = 'main__image-container';
  newFig.appendChild(newDiv);

  const newImg = document.createElement('img');
  newImg.className = 'main__item-image';
  newImg.alt = product.title;
  newImg.src = product._links.photo.href;
  newDiv.appendChild(newImg);

  const newCaption = document.createElement('figcaption');
  newCaption.className = 'main__item-description';
  newCaption.innerText = product.title;
  newFig.appendChild(newCaption);

  const newSpan = document.createElement('span');
  newSpan.className = 'main__item-price';
  newSpan.innerText = product.price.display;
  newFig.appendChild(newSpan);

  const newBtn = document.createElement('button');
  newBtn.className = 'main__add-to-cart-btn';
  newBtn.innerHTML = 'Add to Cart';
  newFig.appendChild(newBtn);

  const newLink = document.createElement('a');
  newLink.className = 'main__item-reverb-link';
  newLink.href = product._links.web.href;
  newLink.target = '_blank';
  newLink.innerText = 'View on Reverb';
  newFig.appendChild(newLink);
}

// Function to delete currently displayed products
function deleteProducts(){
  const figEelem = document.querySelectorAll('.main__grid-element');

  for (var product of figEelem){
    mainGrid.removeChild(product);
  }
}

// Display initial products
fetchListings('ESP guitars');

// Search bar event listeners
const searchBtn = document.querySelector('.header__search-btn');
const searchInput = document.querySelector('.header__search-input');
searchBtn.addEventListener('click', () => {
  const searchBarVal = searchInput.value;
  fetchListings(searchBarVal);
});

searchInput.addEventListener('keydown', (event) => {
  const searchBarVal = searchInput.value;
  if (event.key === 'Enter') fetchListings(searchBarVal);
});



///// PAGINATION

// async function fetchListings(searchTerm, page = 1) {
//   const url = `${baseUrl}/listings?search_term=${encodeURIComponent(searchTerm)}&page=${page}`;

//   try {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (response.ok) {
//       const data = await response.json();
//       displayListings(data);

//       // If there's another page, fetch it
//       if (data.next_page) {
//         fetchListings(searchTerm, page + 1); // Recursive call for next page
//       }
//     } else {
//       console.error('Error fetching data:', response.statusText);
//     }
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }
