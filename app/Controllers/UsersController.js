const BaseController = require("./BaseController.js");
class UserController extends BaseController{

    createUser = async (req, res) => {
        const {username, fullname, email} = req.body;
        const isValid = {
            username: { required: true, alpha_numeric: true },
            fullname: { required: true, alpha_numeric_space: true },
            email: {required: true, is_email: true}
          };
          const errors = await this.valid(isValid).check()(req, res);
          if (errors && errors.length > 0) {
            res.status(400).json({ error: errors });
          } else {
            res.status(201).json({ message: "User created successfully" });
          }
    }
}

module.exports = UserController;