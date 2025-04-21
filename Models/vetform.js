import mongoose from "mongoose";

const uri = "mongodb+srv://ridhikotian22:md3kxOoJUWGTtD0G@cluster0.e6pnd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

try{
    mongoose.connect(uri);
}
catch (error) {
    console.log("Error connecting to mongodb", error);
}

const vetFormModalSchema = new mongoose.Schema({
    vetName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    petName: {
        type: String,
        required: true,
    },
    visitDate: {
        type: Date,
        required: true,
    },
    reasondesc: {
        type: String,
        required: true,
    },
});

const vetFormModal = mongoose.model("vetFormModal", vetFormModalSchema);

export default vetFormModal;