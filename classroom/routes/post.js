const express = require("express");
const router = express.Router();


//index route
router.get("/",(req,res) =>{
     res.send("Get for show users");
})

// show
router.get("/:id",(req,res)=>{
     res.send("Get route for show user");
})


//post
router.post("/",(req,res)=>{
     res.send('post for users');
})

//delete
router.delete("/:id",(req,res) => {
     res.send("Delete route for user");
})

module.exports = router;