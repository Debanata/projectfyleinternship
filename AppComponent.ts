import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Fyle Frontend Challenge';
  userName?: string;
  bio?: string;
  avatarUrl?: string;
  htmlUrl?: string;
  twitterUsername?: string;
  location?: string;
  publicRepos?: number;
  loading = false;
  error?: string;
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  repos: Repo[] = [];

  constructor(public apiService: ApiService) {}

  ngOnInit() {}

  onSearch() {
    this.loading = true;
    this.error = undefined;
    this.repos = [];
    
    this.apiService.getUser(this.searchTerm).subscribe(userData => {
      this.userName = userData.login;
      this.bio = userData.bio;
      this.avatarUrl = userData.avatar_url;
      this.htmlUrl = userData.html_url;
      this.twitterUsername = userData.twitter_username;
      this.location = userData.location;
      this.publicRepos = userData.public_repos;
      this.loading = false;
    }, error => {
      this.error = 'User not found or API error.';
      this.loading = false;
    });

    this.apiService.getRepos(this.searchTerm, this.currentPage, this.pageSize).subscribe(repos => {
      this.repos = repos;
    }, error => {
      this.error = 'Failed to fetch repositories.';
      this.loading = false;
    });
  }

  onPageSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.onSearch();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.onSearch();
  }
}



