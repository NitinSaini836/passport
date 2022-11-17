const express = require('express');
const expressSession = require('express-session')
const db = require('./db')
const bcrypt = require('bcrypt')
const passport = require('passport')
let ejs = require('ejs');
const LocalStrategy = require('passport-local').Strategy
const PORT = 9000;
const userModel = require('./user');
const {initializingPassport} = require('./passportconfig.js')

let app = express()
app.set("view engine", "ejs");
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded({extended:true}));
// passport.use(new LocalStrategy(
 
//     function(username, password, done) {
//       userModel.findOne({ username: username }, function (err, user) {
//         if (err) { return done(err); }
//         if (!user) { return done(null, false); }
//         if (user.password !== password) { return done(null, false); }
//         return done(null, user);
//       });
//     }
//   ));
app.use(express.json());
db.connexion();
initializingPassport(passport);


app.get("/", (req, res) => {
//  userModel.find({}, (err, result)=>{
//     if(err) throw err;
//     res.render('view.ejs', {result : result})
    // res.status(200).send(result)
//  });
res.send("done")
})
app.get('/register',(req,res)=>{
res.render('register.ejs')
})

app.get('/login',(req,res)=>{
    res.render('login.ejs')
    })
    app.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
      res.send('/');
    });

app.post('/register',async(req,res)=>{
    try {
        const user = await userModel.findOne({email: req.body.email})
        if(user) return res.status(400).send("user already exist")
        const salt = await bcrypt.genSalt()
        const hashedtext = await bcrypt.hash(req.body.password,salt);
        console.log(salt)
        console.log(hashedtext)
     const newUser=await userModel.insertMany( { username: req.body.username, email:req.body.email, password: hashedtext  } );
     res.status(201).send(newUser)
    }catch(err){
        res.status(500).send(err);
    }
    
   

})

app.listen(PORT,(req,res)=>{
    console.log(`app listening on port:${PORT}`);
})