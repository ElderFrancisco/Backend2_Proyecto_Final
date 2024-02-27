export const purchaseView = async (req, res) => {
  try {
    const user = req.user;
    return res.render('purchase', { user: user });
  } catch (error) {
    req.logger.error(`Error en purchaseView ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};
