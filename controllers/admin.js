exports.admin = async (req, res) => {
  res.render("admin/admin");
};

// News functions
exports.getNews = async ({ News }, req, res) => {
  const news = await News.find();
  res.render("admin/news", { news });
};

exports.createNewsGet = async (req, res) => {
  res.render("admin/createNews");
};

exports.createNewsPost = async ({ News }, req, res) => {
  try {
    const data = req.body;
    await News.create(data);
    res.redirect("/admin/news");
  } catch (e) {
    res.redirect("/admin/news/create");
  }
};

exports.editNewsGet = async ({ News }, req, res) => {
  const options = ["public", "restrict"];
  const id = req.params.id;
  const news = await News.findById(id);

  res.render("admin/editNews", { news, options });
};

exports.editNewsPost = async ({ News }, req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;
    await News.findByIdAndUpdate(id, data);

    res.redirect("/admin/news");
  } catch (e) {
    res.redirect("/admin/news");
  }
};

exports.removeNews = async ({ News }, req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.redirect("/admin/news");
  } catch (e) {
    res.redirect("/");
  }
};

// Users functions
exports.getUsers = async ({ Users }, req, res) => {
  const allUsers = await Users.find({});
  const users = allUsers.map((user) => {
    user.password = undefined;
    return user;
  });
  res.render("admin/users", { users });
};

exports.createUserGet = async (req, res) => {
  res.render("admin/createUser");
};

exports.createUserPost = async ({ Users }, req, res) => {
  try {
    const user = req.body;
    await Users.create(user);
    res.redirect("/admin/users");
  } catch (e) {
    res.redirect("/admin/users/create");
  }
};

exports.editUserGet = async ({ Users }, req, res) => {
  const options = ["user", "admin"];
  const id = req.params.id;
  const users = await Users.findById(id);
  users.password = undefined;

  res.render("admin/editUser", { users, options });
};

exports.editUserPost = async ({ Users }, req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const user = await Users.findByIdAndUpdate(id, data);
    const isEqual = req.session.user.username === user.username;

    if (!isEqual) return res.redirect("/admin/users");
    if (req.user.roles.indexOf(data.roles) >= 0) {
      return res.redirect("/admin/users");
    }
    req.session.user.roles = data.roles;
    res.redirect("/");
  } catch (e) {
    res.redirect("/admin/users");
  }
};

exports.removeUser = async ({ Users }, req, res) => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);
    const isEqual = req.user.username == user.username;

    if (!isEqual) return res.redirect("/admin/users");

    req.session.destroy();
    res.redirect("/");
  } catch (e) {
    res.redirect("/admin/users");
  }
};
