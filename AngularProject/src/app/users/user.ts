import { Role } from "../roles/role";

export interface User {
    id: number;
    name: string;
    roles?: Role[];
}