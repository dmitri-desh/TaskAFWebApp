import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { User } from './user';
import { UserService } from './user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'rolesList', 'actions'];
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
    private userService: UserService,
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

    const sortColumn = (this.sort)
      ? this.sort.active
      : this.defaultSortColumn;

    const sortOrder = (this.sort)
      ? this.sort.direction
      : this.defaultSortOrder;
    
    const filterColumn = (this.filterQuery)
      ? this.defaultFilterColumn
      : null;

    const filterQuery = (this.filterQuery)
      ? this.filterQuery
      : null;

    this.userService.getData(
      event.pageIndex,
      event.pageSize,
      sortColumn,
      sortOrder,
      filterColumn,
      filterQuery)
      .subscribe(result => {
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        const usersList = result.data.map((item: User) => {
          return {
            id: item.id,
            name: item.name,
            rolesList: item.roles?.map(role => role.name).join(', '),
            roles: item.roles
          }   
        });
        this.users = new MatTableDataSource<User>(usersList);
        
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
  templateUrl: 'user-delete-dialog.html',
  styleUrls: ['./user-delete-dialog.scss']
})

export class UserDeleteDialog {
  constructor(
    private router: Router,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  delete(id: number) {
      this.userService.delete(id).subscribe(result => {
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