const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config()


const port = process.env.PORT || 9000;

const app = express();
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const DB_HOST = process.env.DB_HOST
console.log(DB_HOST)
const url = DB_HOST
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log("Successfully connected to DB"))
    .catch(e => console.log(e))

const userSchema = mongoose.Schema({
    email: String,
    password: String,
})




const User = mongoose.model("user", userSchema);


app.get("/", (req, res) => {
    res.send("Server is up and running");
})

app.post("/login", (req, res) => {
    const username = req.body.email;
    const password = req.body.password;
    // console.log(username, password);
    User.findOne({ email: username }, (err, foundUser) => {
        console.log(username,password)
        if (!err && foundUser) {
            console.log("check-1")
            if (foundUser.password === password) {
                console.log("check-2")

                res.send({ status: true,msg: "Login Success", email: username })

            } else {
                console.log("check-3")

                console.log("fail")
                res.send({ status: false, msg: "invaild password" })
            }
            
        } 
        else if(!foundUser){
            console.log("entered")
            const user = new User({email:username,password:password})
            user.save(user,(err)=>{
                if(!err){
                res.send({status:true,code:1,msg:"new user created please login again."})
            }
        })
            
        }        
        else {
            console.log(err)
        }
    })
})

app.get("/",(req,res) => {
    console.log("server is up")
})


app.get("/fetchCandidates", (req, res) => {
    console.log("fetch")
    Candidate.find({}, (err, data) => {
        console.log(data)
        if (!err) {

            res.send(data);
        } else {
            console.log(err);
        }
    })
})




app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})