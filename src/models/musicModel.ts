export interface IMusicModel {
  id: string; // PK
  title: string;
  description: string;
  name: string;
  singer: string;
  file_name: string;
  image: string;
}

export interface IAlbum {
  id: string; // PK
  name: string;
  songs?: IMusicModel[];
  description?: string;
}
