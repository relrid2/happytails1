import mongoose from "mongoose";

const uri = "mongodb+srv://ridhikotian22:md3kxOoJUWGTtD0G@cluster0.e6pnd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

try{
    mongoose.connect(uri);
}
catch (error) {
    console.log("Error connecting to mongodb", error);
}

const adoptFormModalSchema = new mongoose.Schema({
    petId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true
    },
    userPhone: {
        type: String,
        required: true,
    },
    userAddress: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    }, userAge: {
        type: String,
        required: true,
    },
    homedesc:  {
        type: String,
        required: true,
    },
    petexpdesc: {
        type: String,
        required: true,
    },
});

const adoptFormModal = mongoose.model("adoptForm", adoptFormModalSchema);

export default adoptFormModal;