
import axios, { AxiosResponse } from 'axios';
import { IRequestAuthToken } from '../types/General';
import { BASE_URL, CONFIG_API } from '../constants/ConfigApi';

const http = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-type": "application/json",
      "accept": "application/json",
    }
});

export function getToken(): Promise<AxiosResponse<IRequestAuthToken>> {
  return http.post<IRequestAuthToken>("/AuthToken", CONFIG_API);
}