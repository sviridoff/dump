import joi from 'joi';

export function validateEnvs(): Record<string, unknown> {
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

  const result = schema.validate(process.env, {
    allowUnknown: true,
    stripUnknown: true,
  });

  if (result.error) {
    throw result.error;
  }

  return result.value;
}
