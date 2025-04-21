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
        console.log(pets);
        res.status(200).json({pets});
    }

})

app.post("/signup", async (req, res)=>{
    const {name, email, password} = req.body;

    console.log(name);
    console.log(email);
    console.log(password);

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

app.post("/adoptpetform", (req, res)=>{
    const userEmail = req.session.email;
    const {petId, userId,userName, userPhone, userAddress} = req.body;

    console.log(petId);
})

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
})

app.get("/logout", (req, res)=>{
    req.session.destroy((err)=>{
        if(err){
            throw err;
        }
        res.redirect("/");
    })
})

app.listen(PORT, ()=>{
    console.log(`PORT listening at ${PORT}`);
});








