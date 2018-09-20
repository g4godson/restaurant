var express = require("express");

var app = express();
const path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/RestaurantDB');
var ReviewSchema = new mongoose.Schema({
    name:{type : String, required:[true, "User Name cannot be empty"], minlength:[3, "User name Atleast 3 characters"]},
    stars: {type: Number, required: [true, "Please rate"]},
    message: {type: String, required:[true, "Message cannot be empty"]},
}, { timestamps: true})

var RestaurantSchema = new mongoose.Schema({
    name:{type : String, required:[true, "Retaurant Name cannot be empty"], minlength:[3, "Rest name Atleast 3 characters"]},
    cuisine: {type: String, required:[true, "Cuisine cannot be empty"]},
    description: {type: String, required: [true, "Description cannot be empty"]},
    reviews: [ReviewSchema],

}, { timestamps: true})

var Restaurant = mongoose.model('Restaurant', RestaurantSchema);

var Review = mongoose.model('Review', ReviewSchema);

mongoose.Promise = global.Promise;

app.use(bodyParser.json());
app.use(express.static( __dirname + '/public/dist/public'));

app.get('/api/restaurants', function(req, res){
    Restaurant.find({}, function(err, data){
        if(err){
            console.log("couldn't fetch restaurants");
            res.json({message:"Error", data:data });
        }
        else{
            res.json({message: "Success", data: data });
        }
    });
});

app.get('/api/restaurant/:id', function(req, res){
    Restaurant.findOne({_id: req.params.id}, function(err, data){
        if(err){
            console.log("couldn't fetch restaurant");
            res.json({message:"Error", data:data });
        }
        else{
            res.json({message: "Success", data: data });
        }
    });
});

app.post('/api/restaurants/new', function(req, res){
    Restaurant.findOne({name: req.body.name}, function(err, data){
        if(data){
            res.json({message: "Restaurant already exist", data: data });
        }
        else{
            Restaurant.create(req.body, function(err, data){
                if(err){
                    res.json({message: "Restaurant creation failed", data: data});
                }
                else{
                    res.json({message: "Success, Restaurant Added", data: data});
                }
            })
        }
    });
});


app.put('/api/restaurant/:id', function(req, res){

    Restaurant.update({_id: req.params.id}, req.body, {runValidators: true}, function(err, data){
        if(err){
            res.json({message: "Restaurant updation failed", data: data});
        }
        else{
            res.json({message: "Success, Restaurant updated ", data: data});
        }
    });
});

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
  });


app.listen(8000, ()=> console.log("Running on 8000"));