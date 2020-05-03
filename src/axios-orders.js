import axios from 'axios';

export default axios.create({
    baseURL: "https://burger-builder-9dc78.firebaseio.com/"
});