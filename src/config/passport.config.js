import passport from "passport";
import local from "passport-local";
import userService from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";
import jwt from 'passport-jwt';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
  
    // --- Extractor
    const cookieExtractor = req => {
      let token = null;
      if( req && req.cookies ){
          token = req.cookies['secretToken']
      };
      return token;
    }

  passport.use('current', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: 'pageSecret'
  }, async(jwt_payload, done) => {
    try{
        return done(null, jwt_payload);
    } catch(err){
        return done(err);
    }
  })
  )

  passport.use(
    "github",
    new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:  `http://localhost:8080/api/sessions/githubcallback`,
    }, async (accessToken, refreshToken, profile, done)=>{
      try {
        onsole.log(profile);
          const user = await userService.findOne({
            email: profile._json.email,
          });
          if (!user) {
            const newUser = {
              firstName: profile._json.name,
              lastName: "",
              age: 0,
              email: profile._json.email,
              password: "",
            };
            const response = await userService.create(newUser);
            return done(null, response);
          } else {
            return done(null, user);
          }
        } catch (err) {
          return done("Error al obtener el usuario" + err);
      }
    })
  );

  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          let user = await userService.findOne({ email: username });
          if (user) {
            console.log("El usuario ya existe");
            return done(null, false);
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          let result = await userService.create(newUser);
          return done(null, result);
        } catch (err) {
          return done("Error al obtener el usuario", false);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userService.findOne({ email: username });
          if (!user)
            return done(null, false, { message: "Usuario no encontrado" });
          if (!isValidPassword(user, password))
            return done(null, false, { message: "Contraseña incorrecta" });
          return done(null, user);
        } catch (err) {
          return done("error al obtener usuario" + err);
        }
      }
    )
  );
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    let user = await userService.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
export default initializePassport;