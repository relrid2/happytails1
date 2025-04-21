import mongoose from "mongoose";

const uri = "mongodb+srv://ridhikotian22:md3kxOoJUWGTtD0G@cluster0.e6pnd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

try{
    mongoose.connect(uri);
}
catch (error) {
    console.log("Error connecting to mongodb", error);
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
});

const UserModel = mongoose.model("UserModel", userSchema);

export default UserModel;