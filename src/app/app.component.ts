import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl, FormBuilder, Validators,NgForm, FormArray} from '@angular/forms';
import {forbiddenNameValidator,forbiddenNameValidation} from './shared/user-name.validator';
import {isPasswordMisMatch} from './shared/password.validator';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'reactive-forms';

  registrationForm: FormGroup | any;

  //formbuilder to create formgroup & formcontrol in shorter way. not much difference in syntax
  constructor(private formBuilder : FormBuilder, private registrationService:RegistrationService){
    this.registrationForm = this.formBuilder.group({
        //userName : ['',[Validators.required,Validators.minLength(3),forbiddenNameValidation]],//custom validation
        userName : ['',[Validators.required,Validators.minLength(3),forbiddenNameValidator(/password/),forbiddenNameValidation]],//custom validation
        email:[''],
        subscribe:[false],
        password : [''],
        confirmPassword :[''],
        address : this.formBuilder.group({
          city:[''],
          state:[''],
          pincode:['']
        }),
        alternateEmails:this.formBuilder.array([])
      },
      {
        validators:this.mismatch('password','confirmPassword')
      }
      );
  
      //conditional validation 
      this.registrationForm.get('subscribe').valueChanges
      .subscribe( (checkedValue:any) =>{
        const emailtemp = this.registrationForm.get('email');
        if(checkedValue){
          emailtemp.setValidators(Validators.required)
        }else{
          emailtemp.clearValidators();
        }
        emailtemp.updateValueAndValidity();
      })
  } 

  //cross field validation
  mismatch(password:string,confirmPassword:string){
    console.log('hi from mismatch');
    return (formgroup:FormGroup)=>{
      const controlPass = formgroup.controls[password];
      const controlConfirmPass = formgroup.controls[confirmPassword];
      if(controlConfirmPass.errors && !controlConfirmPass.errors?.['mismatch']){
        return
      }
      if(controlPass.value !== controlConfirmPass.value){
        controlConfirmPass.setErrors({'mismatch':true});
      }else{
        controlConfirmPass.setErrors(null);
      }
    }
  }

  get email(){
    return this.registrationForm.get('email');
  }
  
  get confirmPassword(){
    return this.registrationForm.controls.confirmPassword;
  }

  get userName(){
    return this.registrationForm.controls.userName;
  }

  get alternateEmails(){
    return this.registrationForm.get('alternateEmails') as FormArray;
  }

  addAlternateEmail(){
    this.alternateEmails.push(this.formBuilder.control(''));
  }

  onSubmit(){
    this.registrationService.register(this.registrationForm.value)
    .subscribe(
      response=>console.log('success '+response),
      error=>console.error('error '+error)
      
    )
  }

  loadApiData(){
    this.registrationForm.setValue({//setValue is strick & required all fields of object.
      userName : 'user',
      email:'',
      subscribe:false,
      password : 'test',
      confirmPassword : 'test',
      address : {
        city:'testcity',
        state:'state',
        pincode:'123456'
      },
      alternateEmails:[]
    });
  }

  //lets not load address field values, to partial value use pathValue method
  loadApiDataPartial(){
    this.registrationForm.patchValue({//for partial values
      userName : 'user',
      password : 'test',
      confirmPassword : 'test'
    });
  }
}
