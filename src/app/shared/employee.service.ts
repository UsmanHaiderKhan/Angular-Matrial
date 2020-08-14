import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private firebase: AngularFireDatabase) {}
  employeeList: AngularFireList<any>;
  // FormGroup
  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    imageUrl: new FormControl(''),
    fullname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    mobile: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
    ]),
    city: new FormControl(''),
    gender: new FormControl('1'),
    department: new FormControl(0),
    hireDate: new FormControl(''),
    isPermanant: new FormControl(false),
  });
  // Setting Value on Init
  onInitialLizeFormGroup() {
    this.form.setValue({
      $key: null,
      imageUrl: '',
      fullname: '',
      email: '',
      mobile: '',
      city: '',
      gender: '1',
      department: 0,
      hireDate: '',
      isPermanant: false,
    });
  }
  //Getting Employees
  getEmployees() {
    this.employeeList = this.firebase.list('employees');
    return this.employeeList.snapshotChanges();
  }
  // Add Employees
  addEmployee(employee) {
    this.employeeList.push({
      imageUrl: employee.imageUrl,
      fullname: employee.fullname,
      email: employee.email,
      mobile: employee.mobile,
      city: employee.city,
      gender: employee.gender,
      department: employee.department,
      hireDate: employee.hireDate,
      isPermanant: employee.isPermanant,
    });
  }
  updateEmployee(employee) {
    this.employeeList.update(employee.$key, {
      imageUrl: employee.imageUrl,
      fullname: employee.fullname,
      email: employee.email,
      mobile: employee.mobile,
      city: employee.city,
      gender: employee.gender,
      department: employee.department,
      hireDate: employee.hireDate,
      isPermanant: employee.isPermanant,
    });
  }
  deleteEmployee($key: string) {
    this.employeeList.remove($key);
  }
  editForm(employee) {
    this.form.setValue(_.omit(employee, 'departmentName'));
  }
}
