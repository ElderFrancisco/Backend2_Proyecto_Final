import passport from 'passport';
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

    await UserService.premium(user);
    res.clearCookie('cookieJWT').status(200);
    // hacer render de vista premium,  ver beneficios y volver a iniciar session
    return res.clearCookie('cookieJWT').status(200).redirect('/cambios');
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 'error' });
  }
};
