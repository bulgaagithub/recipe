// ./ current folder

require('@babel/polyfill');

import Search from "./model/Search";

import {elements} from './view/base';

import * as searchView from './view/searchView';
/**
 * Web app state 
 * - Хайлтын query, үр дүн
 * - Тухайн үзүүлж байгаа жор
 * - Лайкалсан жорууд 
 * - Захиалж байгаа жорын найрлагууд
 */

 const state = {};

 const controlSearch = async () => {
     // 1) Вэбээс хайлтын түлхүүр үгийг гаргаж авна. 
    const query = searchView.getInput();
     if(query) {
        // 2) Шинээр хайлтын объектийг үүсгэж өгнө.
        state.search = new Search(query);
        // 3) Хайлт хийхэд зориулж дэлгэцийг UI бэлтгэнэ. 
        searchView.clearSearchQuery();
        searchView.clearSearchResult();
        // 4) Хайлтыг гүйцэтгэнэ.
        await state.search.doSearch();
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