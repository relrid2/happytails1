import e from "express";
import ejs from "ejs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import UserModel from "./Models/user.js";
import session from "express-session"
import MongoStore from "connect-mongo";
import nodemailer from "nodemailer"
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./uploadthing.js";
import petModal from "./Models/pets.js";
import adoptFormModal from "./Models/adoptform.js";
import vetFormModal from "./Models/vetform.js";

dotenv.config();

const adminEmail = "admin@gmail.com"
const adminPass = "admin@123"

const app = e();

const PORT = process.env.PORT || 5000;
app.set("view engine", "ejs");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 

app.use(bodyParser.urlencoded({extended:true}));
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASS,
    },
  });
  

  app.use(
    "/api/uploadthing",
    createRouteHandler({
      router: uploadRouter,
      config: { token: process.env.UPLOADTHING_TOKEN}
    }),
  );  
app.use(bodyParser.json());
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://ridhikotian22:md3kxOoJUWGTtD0G@cluster0.e6pnd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", collectionName: "sessions",
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: "lax",
        secure: false,
    }
}));
app.set("views", path.join(__dirname, "views"));
app.use(e.static(__dirname + "/public/"));
app.use(e.json());
app.use(e.urlencoded({extended:true}));

app.get("/", (req, res) => {
    console.log(req.session.email);

    const email = req.session.email || null;
    res.render("home", {email: req.session.email});
});

app.get("/adoptpet", (req, res)=>{
    res.render("adoptpet");
});

app.get("/signup", (req, res)=>{
    res.render("signup");
});

app.get("/signin", (req, res)=>{
    res.render("signin");
});

app.post("/getpets", async(req,res)=>{
    const pets = await petModal.find({});

    if(pets){
        res.status(200).json({pets});
    }

})

app.post("/signup", async (req, res)=>{
    const {name, email, password} = req.body;

    const user = new UserModel({
        name,
        email,
        password
    });

    await user.save();

    res.send("Works");
});

app.post("/addpet", async (req, res)=>{
    const {petname, petage, petweight, petgender, petlocation, petcolor}  = req.body;

    const newPet = new petModal({
        petName: petname,
        petAge:petage,
        petLocation:petlocation,
        petGender: petgender,
        petWeight: petweight,
        petColor:petcolor,
        petImage: "",
    })

    await newPet.save();
    // const user = new UserModel({
    //     name,
    //     email,
    //     password
    // });

    // await user.save();

    res.send("Works");
});

app.get("/adoptpetform", (req, res)=>{
    res.render("adoptpetform");
});

app.get("/receivedforms", (req, res)=>{
    res.render("receivedforms");
});

app.post("/receivedpetforms", async(req, res)=>{
    const forms = await adoptFormModal.find({});
    console.log(forms);

    if(forms){
        res.status(200).json({forms});
    }

});

app.post("/adoptpetform", async(req, res)=>{
    console.log("Adopt Pet Form");
    const data = req.body;
    const {fullName, phone, email, address, age, pets, homeEnvironment, petExperience, agreement} = req.body;


    const former = new adoptFormModal({
        petId: pets,
        userName: fullName,
        userPhone: phone,
        userEmail: email,
        userAddress: address,
        userAge: age,
        homedesc: homeEnvironment,
        petexpdesc: petExperience, 
    });

    await former.save();
});

app.post("/vetcareform", async(req, res)=>{
    const {vetName, phone, petName, visitDate, reason, agreement} = req.body;

    const vetForm = new vetFormModal({
        vetName,
        phone,
        petName,
        visitDate,
        reasondesc: reason
    });
    await vetForm.save();

    console.log(req.body);
});

app.post("/receivedvetforms", async(req, res)=>{
    const forms = await vetFormModal.find({});
    console.log(forms);

    if(forms){
        res.status(200).json({forms});
    }
}
);

app.post("/signin", async(req, res)=>{
    const {email, password}= req.body;

    const existingUser = await UserModel.findOne({email});
    const mailOptions = {
        from: "relrid2@gmail.com",
        to: email,
        subject: "LOGIN",
        text: `Successfully logged in to Happy Tails`,
      };

    if(existingUser){
        if(existingUser.password === password){
            console.log("Success");
            req.session.email = email;
            await req.session.save();
            transporter.sendMail(mailOptions, (error, info)=>{
                if(error){
                    console.log("Error", error);
                }
            });
            res.redirect("/");
        }
        else{
            console.log("Invalid Password");
        }
    }
    else{
        console.log("User not found");
    }

})

app.get("/addpets", (req, res)=>{
    res.render("addpets");
});

app.get("/vetcare", (req, res)=>{
    res.render("vetcare");
});

app.get("/logout", (req, res)=>{
    req.session.destroy((err)=>{
        if(err){
            throw err;
        }
        res.redirect("/");
    })
});

app.get("/vetcareform", (req, res)=>{
    res.render("vetcareform");
});

app.listen(PORT, ()=>{
    console.log(`PORT listening at ${PORT}`);
});








