import {Component} from '@angular/core';
import {ProgressSpinnerMode, MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSliderModule} from '@angular/material/slider';
import {FormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';

/**
 * @title Configurable progress spinner
 */
@Component({
  selector: 'app-loader',
  templateUrl: 'loader.Component.html',
  styleUrl: 'loader.Component.css',
  imports: [MatCardModule, MatRadioModule, FormsModule, MatSliderModule, MatProgressSpinnerModule],
})
export class LoaderComponent {
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
}
