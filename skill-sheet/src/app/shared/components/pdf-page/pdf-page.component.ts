import { Component, ElementRef, ViewChild } from '@angular/core';
import { elements } from 'chart.js';

@Component({
  selector: 'app-pdf-page',
  imports: [],
  templateUrl: './pdf-page.component.html',
  styleUrl: './pdf-page.component.scss'
})
export class PdfPageComponent {
  @ViewChild('contentDiv') contentDiv!:HTMLDivElement;


  giveRef()  {
    console.log('HTML Content:', this.contentDiv);
    return this.contentDiv?.innerHTML;
  }
}
