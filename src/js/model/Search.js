require('@babel/polyfill');
import axios from "axios";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async doSearch() {
    // Lesson 115.
    try {
      let result = await axios(
        "https://forkify-api.herokuapp.com/api/search?q=" + this.query
      );

      this.result = result.data;
      return this.result; // Remember this function will return promise 
    } catch (error) {
      alert("Алдаа гарлаа: " + error);
    }
  }
}
