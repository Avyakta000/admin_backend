// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

// local controllers
const signUp = async (req, res) => {

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
      res.status(403).json({ message: 'User already exists' });
  }
  

  try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({ email, password: hashedPassword });
      const user = await newUser.save();
      const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      
      res.status(201).json({ message: 'User registered successfully', authToken });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }

}

const login =  async (req, res) => {

  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' });
      res.json({ message: "login successful", authToken });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

const adminProfile = async(req, res) => {
   try{
        const role = "admin"
        const admin = await User.findOne({role: role})
        console.log(admin,'admin')
        res.json(admin)
   }catch(err){
          res.json({message: err})
   }
}


module.exports = {
  signUp,
  login,
  adminProfile,
}



// // google controllers
// exports.login = (req, res) => {
//     res.redirect('/auth/google');
//   };
  
// exports.logout = (req, res) => {
//     req.logout((err) => {
//       if (err) {
//         console.error(err);
//         return;
//       }
//       res.redirect('/');
//     });
//   };
  

  
// exports.isAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//       return next();
//     }
//     res.redirect('/login');
//   };
  