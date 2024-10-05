import { QueryError, ResultSetHeader } from 'mysql2';
import { connection } from '../config/db';
import { IMusic } from '../models/music';
import { sendError } from '../controllers/errorController';

function selectAll(): Promise<IMusic[]> {
  const sqlQuery = `SELECT id, title, description, name, singer, file_name, image FROM musictable;`;

  return new Promise(function (resolve, reject) {
    connection.query(sqlQuery, function (err: QueryError, resultSet: IMusic[]) {
      if (err) {
        return reject(err);
      }

      return resolve(resultSet);
    });
  });
}

function createNewMusic(music: IMusic): Promise<void> {
  const sqlQuery = `INSERT INTO musictable (title, description, name, singer, file_name, image, id) 
  VALUES (?, ?, ?, ?, ?, ?, ?);`;

  const values = [music.title, music.description, music.name, music.singer, music.file_name, music.image, music.id];

  return new Promise(function (resolve, reject) {
    connection.query(sqlQuery, values, function (err: QueryError | null) {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
}

function getSingleMusic(id: string): Promise<IMusic> {
  const sqlQuery = `SELECT id, title, description, name, singer, file_name, image from musictable where id="${id}"`;

  return new Promise(function (resolve, reject) {
    connection.query(sqlQuery, function (err: QueryError, resultSet: IMusic) {
      if (err) {
        return reject(err);
      }

      return resolve(resultSet);
    });
  });
}

function deleteSingleMusic(id: string): Promise<boolean> {
  const sqlQuery = `DELETE from musictable where id="${id}"`;

  return new Promise(function (resolve, reject) {
    connection.query(sqlQuery, function (err: QueryError, resultSet: ResultSetHeader) {
      if (err) {
        return reject(err);
      }

      if (resultSet.affectedRows === 0) {
        resolve(true);
      }
      return resolve(false);
    });
  });
}

export default { selectAll, createNewMusic, deleteSingleMusic, getSingleMusic };
