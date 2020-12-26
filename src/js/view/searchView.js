import { elements } from "./base";

// private function
const renderRecipe = (recipe) => {
  const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="Test">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${recipe.title}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;

  // ul рүүгээ нэмнэ
  elements.searchResultsList.insertAdjacentHTML("beforeend", markup);
};

export const clearSearchQuery = () => {
  elements.searchInput.value = "";
};

export const clearSearchResult = () => {
  elements.searchResultsList.innerHTML = "";
  elements.pageButtons.innerHTML = "";
};

export const getInput = () => elements.searchInput.value;

export const renderRecipes = (recipes, page = 1, resPerPage = 10) => {
  // Хайлтын үр дүнг хуудаслаж үзүүлэх
  // page = 2, start = 10, end = 20
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  // Хуудаслалтын товчуудыг гаргаж ирэх 
  // ceil дээшээгээ бүхэл болгоно. 
  const totalPages = Math.ceil(recipes.length / resPerPage);
  renderButtons(page, totalPages);
};


// type ===> 'prev', 'next'

const createButton = (page, type) => `<button class="btn-inline results__btn--${type}" data-goto=${page}>
<svg class="search__icon">
  <use href="img/icons.svg#icon-triangle-${type === 'next' ? 'right' : 'left'}"></use>
</svg>
<span>Хуудас ${page}</span>
</button>`;

const renderButtons = (currentPage, totalPages) => {
    let buttonHTML;

    if(currentPage === 1 && totalPages > 1) {
        // 1-р хуудсан дээр байна, 2-р хуудас гэдэг товчийг гарга.
        buttonHTML = createButton(2,'next');
    } 
    
    else if (currentPage < totalPages) {
        // middle page running 
        // next and prev buttons show
        buttonHTML = createButton(currentPage - 1,'prev');
        buttonHTML += createButton(currentPage + 1,'next');
    }

    else if(currentPage === totalPages) {
        // Хамгийн сүүлийн хуудас дээр байна.
        buttonHTML = createButton(currentPage - 1,'prev');
    }

    elements.pageButtons.insertAdjacentHTML('afterbegin', buttonHTML);
}
