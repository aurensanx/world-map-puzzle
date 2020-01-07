import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {MapPageRoutingModule} from './map-routing.module';

import {MapPage} from './map.page';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LeafletModule,
        HttpClientModule,
        MapPageRoutingModule
    ],
    declarations: [MapPage]
})
export class MapPageModule {
}
