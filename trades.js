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

// read database 
 const readFile = () =>{
    try {
        const data = fs.readFileSync("db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log("Error in Reading database",error);
    }
 }

 // write database
 const writeFile = () =>{
    try {
        fs.writeFileSync("db.json"),JSON.stringify(data,null,2);
    } catch (error) {
        console.log("Error in writing database",error)
    }
 }

 // Routes

 //get
 app.get("/trades",(req,res)=>{
    const db = readFile();
    res.json(db.trades);
    res.status(200).send("reterived data successfully")
 })

 //post

 app.post("/trades",(req,res) =>{
 const db = readFile();
      
  if(db.trades.some((trades)=>trades.id === req.body.id)){
     return res.status(400).json({message : "id must be unique"})
  }

  db.trades.push(req.body)
  writeFile(db);
  res.status(201).json({message : "trade added successfully"})
 })

 // server 
 const port = 8000
 app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
 })