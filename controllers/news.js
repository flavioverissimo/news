exports.getPublicNews = async ({ News }, req, res) => {
  const publicNews = await News.find({ rule: "public" });
  res.render("news/news", { publicNews });
};
