const LocalStrategy = require('passport-local').Strategy
const userModel = require('./user')
exports.initializingPassport =(passport)=>{
passport.use(new LocalStrategy(async(username,password,done)=>{
 try{
    const user = await userModel.findOne({username});

if(!user)return done (null,false)

bcrypt.compare(password, user.password, function(err, res) {
    if (err){
      console.log(err);
    }
 else {
      // response is OutgoingMessage object that server response http request
      return done(null,res)
    }
  });
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