import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface UserData {
  login: string;
  bio: string;
  avatar_url: string;
  html_url: string;
  twitter_username: string;
  location: string;
  public_repos: number;
}

interface Repo {
  name: string;
  id: number;
  topics: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  getUser(username: string): Observable<UserData> {
    return this.httpClient.get<UserData>(`https://api.github.com/users/${username}`);
  }

  getRepos(username: string, page: number, perPage: number): Observable<Repo[]> {
    return this.httpClient.get<Repo[]>(`https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`);
  }
}


