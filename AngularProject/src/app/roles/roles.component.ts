import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Role } from './role';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})

export class RolesComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'actions'];
  public roles!: MatTableDataSource<Role>;

  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;

  public defaultSortColumn: string = "name";
  public defaultSortOrder: "asc" | "desc" = "asc";

  defaultFilterColumn: string = "name";
  filterQuery?: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterTextChanged: Subject<string> = new Subject<string>();

  constructor(
    private http: HttpClient,
    public dialog: MatDialog) {
  }

  openDialog(id: number, name: string) {
    this.dialog.open(RoleDeleteDialog, { data: { id, name }, width: '350px' });
  }

  ngOnInit() {
    this.loadData();
  }

  // debounce filter text changes
  onFilterTextChanged(filterText: string) {
    if (this.filterTextChanged.observers.length === 0) {
      this.filterTextChanged.pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(query => this.loadData(query));
    }
    
    this.filterTextChanged.next(filterText);
  }


  loadData(query?: string) {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    this.filterQuery = query;
    this.getData(pageEvent);
  }

  getData(event: PageEvent) {
    var url = environment.baseUrl + 'api/Roles';

    var params = new HttpParams()
      .set("pageIndex", event.pageIndex.toString())
      .set("pageSize", event.pageSize.toString())
      .set("sortColumn", (this.sort)
        ? this.sort.active
        : this.defaultSortColumn)
      .set("sortOrder", (this.sort)
        ? this.sort.direction
        : this.defaultSortOrder);

    if (this.filterQuery) {
      params = params
      .set("filterColumn", this.defaultFilterColumn)
      .set("filterQuery", this.filterQuery);
    }

    this.http.get<any>(url, { params })
      .subscribe(result => {
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        this.roles = new MatTableDataSource<Role>(result.data);
      }, 
      error => console.error(error));
  }
}

export interface DialogData {
  id: number;
  name: string;
}

@Component({
  selector: 'role-delete-dialog',
  templateUrl: 'role-delete-dialog.html'
})

export class RoleDeleteDialog {
  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  delete(id: number) {
    const url = `${environment.baseUrl}api/Roles/${id}`;

    this.http.delete<Role>(url).subscribe(result => {
      console.log(`Role ${id} has been deleted.`);

      // go back to roles view
      this.goBack();
    }, error => console.error(error));
  }

  goBack() {
      // go back to roles view
      this.router.navigate(['/roles']);
  }
}
