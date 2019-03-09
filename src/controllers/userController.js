import passport from "passport";
import routes from "../routes";
import User from "../models/User";

// Join

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 }
  } = req;

  if (password !== password2) {
    req.flash("error", "패스워드가 일치하지 않습니다");
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      const user = await User({
        name,
        email
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
    // To Do: Log User In
  }
};

// Login

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: "wellcome",
  failureFlash: "Can't login. Check email and password"
});

// Github

export const githubLogin = passport.authenticate("github", {
  successFlash: "Wellcome",
  failureFlash: "Can't login. check your github id"
});

export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      name,
      email,
      avatarUrl,
      githubId: id
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGithubLogin = (req, res) => {
  res.redirect(routes.home);
};

// Facebook Login

export const facebookLogin = passport.authenticate("facebook", {
  successFlash: "Wellcome",
  failureFlash: "Can't login. check your facebook id"
});

export const facebookLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.facebookId = id;
      user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      name,
      email,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`,
      facebookId: id
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postFacebookLogin = (req, res) => {
  res.redirect(routes.home);
};

// Logout

export const logout = (req, res) => {
  req.flash("info", "로그아웃되었습니다");
  req.logout();
  res.redirect(routes.home);
};

// User Detail(profile)

export const getMe = async (req, res) => {
  // req.user.id를 통해 video db에 일치하는 video를 가져옴
  // console.log(`req.user: ${req.user}`);
  // const user = await User.findById(req.user.id);
  const user = await User.findById(req.user.id)
    .populate("videos")
    .populate("comments");
  console.log(`user: ${user}`);
  res.render("userDetail", { pageTitle: "User Detail", user });
};

export const userDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  // console.log(`params: ${id}`);
  try {
    const user = await User.findById(id).populate("videos");
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    req.flash("error", "User Not Found");
    res.redirect(routes.home);
    console.log(error);
  }
};

export const getEditProfile = (req, res) => {
  res.render("editProfile", { pageTitle: "Edit Profile" });
};

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl
    });
    req.flash("success", "프로필이 수정되었습니다");
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "프로필을 수정할 수 없습니다");
    res.redirect(routes.editProfile);
  }
};

export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 }
  } = req;
  try {
    if (newPassword !== newPassword1) {
      req.flash("error", "비밀번호가 일치하지 않습니다");
      res.status(400);
      res.redirect(routes.changePassword);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "비밀번호를 변경할 수 없습니다");
    res.status(400);
    res.redirect(routes.changePassword);
  }
};
