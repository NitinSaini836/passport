const LocalStrategy = require('passport-local').Strategy;
const bcrypt =require('bcrypt')
const userModel = require('./user')
exports.initializingPassport =(passport)=>{
passport.use(new LocalStrategy(async(username,password,done)=>{
 try{
    const user = await userModel.findOne({username});
console.log(user)
if(!user)return done (null,false)

const newPass = bcrypt.compare(password, user.password) 
    if(!newPass)return done(null, false)

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