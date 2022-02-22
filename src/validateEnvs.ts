import joi from 'joi';

const schema = joi.object({
  POSTGRE_SQL_HOST: joi
    .string()
    .required()
    .example('experiments-api')
    .description('Host.'),
  POSTGRE_SQL_PORT: joi
    .number()
    .required()
    .example(5432)
    .description('Port.'),
  POSTGRE_SQL_USER: joi
    .string()
    .required()
    .example('postgres')
    .description('User.'),
  POSTGRE_SQL_PASSWORD: joi
    .string()
    .required()
    .example('postgres')
    .description('Password.'),
  POSTGRE_SQL_DATABASE_NAME: joi
    .string()
    .required()
    .example('postgres')
    .description('Database name.'),
});

export function validateEnvs(): Record<string, unknown> {
  const result = schema.validate(process.env, {
    allowUnknown: true,
    stripUnknown: true,
  });

  if (result.getError()) {
    throw result.getError();
  }

  return result.getValue();
}
