const express = require('express');
const axios = require('axios')
const ejs = require('ejs')
const LogInCollection = require('./mongodb')
const port = process.env.PORT || 3000

const app = express();
const api_key = "78e89240f741419f9a3093e2299188e9"
console.log("hello")

// Setting up EJS as my view engine
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))


app.get('/signup', (req, res) => {

    res.render('signup')
    console.log("on signup page")
})
app.get('/', (req, res) => {
    res.render('login')
})


app.post('/signup', async (req, res) => {

    const data = {
        name: req.body.name,
        password: req.body.password
    }

    const checking = await LogInCollection.findOne({ name: req.body.name })
    console.log("checking" + checking)
    console.log("data" + data.name + ", " + data.password)
    try {
        if (checking != null && checking.name === req.body.name && checking.password === req.body.password) {
            res.send("user details already exists")
        }
        else {
            await LogInCollection.insertMany([data])
            res.status(201).render('index');
        }
    }
    catch (err) {
        console.error("Error occurred during signup:", err);
        res.send("Wrong Input")
    }

    console.log("made it!")
    res.render('index')
})

app.post('/login', async (req, res) => {

    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
            res.render('index')
        }

        else {
            res.send("incorrect password")
        }


    }

    catch (e) {

        res.send("wrong details")


    }


})


app.get('/index', (req, res) => {
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
})

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



