import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface Form {
  userName: string,
  address: {
    state: string,
    city: string,
  }
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  // forms: Form[] = [];
  players: string[] = [];
  
  form = this.fb.group({
    userName: ['', Validators.required],
    // address: this.fb.group({
    //   street: ['', Validators.required],
    //   city: ['', [Validators.required]],
    // })
  });

  constructor(private fb: FormBuilder, private router: Router) { }

  get userName(){
    return this.form.get('userName');
  }

  onSubmit() {
    if (this.form.valid) {
      // this.forms.push(this.form.value as Form);
      console.log(`%c ${this.form.status} `, 'background: yellow; color: black; font-size: 18px');
      this.form.reset();
      this.router.navigate(['game']);
    } else {
      console.log(`%c ${this.form.status} `, 'background: #222; color: lightgreen; font-size: 18px');
    }
  }
}
