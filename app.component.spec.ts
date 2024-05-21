import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { AppComponent } from './AppComponent';
import { ApiService } from './services/api.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [ApiService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user data and repositories successfully', () => {
    const mockUser = {
      login: 'octocat',
      bio: 'A mysterious octocat',
      avatar_url: 'https://github.com/images/error/octocat_happy.gif',
      html_url: 'https://github.com/octocat',
      twitter_username: 'octocat',
      location: 'San Francisco',
      public_repos: 8
    };

    const mockRepos = [
      { name: 'repo1', id: 12345, topics: ['topic1', 'topic2'] },
      { name: 'repo2', id: 54321, topics: ['topic3', 'topic4'] }
    ];

    spyOn(apiService, 'getUser').and.returnValue(of(mockUser));
    spyOn(apiService, 'getRepos').and.returnValue(of(mockRepos));

    component.onSearch();

    expect(apiService.getUser).toHaveBeenCalled();
    expect(apiService.getRepos).toHaveBeenCalled();
    expect(component.userName).toEqual('octocat');
    expect(component.repos.length).toBe(2);
  });

  it('should handle user data fetch error', () => {
    spyOn(apiService, 'getUser').and.returnValue(throwError('User not found'));

    component.onSearch();

    expect(apiService.getUser).toHaveBeenCalled();
    expect(component.error).toEqual('User not found or API error.');
  });

  it('should handle repository fetch error', () => {
    const mockUser = {
      login: 'octocat',
      bio: 'A mysterious octocat',
      avatar_url: 'https://github.com/images/error/octocat_happy.gif',
      html_url: 'https://github.com/octocat',
      twitter_username: 'octocat',
      location: 'San Francisco',
      public_repos: 8
    };

    spyOn(apiService, 'getUser').and.returnValue(of(mockUser));
    spyOn(apiService, 'getRepos').and.returnValue(throwError('Failed to fetch repositories'));

    component.onSearch();

    expect(apiService.getUser).toHaveBeenCalled();
    expect(apiService.getRepos).toHaveBeenCalled();
    expect(component.error).toEqual('Failed to fetch repositories.');
  });
});
