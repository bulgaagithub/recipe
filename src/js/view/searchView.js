require('@babel/polyfill');

import Search from "../model/Search";

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
    const query = "pizza";
    
     if(query) {
        // 2) Шинээр хайлтын объектийг үүсгэж өгнө.
        state.search = new Search(query);
        // 3) Хайлт хийхэд зориулж дэлгэцийг UI бэлтгэнэ. 
        // 4) Хайлтыг гүйцэтгэнэ.
        await state.search.doSearch();
        // 5) Хайлтын үр дүнг дэлгэцэнд үзүүлнэ.
        
        console.log('Result: ' + state.search.result);
    }
 }

document.querySelector('.search').addEventListener('submit', e => {
    // default behaviour clear
    e.preventDefault(); // default үйл ажиллагааг зогсоох
    controlSearch();
});