import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserResponse } from "../models/user";
import {UserData } from "../models/user";

@Injectable({
    providedIn: 'root'
})

export class UserServices {


    constructor(private http: HttpClient) { }

    getUsers(): Observable<UserResponse> {
        return this.http.get<UserResponse>("https://reqres.in/api/users?page=2");
    }

    addUser(user: UserData): Observable<UserData> {
        return this.http.post<UserData>("https://reqres.in/api/users", user);
    }
    updateUser(user: UserData): Observable<UserData> {
        return this.http.put<UserData>(`${"https://reqres.in/api/users/"}/${user.id}`, user);
    }

    deleteUser(userId: number): Observable<any> {
        return this.http.delete(`${"https://reqres.in/api/users/"}/${userId}`);
    }
}
