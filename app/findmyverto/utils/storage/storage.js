import { MMKV } from 'react-native-mmkv';

export const appStorage = new MMKV({id: 'app-storage'});
export const userStorage = new MMKV({id: 'user-storage'});
export const friendsStorage = new MMKV({id: 'friends-storage'});

// export const userStorage = {
//     get: (key) => {
//         try {
//             return userStorageObject.getString(key);
//         } catch (error) {
//             console.error(error);
//             return null;
//         }
//     },
//     set: (key, value) => {
//         try {
//             userStorageObject.setString(key, value);
//         } catch (error) {
//             console.error(error);
//         }
//     },
//     remove: (key) => {
//         try {
//             userStorageObject.removeItem(key);
//         } catch (error) {
//             console.error(error);
//         }
//     },
//     clear: () => {
//         try {
//             userStorageObject.clearStore();
//         } catch (error) {
//             console.error(error);
//         }
//     }
// }

// export const friendsStorage = {
//     get: (key) => {
//         try {
//             return friendsStorageObject.getString(key);
//         } catch (error) {
//             console.error(error);
//             return null;
//         }
//     },
//     set: (key, value) => {
//         try {
//             friendsStorageObject.setString(key, value);
//         } catch (error) {
//             console.error(error);
//         }
//     },
//     remove: (key) => {
//         try {
//             friendsStorageObject.removeItem(key);
//         } catch (error) {
//             console.error(error);
//         }
//     },
//     clear: () => {
//         try {
//             friendsStorageObject.clearStore();
//         } catch (error) {
//             console.error(error);
//         }
//     }
// }