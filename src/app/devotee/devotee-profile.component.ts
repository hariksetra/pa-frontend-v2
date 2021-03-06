import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, UrlSegment } from '@angular/router';
import { NgbDateStruct, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

import { Devotee } from '../model/devotee.model';
import { routeConstants, statusType, connectionProperties } from '../shared/app-properties';

import { HttpService } from '../shared/http.service';
import { StatusService } from '../shared/status.service';
import { EnumService } from '../shared/enum.service';
import { LoginSessionService } from '../login/login-session.service';

@Component({
    selector: 'devotee-profile',
    templateUrl: './devotee-profile.component.html',
})

export class DevoteeProfileComponent implements OnInit {
    devotee: Devotee;
    resetDevotee: Devotee;
    datePicker: NgbDateStruct;
    disableSpiritualInfoEdit: boolean;

    displayDob: string;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private httpService: HttpService,
        private modalService: NgbModal,
        private statusService: StatusService,
        public enumService: EnumService,
        public location: Location,
        public loginService: LoginSessionService
    ) {}

    ngOnInit() {
        this.devotee = new Devotee();
        this.resetDevotee = new Devotee();
        this.disableSpiritualInfoEdit = false;

        let devoteeId;
        if (this.location.path().split('/').indexOf(routeConstants.editProfile) > -1) {
            devoteeId = this.loginService.devoteeId;
            this.disableSpiritualInfoEdit = true;
        } else {
            devoteeId = this.activatedRoute.snapshot.paramMap.get('devoteeId')
        }

        if (devoteeId) {
            this.httpService.getData(connectionProperties.devotees, "/" + devoteeId)
            .subscribe(devotee => {
                this.devotee = devotee as Devotee;
                this.resetDevotee = devotee as Devotee;
                if (this.devotee.dob) {
                    this.devotee.dob = new Date(this.devotee.dob);
                    this.datePicker = { 
                        year: this.devotee.dob.getFullYear(),
                        month: this.devotee.dob.getMonth()+1,
                        day: this.devotee.dob.getDate(),
                    };
                }
            }, err => {
                //Route to a different Page
            });
        }

        // this.activatedRoute.params.subscribe((params: Params) => {
        //     console.log("Params");
        //     console.log(params);
        // });
    }

    onDateChange() {
        this.devotee.dob = new Date(this.datePicker.year + "-" + this.datePicker.month + "-" + this.datePicker.day);
        console.log(this.devotee.dob); 
    }

    onUpdateClick() {
        if (this.datePicker != undefined) {
            this.devotee.dob = new Date(this.datePicker.year + "-" + this.datePicker.month + "-" + this.datePicker.day);
        }
        
        this.httpService.putAndReturnData(connectionProperties.devotees,"/" + this.devotee.id, this.devotee)
        .subscribe(devotee => {
            this.onBackClick();
        }, err => {
            this.statusService.error("Error updating devotee");
        });
    }

    onResetClick() {
        this.devotee = this.resetDevotee;
        if (this.devotee.dob) {
            this.devotee.dob = new Date(this.devotee.dob);
            this.datePicker = { 
                year: this.devotee.dob.getFullYear(),
                month: this.devotee.dob.getMonth()+1,
                day: this.devotee.dob.getDate(),
            };
        } else {
            document.getElementById("dobInput")["value"] = "";
        }
    }

    onBackClick() {
        let programId: number;
        this.activatedRoute.params.subscribe(params => {
            programId = +params[routeConstants.paramsProgramId];
            if(this.router.routerState.snapshot.url.startsWith(routeConstants.followup,1)) {
                this.router.navigate(['../../../', routeConstants.followupProgram, programId], {relativeTo: this.activatedRoute, queryParams: {id: this.devotee.id} });    
            } else if (this.router.routerState.snapshot.url.startsWith(routeConstants.myPrograms + '/' + routeConstants.addParticipants, 1)) {
                this.router.navigate(['../../../', programId], {relativeTo: this.activatedRoute, queryParams: {id: this.devotee.id} });
            } else if (this.router.routerState.snapshot.url.startsWith(routeConstants.user + '/' + routeConstants.editProfile )) {
                this.router.navigate(['../../']);
            } else {
                this.router.navigate(['../../'], {relativeTo: this.activatedRoute, queryParams: {id: this.devotee.id} });
            }    
        });
    }

    //Modal trigger
    onUpdateDatesClick(content) {
        this.modalService.open(content).result.then((result) => {
          if (result == "ok") {
            //Navigate to important dates page
          }
        });
      }
}
