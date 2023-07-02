import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../../environments/environment';

import { User } from './user';
import { Role } from '../roles/role';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})

export class UserEditComponent implements OnInit {

  // the view title
  title?: string;

  // the form model
  form!: FormGroup;

  // the user object to edit or create
  user?: User;

  // the user object id, as fetched from the active route:
// It's NULL when we're adding a new user,
// and not NULL when we're editing an existing one.
id?: number;

// the roles array for the select
roles?: Role[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient) {
    }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      // TODO update to multi-select
      roleId: new FormControl('')
    }, null, this.isDupeUser());

    this.loadData();
  }

  isDupeUser(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {

      var user = <User>{};
      user.id = (this.id) ? this.id : 0;
      user.name = this.form.controls['name'].value;

      var url = environment.baseUrl + 'api/Users/IsDupeUser';

      return this.http.post<boolean>(url, user).pipe(map(result => {
        return (result ? { isDupeUser: true } : null);
      }));
    }
  }

  loadData() {

    // load roles
    this.loadRoles();

    // retrieve the ID from the 'id' parameter
    var idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;

    if (this.id) {
      // EDIT MODE

      // fetch the user from the server
      var url = environment.baseUrl + 'api/Users/' + this.id;
      this.http.get<User>(url).subscribe(result => {
        this.user = result;
        this.title = "Edit - " + this.user.name;

      // update the form with the user value
      this.form.patchValue(this.user);
      },
      error => console.error(error));
    }
    else {
    // ADD NEW MODE
    this.title = "Create a new User";
    }
  }

  loadRoles() {
    // fetch all the roles from the server
    var url = environment.baseUrl + 'api/Roles';
    var params = new HttpParams()
      .set("pageIndex", "0")
      .set("pageSize", "9999")
      .set("sortColumn", "name");
    this.http.get<any>(url, { params }).subscribe(result => {
      this.roles = result.data;
    }, 
    error => console.error(error));
  }

  onSubmit() {
    var user = (this.id) ? this.user : <User>{};

    if (user) {
      user.name = this.form.controls['name'].value;
      // TODO get roles array values
      user.roleId = +this.form.controls['roleId'].value;

      if (this.id) {
        // EDIT mode

        var url = environment.baseUrl + 'api/Users/' + user.id;
        this.http.put<User>(url, user).subscribe(result => {
            console.log("User " + user!.id + " has been updated.");

            // go back to cities view
            this.router.navigate(['/users']);
        }, 
        error => console.error(error));
      }
      else {
        // ADD NEW mode

        var url = environment.baseUrl + 'api/Users';
        this.http.post<User>(url, user).subscribe(result => {
          console.log("User " + result.id + " has been created.");

          // go back to users view
          this.router.navigate(['/users']);
        }, 
        error => console.error(error));
      }
    }
  }
}
