import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from './../../environments/environment';

import { Role } from './role';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})

export class RoleEditComponent implements OnInit {

  // the view title
  title?: string;

  // the form model
  form!: FormGroup;

  // the role object to edit or create
  role?: Role;

  // the role object id, as fetched from the active route:
// It's NULL when we're adding a new role,
// and not NULL when we're editing an existing one.
id?: number;

// the roles array for the select
roles?: Role[];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient) {
    }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required, this.isDupeField("name")]
    });

    this.loadData();
  }

  loadData() {

    // retrieve the ID from the 'id' parameter
    var idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;
    
    if (this.id) {
      // EDIT MODE

      // fetch the role from the server
      var url = environment.baseUrl + "api/Roles/" + this.id;
      this.http.get<Role>(url).subscribe(result => {
      this.role = result;
      this.title = "Edit - " + this.role.name;
        console.log(this.id, this.role);
      // update the form with the role value
      this.form.patchValue(this.role);
      }, error => console.error(error));
    }
    else {
    // ADD NEW MODE
    this.title = "Create a new Role";
    }
  }

  onSubmit() {
    var role = (this.id) ? this.role : <Role>{};

    if (role) {
      role.name = this.form.controls['name'].value;
      
      if (this.id) {
      // EDIT MODE
      var url = environment.baseUrl + 'api/Roles/' + role.id;

      this.http.put<Role>(url, role)
        .subscribe(result => {
          console.log("Role " + role!.id + " has been updated.");

          // go back to roles view
          this.router.navigate(['/roles']);
        }, 
        error => console.error(error));
      }
      else {
        // ADD NEW mode
        var url = environment.baseUrl + 'api/Roles';
        this.http.post<Role>(url, role).subscribe(result => {
          console.log("Role " + result.id + " has been created.");

          // go back to roles view
          this.router.navigate(['/roles']);
        }, error => console.error(error));
      }
    }
  }

  isDupeField(fieldName: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{[key: string]: any} | null> => {
      var params = new HttpParams()
        .set("roleId", (this.id) ? this.id.toString() : "0")
        .set("fieldName", fieldName)
        .set("fieldValue", control.value);
      var url = environment.baseUrl + 'api/Roles/IsDupeField';
        return this.http.post<boolean>(url, null, { params })
        .pipe(map(result => {
            return (result ? { isDupeField: true } : null);
          }));
    }
  }
}
