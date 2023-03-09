import {Router} from 'express';
import passport from 'passport';
import { passportCall } from "../utils.js";

const router = Router();

router.get("/current", passportCall("jwt"), (req, res) => {
    res.send(req.user);
  });

/*
router.get("/github", passport.authenticate("github", {scope:['user:email']}), async(req,res)=>{});
    
router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async(req,res)=>{
    req.session.user = req.user;
    res.redirect("/");
}
);
*/
export default router;