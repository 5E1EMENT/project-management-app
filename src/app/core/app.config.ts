import { Injectable } from '@angular/core';

/**
 * Application configurations.
 */
@Injectable({
  providedIn: 'root',
})
export class AppConfig {
  /**
   * API URL.
   */
  public API_URL = 'https://canban-back.herokuapp.com/';
}
