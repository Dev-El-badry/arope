import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UIService } from './ui.services';
import { Observable } from 'rxjs';

@Injectable()
export class OdooService {

  constructor(private http: HttpClient, private uiService: UIService){ }
  call_odoo_function(dbName, user, pass, modelName, functionName, data): Observable<any>  {
    data = JSON.stringify(data);
    const nwData = {paramlist: data};
    const odooUrl = 'http://207.154.195.214:4000/call_method' + '/' + dbName + '/' +
     user + '/' + pass + '/' + modelName + '/' + functionName;
    return this.http.post(odooUrl, nwData)

  }
  

}
