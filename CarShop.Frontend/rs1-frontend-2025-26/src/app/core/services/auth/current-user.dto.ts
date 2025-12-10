export interface CurrentUserDto {
  userId: number;
  email: string;
  roleName?: string;
  isAdmin: boolean;
  isManager: boolean;
  isEmployee: boolean;
  tokenVersion: number;
}
