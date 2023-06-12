const express = require('express')
const bodyParser = require("body-parser")
const _ = require("lodash")
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://laryjude:Miracle%402002@cluster0.vqkvle4.mongodb.net/").then(()=>console.log("Successful")).catch((error)=>console.log(error))

const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

var dDay = new Date().getDay()

console.log(dDay)


//schema for itemsDb
const itemSchema = new mongoose.Schema({
    activity:String
})

//schema for alternative item

const NewSchema = new mongoose.Schema({
    name:String,
    stuffs:[itemSchema]
})
//model for ItemsDb

const Item = mongoose.model("Activity", itemSchema)


//model for alternativeitems

const Newitem = mongoose.model('Newitem', NewSchema )


//default items

const docs = [
    {
        activity:"Welcome, Please input your activity in the input"
    },

   {
        activity:"Click the checkbox to delete activities done or unwanted activity"
    },
   {
        activity:"<<= Click the checkbox to delete items"
    }

]


//root  get server
app.get("/",function(req,res){

    var options = {
        year:"numeric",
        day:"numeric",
        month:"long"
    }

    var period = "Weekend"
    var date = new Date().toLocaleString("en-US",options)

    const newlists = Item.find({}).then(data=>{

       if(data.length === 0){
        Item.insertMany(docs)
        res.redirect("/")
       } else{
        res.render("stuff",{ newlists:data, date:date, TITLE:period})
       }
     })

   // res.render("stuff",{ newlists:data, date:date, TITLE:period})
})



app.post("/", function(req,res){
    const newList = req.body.list
    const path = req.body.btn
 
    const item = new Item({
        activity: newList
    })

    if(path === "Weekend"){
        item.save() 
        res.redirect("/")
    }else{

        Newitem.findOne({name:path}).then(data=>{
            data.stuffs.push(item)
            data.save()
            res.redirect("/"+path)
        })

        
    }
})



app.get("/:route",(req,res)=>{

    const route = _.capitalize(req.params.route);

     switch (dDay) {
        case 1:
            dDay="Its Monday work day"
        break;
        case 2:
            dDay= "Its Tuesday workday"
        break;
        case 3:
            dDay="Its Wednesday workday"
        break;
        case 4:
            dDay= "Its Thurday workday"
        break;
        case 5:
            dDay= "Its Friday hurray,it is the last day of working day"
        break;
        case 6:
            dDay= "Its saturday hurray,it is the last day of working day"
        }

Newitem.findOne({name:route}).then((data)=>{

    if (!data){
       const newitem = new Newitem({
            name:route,
            stuffs:docs
            })
            newitem.save()
            res.redirect("/"+route)
        // 
    }else{
        res.render("stuff",{newlists:data.stuffs, date:dDay,TITLE:route})
    }      
    })
})

// root post server



app.post("/delete", (req,res)=>{
    var del = req.body.del //for id
    const way = String(req.body.route) //for the title
    
    if(way ==="Weekend"){
        Item.findByIdAndRemove({_id:del}).then(()=>{
        })
       
        res.redirect("/")
    }
    else{
        Newitem.findOneAndUpdate({name:way},{$pull:{stuffs:{_id:del}}}).then((data)=>{
           
            res.redirect("/"+way)

        })
    }
   
})



app.listen(3000,function(){
    console.log("port 3000 is running now")
})