const express = require("express");
const router = express.Router();


//index route
router.get("/",(req,res) =>{
     res.send("Get for show users");
})

// show -user 
router.get("/:id",(req,res)=>{
     res.send("Get route for show user");
})


//post -user
router.post("/",(req,res)=>{
     res.send('post for users');
})

//delete -user
router.delete("/:id",(req,res) => {
     res.send("Delete route for user");
})

module.exports = router;