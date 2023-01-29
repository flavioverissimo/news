const User = require("../models/users");

const createUsers = async () => {
  try {
    const totalUsers = await User.count();

    if (totalUsers) return;

    await User.create({
      username: process.env.USER_ADMIN,
      password: process.env.USER_ADMIN_PASSWORD,
      roles: ["admin"],
    });

    await User.create({
      username: process.env.USER_SIMPLE,
      password: process.env.USER_ADMIN_SIMPLE,
      roles: ["user"],
    });

    console.log("It was created with success");
  } catch (e) {
    console.log("It wasn't possible to create the users");
  }
};

module.exports = createUsers;
