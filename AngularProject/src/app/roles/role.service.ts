import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BaseService, ApiResult } from "../base.service";
import { Observable } from "rxjs";

import { Role } from "./role";

@Injectable({ providedIn: 'root' })

export class RoleService extends BaseService<Role> {
    constructor(http: HttpClient) {
        super(http);
    }

    private apiUrl: string = "api/Roles";

    getData(
        pageIndex: number,
        pageSize: number,
        sortColumn: string,
        sortOrder: string,
        filterColumn: string | null,
        filterQuery: string | null
        ): Observable<ApiResult<Role>> {

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

        return this.http.get<ApiResult<Role>>(url, { params });
    }

    get(id: number): Observable<Role> {
        const url = this.getUrl(`${this.apiUrl}/${id}`);

        return this.http.get<Role>(url);
    }

    put(item: Role): Observable<Role> {
        const url = this.getUrl(`${this.apiUrl}/${item.id}`);

        return this.http.put<Role>(url, item);
    }

    post(item: Role): Observable<Role> {
        const url = this.getUrl(this.apiUrl);
        
        return this.http.post<Role>(url, item);
    }

    delete(id: number): Observable<Role> {
        const url = this.getUrl(`${this.apiUrl}/${id}`);

        return this.http.delete<Role>(url);
    }

    isDupeField(roleId: number, fieldName: string, fieldValue: string): Observable<boolean> {
        const params = new HttpParams()
            .set("roleId", roleId)
            .set("fieldName", fieldName)
            .set("fieldValue", fieldValue);
        const url = this.getUrl(`${this.apiUrl}/IsDupeField`);

        return this.http.post<boolean>(url, null, { params });
    }
}