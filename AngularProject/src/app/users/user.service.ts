import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BaseService, ApiResult } from "../base.service";
import { Observable } from 'rxjs';

import { User } from "./user";
import { Role } from "../roles/role";

@Injectable({ providedIn: 'root' })

export class UserService extends BaseService<User> {
    constructor(http: HttpClient) {
        super(http);
    }

    private apiUrl: string = "api/Users";

    getData(
        pageIndex: number,
        pageSize: number,
        sortColumn: string,
        sortOrder: string,
        filterColumn: string | null,
        filterQuery: string | null
        ): Observable<ApiResult<User>> {
        const url = this.getUrl(this.apiUrl);
        let params = new HttpParams()
            .set("pageIndex", pageIndex.toString())
            .set("pageSize", pageSize.toString())
            .set("sortColumn", sortColumn)
            .set("sortOrder", sortOrder);

        if (filterColumn && filterQuery) {
            params = params
                .set("filterColumn", filterColumn)
                .set("filterQuery", filterQuery);
        }

        return this.http.get<ApiResult<User>>(url, { params });
    }

    get(id: number): Observable<User> {
        const url = this.getUrl(`${this.apiUrl}/${id}`);

        return this.http.get<User>(url);
    }

    put(item: User): Observable<User> {
        const url = this.getUrl(`${this.apiUrl}/${item.id}`);

        return this.http.put<User>(url, item);
    }

    post(item: User): Observable<User> {
        const url = this.getUrl(this.apiUrl);

        return this.http.post<User>(url, item);
    }

    delete(id: number): Observable<User> {
        const url = this.getUrl(`${this.apiUrl}/${id}`);

        return this.http.delete<User>(url);
    }

    getRoles(
        pageIndex: number,
        pageSize: number,
        sortColumn: string,
        sortOrder: string,
        filterColumn: string | null,
        filterQuery: string | null
    ): Observable<ApiResult<Role>> {
        const url = this.getUrl("api/Roles");
        let params = new HttpParams()
            .set("pageIndex", pageIndex.toString())
            .set("pageSize", pageSize.toString())
            .set("sortColumn", sortColumn)
            .set("sortOrder", sortOrder);

        if (filterColumn && filterQuery) {
            params = params
                .set("filterColumn", filterColumn)
                .set("filterQuery", filterQuery);
        }

        return this.http.get<ApiResult<Role>>(url, { params });
    }

    isDupeUser(item: User): Observable<boolean> {
        const url = this.getUrl(`${this.apiUrl}/IsDupeUser`);

        return this.http.post<boolean>(url, item);
    }
}