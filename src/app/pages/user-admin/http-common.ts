import axios from 'axios';

const LOCAL_ENVIRONMENT = "https://apiempopasto.azurewebsites.net/";
//const LOCAL_ENVIRONMENT = "https://localhost:7098/";
const baseURL = `${LOCAL_ENVIRONMENT}api`;

export const http =  axios.create({

  baseURL: baseURL,

  headers: {

    //"Content-type": "application/json",
    //"accept": "application/json",
    //"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE2NjU1ODM5NTMsImV4cCI6MTY2NTY0Mzk1MywiaXNzIjoiSldUQXV0aGVudGljYXRpb25TZXJ2ZXIiLCJhdWQiOiJKV1RTZXJ2aWNlUG9zdG1hbkNsaWVudCJ9.VgM2KtHevDQOVQIUfTGiVhXKN7FDi4j-d3CXf0XTCIY"
    //"Authorization": `Bearer ${localStorage.getItem('token')}`,
  },

});