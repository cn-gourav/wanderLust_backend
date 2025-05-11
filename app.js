const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(() =>
     console.log('Connected to database')
).catch(err => console.log(err));

async function main() {
     await mongoose.connect(MONGO_URL);
}

app.get('/', (req, res) => {
     res.send('Hello World!');
});



app.get("/testlisting", async (req, res) => {
     let sampleListing = new Listing({
          title: "test",
          description: "test",
          price: 0,
          location: "test",
          country: "test"
     })

     await sampleListing.save().then(() => {
          console.log("Listing saved");
          res.send("Listing saved");
     }).catch(err => {
          console.log(err);
     })
})

app.listen(8080, () => {
     console.log('Server is running on port 8080');
})

