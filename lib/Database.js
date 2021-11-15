import Realm from "realm";

// Declare Schema
class BookSchema extends Realm.Object {}
BookSchema.schema = {
    name: 'Book',
    properties: {
        title: 'string',
        pages:  'int',
        edition: 'int?'
    }
};

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
let realm = new Realm({schema: [BookSchema], schemaVersion: 1});

  let getAllBooks = () => {
    return realm.objects('Book');
}
// Add our two new functions
let addBook = (_title, _pages, _edition = null) => {
    realm.write(() => {
        const book = realm.create('Book', {
            title: _title,
            pages:  _pages,
            edition: _edition
        });
    });
}

let deleteAllBooks = () => {
    realm.write(() => {
        realm.delete(getAllBooks());
    })
}



// Update exports
export {
    getAllBooks,
    addBook,
    deleteAllBooks
}

// Export the realm
export default realm;