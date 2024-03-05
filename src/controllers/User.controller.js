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
      const pathWithoutSrc = element.path.replace(
        /^.*src[\/\\]public[\/\\]/,
        '\\',
      );
      user.documents.push({ name: element.originalname, path: pathWithoutSrc });
    });

    await UserService.update(user);
    return res.status(200).redirect('/premium');
  } catch (error) {
    req.logger.error(`Error en file: ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await UserService.getAll();
    return res.status(200).json({ status: 'success', payload: users });
  } catch (error) {
    req.logger.error(`Error en getUsers: ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};

export const deleteInactiveUsers = async (req, res) => {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const result = await UserService.deleteInactive(twoDaysAgo);
    return res.status(200).json({ status: 'success', payload: result });
  } catch (error) {
    req.logger.error(`Error en deleteInactiveUsers: ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};

export const renderAdminUsers = async (req, res) => {
  try {
    const allUsers = await UserService.getAll();
    const users = allUsers.filter((user) => user.rol !== 'admin');
    return res.status(200).render('adminUsersView', { users, user: req.user });
  } catch (error) {
    req.logger.error(`Error en renderAdminView: ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};

export const deleteById = async (req, res) => {
  try {
    const user = await UserService.getByID(req.params.id);
    if (!user) {
      return res.status(404).json({ status: 'error', error: 'User not found' });
    }
    const result = await UserService.deleteById(req.params.id);
    return res.status(200).json({ status: 'success', payload: result });
  } catch (error) {
    req.logger.error(`Error en deleteInactiveUsers: ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};

export const makeUserById = async (req, res) => {
  try {
    const user = await UserService.getByID(req.params.id);
    if (!user) {
      return res.status(404).json({ status: 'error', error: 'User not found' });
    }
    if (user.rol === 'user') {
      return res
        .status(400)
        .json({ status: 'error', error: 'User already rol user' });
    }
    user.rol = 'user';
    const result = await UserService.update(user);
    return res.status(200).json({ status: 'success', payload: result });
  } catch (error) {
    req.logger.error(`Error en deleteInactiveUsers: ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};

export const renderAdmin = async (req, res) => {
  try {
    return res.status(200).render('adminView', { user: req.user });
  } catch (error) {
    req.logger.error(`Error en renderAdminView: ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};
