import 'reflect-metadata';
import '../polyfills';

import { AppComponent } from './app.component';
import { AngularMaterialModule } from './angular-material-module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { HeaderComponent } from './components/main/header/header.component';
import { ErrorComponent } from './components/main/error/error.component';
import { BodyComponent } from './components/main/body/body.component';
import { BreadcrumbComponentComponent } from './components/main/breadcrumb-component/breadcrumb-component.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { AuthInterceptor } from './guards/token-interceptor';
import { MappoolOverviewComponent } from './components/mappool/mappool-overview/mappool-overview.component';
import { MappoolCreateComponent } from './components/mappool/mappool-create/mappool-create.component';
import { LoggedInGuard } from './guards/logged-in-guard';
import { AdministratorGuard } from './guards/administrator-guard';
import { TournamentOverviewComponent } from './components/tournament/tournament-overview/tournament-overview.component';
import { TournamentCreationComponent } from './components/tournament/tournament-creation/tournament-creation.component';
import { SearchPipe } from './pipes/search.pipe';
import { UserPickerComponent } from './components/tournament/user-picker/user-picker.component';
import { TournamentComponent } from './components/tournament/tournament/tournament.component';
import { TournamentViewComponent } from './components/tournament/tournament-view/tournament-view.component';
import { TournamentInterfaceComponent } from './components/tournament/tournament-interface/tournament-interface.component';
import { DeleteTournamentComponent } from './components/dialogs/delete-tournament/delete-tournament.component';
import { ModBracketComponent } from './components/mappool/template/mod-bracket/mod-bracket.component';
import { MappoolComponent } from './components/mappool/template/mappool/mappool.component';
import { DeleteMappoolComponent } from './components/dialogs/delete-mappool/delete-mappool.component';
import { SuggestAMapComponent } from './components/dialogs/suggest-a-map/suggest-a-map.component';
import { AlertComponent } from './components/main/alert/alert.component';
import { SuggestedMapsListComponent } from './components/suggested-maps/suggested-maps-list/suggested-maps-list.component';
import { DeleteSuggestedMapComponent } from './components/dialogs/delete-suggested-map/delete-suggested-map.component';
import { FilterSuggestedMapsPipe } from './pipes/filter-suggested-maps.pipe';
import { MappoolViewComponent } from './components/mappool/mappool-view/mappool-view.component';
import { FinalizedMappoolComponent } from './components/mappool/finalized-mappool/finalized-mappool.component';
import { MappoolCreationTemplateComponent } from './components/mappool/template/mappool-creation-template/mappool-creation-template.component';
import { MappoolEditComponent } from './components/mappool/mappool-edit/mappool-edit.component';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
	declarations: [
		AppComponent,

		HeaderComponent,
		ErrorComponent,
		BodyComponent,
		BreadcrumbComponentComponent,
		LoginComponent,
		RegisterComponent,
		MappoolOverviewComponent,
		MappoolCreateComponent,
		TournamentOverviewComponent,
		TournamentCreationComponent,
		SearchPipe,
		UserPickerComponent,
		TournamentComponent,
		TournamentViewComponent,
		TournamentInterfaceComponent,
		DeleteTournamentComponent,
		ModBracketComponent,
		MappoolComponent,
		DeleteMappoolComponent,
		SuggestAMapComponent,
		AlertComponent,
		SuggestedMapsListComponent,
		DeleteSuggestedMapComponent,
		FilterSuggestedMapsPipe,
		MappoolViewComponent,
		FinalizedMappoolComponent,
		MappoolCreationTemplateComponent,
		MappoolEditComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		AppRoutingModule,
		AngularMaterialModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		ColorPickerModule
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
		LoggedInGuard,
		AdministratorGuard
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
