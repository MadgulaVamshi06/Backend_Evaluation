const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const app = express();

 app.use(express.json());

const logDirectory = "src";
const logFileName = "access.log";

const accessLogPath=path.join(logDirectory,logFileName);

const accessLogStream = fs.createWriteStream(path.join(accessLogPath),
{
    flags : "a",
})

morgan.token('date', function(){
    return new Date().toString();
});

const logFormat =':method :url :status : response-time ms - :date';

app.use(morgan(logFormat,{stream:accessLogStream}));

 // Routes

 //get
 app.get("/trades",(req,res)=>{
    const data = JSON.parse(
        fs.readFileSync(path.join(__dirname,"db.json"),"utf-8")
    );
    res.status(200).send(data)
 });
 
 
 //get by id
 app.get("/trades/:id",(req,res)=>{
    const tradeId = req.params.id;
    console.log(tradeId)
    try {
        const data = JSON.parse(
            fs.readFileSync(path.join(__dirname,"db.json"),"utf-8")
        );
        const trade = data.trades.find(trade =>trade.id === tradeId);

        if(trade){
            res.status(200).send(trade)
        }else{
            res.send(404),send({message : "ID not found"})
        }
    } catch (error) {
       console.log(error)
       res.status(500),send({message : "Internal issue"})
    }
    
 });

 //post

 app.post("/trades",(req,res) =>{
 const newTrade = req.body;

 const db = JSON.parse(
    fs.readFileSync(path.join(__dirname,"db.json"),"utf-8")
 )
  if(db.trades.some((trades)=>trades.id === req.body.id)){
     return res.status(400).json({message : "id must be unique"})
  }
  db.trades.push(newTrade)
 fs.writeFileSync(path.join(__dirname,"db.json"),JSON.stringify(db,null,2),"utf-8");
  res.status(201).json({message : "trade added successfully"})
 })

 // server 
 const port = 8000
 app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
 })