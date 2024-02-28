export const notFound = (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    return res.status(404).render('404', { user: user });
  } catch (error) {
    req.logger.error(error);
  }
};
