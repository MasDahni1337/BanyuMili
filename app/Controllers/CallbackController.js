const BaseController = require("./BaseController.js");
class CallbackController extends BaseController{

    testCallback = async (req, res) => {
        var response = {
            data: req.body,
        }
        console.log(response);
        res.status(200).json(response)
    }
    
}

module.exports = CallbackController;