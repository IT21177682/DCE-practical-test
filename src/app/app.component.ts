import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UserData } from '../app/models/user';
import { UserServices } from './services/user-services';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  users: UserData[] = [];
  user: UserData = { id: 0, first_name: '', last_name: '', email: '', avatar: '' };
  isUpdating: boolean = false;
  editingUser: UserData | null = null;

  displayedColumns: string[] = ['id', 'first_name', 'last_name', 'email', 'avatar', 'actions'];
  dataSource = new MatTableDataSource<UserData>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserServices) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.getUsers();
  }

  addUser() {
    this.userService.addUser(this.user).subscribe({
      next: (res) => {
        this.users.push(this.user);
        this.dataSource.data = this.users;
        Swal.fire({
          title: 'Saved!',
          text: 'Saved successfully.',
          icon: 'success',
        });
        this.clearForm();
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'Error!',
          text: 'Error in save.',
          icon: 'warning',
        });
      },
    });
  }

  getUsers() {
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res.data;
        this.dataSource.data = this.users; // Update the table data source
      },
      error: (err) => console.log(err),
    });
  }

  clearForm() {
    this.user = { id: 0, first_name: '', last_name: '', email: '', avatar: '' };
    this.isUpdating = false;
    this.editingUser = null;
  }

  editUser(user: UserData) {
    this.user = { ...user };
    this.editingUser = user;
    this.isUpdating = true;
  }

  updateUser(updatedUser: UserData) {
    this.userService.updateUser(updatedUser).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          
          this.users[index] = updatedUser;
          this.dataSource.data = this.users; // Update the table data source
        }
        Swal.fire({
          title: 'Updated!',
          text: 'Update successful.',
          icon: 'success',
        });
        this.clearForm();
        this.isUpdating = false;
        this.editingUser = null;
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'Error!',
          text: 'Error in update.',
          icon: 'warning',
        });
      },
    });
  }

  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter((user) => user.id !== userId);
        this.dataSource.data = this.users; // Update the table data source
        Swal.fire({
          title: 'Delete!',
          text: 'Deleted successfully.',
          icon: 'warning',
        });
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          title: 'Error in Delete!',
          text: 'Error in delete.',
          icon: 'warning',
        });
      },
    });
  }
}
