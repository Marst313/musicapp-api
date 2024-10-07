import { QueryError, QueryResult } from 'mysql2';
import { connection } from '../config/db';
import { IUserModel } from '../models/user';
import { v4 as uuidv4 } from 'uuid';

function checkIfEmailExists(email: string): Promise<boolean> {
  const sqlQuery = `SELECT COUNT(*) AS userCount FROM users WHERE email = ?;`;

  return new Promise(function (resolve, reject) {
    connection.query(sqlQuery, email, function (err: QueryError | null, resultSet: any) {
      if (err) return reject(err);

      return resolve(resultSet[0].userCount > 0);
    });
  });
}

function createNewUser(user: IUserModel) {
  const sqlQuery = `INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?);`;

  const userId = uuidv4();
  const values = [userId, user.email, user.password, user.role];

  return new Promise(function (resolve, reject) {
    connection.query(sqlQuery, values, function (err: QueryError | null, resultSet: any) {
      if (err) return reject(err);

      console.log(resultSet);

      const newUser = {
        id: userId,
        email: user.email,
        role: user.role,
      };

      return resolve(newUser);
    });
  });
}

export { checkIfEmailExists, createNewUser };
