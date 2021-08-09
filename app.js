
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const machine = require('./info/machine');
const { info } = require('console');


mongoose.connect('mongodb://localhost:27017/AEI', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind("console,connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('Views', path.join(__dirname, 'Views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('Home')
});

app.get('/pages', async (req, res) => {
    const pages = await Page.find({});
    res.render('pages/index', { pages })
});
app.get('/pages/new', (req, res) => {
    res.render('pages/new');
})

app.post('/pages', async (req, res) => {
    const page = new Page(req.body.page);
    await page.save();
    res.redirect(`/pages/${page._id}`)
})

app.get('/pages/:id', async (req, res,) => {
    const page = await Page.findById(req.params.id)
    res.render('pages/signin', { page });
});

app.get('/pages/:id/edit', async (req, res) => {
    const page = await Page.findById(req.params.id)
    res.render('pages/edit', { page });
})

app.put('/pages/:id', async (req, res) => {
    const { id } = req.params;
    const page = await Page.findByIdAndUpdate(id, { ...req.body.page });
    res.redirect(`/pages/${page._id}`)
});

app.delete('/pages/:id', async (req, res) => {
    const { id } = req.params;
    await Page.findByIdAndDelete(id);
    res.redirect('/pages');
})


app.listen(3000, () => {
    console.log('Serving on port 3000')
})

