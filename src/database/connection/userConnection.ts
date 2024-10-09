import { connection } from '../db';
import { IUserModel } from '../../models/userModel';
import { v4 as uuidv4 } from 'uuid';
import { JWT } from '../../utils/jwt';
import { RowDataPacket } from 'mysql2';

export const userConnection = {
  /**
   * Checks if the provided email exists in the database.
   *
   * @param {string} email - The email address to check for existence in the database.
   * @returns {Promise<boolean>} - Returns a promise that resolves to true if the email exists, false otherwise.
   */
  async checkIfEmailExists(email: string): Promise<boolean> {
    const sqlQuery = `SELECT * FROM users WHERE email = ?;`;

    const [resultSet]: [RowDataPacket[], any] = await connection.promise().query(sqlQuery, [email]);

    return resultSet.length > 0;
  },

  /**
   * Creates a new user in the music application.
   *
   * @param {IUserModel} user - The user details to be created, including email, password, and role.
   * @returns {Promise<{ id: string, email: string, role: number, token: string }>} - Returns a promise that resolves to the created user's details,
   * which includes their id, email, role, and a JWT token for authentication.
   */
  async createNewUser(user: IUserModel) {
    const sqlQuery = `INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, ?);`;

    const userId = uuidv4();
    const userRole = user.role ?? 1; // Default role is 1 if not specified.
    const values = [userId, user.email, user.password, userRole];

    await connection.promise().query(sqlQuery, values);
    const token = JWT.sign(
      { id: userId, role: userRole },
      {
        audience: 'https://musicapp.com', // The intended audience for the token.
        issuer: 'Authorization/Resource/MusicApp', // The entity that issues the token.
        subject: user.email, // The subject of the token, typically the user's email.
      }
    );

    return { id: userId, email: user.email, role: userRole, token };
  },

  async loginUser(user: IUserModel) {
    const sqlQuery = `SELECT email, password, role, id from users WHERE email = ?;`;

    try {
      const [rows]: [RowDataPacket[], any] = await connection.promise().query(sqlQuery, [user.email]);

      const { id, role, email, password } = rows[0];

      const token = JWT.sign(
        { id, role },
        {
          audience: 'https://musicapp.com',
          issuer: 'Authorization/Resource/MusicApp',
          subject: email,
        }
      );

      return {
        id,
        email,
        role,
        password,
        token,
      };
    } catch (error) {
      throw new Error('Users is not found');
    }
  },
};
