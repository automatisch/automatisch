import { IJSONObject } from '@automatisch/types';
import FavoritePhoto from './triggers/favorite-photo';
import NewPhotoInAlbum from './triggers/new-photo-in-album';
import NewPhoto from './triggers/new-photo';
import NewAlbum from './triggers/new-album';

export default class Triggers {
  favoritePhoto: FavoritePhoto;
  newPhotoInAlbum: NewPhotoInAlbum;
  newPhoto: NewPhoto;
  newAlbum: NewAlbum;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.favoritePhoto = new FavoritePhoto(connectionData);
    this.newPhotoInAlbum = new NewPhotoInAlbum(connectionData, parameters);
    this.newPhoto = new NewPhoto(connectionData);
    this.newAlbum = new NewAlbum(connectionData);
  }
}
