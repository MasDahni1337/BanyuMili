const Model = require("../Config/Model.js")
/**
 * Represents a model for the "users" table.
 * @extends Model
 */
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

   getMember(){
        let hasil = this.getResult();
        return hasil;
    }

   save(data) {
        return this.save(data);
    }

   update(id, data) {
        this.service.where('id', id);
        return this.update(data);
    }

   delete(id) {
        this.service.where('id', id);
        return this.delete();
    }

}

module.exports = UsersModel;