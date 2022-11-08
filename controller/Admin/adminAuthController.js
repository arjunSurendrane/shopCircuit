const Admin = require("../../modeling/adminModel");
const catchAsync = require("../../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../../utils/appError");
const { ConnectAppContext } = require("twilio/lib/rest/api/v2010/account/connectApp");
const async = require("hbs/lib/async");

// ------------CREATE TOKEN-------------
const generateToken = (userid) => {
  return jwt.sign({ id: userid }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

//----------CREATE AND SEND TOKEN------------------
const createSendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("adminJwt", token, cookieOption);
  res.status(statusCode).json({
    status: "success",
    token,
  });
};

// ----------------ADMIN LOGIN-------------
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) ---------check email and password exist or not----------
  if (!email || !password) {
    return next(new AppError("must type email and password!!", 404));
  }
  // 2) --------compare email and password------------------
  const admin = await Admin.findOne({ email });
  console.log(admin);
  if (!admin || !(await admin.comparePassword(password, admin.password))) {
    return next(new AppError("invalid email or password!!!", 401));
  }
  // 3) ----------successfully login------------------
  createSendToken(admin, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('adminJwt', undefined, {
    expires: new Date(
      Date.now() + 100
    ),
    httpOnly: true,
  })
  res.redirect('/admin')
})


exports.isAdmin = async function (req, res, next) {
  // 1) ---------getting token and check of it there-----------
  if (req.cookies.adminJwt) {
    try {
      // 2) -------------Verification token-------------
      const decoded = await jwt.verify(req.cookies.adminJwt, process.env.JWT_SECRET);
      if (!decoded) {
        return res.redirect("/admin");
      }
      // 3) --------------Check if user still exist-----------
      const newUser = await Admin.findById(decoded.id);
      if (!newUser) {
        return res.redirect("/admin");
      }
      // 4)----------- Check if user change password after the token was issued---------
      // const changePassword = newUser.changePassword(decoded.iat)
      // console.log("change passwored = " + changePassword)

      return next();
    } catch (err) {
      return res.redirect("/admin");
    }
  }
  res.redirect("/admin");
};




