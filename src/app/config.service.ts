import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  // public to be accessible in the html view
  public appVersion: string = String('V1.0');

  constructor() { }

}