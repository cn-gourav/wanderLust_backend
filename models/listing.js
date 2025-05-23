const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    //     type: String,
    //     default:
    //       "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png",
    //     set: (v) =>
    //       v === ""
    //    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"
    //         : v,
    //   },
    filename: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

ListingSchema.post("findOneAndDelete", async (listing) => {
  if(listing){
    await Review.deleteMany({
      _id : {$in: listing.reviews}
    })
  }
})

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
