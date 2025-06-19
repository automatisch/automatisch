const { expect } = require('../fixtures/index');
const { pgPool } = require('../fixtures/postgres-config');

export const insertAppConnection = async (appName) => {
  const queryUser = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [process.env.LOGIN_EMAIL],
  };

  try {
    const queryUserResult = await pgPool.query(queryUser);
    expect(queryUserResult.rowCount).toEqual(1);

    const createConnection = {
      text: 'INSERT INTO connections (key, data, user_id, verified, draft) VALUES ($1, $2, $3, $4, $5)',
      values: [
        appName,
        'U2FsdGVkX1+cAtdHwLiuRL4DaK/T1aljeeKyPMmtWK0AmAIsKhYwQiuyQCYJO3mdZ31z73hqF2Y+yj2Kn2/IIpLRqCxB2sC0rCDCZyolzOZ290YcBXSzYRzRUxhoOcZEtwYDKsy8AHygKK/tkj9uv9k6wOe1LjipNik4VmRhKjEYizzjLrJpbeU1oY+qW0GBpPYomFTeNf+MejSSmsUYyYJ8+E/4GeEfaonvsTSwMT7AId98Lck6Vy4wrfgpm7sZZ8xU15/HqXZNc8UCo2iTdw45xj/Oov9+brX4WUASFPG8aYrK8dl/EdaOvr89P8uIofbSNZ25GjJvVF5ymarrPkTZ7djjJXchzpwBY+7GTJfs3funR/vIk0Hq95jgOFFP1liZyqTXSa49ojG3hzojRQ==',
        queryUserResult.rows[0].id,
        'true',
        'false',
      ],
    };

    const createConnectionResult = await pgPool.query(createConnection);
    expect(createConnectionResult.rowCount).toBe(1);
    expect(createConnectionResult.command).toBe('INSERT');
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};
