const User = require("../../modeling/userModel");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

// ------RESPONSE-------
const response = (content, statusCode, res) => {
  res.status(statusCode).json({
    status: "success",
    content,
  });
};

// -------LIST ALL USERS--------
exports.listUser = catchAsync(async (req, res, next) => {
  const user = await User.find();
  response(user, 200, res);
});

// ---------DELTE USER --------------
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete({ _id: req.params.id });
  if (!user) {
    return next(new AppError("this user doesnot exist!!!", 404));
  }
  // response(user, 200, res)
  res.redirect("/admin/user");
});

//-----BLOCK USER--------------
exports.blockUser = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = await User.findByIdAndUpdate(
    { _id: req.params.id },
    { block: true }
  );
  // res.json({
  //     status: 'success',
  //     user
  // })
  res.redirect("/admin/user");
});

exports.unBlockUser = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = await User.findByIdAndUpdate(
    { _id: req.params.id },
    { block: false }
  );
  // res.json({
  //     status: 'success',
  //     user
  // })
  res.redirect("/admin/user");
});

// ---------CREATE USER--------------
exports.createUser = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    mob: req.body.mob,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    address: {
      Pincode: req.body.Pincode,
      city: req.body.city,
      Locality: req.body.Locality,
      BuildingName: req.body.BuildingName,
      Landmark: req.body.Landmark,
      AddressType: req.body.AddressType,
    },
  });
  response(user, 200, res);
});
