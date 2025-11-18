import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-event-location-picker',
  imports: [FormsModule],
  templateUrl: './event-location-picker.html',
  styleUrl: './event-location-picker.scss'
})
export class EventLocationPicker implements AfterViewInit {

   @Output() locationSelected = new EventEmitter<any>();

  map!: L.Map;
  marker!: L.Marker;
  searchQuery = '';
  searchResults: any[] = [];
  selectedLocation: any;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  initMap() {
    const INDIA_BOUNDS = L.latLngBounds(
      [6.4627, 68.1097],
      [35.5133, 97.3953]
    );

    this.map = L.map('map', {
      center: [20.5937, 78.9629],
      zoom: 5,
      maxBounds: INDIA_BOUNDS,
      maxBoundsViscosity: 0.8,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(this.map);

    // On click → place draggable marker + get address
    this.map.on('click', (e: any) => {
      this.updateMarker(e.latlng.lat, e.latlng.lng);
      this.reverseGeocode(e.latlng.lat, e.latlng.lng);
    });
  }

  updateMarker(lat: number, lng: number) {
    if (this.marker) this.marker.remove();

    this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);

    this.marker.on('dragend', () => {
      const pos = this.marker.getLatLng();
      this.reverseGeocode(pos.lat, pos.lng);
    });
  }

  /** 🔍 Search API (Nominatim) */
  onSearchChange(event: any) {
    const query = event.target.value;

    if (query.length < 3) {
      this.searchResults = [];
      return;
    }

    this.http
      .get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=in&limit=5`
      )
      .subscribe((res: any) => {
        this.searchResults = res;
      });
  }

  /** 📌 When search result is selected */
  selectSearchResult(result: any) {
    this.searchQuery = result.display_name;
    this.searchResults = [];

    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    this.map.setView([lat, lng], 15);
    this.updateMarker(lat, lng);

    this.selectedLocation = {
      lat,
      lng,
      address: result.display_name,
    };

    this.locationSelected.emit(this.selectedLocation);
  }

  /** 🔁 Reverse Geocoding → lat/lng → address */
  reverseGeocode(lat: number, lng: number) {
    this.http
      .get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      .subscribe((res: any) => {
        const address = res.display_name;

        this.selectedLocation = {
          lat,
          lng,
          address,
        };

        this.locationSelected.emit(this.selectedLocation);
      });
  }
}
