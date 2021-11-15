import Realm from "realm";

// Declare Schema
class CustomerSchema extends Realm.Object {}
CustomerSchema.schema = {
    primaryKey:'id',
    name: 'Customer',
    properties: {
        id:'int',
        name: 'string',
        creationDate:  'date',
        
    }
};

// Create realm
let realm = new Realm({schema: [CustomerSchema], schemaVersion: 1});

  let getAllCustomers = () => {
    return realm.objects('Customer');
}
// Add our two new functions
let addCustomer = (_id, _name, _date = null) => {
    realm.write(() => {
        const book = realm.create('Customer', {
            id: _id,
            name:  _name,
            creationDate: _date
        });
    });
}

let deleteAllCustomers = () => {
    realm.write(() => {
        realm.delete(getAllCustomers());
    })
}



// Update exports
export {
    getAllCustomers,
    addCustomer,
    deleteAllCustomers
}

// Export the realm
export default realm;