import {LatLng, LatLngBounds} from 'leaflet';

export interface MyMap {
    id: string;
    title: string;
    fileName: string;
    idField: string;
    // zoom: number;
    minZoom: number;
    // center: LatLng;
    mapBounds: LatLngBounds;
}


export const maps: MyMap[] = [
    {
        id: 'spain',
        title: 'España',
        fileName: 'spain-simplified',
        idField: 'nameunit',
        // zoom: 4.5,
        minZoom: 4,
        // center: latLng(39.616775, -2.703790),
        mapBounds: new LatLngBounds(new LatLng(27, 10), new LatLng(45, -20)),
    },
    {
        id: 'usa',
        title: 'USA',
        fileName: 'usa',
        idField: 'NAME',
        // zoom: 4.5,
        minZoom: 2,
        // center: latLng(39.616775, -2.703790),
        mapBounds: new LatLngBounds(new LatLng(16, -55), new LatLng(65, -145)),
    },
    // {title: 'United States', fileName: 'usa', idField: 'name', zoom: 4, minZoom: 3},
    {
        id: 'world',
        title: 'World',
        fileName: 'world',
        idField: 'ADMIN',
        // zoom: 3,
        minZoom: 2,
        // center: latLng(41.65606, -0.87734),
        mapBounds: new LatLngBounds(new LatLng(-90, 225), new LatLng(90, -225))
    },
];
