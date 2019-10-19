const passport = require('passport');
const passportJWT = require('passport-jwt');
const { ExtractJwt, Strategy } = passportJWT;


require('dotenv').config();

const User = require('./models/User');

const params = {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

module.exports = () => {
    const strategy = new Strategy(params, async (payload, done) => {
        const user = await User.findById({_id : payload.id}).catch(error => {
            console.log(error);
        });
        
        if (user) {
            return done(null, {id: user.id});
        }else{
            return done(new Error("User not found", null));
        }
    });

    passport.use(strategy);

    return {
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate("jwt", { session: false })
    };
};