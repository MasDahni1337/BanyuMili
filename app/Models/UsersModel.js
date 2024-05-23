const Model = require("../Config/Model.js")
/**
 * Represents a model for the "users" table.
 * @extends Model
 */
class UsersModel extends Model{
    constructor(configName = 'default'){
        super(configName);
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