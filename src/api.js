export const fetchApi = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => {
        if(response.ok) {
          return response.json();
        } else {
          alert("Ошибка загрузки данных");
        }
      })
      .then(data => {
        resolve(data);
      })
      .catch((e) => {
        alert("При загрузке произошла ошибка: \n" + e);
      });
  });
}

export default class CallApi {

  static getPeopleData() {
    return fetchApi("https://api.npoint.io/324f4ca2cdd639760638");
  }

}