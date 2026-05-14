import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { InitService } from '../modules/shared/services/init.service';

@Injectable({
  providedIn: 'root'
})
export class InitResolver implements Resolve<any> {

  constructor(private initService: InitService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {

    return this.initService.init();
  }
}