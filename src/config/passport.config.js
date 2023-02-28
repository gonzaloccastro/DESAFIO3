import passport from "passport";
import local from "passport-local";
import userService from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "github",
    new GitHubStrategy({
      clientID: process.env.GUTHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:  `http://localhost:${process.env.PORT}/api/sessions/githubcallback`,
    }, async (accessToken, refreshToken, profile, done)=>{
      try {
        console.log(profile);
        let user = await userService.findOne({email:profile.emails[0].value});
        if (!user) {
          const newUser = {
            first_name: profile.displayName,
            last_name: profile.displayName,
            email: profile.emails[0].value,
            age: 12,
            passwprd: "",
          };
          let result = await userService.create(newUser);
        }
      } catch (error) {
        return done("Error al obtener el usuario", false);
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
      async (req, email, password, done) => {
        const { first_name, last_name, age } = req.body;

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