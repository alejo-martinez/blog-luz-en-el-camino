import passport from "passport";

export const strategyPassport = (strategy)=>{
    return async(req, res, next) =>{
        passport.authenticate(strategy,function(err, user, info){
            if(err) next(err);
            if(!user){
               return res.status(401).send({error: info?info.message:info}) 
            } 
            else{
                req.user = user
                return next()
            }
        })(req, res, next)
    }
}