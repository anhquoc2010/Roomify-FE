import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import _ from 'lodash';

type TCollection = 'NotificationTokens';

class CFirestore {
  private static _instance: CFirestore;

  private constructor() {
    // ...
  }

  public static get Instance(): CFirestore {
    if (!this._instance) {
      this._instance = new this();
    }
    return CFirestore._instance;
  }

  getCollection = (name: string) => firestore().collection(name);

  get = async (name: string, condition?: any[]) => {
    if (condition) {
      return firestore().collection(name).where(condition[0], condition[1], condition[2]).get();
    }
    return firestore().collection(name).get();
  };

  find = async (name: string, id: string) => firestore().collection(name).doc(id).get();

  add = async (collection: string, data: any) => {
    if (!_.isUndefined(data.id)) {
      return firestore()
        .collection(collection)
        .doc(data.id.toString())
        .set(_.omit(data, 'id'));
    }
    return firestore()
      .collection(collection)
      .add(_.omit(data, 'id'));
  };

  update = async (collection: string, id: string, data: any) => firestore()
    .collection(collection)
    .doc(id)
    .update(data);

  delete = async (collection: string, id: string) => firestore()
    .collection(collection)
    .doc(id)
    .delete();

  // eslint-disable-next-line max-len
  listen = (collection: string, condition: any[], fn: (change: FirebaseFirestoreTypes.DocumentChange<FirebaseFirestoreTypes.DocumentData>) => any) => {
    firestore().collection(collection).where(condition[0], condition[1], condition[2])
      .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          fn(change);
          // if (change.type === 'added') {
          //   // eslint-disable-next-line no-console
          //   console.log('New city: ', change.doc.data());
          // }

          const source = snapshot.metadata.fromCache ? 'local cache' : 'server';
          // eslint-disable-next-line no-console
          console.log(`Data came from ${source}`);
        });
      });
  };
}

const Firestore = CFirestore.Instance;
export default Firestore;
