import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
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
  private readonly formspreeUrl = 'https://formspree.io/f/xpqjvagn';

  isContactModalOpen: boolean = false;
  formData = {
    name: '',
    email: '',
    message: ''
  };
  isSubmitting: boolean = false;
  mensajeEnviado: boolean = false;
  errorEnvio: boolean = false;

  // La app no usa zone.js: los cambios que ocurren dentro de promesas o timers
  // necesitan actualizar la vista a mano.
  constructor(private cdr: ChangeDetectorRef) {}

  openContactModal(): void {
    this.isContactModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeContactModal(): void {
    this.isContactModalOpen = false;
    this.errorEnvio = false;
    document.body.style.overflow = 'auto';
    this.resetForm();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isContactModalOpen) {
      this.closeContactModal();
      this.cdr.detectChanges();
    }
  }

  submitForm(): void {
    if (this.isSubmitting) return;
    if (!(this.formData.name && this.formData.email && this.formData.message)) return;

    this.isSubmitting = true;
    this.errorEnvio = false;

    fetch(this.formspreeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: this.formData.name,
        email: this.formData.email,
        message: this.formData.message
      })
    })
      .then(respuesta => {
        // fetch no rechaza ante 4xx/5xx: hay que revisar el estado a mano
        if (!respuesta.ok) {
          throw new Error('Formspree respondió ' + respuesta.status);
        }
        this.closeContactModal();
        this.mensajeEnviado = true;
        setTimeout(() => {
          this.mensajeEnviado = false;
          this.cdr.detectChanges();
        }, 3500);
      })
      .catch(() => {
        this.errorEnvio = true;
      })
      .finally(() => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
      });
  }

  resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      message: ''
    };
  }
}
