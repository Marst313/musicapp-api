import { connection } from '../config/db';

export function initializeTables(): Promise<void> {
  const createNewTableQuery = `
    CREATE TABLE IF NOT EXISTS musictable (
        pk INT NOT NULL AUTO_INCREMENT,
        id CHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        singer VARCHAR(255) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        PRIMARY KEY(pk),
        UNIQUE(id)
    );`;

  return new Promise(function (resolve, reject) {
    connection.query(createNewTableQuery, function (err) {
      if (err) {
        console.error('Error creating music table:', err);
        return reject(err);
      }

      console.log('Database is ready');
      resolve();
    });
  });
}
