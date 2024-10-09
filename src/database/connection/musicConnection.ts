import { QueryError, ResultSetHeader } from 'mysql2';
import { connection } from '../db';
import { IMusicModel } from '../../models/musicModel';

function selectAll(): Promise<IMusicModel[]> {
  const sqlQuery = `SELECT id, title, description, name, singer, file_name, image FROM musics;`;

  return new Promise(function (resolve, reject) {
    connection.query(sqlQuery, function (err: QueryError, resultSet: IMusicModel[]) {
      if (err) {
        return reject(err);
      }

      return resolve(resultSet);
    });
  });
}

function createNewMusic(music: IMusicModel): Promise<void> {
  const sqlQuery = `INSERT INTO musics (title, description, name, singer, file_name, image, id) 
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

function getSingleMusic(id: string): Promise<IMusicModel> {
  const sqlQuery = `SELECT id, title, description, name, singer, file_name, image from musics where id="${id}"`;

  return new Promise(function (resolve, reject) {
    connection.query(sqlQuery, function (err: QueryError, resultSet: IMusicModel) {
      if (err) {
        return reject(err);
      }

      return resolve(resultSet);
    });
  });
}

function deleteSingleMusic(id: string): Promise<boolean> {
  const sqlQuery = `DELETE from musics where id="${id}"`;

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
