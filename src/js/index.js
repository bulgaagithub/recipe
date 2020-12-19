// ./ current folder
require('@babel/polyfill');
import axios from "axios";

async function doSearch(search) {
    // Lesson 114.
    try {
        let result = await axios('https://forkify-api.herokuapp.com/api/search?q=' + search);
        // console.log(result.data.recipes);
    
        const recipes = result.data.recipes;
        console.log(recipes);
    
        result = await axios('https://forkify-api.herkuapp.com/api/get?rId=' + recipes[1].recipe_id);
    
        console.log(result);
    } catch(error) {
        alert('Алдаа гарлаа: ' + error);
    }
    
}

doSearch('pizza');