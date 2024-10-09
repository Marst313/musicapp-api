import { connection } from '../db';

export async function initializeTables(): Promise<void> {
  const createNewTableQuery = [
    `CREATE TABLE IF NOT EXISTS musics (
        id CHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        singer VARCHAR(255) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        PRIMARY KEY(id)
    );`,
    `CREATE TABLE IF NOT EXISTS users (
      id CHAR(36) NOT NULL,
      email varchar(100) DEFAULT NULL,
      password varchar(255) DEFAULT NULL,
      role INT DEFAULT 1,
      PRIMARY KEY(id)
  );`,
    `CREATE TABLE IF NOT EXISTS usersAlbums (
    album_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    album_name VARCHAR(255) NOT NULL,
    album_songs VARCHAR(255),
    album_description VARCHAR(255),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);`,
  ];

  try {
    for (const createTable of createNewTableQuery) {
      await new Promise<void>(function (resolve, reject) {
        connection.query(createTable, function (err) {
          if (err) {
            console.error(`Error creating table:`, err);
            return reject(err);
          }

          resolve();
        });
      });
    }

    console.log('Database is ready');
  } catch (error) {
    console.log(error);
  }
}
