export interface UserDTO {
    id: string;
    Login: string;
    Email: string;
    PhoneNumber: string;
    Role: ERole
};

export interface UpdateUserDTO {
    Email: string;
    PhoneNumber: string;
}

export interface ChangeUserRoleDTO {
    userRole: ERole;
}

export enum ERole {
    User,
    Admin1
}