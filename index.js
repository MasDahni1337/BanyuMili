const express = require("express");
const Routes = require("./app/Config/Routes.js");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// method baru
const app = express();
const routes = new Routes().defineRoutes();
process.env.TZ = "Asia/Jakarta";

// config

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static(path.join('public')))
app.use(cookieParser());
// default engine
// app.set('view engine', 'ejs');
app.set('views', path.join('./app/Views'));
app.use(routes);
// default 404
// app.use(function(req, res, next) {
//     res.status(404);
  
//     // respond with html page
//     if (req.accepts('html')) {
//       res.render('notfound.ejs', { url: req.url });
//       return;
//     }
//     // respond with json
//     if (req.accepts('json')) {
//       res.json({ error: 'Not found' });
//       return;
//     }
//     res.type('txt').send('Not found');
//   });
console.log(new Date().toString());
app.listen(3387, () => console.log('Server Up and Running...'));