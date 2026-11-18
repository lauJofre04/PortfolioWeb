import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  isContactModalOpen: boolean = false;
  formData = {
    name: '',
    email: '',
    message: ''
  };
  isSubmitting: boolean = false;
  mensajeEnviado: boolean = false;

  openContactModal(): void {
    this.isContactModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeContactModal(): void {
    this.isContactModalOpen = false;
    document.body.style.overflow = 'auto';
    this.resetForm();
  }

  submitForm(): void {
    if (this.formData.name && this.formData.email && this.formData.message) {
      this.isSubmitting = true;
      
      // Simular envío del formulario a formspree
      fetch('https://formspree.io/f/xpqjvagn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.formData.name,
          email: this.formData.email,
          message: this.formData.message
        })
      }).then(() => {
        this.closeContactModal();
        this.isSubmitting = false;
        this.mensajeEnviado = true;
        setTimeout(() => (this.mensajeEnviado = false), 3500);
      }).catch(error => {
        this.isSubmitting = false;
      });
    }
  }

  resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      message: ''
    };
  }
}
