import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { User } from './user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'actions'];
  public users!: MatTableDataSource<User>;

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
    this.dialog.open(UserDeleteDialog, { data: { id, name }, width: '350px' });
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
    const pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;

    this.filterQuery = query;

    this.getData(pageEvent);
  }

  getData(event: PageEvent) {
    const url = `${environment.baseUrl}api/Users`;

    let params = new HttpParams()
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
        this.users = new MatTableDataSource<User>(result.data);
      }, 
      error => console.error(error));
  }
}

export interface DialogData {
  id: number;
  name: string;
}

@Component({
  selector: 'user-delete-dialog',
  templateUrl: 'user-delete-dialog.html'
})

export class UserDeleteDialog {
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  delete(id: number) {
    const url = `${environment.baseUrl}api/Users/${id}`;

    this.http.delete<User>(url).subscribe(result => {
      console.log(`User ${id} has been deleted.`);

      // go back to users view
      this.goBack();
    }, error => console.error(error));
  }

  goBack() {
      // go back to users view
      this.router.navigate(['/users']);
  }
}