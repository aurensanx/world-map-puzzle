import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {geoJSON, GeoJSON, Map, MapOptions} from 'leaflet';
import {Subscription, timer} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import * as moment from 'moment';
import * as _ from 'lodash';
import {ActivatedRoute} from '@angular/router';
import {maps, MyMap} from '../maps';

interface Score {
    rightGuesses: number;
    wrongGuesses: number;
    totalAreas: number;
}

@Component({
    selector: 'app-map',
    templateUrl: './map.page.html',
    styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {

    title = 'World Map Puzzle';
    map: MyMap;
    maps: MyMap[] = maps;
    options: MapOptions;

    pendingAreas: GeoJSON.Feature[] = [];
    currentArea: any;
    score: Score = {
        rightGuesses: 0,
        wrongGuesses: 0,
        totalAreas: undefined,
    };

    timerSubscription: Subscription;
    timerSeconds: string;

    wrongGuessesMapping: { [k: string]: string } = {'=0': '0 fallos', '=1': '1 fallo', other: '# fallos'};

    // options = {
    //     // zoom: 3,
    //     // minZoom: 2,
    //     attributionControl: false,
    //     center: latLng(41.65606, -0.87734),
    //     maxBounds: new LatLngBounds(new LatLng(-90, 225), new LatLng(90, -225)),
    //     maxBoundsViscosity: 1,
    //     zoomSnap: 0,
    // };

    constructor(private http: HttpClient, private ngZone: NgZone, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        const paramMap = this.activatedRoute.snapshot.paramMap.get('map');
        this.map = _.find(this.maps, ['id', paramMap]);
        this.options = {
            // zoom: this.map.zoom,
            minZoom: this.map.minZoom,
            attributionControl: false,
            // center: this.map.center,
            maxBounds: this.map.mapBounds,
            maxBoundsViscosity: 1,
            zoomSnap: 0,
        };
    }

    ngOnDestroy() {
        this.timerSubscription.unsubscribe();
    }

    onMapReady(map: Map) {

        const whenClicked = (e, feature: GeoJSON.Feature, layer) => {
            this.ngZone.run(() => {
                if (_.indexOf(_.map(this.pendingAreas, this.map.idField), feature.properties[this.map.idField]) > -1) {
                    if (feature.properties[this.map.idField] === this.currentArea[this.map.idField]) {
                        this.onRightGuess(layer, this.currentArea[this.map.idField]);
                    } else {
                        this.onWrongGuess(layer);
                    }
                    this.getRandomArea();
                }
            });

        };

        const onEachFeature = (feature, layer) => {
            layer.on({
                click: e => whenClicked(e, feature, layer)
            });
        };


        this.http.get(`assets/${this.map.fileName}.geojson`).subscribe((json: GeoJSON.FeatureCollection) => {
            geoJSON(json, {
                onEachFeature,
                style: {
                    color: 'white',
                    weight: 0.5,
                },
            }).addTo(map);

            map.fitBounds(this.map.mapBounds);

            json.features.forEach((f: any) => {
                this.pendingAreas.push(f.properties);
            });
            this.score.totalAreas = this.pendingAreas.length;
            this.getRandomArea();

            const source = timer(0, 1000);
            this.timerSubscription = source.subscribe(s => this.timerSeconds = moment().startOf('day').add(s, 'seconds').format('mm:ss'));

        });

    }

    getRandomArea: () => void = () => {
        this.currentArea = this.pendingAreas[Math.floor(Math.random() * (this.pendingAreas.length))];
        if (!this.currentArea) {
            this.timerSubscription.unsubscribe();
        }
    };

    onRightGuess = (layer, id: string) => {
        // layer.getContainer().className += ' correct';
        layer.setStyle({fillColor: 'green', fillOpacity: 0.7, cursor: 'none'});
        _.remove(this.pendingAreas, [this.map.idField, id]);
        this.score.rightGuesses++;
    };

    onWrongGuess = (layer) => {
        layer.setStyle({fillColor: 'red', fillOpacity: 0.7});
        setTimeout(() => {
            layer.setStyle({fillColor: 'white', fillOpacity: 0.2});
        }, 1000);
        this.score.wrongGuesses++;

    };
}
