import axios from 'axios'

const apiInstance = axios.create({
  baseURL: typeof window !== 'undefined' ? '/api' : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api`,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout
});

export const apiGet = async (url: string, data? : Object) => {
  console.log('GET Request to:', url, 'with data:', data);
  try {
    const response = await apiInstance.get(url, data);
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      window.location.href = '/admin';
    }
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(`${error.response.data.error || 'Failed'}`);
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(`Failed request to ${url}: ${error.message}`);
    }
  }
}

export const apiPost = async (url: string, data? : Object) => {
  console.log('POST Request to:', url);
  try {
    const response = await apiInstance.post(url, data);
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      window.location.href = '/admin';
    }
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(`Error: ${error.response.data.error || 'Login failed'}`);
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
};