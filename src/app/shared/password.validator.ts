import { AbstractControl } from "@angular/forms";


export function isPasswordMisMatch(control:AbstractControl) : {[key:string] : any} | null{
    console.log('hi from password mismatch');
    const password = control.get('password');
    const confirmPass = control.get('confirmPassword');
    

    if(password && confirmPass && password.value !== confirmPass.value ){
        return {'mismatch':true};
    }else{
        return null;
    }
}