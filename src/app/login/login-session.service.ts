import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { LoginStatus } from '../shared/app-properties';

import { HttpService } from '../shared/http.service';
import { EnumService } from '../shared/enum.service';
import { connectionProperties, routeConstants } from '../shared/app-properties';

import { StatusService } from '../shared/status.service';
import { Observable } from 'rxjs';


/*
Name: LoginSessionService
Purpose: To maintain the identity of devotee logged in such as roles and other details
*/

@Injectable()
export class LoginSessionService implements OnInit {
    loginStatus: LoginStatus;
    userName: string;
    password: string;
    devoteeId: number;
    devoteeName: string;
    role: string;

    constructor(
        private httpService: HttpService,
        private router: Router,
        private statusService: StatusService,
        public enumService: EnumService,
    ) {}

    ngOnInit(): void {
        this.loginStatus = LoginStatus.loggedOut;
        this.devoteeId = 0;
    }

    login(username: string, password: string): Observable<any> {
        //Authentication Code
        const queryParams = {
            username
        };
        return Observable.create(observer => {
            this.httpService
                .get(connectionProperties.login, '', queryParams)
                .subscribe(res => {
                    let loginResponse = JSON.parse(res._body);
                    this.loginStatus = LoginStatus.loggedIn;
                    this.userName = username;
                    this.password = password;
                    this.devoteeId = loginResponse.data.devoteeId;
                    this.devoteeName = loginResponse.data.devoteeName;
                    this.role = loginResponse.data.role;

                    this.statusService.info("Welcome: " + this.devoteeName);
                    this.router.navigate([routeConstants.dashboard]);
                    this.enumService.loadEnums();
                    console.log(this.enumService.enums);
                    observer.next(res);
                    observer.complete();
                }, (err: HttpErrorResponse) => {
                    console.log(err);
                    this.loginStatus = LoginStatus.loggedOut;
                    this.userName = "";
                    this.password = "";
                    this.devoteeId = 0;
                    this.router.navigate([routeConstants.welcome]);
                    observer.error(err);
                    observer.complete();
            });
        });
    }

    logout(): void {
        this.loginStatus = LoginStatus.loggedOut;
        this.userName = "";
        this.password = "";
        this.devoteeId = 0;
        this.router.navigate([routeConstants.welcome]);
    }

    getDevoteeId(): number {
        return this.devoteeId;
    }

    getRole(): string {
        return this.role;
    }
}
