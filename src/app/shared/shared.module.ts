import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedSortableDirective } from './directives/shared-sortable.directive';
import { ToastsComponent } from './components/toasts/toasts.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SharedSortableDirective, ToastsComponent],
  imports: [CommonModule, NgbToastModule],
  exports: [SharedSortableDirective, ToastsComponent],
})
export class SharedModule {}
