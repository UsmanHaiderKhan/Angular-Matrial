import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../../shared/employee.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DepartmentService } from 'src/app/shared/department.service';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { EmployeeComponent } from '../employee/employee.component';
import { NotificationService } from 'src/app/shared/notification.service';
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  listData: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  searchKey: string;
  displayedColumns: string[] = [
    'fullname',
    'email',
    'mobile',
    'city',
    'departmentName',
    'actions',
    // 'gender',
    // 'hireDate',
    // 'isPermanant',
  ];

  constructor(
    private employeeService: EmployeeService,
    private departmentServiec: DepartmentService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getEmployeeList();
  }
  getEmployeeList() {
    this.employeeService.getEmployees().subscribe((list) => {
      let array = list.map((item) => {
        let departmentName = this.departmentServiec.getDepartmentName(
          item.payload.val()['department']
        );
        return { $key: item.key, departmentName, ...item.payload.val() };
      });
      this.listData = new MatTableDataSource(array);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listData.filterPredicate = (data, filter) => {
        return this.displayedColumns.some((ele) => {
          return (
            ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1
          );
        });
      };
    });
  }
  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }
  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }
  onCreate() {
    this.employeeService.onInitialLizeFormGroup();
    let config = new MatDialogConfig();
    (config.disableClose = true), (config.width = '60%');
    this.dialog.open(EmployeeComponent, config);
  }
  onEdit(row) {
    this.employeeService.editForm(row);
    let config = new MatDialogConfig();

    (config.disableClose = true), (config.width = '60%');
    this.dialog.open(EmployeeComponent, config);
  }
  onDelete($key) {
    if (confirm('Are you Sure you Want to Delete Record?')) {
      this.employeeService.deleteEmployee($key);
      this.notificationService.danger('Deleted SuccessFully');
    }
  }
}
