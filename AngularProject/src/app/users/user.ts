import { Role } from "../roles/role";

export interface User {
    id: number;
    name: string;
    rolesList: string;
    roles?: Role[];
}