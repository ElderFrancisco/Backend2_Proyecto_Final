import { UserService } from '../repository/index.js';

export const premiumById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.getByID(id);
    if (!user) {
      return res.status(400).json({ status: 'error', error: 'User not found' });
    }
    if (user.rol !== 'user') {
      return res
        .status(400)
        .json({ status: 'error', error: 'User Already Premium' });
    }

    if (user.documents.length < 3) {
      return res
        .status(400)
        .json({ status: 'error', error: 'User must have 3 documents' });
    }

    await UserService.premium(user);
    res.clearCookie('cookieJWT').status(200);
    return res.clearCookie('cookieJWT').status(200).redirect('/cambios');
  } catch (error) {
    req.logger.error(`Error en premiumById: ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};

export const file = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.getByID(id);
    if (!user) {
      return res.status(400).json({ status: 'error', error: 'User not found' });
    }

    req.files.forEach((element) => {
      const pathWithoutSrc = element.path.replace('src\\public', '');
      user.documents.push({ name: element.originalname, path: pathWithoutSrc });
    });

    await UserService.update(user);
    return res.status(200).redirect('/premium');
  } catch (error) {
    req.logger.error(`Error en file: ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};
