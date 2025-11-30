import axios from 'axios'
import { HTTP_STATUS } from '../utils';

const apiInstance = axios.create({
  baseURL: typeof window !== 'undefined' ? '/api' : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api`,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout
});

const throwRequestError = (error: any, url: string) => {
  if (error.response) {
    if (error.response.status === HTTP_STATUS.UNAUTHORIZED) {
      throw new Error('Usuário não tem permissão para realizar esta operação.');
    }
    else if (error.response.status === HTTP_STATUS.FORBIDDEN) {
      throw new Error('Acesso negado. Favor verificar suas credenciais.');
    }
    throw new Error(`${error.response.data.error || error.response.data.message || 'Failed request'}`);
  } else if (error.request) {
    throw new Error('No response from server. Please check your connection.');
  } else {
    throw new Error(`Failed request to ${url}: ${error.message}`);
  }
};

export const apiGet = async (url: string, data? : Object) => {
  console.log('GET Request to:', url, 'with data:', data);
  try {
    const response = await apiInstance.get(url, data);
    return response.data;
  } catch (error: any) {
    throwRequestError(error, url);
  }
}

export const apiPost = async (url: string, data? : Object ) => {
  try {
    const response = await apiInstance.post(url, data);
    return response.data;
  } catch (error: any) {
    throwRequestError(error, url);
  }
};

export const apiPostForm = async (url: string, data : FormData, auth? : string ) => {
  try {
    const response = await axios.post(
      `${apiInstance.defaults.baseURL}${url}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(auth ? { 'Authorization': `Bearer ${auth}` } : {}),
        },
        timeout: 10000,
      }
    );
    return response.data;
  } catch (error: any) {
    throwRequestError(error, url);
  }
};

export const apiPutForm = async (url: string, data : FormData, auth? : string ) => {
  try {
    const response = await axios.put(
      `${apiInstance.defaults.baseURL}${url}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(auth ? { 'Authorization': `Bearer ${auth}` } : {}),
        },
        timeout: 10000,
      }
    );
    return response.data;
  } catch (error: any) {
    throwRequestError(error, url);
  }
};

export const apiDelete = async (url: string, auth? : string ) => {
  try {
    const response = await axios.delete(
      `${apiInstance.defaults.baseURL}${url}`,
      {
        headers: {
          ...(auth ? { 'Authorization': `Bearer ${auth}` } : {}),
        }
      }
    );
    return response.data;
  } catch (error: any) {
    throwRequestError(error, url);
  }
}