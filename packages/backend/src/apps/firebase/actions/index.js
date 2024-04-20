import createCloudFirestoreDocument from './create-cloud-firestore-document/index.js';
import createFirebaseRealtimeDatabaseRecord from './create-firebase-realtime-database-record/index.js';
import findCloudFirestoreDocument from './find-cloud-firestore-document/index.js';
import findFirebaseRealtimeDatabaseRecord from './find-firebase-realtime-database-record/index.js';

export default [
  createCloudFirestoreDocument,
  createFirebaseRealtimeDatabaseRecord,
  findCloudFirestoreDocument,
  findFirebaseRealtimeDatabaseRecord,
];
