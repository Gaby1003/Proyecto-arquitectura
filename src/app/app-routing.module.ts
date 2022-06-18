import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConverterComponent } from './components/converter/converter.component';

const routes: Routes = [
  //{path:'', redirectTo:'converter',pathMatch:'full'},
  {path:'converter', component: ConverterComponent},
  {path:'**', redirectTo:'converter',pathMatch:'full'} /* esto va al final */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
