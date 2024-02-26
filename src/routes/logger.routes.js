import { Router } from 'express';

const router = Router();
router.get('/', (req, res) => {
  req.logger.silly('silly test');
  req.logger.debug('debug test');
  req.logger.verbose('verbose test');
  req.logger.http('http test');
  req.logger.info('info test');
  const error = ' adkwoakdowa';
  req.logger.warn('warn test');
  req.logger.error(error);
  return res.json({ status: 'ok' });
});
export default router;
