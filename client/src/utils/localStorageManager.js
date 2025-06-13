// export const KEY_ACCESS_TOKEN = "access_token"

// export const  getItem= (key)=> {
//     return localStorage.getItem(key);

// }

// export function setItem(key, value){
//     localStorage.setItem(key, value);
// }

// export function removeItem(key){
//     localStorage.removeItem(key);
// }





export const KEY_ACCESS_TOKEN = 'accessToken';  // SAME KEY used everywhere

export const getItem = (key) => {
  return localStorage.getItem(key);
}

export function setItem(key, value) {
  localStorage.setItem(key, value);
}

export function removeItem(key) {
  localStorage.removeItem(key);
}