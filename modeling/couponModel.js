const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      require: true,
      unique: true,
    },
    isPercent: {
      type: Number,
      require: true,
    },
    expireDate: {
      type: String,
      require: true,
      default: "",
    },
    isActive: {
      type: String,
      default: true,
    },
  },
  { timestamps: true }
);

couponSchema.pre("save", function (next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  next();
});

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
