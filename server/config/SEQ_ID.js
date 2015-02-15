(function () {

// *** put this SEQ_ID.js file in "config" folder

// *** within initial start-up (app.js) file of project --> set up SEQ_ID.js :

//   -->  var SEQ_ID = require("./config/SEQ_ID");
//    initialize io_counters collection
//   -->  SEQ_ID.load_SEQ_ID(mongoose.connection, 'core');

// *** within each "XXX.model.js" add these lines right after your schema :

//   --> var SEQ_ID = require("../../config/SEQ_ID");
//   --> UserSchema.plugin(SEQ_ID.plugin, {counterID: 'core', prefix: 'U0'});

// *** you don't have to add "SEQ" manually as part of the Schema, as this routine adds it with a "pre" function

   var counter_name, db, mongoose;
   mongoose = require('mongoose');
   counter_name = null;
   db = null;

   exports.load_SEQ_ID = function (database, id_string) {
      counter_name = 'io_counters';
      db = database;
      var schema = new mongoose.Schema({
         _id: String,
         SEQ: String,
         SEQ_num: Number,
         name: String,
         created: {type: Date, default: Date.now},
         updated: {type: Date}
      });
      var SEQ_ID_create = mongoose.model(counter_name, schema);
      SEQ_ID_create.create({
            _id: id_string,
            SEQ_num: 1075000100
         },
         function (error, success) {
            if (error) console.log("SEQ ID : '" + id_string + "' : exists");
            if (!error) console.log("SEQ ID OK : " + success);
         });
      return db.model(counter_name, schema);
   };

   exports.plugin = function (schema, options) {
      var Counter, model_name, prefix;
      if (!options.counterID) {
         throw new Error('Missing required parameter: counterID');
      }
      // get "io_counters" _id (text)
      model_name = options.counterID.toLowerCase();
      // get "prefix" to put in front of base_32 number:  "C0" + "A1B2C3D4"
      prefix = options.prefix
      Counter = db.model(counter_name);
      schema.add({
         SEQ: {
            type: String,
            unique: true
         }
      });
      return schema.pre('save', function (next) {
         var self,
            _this = this;
         self = this;
         if (!self.SEQ) {
            return Counter.collection.findAndModify({
                  _id: model_name
               },
               [], {
                  $inc: {SEQ_num: 1},
                  $currentDate: {updated: true}
               }, {
                  "new": true,
                  upsert: true
               }, function (err, doc) {
                  var count;
                  count = doc.SEQ_num;
                  if (err) {
                     return next(err);
                  }
                  self.SEQ = prefix + count.toString(32).toUpperCase();
                  return next();
               });
         } else {
            return next();
         }
      });
   };
}).call(this);
