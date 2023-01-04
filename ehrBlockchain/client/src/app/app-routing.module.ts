import { HistoryDetailComponent } from './history-detail/history-detail.component';
import { HomepageComponent } from './homepage/homepage.component';
import { DoctorRegistrationComponent } from './doctor-registration/doctor-registration.component';
import { HistoryComponent } from './history/history.component';
import { PatientConsentComponent } from './patient-consent/patient-consent.component';
import { PatientOnboardingComponent } from './patient-onboarding/patient-onboarding.component';
import { PatientHomeComponent } from './patient-home/patient-home.component';
import { DoctorHomeComponent } from './doctor-home/doctor-home.component';
import { PatientLoginComponent } from './patient-login/patient-login.component';
import { DoctorLoginComponent } from './doctor-login/doctor-login.component';
import { DoctorOptionComponent} from './doctor-option/doctor-option.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { PatientChoiceComponent } from './patient-choice/patient-choice.component';
import { AuthGuardLoginService } from './services/auth-guard-login.service';
import { PatientAuthGuardService } from './services/patient-auth-guard.service';
import { PatientAuthGuardLoginService } from './services/patient-auth-guard-login.service';
import { ArCompComponent } from './ar-comp/ar-comp.component';
import { ClientArComponent } from './client-ar/client-ar.component';
import { DoctorChatComponent } from './doctor-chat/doctor-chat.component';
import { ChooseChatComponent } from './choose-chat/choose-chat.component';
import { ChoosePatientChatComponent } from './choose-patient-chat/choose-patient-chat.component';
import { PatientChatComponent } from './patient-chat/patient-chat.component';

const routes: Routes = [
  { path : "doctorLogin", component : DoctorLoginComponent, canActivate : [AuthGuardLoginService] },
  { path : "patientChoice", component : PatientChoiceComponent, canActivate: [PatientAuthGuardLoginService] },
  { path : "homepage", component : HomepageComponent },
  { path : "arPage", component : ArCompComponent },
  { path : "qrPage", component : ClientArComponent },
  { path : "chooseChat", component : ChooseChatComponent },
  { path : "chooseDoctor", component : ChoosePatientChatComponent },
  { path : "doctorChat/:patientId", component : DoctorChatComponent },
  { path : "patientChat/:doctorId", component : PatientChatComponent },
  { path : "doctorRegistration", component : DoctorRegistrationComponent},
  { path : "patientLogin", component : PatientLoginComponent, canActivate: [PatientAuthGuardLoginService] },
  { path : "doctorHome/:doctorId", component : DoctorHomeComponent, canActivate : [AuthGuardService] },
  { path : "patientHome/:patientId", component : PatientHomeComponent, canActivate: [PatientAuthGuardService] },
  { path : "patientOnboarding", component : PatientOnboardingComponent, canActivate : [AuthGuardService] },
  { path : "patientConsent/:patientId", component : PatientConsentComponent, canActivate : [AuthGuardService] },
  { path : "patientConsent", component : PatientConsentComponent, canActivate : [AuthGuardService] },
  { path : "doctorOption/:doctorId/:patientId", component : DoctorOptionComponent, canActivate : [AuthGuardService] },
  { path: "history", component : HistoryComponent, canActivate : [AuthGuardService]},
  { path : "historyDetail/:recordNumber", component: HistoryDetailComponent, canActivate : [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
