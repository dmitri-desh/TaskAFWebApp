import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { environment } from './../../environments/environment';

import { User } from './user';

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

  onSubmit() {
    var user = (this.id) ? this.user : <User>{};

    if (user) {
      user.name = this.form.controls['name'].value;
      
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
