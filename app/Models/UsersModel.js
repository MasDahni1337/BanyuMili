const Model = require("../Config/Model.js")
/**
 * Represents a model for the "users" table.
 * @extends Model
 */
class UsersModel extends Model{
    constructor() {
        super(); 
        this.setTable('product');
        this.setPrimaryKey('id');
        this.setAllowedFields([
            'name',
            'slug',
            'price',
            'foto'
        ]);
        this.setTimestamps(true);
        this.setSoftDelete(false);
    }

}

module.exports = UsersModel;