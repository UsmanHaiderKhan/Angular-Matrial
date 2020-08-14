import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../shared/employee.service';
import { DepartmentService } from '../../shared/department.service';
import { NotificationService } from '../../shared/notification.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
interface Departments {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit {
  selectedValue: string;
  optionsSelect: Array<any>;
  selectedImage: any = null;
  imgSrc = '';
  constructor(
    public employeeService: EmployeeService,
    public departmentService: DepartmentService,
    public notificationService: NotificationService,
    public dialogRef: MatDialogRef<EmployeeService>,
    public storage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.employeeService.getEmployees();
  }
  onReset() {
    this.employeeService.form.reset();
    this.employeeService.onInitialLizeFormGroup();
    this.notificationService.openSnackBar('Submitted SuccessFully');
  }
  onSubmit(formValue) {
    if (this.employeeService.form.valid) {
      if (!this.employeeService.form.get('$key').value) {
        // this.employeeService.addEmployee(this.employeeService.form.value);
        var filePath = `images/${this.selectedImage.name
          .split('.')
          .slice(0, -1)
          .join('.')}_${new Date().getTime()}`;
        const fileRef = this.storage.ref(filePath);
        this.storage
          .upload(filePath, this.selectedImage)
          .snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((url) => {
                formValue['imageUrl'] = url;
                this.employeeService.addEmployee(formValue);
                this.employeeService.onInitialLizeFormGroup();
                this.notificationService.openSnackBar('Submitted SuccessFully');
                this.onClose();
              });
            })
          )
          .subscribe();
      } else {
        this.employeeService.updateEmployee(this.employeeService.form.value);
      }
    }
  }
  onClose() {
    this.employeeService.form.reset();
    this.employeeService.onInitialLizeFormGroup();
    this.dialogRef.close();
  }
  showImagePreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.imgSrc = e.target.result);
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    } else {
      this.imgSrc = '../../../assets/img/avatar.png';
      this.selectedImage = null;
    }
  }
}
