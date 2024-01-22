const express = require("express");
const firebaseClient = require("../config/firebase_client");
const auth = firebaseClient.auth();
const router = express.Router();

router.authCheck = (req, res, next) => {
  if (req.session.uid === process.env.ADMIN_UID) {
    return next();
  }
  return res.redirect("auth/signin");
};

router.apiAuthCheck = (req, res, next) => {
  if (req.session.uid === process.env.ADMIN_UID) {
    return next();
  }
  res.json({ message: "Permission Denial!" });
};

router.get("/signin", (req, res) => {
  res.render("admin/login", {});
});

router.get("/signup", (req, res) => {
  res.render("admin/register", {});
});

router.post("/api/signin", (req, res) => {
  const email = req.body.email;
  const password = req.body.psw;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      req.session.uid = user.uid;
      req.session.mail = req.body.email;
      // console.log(req.session.uid);
      res.json({ message: "Login success!" });
    })
    .catch((error) => {
      console.log(error);
      res.json({ message: "Login failed!" });
    });
});

router.post("/signin", (req, res) => {
  const email = req.body.email;
  const password = req.body.psw;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      req.session.uid = user.uid;
      req.session.mail = req.body.email;
      // console.log(req.session.uid);
      res.redirect("/admin");
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/auth/signin");
    });
});

router.post("/signup", (req, res) => {
  const email = req.body.email;
  const password = req.body.psw;
  const confirmPassword = req.body.pswRepeat;
  const isOk = password == confirmPassword;

  console.log(password, confirmPassword);
  if (!isOk) {
    console.log("兩個密碼輸入不符合");
    res.redirect("/auth/signup");
  }

  if (isOk) {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log(req.session.uid);
        res.redirect("/auth/signin");
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/auth/signup");
      });
  }
});

module.exports = router;
