const Express = require("express")
const Mongoose = require("mongoose")
const Bcrypt = require("bcrypt")
const Cors = require("cors")
const jwt = require("jsonwebtoken")
const UserModel= require("./models/Users")

let app= Express()
app.use(Express.json())
app.use(Cors())

Mongoose.connect("mongodb+srv://aseera:aseera@cluster0.x0tifel.mongodb.net/blog1appDb?retryWrites=true&w=majority&appName=Cluster0")

app.post("/SignUp",async(req,res)=>{
    let input=req.body
    let hashedpassword =Bcrypt.hashSync(req.body.password,10)
    console.log(hashedpassword)
    req.body.password=hashedpassword
    
    UserModel.find({email:req.body.email}).then(
        (items)=>{
            if (items.length>0) {
                res.json({"status":"email Id already exist"})
            } else {
                let result=new UserModel(input)
                result.save()
               res.json({"status":"success"})
            }
        }
    ).catch(
        (error)=>{}
    )

     
})
app.listen(3030,()=>{
    console.log("Server started")
})