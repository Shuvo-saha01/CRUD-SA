// requiring the modules
const express = require ("express");
const mongoose = require("mongoose")
const bodyParser = require("body-parser")


const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());

//mongodb server uri
let uri = "mongodb://localhost:27017/person"

//connecting to the mongodb server
const connection = mongoose.connect(uri);
connection
.then( ()=>console.log("mongodb connected"))
.catch( (err)=>console.log(err));

//creating the schema of the data structure
const personSchema = new mongoose.Schema({
    name:String,
    age:Number,
    gender:String
})

//creating a new model AKA collection
const personCollection = new mongoose.model("person",personSchema);

// create new person data 
app.post("/api/create/personal", async(req,res)=> {
    let person = await personCollection.create(req.body);
    res.status(201).json({
        success: true,
        person
    })
})

// read all the data in the collection
app.get('/api/people', async(req,res) => {
    let people = await personCollection.find();
    res.status(200).json({
        success:true,
        people
    })
})

//update the data by id in the collection
app.put("/api/update/:id", async (req, res)=> {
    let person = await personCollection.findById(req.params.id)
    person = await personCollection.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json({
        success: true,
        person
    })
})

//delete the data by id in collection
app.delete("/api/delete/:id", async(req,res) => {
    let person = await personCollection.findById(req.params.id);
    if(!person){
        res.json({
            message : "the id is not found"
        })
    }
    // await person.remove();
    await personCollection.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success: true,
        message:"the id have been successfully removed"
    })
})

app.listen(3000, console.log("server is running"))