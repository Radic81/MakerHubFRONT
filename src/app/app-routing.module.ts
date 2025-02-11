import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Charge le module calendrier en lazy loading
  { path: 'calendar', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule) },
  // Redirige la racine vers /calendar
  { path: '', redirectTo: '/calendar', pathMatch: 'full' },
  // Optionnel : redirige toute URL inconnue vers /calendar
  { path: '**', redirectTo: '/calendar' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
