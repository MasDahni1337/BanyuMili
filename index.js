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
app.set('views', path.join('./app/Views'));
app.use(routes);
app.listen(3387, () => console.log('Server Up and Running...'));