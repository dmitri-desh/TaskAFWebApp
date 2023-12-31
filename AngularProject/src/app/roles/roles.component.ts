import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Role } from './role';
import { RoleService } from './role.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})

export class RolesComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'usersCount', 'actions'];
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
    private roleService: RoleService,
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

    this.roleService.getData(
      event.pageIndex,
      event.pageSize,
      sortColumn,
      sortOrder,
      filterColumn,
      filterQuery
    )
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
    private roleService: RoleService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  delete(id: number) {
    this.roleService.delete(id).subscribe(result => {
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
