const express = require('express');
const app = express();
const cors = require('cors');
const User = require('./Models/User');
const Place = require('./Models/Places');
const Booking = require('./Models/Booking.js');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcryptSalt = bcrypt.genSaltSync(12);
const jwtSecret = 'HARDIK';
const cookieParser = require('cookie-parser');
const multer = require('multer');
const imageDownloader = require('image-downloader');
const fs = require('fs');
const mime = require('mime-types');
const { getMaxListeners } = require('events');
const nodemailer = require("nodemailer");
// Lflf8UC1IGj57b5x
const corsOptions = {
  origin: 'https://frontend-airbnb-teal.vercel.app', // Replace with your Vercel deployment URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));
app.use('/uploads',express.static(__dirname + '/uploads'));
mongoose.connect('mongodb+srv://hardiksinfg5:Lflf8UC1IGj57b5x@cluster0.pggbtns.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hardiksinfg5@gmail.com',
    pass: 'tava jnhk kxbv skzo',   
  },
});
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    const mailOptions = {
      from: 'hardiksinfg5@gmail.com',
      to: email,
      subject: 'Welcome to Our Service',
      text: `Hello ${name},\n\nThank you for registering at our service!\n\nBest regards,\nYour Company`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});
app.post('/update-password', async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  try {
    jwt.verify(token, jwtSecret, async (err, userData) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(403).json({ error: 'Unauthorized: Token expired' });
        } else {
          return res.status(403).json({ error: 'Unauthorized: Invalid token' });
        }
      }
      const { id } = userData;
      const { currentPassword, newPassword, confirmPassword } = req.body;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'New password and confirmation do not match' });
      }
      const hashedPassword = bcrypt.hashSync(newPassword, bcryptSalt);
      user.password = hashedPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});
app.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    const userDoc = await User.findOne({email});
    if(userDoc){
         const passOk = bcrypt.compareSync(password,userDoc.password);
        if(passOk){
          jwt.sign({email:userDoc.email,id:userDoc._id},jwtSecret,{},(err,token)=>{
              if(err){
                throw err;
              }
              res.cookie('token',token).json(userDoc);
          });
        }
        else{
          res.status(422).json("pass_not_ok")
        }
    }
    else{
       res.json("Not Found");
    }
});
app.get('/profile',async(req,res)=>{
   const{token} = req.cookies;
    if(token){
      jwt.verify(token,jwtSecret,{},async (err,user)=>{
        if(err){
          throw err;
        }
        const {name,email,_id} = await User.findById(user.id);
         res.json({name,email,_id});
      });
    }
    else{
      res.json(null);
    }
});
app.post('/logout', (req, res) => {
  res.cookie("token", "", { expires: new Date(0) }).json(true);
});
app.post('/upload-by-link', async (req, res) => {
   const {link} = req.body;
   const newName = 'photo' + Date.now() +'.jpg';
   await imageDownloader.image({
     url:link,
     dest: __dirname + '/uploads/' +newName,
   });
   res.json(newName);
});

const photosMiddleware = multer({dest:'uploads/'})
app.post('/upload',photosMiddleware.array('photos',100),(req, res) => {
     const uploadFiles = [];
    for(let i = 0;i<req.files.length;i++){
      const {path,originalname} = req.files[i]
      const parts = originalname.split('.');
      const ext = parts[parts.length-1];
      const newPath = path +'.' +  ext;
       fs.renameSync(path, newPath);
       uploadFiles.push(newPath.replace('uploads\\',''));
    }
    res.json(uploadFiles);
})
app.post('/places', (req, res) => {
  const{token} = req.cookies;
  const {
    title,address,addedPhotos,description,price,
    perks,extraInfo,checkIn,checkOut,maxGuests,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner:userData.id,price,
      title,address,photos:addedPhotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests,
    });
    res.json(placeDoc);
    });

});
app.get('/user-places', (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id} = userData;
    res.json( await Place.find({owner:id}) );
  });
});

app.get('/places/:id', async (req,res) => {
  const {id} = req.params;
  res.json(await Place.findById(id));
});

app.put('/places', async (req,res) => {
  const {token} = req.cookies;
  const {
    id, title,address,addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});
app.get('/places', async (req,res) => {
  res.json( await Place.find() );
});

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.post('/bookings', async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ msg: 'Unauthorized: User not logged in' });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.id;
    if (!userId) {
      return res.status(401).json({ msg: 'Unauthorized: User not logged in' });
    }
    const {
      place, checkIn, checkOut, numberOfGuests, name, phone, price,
    } = req.body;
    const booking = await Booking.create({
      place, checkIn, checkOut, numberOfGuests, name, phone, price,
      user: userId,
    });
    res.json(booking);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ msg: 'Unauthorized: Token expired' });
    } else {
      console.error('Error creating booking:', error);
      return res.status(500).json({ msg: 'An unexpected error occurred' }); // Send an error response
    }
  }
});


app.get('/bookings', async (req,res) => {
  const userData = await getUserDataFromReq(req);
  res.json( await Booking.find({user:userData.id}).populate('place') );
});

app.listen(4000, () => {
  console.log('Running at 4000');
});

