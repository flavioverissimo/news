const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    minLength: 6,
  },
  password: {
    type: String,
    trim: true,
    minLength: 8,
  },
  facebookId: String,
  googleId: String,
  name: String,
  roles: {
    type: [String],
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;

  next();
});

UserSchema.methods.checkPassword = async function (password) {
  try {
    const decoded = await bcrypt.compare(password, this.password);
    return decoded;
  } catch (e) {
    return false;
  }
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
