
export * from './constants';

export const setItemInLocalStorage = (key,value) => {
  if( !key || !value ){
    return console.error('can not store in local storage');
  }
  const valueStorage = typeof value !== 'string' ? JSON.stringify(value) : value;
  localStorage.setItem(key,valueStorage);
}

export const getItemInLocalStorage = (key) => {
  if(!key){
    return console.error('can not get value from local storage');
  }
  return localStorage.getItem(key);
}

export const removeItemFromLocalStorage = (key) => {
  if( !key ){
    return console.error('can not get value from local storage');
  }
  localStorage.removeItem(key);
}

export const getFormBody = (params) => {
  let fromBody = [];

  for (let property in params) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(params[property]);

    fromBody.push(encodedKey + '=' + encodedValue);
  }

  return fromBody.join('&');
};
