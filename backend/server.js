const express= require("express")

const app=express()

app.get('/', (req, res)=>{
    console.log("all good");
    res.end("done")
    
})

app.listen(8000, ()=>{
    console.log("I am running master D!");
})
asjdk