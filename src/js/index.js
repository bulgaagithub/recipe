// ./ current folder

require("@babel/polyfill");

import Search from "./model/Search";
import Recipe from "./model/Recipe";
import List from "./model/List";

import {
  renderRecipe,
  clearRecipe,
  highlightSelectRecipe,
} from "./view/recipeView";

import { elements, renderLoader, clearLoader } from "./view/base";

import * as searchView from "./view/searchView";
import * as listView from "./view/listView";
import * as likesView from "./view/likesView";
import Like from "./model/Like";

/**
 * Web app state
 * - Хайлтын query, үр дүн
 * - Тухайн үзүүлж байгаа жор
 * - Лайкалсан жорууд
 * - Захиалж байгаа жорын найрлагууд
 */

const state = {};

/**
 * MVC architecture
 * Model ===> Controller <=== View
 * 1. Search Controller
 * 2. Recipe Controller
 */

const controlSearch = async () => {
  // 1) Вэбээс хайлтын түлхүүр үгийг гаргаж авна.
  const query = searchView.getInput();
  if (query) {
    // 2) Шинээр хайлтын объектийг үүсгэж өгнө.
    state.search = new Search(query);
    // 3) Хайлт хийхэд зориулж дэлгэцийг UI бэлтгэнэ.
    searchView.clearSearchQuery();
    searchView.clearSearchResult();
    renderLoader(elements.searchResultDiv);
    // 4) Хайлтыг гүйцэтгэнэ.
    await state.search.doSearch();
    clearLoader();
    // 5) Хайлтын үр дүнг дэлгэцэнд үзүүлнэ.
    if (state.search.result === undefined) alert("Хайлтаар илэрцгүй");
    else searchView.renderRecipes(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  // default behaviour clear
  e.preventDefault(); // default үйл ажиллагааг зогсоох
  controlSearch();
});

elements.pageButtons.addEventListener("click", (e) => {
  // дарагдсан товчийг шууд олох
  // closest хамгийн ойр байгаа element-ийг олж өгнө.
  // e.target dom element
  const btn = e.target.closest(".btn-inline");

  if (btn) {
    searchView.clearSearchResult();
    searchView.renderRecipes(state.search.result, parseInt(btn.dataset.goto));
  }
});

/**
 * Жорын контроллер
 */

const controlRecipe = async () => {
  // 1) URL-аас ID-ийг салгаж авна.
  const id = window.location.hash.replace("#", "");
  // ID on browser url section
  if (id) {
    // 2) Жорын моделийг үүсгэж өгнө.
    state.recipe = new Recipe(parseInt(id));

    // 3) UI дэлгэцийг бэлтгэнэ.
    clearRecipe();
    renderLoader(elements.recipeDiv);
    highlightSelectRecipe(id);
    // 4) Жороо татаж авчирна.

    await state.recipe.getRecipe();

    // 5) Жорыг гүйцэтгэх хугацаа болон орцыг тооцоолно.
    clearLoader();
    state.recipe.calcTime();
    state.recipe.calcHuniiToo();

    // 6) Жороо дэлгэцэнд гаргана.
    renderRecipe(state.recipe, state.likes.isLiked(parseInt(id)));
  }

};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

window.addEventListener("load", e => {
  // Шинээр лайз моделийг апп дөнгөж ачаалагдахад үүсгэнэ.
  if(!state.likes) state.likes = new Like();

  // like menu hidden
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());

  // Лайкууд байвал тэдгээрийг цэсэнд нэмж харуулна. 
  state.likes.likes.forEach(like => likesView.renderLike(like));

});

/**
 * Ingredients Controller 
 * Найрлаганы контроллер 
 */

const controlList = () => {

    // Create model Ingredients
    state.list = new List();

    // Before ingredients delete from display
    listView.clearItems();
    // all ingredients Add to model
    state.recipe.ingredients.forEach(n => {
        // Тухайн найрлагыг модел рүү хийнэ. 
        const item = state.list.addItem(n);
        // Тухайн найрлагыг дэлгэцэнд гаргана.
        listView.renderItem(item);
    });
};


/**
 * Like controller 
 */

const controllerLike = () => {
  // Дарагдсан жорыг авч модел руу хийх 
  // 1) Лайкийн моделийг үүсгэнэ.
  if(!state.likes) state.likes = new Like();
  // 2) Одоо харагдаж байгаа жорын ID-г олж авах 
  const currentRecipeId = state.recipe.id;
  // 3) Энэ жорыг лайкалсан эсэхийг шалгах 
  if(state.likes.isLiked(currentRecipeId)) {
    // Лайкалсан бол лайкийг болиулна.
    state.likes.deleteLike(currentRecipeId);

    // Лайкын цэснээс устгана.
    likesView.deleteLike(currentRecipeId);

    // Toggle like button hide
    likesView.toggleLikeBtn(false);
  } else {
    // Лайкалаагүй бол лайкална. 
    const newLike = state.likes.addLike(currentRecipeId, state.recipe.title, state.recipe.publisher, state.recipe.image_url);
    
    // add like to like menu
    likesView.renderLike(newLike);
    
    // Like button toggle show
    likesView.toggleLikeBtn(true);
  }
  
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
}

elements.recipeDiv.addEventListener('click', (e) => {
    if(e.target.matches('.recipe__btn, .recipe__btn *')) {
      controlList();
    } else if(e.target.matches('.recipe__love, .recipe__love *')){
      controllerLike();
    }
});


elements.shoppingList.addEventListener('click', (e) => {
    // Click хийсэн li элементийн data-itemid аттрибутыг шүүж гаргаж авах
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // олдсон ID-тэй орцыг моделоос устгана.
    state.list.deleteItem(id);
    
    // Дэлгэцнээс устгах 
    listView.deleteItem(id);
});