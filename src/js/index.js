// ./ current folder

import Search from "./model/Search";

let search = new Search('pasta');

search.doSearch().then(r => console.log(r));

