import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { TobuyStoreService } from './services/tobuy-store.service';
import {
	AppComponent,
	TobuyListComponent,
	TobuyFooterComponent,
	TobuyHeaderComponent,
	TobuyItemComponent
} from './components';
import { TrimPipe } from './pipes';
import { routes } from './routes';

@NgModule({
	bootstrap: [AppComponent],
	declarations: [
		AppComponent,
		TobuyListComponent,
		TobuyFooterComponent,
		TobuyHeaderComponent,
		TobuyItemComponent,
		TrimPipe
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		RouterModule.forRoot(routes, {
			useHash: true
		})
	],
	providers: [
		TobuyStoreService
	]
})
export class MainModule {}
