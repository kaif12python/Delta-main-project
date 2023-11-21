const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type:String,
        required: true,
    },
    description:String,
    image:{
        url: String,
        filename: String,
    },
    price:Number,
    location:String,
    country:String,
    reviews: [
        {
          type: Schema.Types.ObjectId,
          ref:"Review",
        },
    ],
    owner: {
       type: Schema.Types.ObjectId,
       ref: "User",
    },
    // category: {
    //    type:String,
    //    enum: ["Mountains","Arctic","Farms","Camping","Iconic Cities","Castles","Rooms","Amazing Pools"]
    // }
    // geometry: {
    //     type: {
    //         type: String,
    //         enum: ["Point"],
    //         required: true
    //     },
    //     coordinates: {
    //         type: [Number],
    //         required: true
    //     }
    // }
});


// Mongoose middleware to delete comment from Data base 
// when the listings delete from database
listingSchema.post("findOneAndDelete", async(listing)=>{
   if(listing){
    await Review.deleteMany({_id : {$in:  listing.reviews}});
   } 
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;