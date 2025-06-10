import mongoose from "mongoose";
const schema = mongoose.Schema;

const Loginschema = new schema({
    username:String,
    email:String,
    password:String
})


const Adminschema = new schema({
    username:String,
    email:String,
    password:String
})


const FoodSchema = new mongoose.Schema({
  name: String,
  price: Number,
  rating: Number,
  imgurl: String,
});

const RestaurantSchema = new mongoose.Schema({
  name: String,
  imgurl: String,
  rating: Number,
  menu: [FoodSchema],
});

const RestaurantModel: any = mongoose.models.Restaurant || mongoose.model('Restaurant', RestaurantSchema);

const LoginModel = mongoose.models.login || mongoose.model("login", Loginschema);

const AdminModel = mongoose.models.admin || mongoose.model("admin", Adminschema);

export {LoginModel,RestaurantModel,AdminModel};