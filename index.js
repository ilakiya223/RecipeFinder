const express = require('express');
const axios = require('axios')
const ejs = require('ejs')

const app = express();
const api_key = "78e89240f741419f9a3093e2299188e9"
console.log("hello")

// Setting up EJS as our view engine
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.static('public'))
// Parsing incoming request bodies
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('index');
})


// Endpoint to filter recipes based on ingredients
app.post('/search', async (req, res) => {
    console.log(req.body);
    const { query, diet, cuisine } = req.body

    console.log("query", query)

    console.log("diet", diet)
    console.log("cuisine", cuisine)
    var queryParams = `query=${query}&apiKey=${api_key}`;
    if (diet) {
        queryParams += `&diet=${diet}`;
    }
    if (cuisine) {
        queryParams += `&cuisine=${cuisine}`;
    }
    const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?${queryParams}`)
    const recipes = response.data.results
    res.render('results', { recipes })
    // Implement logic to filter recipes based on ingredients
})

//want to get a route
app.get("/recipe/:id", async (req, res) => {
    const { id } = req.params;
    const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${api_key}`)
    const recipe = response.data
    res.render('recipe', { recipe })
})

const Port = 3000;
app.listen(Port, () => {
    console.log('Server is running')
})

