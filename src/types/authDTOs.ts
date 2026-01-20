export interface RegisterUserDTO{
    login: string;
    phoneNumber:string;
    email:string;
    password:string;
}

export interface LoginDTO{
    login: string;
    password:string;
}

export interface AuthResponseDTO{
    accessToken:string;
    refreshToken:string;
}

export interface RefreshTokenDTO{
    refreshToken:string;
}

export interface LogoutDTO{
    refreshToken:string;
}