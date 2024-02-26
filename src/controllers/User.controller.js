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

export const file = async (req, res) => {
  try {
    console.log(req.body.type);
    console.log('entro a la route');
    if (!req.file) {
      return res.status(400).json({ status: 'error', error: 'File not found' });
    }
    const nombreArchivo = req.file.originalname;
    const direccionArchivo = req.file.path;
    const { id } = req.params;
    const user = await UserService.getByID(id);
    if (!user) {
      return res.status(400).json({ status: 'error', error: 'User not found' });
    }
    user.documents.push({ name: nombreArchivo, path: direccionArchivo });
    const userUpdated = await UserService.update(user);
    console.log('salio de la route');
    return res.status(200).json({
      status: 'success',
      message: 'File uploaded successfully',
      payload: userUpdated,
    });
  } catch (error) {
    req.logger.error(`Error en file: ${error}`);
    return res.status(500).json({ status: 'error' });
  }
};
