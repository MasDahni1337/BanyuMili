const BaseController = require("./BaseController.js");
class HomeController extends BaseController{

    index = async (req, res) => {
        return res.send("welcome to banyumili");
    }

    test = async (req, res) => {
        return res.send("test group banyumili");
    }
}

module.exports = HomeController;