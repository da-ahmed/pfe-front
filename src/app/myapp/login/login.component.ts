import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import {TokenStorageService} from '../_services/token-storage.service';
import {AuthService} from '../_services/auth.service';
import {Router} from '@angular/router';

@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
})
export class LoginComponent implements OnInit
{
    form: any = {};
    isLoggedIn = false;
    isLoginFailed = false;
    errorMessage = '';
    roles: string[] = [];
    loginForm: FormGroup;
    lognotok: boolean = false ;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private authService: AuthService,
        private tokenStorage: TokenStorageService,
        private router: Router


    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
        this.lognotok = false;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        if (this.tokenStorage.getToken()) {
            this.isLoggedIn = true;
            this.roles = this.tokenStorage.getUser().roles;
        }
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        console.log('a');
        console.log(this.form.username);
        console.log(this.form.password);
        this.authService.login(this.form).subscribe(
            data => {
                this.tokenStorage.saveToken(data.accessToken);
                this.tokenStorage.saveUser(data);


                this.roles = this.tokenStorage.getUser().roles;
                this.router.navigate(['/apps/calendar']);

            },
            err => {
                this.errorMessage = err.error.message;
                this.tokenStorage.signOut();
                this.lognotok = true ;
            }
        );
    }


}
