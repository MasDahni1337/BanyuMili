# BanyuMili

## Table Of Contents
- [BanyuMili](#banyumili)
  - [Table Of Contents](#table-of-contents)
  - [1. Overview](#1-overview)
  - [2. Introduction](#2-introduction)
  - [3. Installation](#3-installation)
  - [4. Usage](#4-usage)
    - [4.1. Model](#41-model)
    - [4.2. Controller](#42-controller)
    - [4.3. Routes](#43-routes)
    - [4.4. Validation](#44-validation)
      - [4.4.1 Valiation Rules](#441-valiation-rules)
    - [4.5. Example Using Validation on Controller](#45-example-using-validation-on-controller)
    - [4.6. Query Builder](#46-query-builder)
##  1. <a name='Overview'></a>Overview
BanyuMili is a JavaScript library for creating web applications. It provides a simple and intuitive API that can help beginners and experienced developers alike to quickly create web applications with ease.


##  2. <a name='Introduction'></a>Introduction
This is a collection of Node.js modules that can be used to build a basic RESTful API. The code includes modules for creating models, controllers, and validation rules. These modules can be used as building blocks for your Node.js application.

##  3. <a name='Installation'></a>Installation
To install the code, clone the repository from GitHub:
```bash
git clone https://github.com/MasDahni1337/BanyuMili.git
```
Then, install the dependencies:
```bash
npm install
```
##  4. <a name='Usage'></a>Usage

Here's an example of how you can use the modules provided in this codebase to build a basic RESTful API:

###  4.1. <a name='Model'></a>Model
To create a model, extend the Model class and configure it using the following methods:
- setTable(table_name): set the name of the database table associated with the model
- setPrimaryKey(primary_key): set the primary key field for the table
- setAllowedFields(fields): set an array of allowed fields for the table
- setReturnType(type): set the return type for queries ('object' or 'array')
- setTimestamps(bool): enable/disable automatic timestamp fields ('created_at' and 'updated_at')
- setSoftDelete(bool): enable/disable automatic soft delete

example
```javascript
const Model = require("./Model.js");

class UsersModel extends Model{
    constructor() {
        super(); 
        this.setTable('users');
        this.setPrimaryKey('id');
        this.setAllowedFields([]);
        this.setReturnType('object');
        this.setTimestamps(true);
        this.setSoftDelete(false);
    }
}

module.exports = UsersModel;
```
###  4.2. <a name='Controller'></a>Controller
To create a controller, extend the `BaseController` class and define the methods that will handle HTTP requests. You can also use the valid method to define validation rules for each request.

The `BaseController` class provides a way to create a controller in Node.js that handles incoming requests and returns responses. It includes methods for validating input data, accessing a model class to retrieve data from a database, and more.

Example:
```javascript
class UserController extends BaseController{

    testUser = async (req, res) => {
        const users = await this.users.getResult();
        res.send(users);
    }
}
```

###  4.3. <a name='Routes'></a>Routes
`express.Router()` method is used to create an instance of a router object that is assigned to routes variable. The Router() method is a middleware function provided by the Express.js framework that allows you to define routes for HTTP methods like GET, POST, PUT, DELETE, etc.

On Routes you just define the routes in this block like code below

```javascript
defineRoutes() {
    const routes = express.Router();

    routes.get("/test", this.user.testUser.bind(this.user));
    routes.post("/testPost", this.user.createUser.bind(this.user));

    return routes;
  }
```

After defining the routes, the routes object is returned from the defineRoutes() method. The returned object can be used to mount these routes to the server using app.use() method in the main application file.

Overall, this code block provides a way to define routes for a specific part of your application and export them for use in other parts of your application. This promotes modularity and separation of concerns in your application.


###  4.4. <a name='Validation'></a>Validation
The `Validation` class can be used in a controller to validate incoming request data. Untuk membuatnya cukup buat rules seperti dibawah ini
```javascript
 const isValid = {
   email: {
     required: true,
     is_email: true
   },
   password: {
     required: true,
     minLength: 8
   }
 };
```
In the example above, the variable `isValid` instantiated with an object that contains two properties, `email` and `password`. Each property represents a key in the incoming request data that needs to be validated. The validation rules are specified as key-value pairs in the object.

In this case, the `email` property is set to require a value (`required: true`) and to be a valid email address (`is_email: true`). The password property is set to require a value (`required: true`) and to have a minimum length of 8 characters (`minLength: 8`).

#### 4.4.1 Valiation Rules

| Rule              | Description                                               | Example                                           |
| ----------------- | --------------------------------------------------------- | ------------------------------------------------- |
| `required`        | Value must be present and not empty.                      | `{ username: { required: true } }`            |
| `minLength`       | Value must be at least the specified length.              | `{ password: { minLength: 8 } }`              |
| `is_email`        | Value must be a valid email address.                      | `{ email: { is_email: true } }`               |
| `alpha_numeric`   | Value must contain only letters and numbers.              | `{ username: { alpha_numeric: true } }`       |
| `alpha_numeric_space` | Value must contain only letters, numbers, and spaces.  | `{ full_name: { alpha_numeric_space: true } }` |
| `valid_json`      | Value must be a valid JSON string.                        | `{ data: { valid_json: true } }`              |
| `valid_url`       | Value must be a valid URL.                                 | `{ website: { valid_url: true } }`            |
| `valid_ip`        | Value must be a valid IP address.                          | `{ ip_address: { valid_ip: true } }`          |
| `alpha_dash`      | Value must contain only letters, numbers, and dashes.      | `{ slug: { alpha_dash: true } }`              |
| `alpha_space`     | Value must contain only letters and spaces.                | `{ first_name: { alpha_space: true } }`       |
| `alpha_numeric_punct` | Value must contain only letters, numbers, and punctuation marks. | `{ message: { alpha_numeric_punct: true } }` |
| `regex_match`     | Value must match the specified regular expression.         | `{ code: { regex_match: "/^[A-Z]{3}-[0-9]{3}$/" } }` |
| `valid_date`      | Value must be a valid date.                                | `{ dob: { valid_date: true } }`               |
| `valid_cc_number` | Value must be a valid credit card number.                  | `{ cc_number: { valid_cc_number: true } }`     |
| `is_unique`       | Value must be unique in the specified table and column.    | `{ email: { is_unique: "users.email" } }`     |

###  4.5. <a name='ExampleUsingValidationonController'></a>Example Using Validation on Controller
```javascript
createUser = async (req, res) => {
      const {
        username,
        fullname,
        email,
        password
      } = req.body;
      const isValid = {
        username: {
          required: true,
          minLength: 6,
          alpha_numeric: true,
        },
        fullname: {
          required: true,
          minLength: 6,
          alpha_numeric_space: true,
        },
        email: {
          required: true,
          is_email: true,
          is_unique: 'users.email',
        },
        password: {
          required: true,
          minLength: 8,
        },

        const errors = await this.valid(isValid).check()(req, res);
        if (errors && errors.length > 0) {
          res.status(400).json({
            error: errors
          });
        } else {
          res.status(201).json({
            message: "User created successfully"
          });
        }
      }
```

###  4.6. <a name='QueryBuilder'></a>Query Builder
The Service class is a helper class for executing queries on a MySQL database. It provides methods for constructing SELECT, INSERT, UPDATE, and DELETE queries, as well as setting various query options.

Build your query by chaining methods such as `select()`, `where()`, `join()`, `orderBy()`, and `groupBy()`. For example:

```javascript
const result = await this.objmodel
  .select('id', 'name', 'email')
  .where('status', 'active')
  .join('orders', 'my_table.id = orders.user_id')
  .orderBy('name ASC')
  .groupBy('id')
  .getResult();
```
Execute your query using the getResult() method to get an array of records or the single() method to get a single record. For example:
```javascript
const records = await this.objmodel.getResult();
const record = await this.objmodel.where('id', 1).single();
```

To insert a new record into the database, use the save() method and pass in an object containing the data to insert. For example:

```javascript
const data = { name: 'Petrok', email: 'petrok@example.com', phone: '111-1111' };
const record = await this.objmodel.save(data);
```
Note that if you have set the timestamps property to true on your model, the created_at and updated_at automated filled.

In Model, just call with `this`, example:

```javascript
const Model = require("../Config/Model.js")
/**
 * Represents a model for the "users" table.
 * @extends Model
 */
class UsersModel extends Model{
    // ...
    getMember(){
        let hasil = this.getResult();
        return hasil;
    }

   simpan(data) {
        return this.save(data);
    }

   ubah(id, data) {
        return this.update(id, data);
    }

   hapus(id) {
        this.where('id', id);
        return this.delete();
    }
    
}

module.exports = UsersModel;
```