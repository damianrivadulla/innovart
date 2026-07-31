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
import { SeoService } from '../../shared/services/seo.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    name: new FormControl(null),
    company: new FormControl(null),
    position: new FormControl(null),
    email: new FormControl(null, [Validators.email]),
    phone: new FormControl(null),
    hear: new FormControl(null),
    message: new FormControl(null),
    skills: new FormControl(null),
    collaborationDetails: new FormControl(null),
  });
  contact: any;
  error: boolean | null = null;
  success: boolean | null = null;
  submitted: boolean | null = null;
  formValid : boolean;
  selectedFormId: string = '';

  constructor(private readonly apollo: Apollo,
              private seoService: SeoService,
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

  get formSkills() {
    return this.contactForm.get('skills');
  }

  get formCollaborationDetails() {
    return this.contactForm.get('collaborationDetails');
  }

  get selectedType() {
    return this.contactForm.get('type')?.value;
  }

  getSelectedFormId(): string {
    if (!this.contact?.contactFields?.contactFormSubjectOptions) {
      return '';
    }
    const selectedOption = this.contact.contactFields.contactFormSubjectOptions.find(
      (item: any) => item.option === this.selectedType
    );
    return selectedOption?.formId || '';
  }

  isFieldRequired(fieldName: string): boolean {
    const formId = this.getSelectedFormId();
    
    switch (formId) {
      case 'job':
        return ['name', 'company', 'position', 'email', 'phone', 'hear', 'message'].includes(fieldName);
      case 'careers':
        return ['name', 'email', 'phone', 'skills'].includes(fieldName);
      case 'partnership':
        return ['company', 'name', 'position', 'email', 'phone', 'hear', 'collaborationDetails'].includes(fieldName);
      default:
        return false;
    }
  }

  shouldShowField(fieldName: string): boolean {
    const formId = this.getSelectedFormId();
    
    switch (formId) {
      case 'job':
        return ['name', 'company', 'position', 'email', 'phone', 'hear', 'message'].includes(fieldName);
      case 'careers':
        return ['name', 'email', 'phone', 'skills'].includes(fieldName);
      case 'partnership':
        return ['company', 'name', 'position', 'email', 'phone', 'hear', 'collaborationDetails'].includes(fieldName);
      default:
        return false;
    }
  }

  updateFormValidators(): void {
    const formId = this.getSelectedFormId();
    
    // Reset all validators first
    Object.keys(this.contactForm.controls).forEach(key => {
      if (key !== 'type') {
        this.contactForm.get(key)?.clearValidators();
        this.contactForm.get(key)?.updateValueAndValidity();
      }
    });

    // Set validators based on form type
    if (formId === 'job') {
      this.contactForm.get('name')?.setValidators([Validators.required]);
      this.contactForm.get('company')?.setValidators([Validators.required]);
      this.contactForm.get('position')?.setValidators([Validators.required]);
      this.contactForm.get('email')?.setValidators([Validators.required, Validators.email]);
      this.contactForm.get('phone')?.setValidators([Validators.required]);
      this.contactForm.get('hear')?.setValidators([Validators.required]);
      this.contactForm.get('message')?.setValidators([Validators.required]);
    } else if (formId === 'careers') {
      this.contactForm.get('name')?.setValidators([Validators.required]);
      this.contactForm.get('email')?.setValidators([Validators.required, Validators.email]);
      this.contactForm.get('phone')?.setValidators([Validators.required]);
      this.contactForm.get('message')?.setValidators([Validators.required]);
    } else if (formId === 'partnership') {
      this.contactForm.get('company')?.setValidators([Validators.required]);
      this.contactForm.get('name')?.setValidators([Validators.required]);
      this.contactForm.get('position')?.setValidators([Validators.required]);
      this.contactForm.get('email')?.setValidators([Validators.required, Validators.email]);
      this.contactForm.get('phone')?.setValidators([Validators.required]);
      this.contactForm.get('hear')?.setValidators([Validators.required]);
      this.contactForm.get('collaborationDetails')?.setValidators([Validators.required]);
    }

    // Update validity for all fields
    Object.keys(this.contactForm.controls).forEach(key => {
      if (key !== 'type') {
        this.contactForm.get(key)?.updateValueAndValidity();
      }
    });
  }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: gql`${QUERY_CONTACT}`
    }).valueChanges.subscribe((result: any) => {
      console.log("@==>", result.data.page);
      this.contact = result.data.page;
      this.seoService.applySeo(this.contact?.seo, this.contact?.title);
      // Seleccionar el primer radio button por defecto
      if (this.contact?.contactFields?.contactFormSubjectOptions && 
          this.contact.contactFields.contactFormSubjectOptions.length > 0) {
        const firstOption = this.contact.contactFields.contactFormSubjectOptions[0].option;
        this.contactForm.get('type')?.setValue(firstOption);
        this.updateFormValidators();
      }

      // Listen to type changes
      this.contactForm.get('type')?.valueChanges.subscribe(() => {
        // Clear all fields when type changes
        Object.keys(this.contactForm.controls).forEach(key => {
          if (key !== 'type') {
            this.contactForm.get(key)?.setValue(null);
          }
        });
        this.updateFormValidators();
      });
    });
  }

  sendForm() {
    this.submitted = true;
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
    } else {
      const form = this.contactForm.getRawValue();
      const formId = this.getSelectedFormId();
      console.log("@==>", form);
      
      // Build message based on form type
      let message = `type: ${form.type}\n`;
      
      if (formId === 'job') {
        message += `name: ${form.name}\ncompany: ${form.company}\nposition: ${form.position}\nphone: ${form.phone}\nhear: ${form.hear}\nmessage: ${form.message}`;
      } else if (formId === 'careers') {
        message += `name: ${form.name}\nphone: ${form.phone}\nskills: ${form.message}`;
      } else if (formId === 'partnership') {
        message += `company: ${form.company}\nname: ${form.name}\nposition: ${form.position}\nphone: ${form.phone}\nhear: ${form.hear}\ncollaborationDetails: ${form.collaborationDetails}`;
      }
      
      this.apollo.mutate({
        mutation: gql`${MUTATION_SEND_EMAIL}`,
        variables: {
          email: form.email,
          message: message,
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
