import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

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

  // the role object to edit
  role?: Role;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient) {
    }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('')
    });

    this.loadData();
  }

  loadData() {

    // retrieve the ID from the 'id' parameter
    var idParam = this.activatedRoute.snapshot.paramMap.get('id');
    var id = idParam ? +idParam : 0;

    // fetch the role from the server
    var url = environment.baseUrl + 'api/Roles/' + id;

    this.http.get<Role>(url).subscribe(result => {
      this.role = result;
      this.title = "Edit - " + this.role.name;
      
      // update the form with the role value
      this.form.patchValue(this.role);
    }, 
    error => console.error(error));
  }

  onSubmit() {
    var role = this.role;

    if (role) {
      role.name = this.form.controls['name'].value;
      
      var url = environment.baseUrl + 'api/Roles/' + role.id;

      this.http.put<Role>(url, role)
        .subscribe(result => {
          console.log("Role " + role!.id + " has been updated.");

          // go back to roles view
          this.router.navigate(['/roles']);
        }, 
        error => console.error(error));
    }
  }
}
