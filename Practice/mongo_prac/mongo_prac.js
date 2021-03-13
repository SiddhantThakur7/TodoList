o
//jshint esversion:6

const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/fruitsDB", {useNewUrlParser:  true});

const fruitSchema = new mongoose.Schema ({
  name: {
    type: String,
    required: [true, "Please Enter a Name"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 10
  },
  review: String
});


const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  favFruit: fruitSchema
});

const Person = mongoose.model("Person", personSchema);



const Fruit = mongoose.model("Fruit", fruitSchema);

const nfruit = new Fruit({
  name: "Anjeer",
  rating: 9,
  review: "Good"
});

// Fruit.insertMany([
//   new Fruit({
//     name: "Papaya",
//     rating: 3,
//     review: "Pregy"
//   }),
//   new Fruit({
//     name: "berry",
//     rating: 10,
//     review: "Sour"
//   }),
//   new Fruit({
//     name: "Avocado",
//     rating: 9,
//     review: "buttery"
//   })
// ], function(err){
//   if (err){
//     console.log(err);
//   }
// });

//fruit.save();

let nfruit2 = Fruit.find({name:"Apple"},{},function(err, fruits){
  if(err){
    console.log(err);
  }else{
    // fruits.forEach(function(fruit){
    //   console.log(fruit.name);
    // });
    mongoose.connection.close();
  }
});

Person.updateOne({name: "John"}, {favFruit: nfruit2},function(err){
  if(err){
    console.log(err);
  }else{
    console.log("Success");
  }
});
//
// Fruit.deleteOne({_id: "604a686a50ede824700fe985"}, function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log("Successfully Removed");
//   }
// });

// Fruit.deleteMany({name: "Bana"}, function(err){
//   if (err) {
//     console.log(err);
//   }else {
//     console.log("All Bana's Deleted");
//   }
// });


const person = new Person({
  name: "John",
  age: 37,
  favFruit: nfruit
});

//nfruit.save();
//person.save();
