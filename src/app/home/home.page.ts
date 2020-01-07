import {Component, OnInit} from '@angular/core';
import {maps, MyMap} from '../maps';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    title = 'Home';
    maps: MyMap[] = maps;

    constructor() {
    }

    ngOnInit() {
    }
}
