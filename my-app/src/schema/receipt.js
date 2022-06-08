var mongoose = require('mongoose');

// create a schema
var receiptSchema = new mongoose.Schema({
    location: String,
    receipt_name: String, 
    master_user: String,
    date: { type: Date, default: Date.now },
    items: [],
    users: [],
    selected_items: []
});

// the schema is useless so far
// we need to create a model using it
var Receipt = mongoose.model('Reciept', receiptSchema);

// make this available to our users in our Node applications
module.exports = Receipt;
