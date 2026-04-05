import { ICreateUserDto, IUser } from './auth.type';
import API from '@/service/api';
import { http } from '@/service/httpService';

class AuthService {
  registerUser = async (data: ICreateUserDto): Promise<IUser> => {
    const result = await http.post<IUser>(`${API.Auth.Register}`, data)
    
    return result;
  }

  loginUser = async (data: Partial<ICreateUserDto>): Promise<IUser> => {
    const result = await http.post<IUser>(`${API.Auth.Login}`, data)
    
    return result;
  }

  refreshToken = async (token: string): Promise<IUser> => {
    const result = await http.post<IUser>(`${API.Auth.Refresh}`, {refreshToken: token})
    
    return result;
  }

  logOut = async (token: string): Promise<IUser> => {
    const result = await http.post<IUser>(`${API.Auth.Logout}`, {refreshToken: token})
    
    return result;
  }
}

export const authService = new AuthService()