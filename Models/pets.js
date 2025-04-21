import mongoose from "mongoose";

const uri = "mongodb+srv://ridhikotian22:md3kxOoJUWGTtD0G@cluster0.e6pnd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

try{
    mongoose.connect(uri);
}
catch (error) {
    console.log("Error connecting to mongodb", error);
}

const petSchema = new mongoose.Schema({
    petName: {
        type: String,
        required: true,
    },
    petImage: {
        type: String,
        required: false,
    },
    petAge: {
        type: String,
        required: true
    },
    petWeight: {
        type: String,
        required: true,
    },
    petGender: {
        type: String,
        required: true,
    },
    petLocation: {
        type: String,
        required: true,
    }, petColor: {
        type: String,
        required: true,
    },
});

const petModal = mongoose.model("petModal", petSchema);

export default petModal;