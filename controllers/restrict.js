exports.getRestricNews = async ({ News }, req, res) => {
  const restricNews = await News.find({ rule: "restrict" });
  res.render("news/restrictNews", { restricNews });
};
