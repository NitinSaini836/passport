const LocalStrategy = require('passport-local').Strategy;
const bcrypt =require('bcrypt')
const userModel = require('./user')
exports.initializingPassport =(passport)=>{
passport.use(new LocalStrategy(async(username,password,done)=>{
 try{
    const user = await userModel.findOne({username});
console.log(user)
if(!user)return done (null,false)

const newPass =await bcrypt.compare( password , user.password) 
console.log(newPass);
    if(newPass !== true)return done(null, false)

return done(null,user)
 }
catch(err){
    return done(err,false)
}
})

)



passport.serializeUser((user,done)=>{
    done(null,user.id);
})


passport.deserializeUser(async(id,done)=>{
    try{
        const user = await userModel.findById(id);
        done(null,user);
    }
    catch(err){
        done(err,false)
    }
})


}

exports.isAuthenticated =(req,res,next)=>{
    if(req.user) return next;

    res.redirect("/login")
}