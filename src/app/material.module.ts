import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule, MatCardModule, MatInputModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatButtonModule, 
    MatCardModule,
    MatInputModule,
  ],
  exports: [
   CommonModule,
   BrowserAnimationsModule,
   MatButtonModule, 
   MatCardModule, 
   MatInputModule, 
   ]
})
export class CustomMaterialModule {}
