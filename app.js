const Express = require("express")
const Mongoose = require("mongoose")
const Bcrypt = require("bcrypt")
const Cors = require("cors")
const jwt = require("jsonwebtoken")
const UserModel= require("./models/Users")
const postModel = require("./models/post")

let app= Express()
app.use(Express.json())
app.use(Cors())

Mongoose.connect("mongodb+srv://aseera:aseera@cluster0.x0tifel.mongodb.net/blog1appDb?retryWrites=true&w=majority&appName=Cluster0")

//viewmypost
app.post("/Viewmypost",(req,res)=>{
    let input=req.body
    let token=req.headers.token
    jwt.verify(token,"blog1app",(error,decoded)=>{
        if (decoded && decoded.email) {
            postModel.find(input).then(
                (items)=>{
                    res.json(items)
                }
            ).catch(
                (error)=>{
                    res.json({"status":"error"})
                }
            )
            
        } else {
            res.json({"status":"Invalid Authentication"})
        }
    })
})

//viewall
app.post("/Viewall",(req,res)=>{
    let token=req.headers.token
    jwt.verify(token,"blog1app",(error,decoded)=>{
        if (decoded && decoded.email) {
            postModel.find().then(
                (items)=>{
                    res.json(items)
                }
            ).catch(
                (error)=>{
                    req.json({"status":"error"})
                }
            )
            
        } else {
            res.json({"status":"Invalid Authentication"})
        }
    })
})


//create a post
app.post("/Create",async(req,res)=>{
    let input=req.body
    //secureing api passsing through token
    let token=req.headers.token
    //verify token
    jwt.verify(token,"blog1app",async(error,decoded)=>{
        if (decoded && decoded.email) {
            
            let result=new postModel(input)
            await result.save()
            res.json({"status":"success"})
        } else {
            res.json({"status":"Invalid Authentication"})
        }
    })


})

//signIn
app.post("/SignIn",async(req,res)=>{
    let input=req.body
    let result =UserModel.find({email:req.body.email}).then(
        (items)=>{
            if (items.length>0) {
                const passwordValidator=Bcrypt.compareSync(req.body.password,items[0].password)
                if (passwordValidator) {

                    jwt.sign({email:req.body.email},"blog1app",{expiresIn:"1d"},
                        (error,token)=>{
                            if (error) {
                                res.json({"status":"error","errorMessage":error})
                            } else {
                                res.json({"status":"success","token":token,"userId":items[0]._id})
                            }
                        }
                    )
                } else {
                    res.json({"status":"Invalid Password"})
                }
            } else {
                res.json({"status":"Invalid Email Id"})
                
            }
        }
    ).catch()
})

//signup
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