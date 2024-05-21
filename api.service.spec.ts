import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user data', () => {
    const dummyUser = {
      login: 'octocat',
      bio: 'A mysterious octocat',
      avatar_url: 'https://github.com/images/error/octocat_happy.gif',
      html_url: 'https://github.com/octocat',
      twitter_username: 'octocat',
      location: 'San Francisco',
      public_repos: 8
    };

    service.getUser('octocat').subscribe(user => {
      expect(user.login).toEqual('octocat');
    });

    const req = httpMock.expectOne(`https://api.github.com/users/octocat`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUser);
  });

  it('should fetch user repositories', () => {
    const dummyRepos = [
      { name: 'repo1', id: 12345, topics: ['topic1', 'topic2'] },
      { name: 'repo2', id: 54321, topics: ['topic3', 'topic4'] }
    ];

    service.getRepos('octocat', 1, 10).subscribe(repos => {
      expect(repos.length).toBe(2);
      expect(repos).toEqual(dummyRepos);
    });

    const req = httpMock.expectOne(`https://api.github.com/users/octocat/repos?page=1&per_page=10`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyRepos);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
