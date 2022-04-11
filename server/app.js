import express from 'express'
import compression from 'compression'
import ejs from 'ejs'

const app = express();

const hostname = '127.0.0.1';
const port = process.env.PORT || 5500;

app.use(compression());
app.use(/.*-[0-9a-f]{10}\..*/, (req, res, next) => {
    res.setHeader('Cache-Control', 'max-age=365000000, immutable');
    next();
});

app.set('view engine', 'ejs');

app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
    console.log("App is running on port " + port);
  });
