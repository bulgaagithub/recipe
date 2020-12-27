// ./ current folder

require('@babel/polyfill');

import Search from "./model/Search";
import Recipe from "./model/Recipe";

import {elements, renderLoader, clearLoader} from './view/base';

import * as searchView from './view/searchView';
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
     if(query) {
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
        if(state.search.result === undefined) alert('Хайлтаар илэрцгүй');
        else searchView.renderRecipes(state.search.result);
    }
 }

 elements.searchForm.addEventListener('submit', e => {
    // default behaviour clear
    e.preventDefault(); // default үйл ажиллагааг зогсоох
    controlSearch();
});

elements.pageButtons.addEventListener('click', e => {
    // дарагдсан товчийг шууд олох 
    // closest хамгийн ойр байгаа element-ийг олж өгнө. 
    // e.target dom element 
    const btn = e.target.closest('.btn-inline');

    if(btn) {
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
    console.log(id);

    // 2) Жорын моделийг үүсгэж өгнө.
    state.recipe = new Recipe(parseInt(id));

    // 3) UI дэлгэцийг бэлтгэнэ.

    // 4) Жороо татаж авчирна. 

    await state.recipe.getRecipe();

    // 5) Жорыг гүйцэтгэх хугацаа болон орцыг тооцоолно.
    state.recipe.calcTime();
    state.recipe.calcHuniiToo();

    // 6) Жороо дэлгэцэнд гаргана. 
    console.log(state.recipe);


}
 window.addEventListener('hashchange', controlRecipe);