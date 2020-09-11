import { User } from "../models/user.model";
import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt as ExtractJWT } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { SESSION_SECRET } from "../config/secrets";

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new JWTStrategy({
    //secret we used to sign our JWT
    secretOrKey: SESSION_SECRET,
    //we expect the user to send the token as a query parameter with the name 'secret_token'
    jwtFromRequest : ExtractJWT.fromUrlQueryParameter('secret_token')
}, async (token, done) => {
    try {
        //Pass the user details to the next middleware
        return done(null, token.user);
    } catch (error) {
        done(error);
    }
}));

passport.use('local', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password'
}, async (username: string, password: string, done) => {
    try {
        //Find the user associated with the email provided by the user
        const user = await User.findOne({ username });
        if( !user ){
            //If the user isn't found in the database, return a message
            return done(null, null, { message : 'User not found'});
        }
        //Validate password and make sure it matches with the corresponding hash stored in the database
        //If the passwords match, it returns a value of true.
        const validate = await user.isValidPassword(password);
        if( !validate ){
            return done(null, null, { message : 'Wrong Password'});
        }
        //Send the user information to the next middleware
        return done(null, user, { message : 'Logged in Successfully'});
    } catch (error) {
        return done(error);
    }
}));