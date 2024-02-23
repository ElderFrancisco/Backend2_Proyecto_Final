import { ResetService, UserService } from '../repository/index.js';
import HashManager from '../util/hash.js';

const HashController = new HashManager();

export const login = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(400)
        .send({ status: 'error', error: 'credenciales invalidas' });
    }
    return res
      .status(201)
      .cookie('cookieJWT', req.user.token)
      .redirect('/products');
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error' });
  }
};
export const register = async (req, res) => {
  try {
    return res.status(201).redirect('/login');
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error' });
  }
};
export const githubcallback = async (req, res) => {
  try {
    return res.cookie('cookieJWT', req.user.token).redirect('/products');
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error' });
  }
};
export const logout = async (req, res) => {
  try {
    if (req.cookies['cookieJWT']) {
      // Elimina la cookie
      res.clearCookie('cookieJWT').status(200).redirect('/');
    } else {
      res.status(400).redirect('/login');
    }
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error' });
  }
};
export const current = async (req, res) => {
  try {
    return res.send({ status: 'Success', payload: req.user });
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error' });
  }
};
export const recoveryPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Email is required' });
    }
    UserService.recoverPassword(email);
  } catch (error) {
    req.logger.error(error);
    return res.status(500).json({ status: 'error' });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Email is required' });
    }
    const User = await UserService.getByEmail(email);
    if (!User) {
      return res.status(404).json({ status: 'error', error: 'User not found' });
    }
    const data = {
      UserId: User._id,
      Code: Math.random().toString(36).substring(2, 17),
      dateEnd: new Date(Date.now() + 1 * 60 * 60 * 1000),
    };
    await ResetService.create(data);
    return res.render('forgot-password', {
      message:
        'El enlace de restablecimiento de contraseña ha sido enviado a tu correo',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 'error' });
  }
};

export const restorePassword = async (req, res) => {
  try {
    const id = req.params.id;
    const code = req.params.code;
    const { password } = req.body;
    const { confirm_password } = req.body;

    if (password !== confirm_password) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Passwords do not match' });
    }

    if (!id || !code) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Id and code are required' });
    }

    if (!password) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Password is required' });
    }
    const Reset = await ResetService.getByIdAndCode(id, code);

    if (!Reset) {
      return res
        .status(404)
        .json({ status: 'error', error: 'Reset not found' });
    }

    console.log(Reset.dateEnd, Date.now());
    if (Reset.dateEnd < Date.now()) {
      return res.status(404).json({ status: 'error', error: 'Code expired' });
    }

    const User = await UserService.getByID(Reset.UserId);
    if (!User) {
      return res.status(404).json({ status: 'error', error: 'User not found' });
    }

    if (HashController.isValidPassword(User, password) == true) {
      return res.status(404).render('reset-password', {
        id,
        code,
        error: 'No puedes usar la misma contraseña',
      });
    }
    User['password'] = HashController.createHash(password);

    await UserService.update(User);

    await ResetService.deleteById(Reset._id);

    return res.status(201).clearCookie('cookieJWT').render('cambios');
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 'error' });
  }
};
export const RenderRestorePassword = async (req, res) => {
  try {
    const id = req.params.id;
    const code = req.params.code;
    const reset = await ResetService.getByIdAndCode(id, code);
    if (!reset) {
      return res.status(404).redirect('/404');
    }

    if (reset.dateEnd < Date.now()) {
      return res.status(404).redirect('/forgot-password?error=Code expired');
    }
    return res.render('reset-password', {
      id,
      code,
    });
  } catch (error) {
    req.logger.error(error);
  }
};

export const RenderforgotPassword = async (req, res) => {
  try {
    res.render('forgot-password', { error: req.query.error });
  } catch (error) {
    req.logger.error(error);
  }
};

export const RenderCurrent = async (req, res) => {
  try {
    const user = req.user.user;
    let infoRol = null;
    if (user.rol == 'user') {
      infoRol = 'premium';
    }
    return res.render('current', { user: user, infoRol });
  } catch (error) {
    req.logger.error(error);
  }
};

export const RenderHome = async (req, res) => {
  try {
    const user = req.user;
    return res.render('index', { user: user });
  } catch (error) {
    req.logger.error(error);
  }
};

export const RenderRegister = async (req, res) => {
  try {
    if (req.session?.user) {
      return res.redirect('/products');
    }
    return res.render('register', {});
  } catch (error) {
    req.logger.error(error);
  }
};
export const RenderLogin = async (req, res) => {
  try {
    if (req.cookies['cookieJWT']) {
      return res.redirect('/products');
    }
    return res.render('login', {});
  } catch (error) {
    req.logger.error(error);
  }
};
export const RenderAuthfailed = async (req, res) => {
  try {
    if (req.session?.user) {
      return res.redirect('/');
    }
    return res.render('authfailed', {});
  } catch (error) {
    req.logger.error(error);
  }
};
export const Render404 = async (req, res) => {
  try {
    return res.render('404', {});
  } catch (error) {
    req.logger.error(error);
  }
};
export const premium = async (req, res) => {
  try {
    return res.render('premium', { user: req.user.user });
  } catch (error) {
    req.logger.error(error);
  }
};

export const RenderCambios = async (req, res) => {
  try {
    return res.render('cambios', {});
  } catch (error) {
    req.logger.error(error);
  }
};
