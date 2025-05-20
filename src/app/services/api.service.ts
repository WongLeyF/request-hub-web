import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtService } from './jwt.service';


const URL = "http://localhost:8099/api";

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  public readonly URL = URL;

  headersFile = new HttpHeaders({});

  constructor(private http: HttpClient, private jwtService: JwtService) {}

  // set bearer token in header
  setToken() {
    const token = this.jwtService.getToken();
    if (token) {
      this.headers = this.headers.set('Authorization', `Bearer ${token}`);
    }
  }

//   get header for file upload return HttpHeaders
    getHeaderFile() {
        const token = this.jwtService.getToken();
        if (token) {
            this.headersFile = this.headersFile.set('Authorization', `Bearer ${token}`);
        }
        return this.headersFile;
    }

  get(endpoint: string, params?: any): Observable<any> {
    this.setToken();
    const options: any = { headers: this.headers };

    if (params) {
      let paramsLocal = new HttpParams();
      Object.keys(params).forEach((k) => {
        if (params[k] instanceof Array) {
          params[k].forEach((item: any) => {
            paramsLocal = paramsLocal.append(`${k.toString()}[]`, item);
          });
        } else {
          paramsLocal = paramsLocal.append(k, params[k]);
        }
      });

      // tslint:disable-next-line:no-string-literal
      options['params'] = paramsLocal;
    }

    return this.http.get(URL + '/' + endpoint, options);
  }

  getStream(endpoint: string): Observable<any> {
    this.setToken();
    return this.http.get(URL + '/' + endpoint, {
      headers: this.headers,
      responseType: 'blob',
    });
  }

  post(endpoint: string, body: any): Observable<any> {
    this.setToken();
    const options = { headers: this.headers };
    return this.http.post(URL + '/' + endpoint, body, options);
  }

  put(endpoint: string, body: any): Observable<any> {
    this.setToken();
    const options = { headers: this.headers };
    return this.http.put(URL + '/' + endpoint, body, options);
  }

  putFile(endpoint: string, body: any): Observable<any> {
    this.setToken();
    const options = { headers: this.headersFile };
    return this.http.put(URL + '/' + endpoint, body, options);
  }

  delete(endpoint: string): Observable<any> {
    this.setToken();
    const options = { headers: this.headers };
    return this.http.delete(URL + '/' + endpoint, options);
  }
}
