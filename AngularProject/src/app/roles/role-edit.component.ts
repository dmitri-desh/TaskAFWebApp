import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Role } from './role';
import { BaseFormComponent } from '../base-form.component';
import { RoleService } from './role.service';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})

export class RoleEditComponent
  extends BaseFormComponent implements OnInit {

  // the view title
  title?: string;

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
    private roleService: RoleService) {
      super();
    }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required, this.isDupeField("name")]
    });

    this.loadData();
  }

  loadData() {

    // retrieve the ID from the 'id' parameter
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.id = idParam ? +idParam : 0;
    
    if (this.id) {
      // EDIT MODE

      // fetch the role from the server
      this.roleService.get(this.id).subscribe(result => {
      this.role = result;
      this.title = "Edit - " + this.role.name;
  
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
    const role = (this.id) ? this.role : <Role>{};

    if (role) {
      role.name = this.form.controls['name'].value;
      
      if (this.id) {
      // EDIT MODE

      this.roleService.put(role).subscribe(result => {
          console.log("Role " + role!.id + " has been updated.");

          // go back to roles view
          this.router.navigate(['/roles']);
        }, 
        error => console.error(error));
      }
      else {
        // ADD NEW mode
        this.roleService.post(role).subscribe(result => {
          console.log("Role " + result.id + " has been created.");

          // go back to roles view
          this.router.navigate(['/roles']);
        }, error => console.error(error));
      }
    }
  }

  isDupeField(fieldName: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{[key: string]: any} | null> => {
        return this.roleService.isDupeField(this.id ?? 0, fieldName, control.value)
          .pipe(map(result => {
            return (result ? { isDupeField: true } : null);
          }));
    }
  }
}
