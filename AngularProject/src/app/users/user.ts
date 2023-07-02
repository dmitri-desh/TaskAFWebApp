import { Role } from "../roles/role";

export interface User {
    id: number;
    name: string;
    // TODO rollback to array
    // roles?: Role[];
    roleId?: number;
}