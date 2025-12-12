import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { GalleryHorizontalComponent } from '../../shared/gallery-horizontal/gallery-horizontal.component';
import { GalleryTextHorizontalComponent } from '../../shared/gallery-text-horizontal/gallery-text-horizontal.component';
import { LineRevealComponent } from '../../shared/line-reveal/line-reveal.component';
import { ParagraphRevealComponent } from '../../shared/paragraph-reveal/paragraph-reveal.component';
import { CurtainRevealComponent } from '../../shared/curtain-reveal/curtain-reveal.component';
import { MUTATION_SEND_EMAIL, QUERY_CONTACT } from '../../queries/contact';
import { BaseComponentService } from '../../shared/services/base-component.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import ScrollReveal from 'scrollreveal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    LayoutComponent,
    HeaderComponent,
    NgIf,
    NgForOf,
    GalleryHorizontalComponent,
    GalleryTextHorizontalComponent,
    LineRevealComponent,
    ParagraphRevealComponent,
    FooterComponent,
    CurtainRevealComponent,
    ReactiveFormsModule,
    JsonPipe,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})

export class ContactComponent extends BaseComponentService implements OnInit {
  contactForm: FormGroup = new FormGroup<any>({
    type: new FormControl(null, Validators.required),
    name: new FormControl(null, Validators.required),
    company: new FormControl(null, Validators.required),
    position: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.email, Validators.required]),
    phone: new FormControl(null, Validators.required),
    hear: new FormControl(null, Validators.required),
    message: new FormControl(null, Validators.required),
  });
  contact: any;
  error: boolean | null = null;
  success: boolean | null = null;
  submitted: boolean | null = null;
  formValid : boolean;

  constructor(private readonly apollo: Apollo,
              router: Router,
              elementRef: ElementRef,
              renderer: Renderer2) {
    super(elementRef, renderer, router);
  }

  get formType() {
    return this.contactForm.get('type');
  }

  get formName() {
    return this.contactForm.get('name');
  }

  get formCompany() {
    return this.contactForm.get('company');
  }

  get formPosition() {
    return this.contactForm.get('position');
  }

  get formEmail() {
    return this.contactForm.get('email');
  }

  get formPhone() {
    return this.contactForm.get('phone');
  }

  get formHear() {
    return this.contactForm.get('hear');
  }

  get formMessage() {
    return this.contactForm.get('message');
  }

  ngAfterViewInit(): void {
    ScrollReveal().reveal('body', {
      interval: 200,
      duration: 1000,
      viewFactor: .1,
    });

  }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: gql`${QUERY_CONTACT}`
    }).valueChanges.subscribe((result: any) => {
      console.log("@==>", result.data.page);
      this.contact = result.data.page;
      this.contactForm.get('hear')?.setValue("");
    });
  }

  sendForm() {
    this.submitted = true;
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
    } else {
      const form = this.contactForm.getRawValue();
      console.log("@==>", form);
      this.apollo.mutate({
        mutation: gql`${MUTATION_SEND_EMAIL}`,
        variables: {
          email: form.email,
          message: `
          type: ${form.type},
          name: ${form.name},
          company: ${form.company},
          position: ${form.position},
          phone: ${form.phone},
          hear: ${form.hear},
          message: ${form.message},
        `,
          subject: "Contact page form submitted"
        }
      }).subscribe((response: any) => {
        console.log("@==>", response);
        if (response.data.sendEmail.sent) {
          this.success = true;
          console.log("@==>send");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          this.error = true;
          console.log("@==>error");
        }
      });
    }
  }

}
