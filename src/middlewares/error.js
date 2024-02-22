import EErrors from '../services/errors/enums.js';

export default (error, req, res, next) => {
  console.error(error);

  switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR:
      return res.status(400).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
      });
      break;
    case EErrors.DATABASE_ERROR:
      return res.status(404).send({
        status: 'error',
        error: error.name,
        cause: error.cause,
      });

    default:
      return res
        .status(500)
        .send({ status: 'error', error: 'Unhandled error' });
  }
};
