export interface UserDTO {
    id: string
    login: string
    email: string
    phoneNumber: string
    role: ERole
}

export interface UpdateUserDTO {
    email: string
    phoneNumber: string
}

export interface ChangeUserRoleDTO {
    role: ERole
}

export enum ERole {
    User,
    Admin
}