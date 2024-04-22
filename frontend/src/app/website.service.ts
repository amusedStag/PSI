import { Injectable } from '@angular/core';
import { MessageService } from "./message.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";
import {Website} from "./website";
import {WebsitePage} from "./websitepage";

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {

  private websitesUrl = 'http://localhost:3078/websites'; //replace with appserver url (http://appserver.alunos.di.fc.ul.pt:3078/websites)
  private websiteUrl = 'http://localhost:3078/website'; // replace with appserver url (http://appserver.alunos.di.fc.ul.pt:3078/website)

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private ms: MessageService, private http: HttpClient) { }

  getWebsites(): Observable<Website[]> {
    return this.http.get<Website[]>(this.websitesUrl)
      .pipe(
        tap(_ => this.log('fetched websites')),
        catchError(this.handleError<Website[]>('getWebsites', []))
      );
  }

  getWebsite(id: string | null): Observable<Website> {
    const url = this.websiteUrl + '/' + id;
    return this.http.get<Website>(url).pipe(
      tap(_ => this.log(`fetched website id=${id}`)),
      catchError(this.handleError<Website>(`getWebsite id=${id}`))
    );
  }

  updateWebsitePages(webpage: WebsitePage, website: Website | undefined): Observable<Website> {
    const url = this.websiteUrl + '/' + website?._id + '/addpage';
    return this.http.put<Website>(url, webpage, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated pages with webpage id=${webpage._id}`)),
        catchError(this.handleError<Website>('updateWebsitePages'))
      );
  }

  addWebsite(website: Website): Observable<any> {
    return this.http.post<Website>(this.websiteUrl, website, this.httpOptions).pipe(
      tap((newWebsite: Website) => this.log(`added website with id=${newWebsite._id}`)),
      catchError(this.handleError<Website>('addWebsite'))
    );
  }

  deleteWebsite(id: string): Observable<Website> {
    const url = this.websiteUrl + '/' + id;
    return this.http.delete<Website>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted website id=${id}`)),
      catchError(this.handleError<Website>('deleteWebsite'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    this.ms.add(`WebsiteService: ${message}`);
  }
}
