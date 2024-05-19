
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user data', () => {
    const dummyUser = { login: 'testuser' };
    service.getUser('testuser').subscribe(user => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne('https://api.github.com/users/testuser');
    expect(req.request.method).toBe('GET');
    req.flush(dummyUser);
  });

  it('should fetch repositories', () => {
    const dummyRepos = { items: [], total_count: 0 };
    service.getRepositories('testuser', 1, 10).subscribe(repos => {
      expect(repos).toEqual(dummyRepos);
    });

    const req = httpMock.expectOne('https://api.github.com/search/repositories?q=user:testuser&page=1&per_page=10');
    expect(req.request.method).toBe('GET');
    req.flush(dummyRepos);
  });

  it('should cache responses', () => {
    const dummyRepos = { items: [], total_count: 0 };
    const cacheKey = 'testuser-1-10';

    service.getRepositories('testuser', 1, 10).subscribe(repos => {
      expect(repos).toEqual(dummyRepos);
    });

    const req = httpMock.expectOne('https://api.github.com/search/repositories?q=user:testuser&page=1&per_page=10');
    expect(req.request.method).toBe('GET');
    req.flush(dummyRepos);

    service.getRepositories('testuser', 1, 10).subscribe(repos => {
      expect(repos).toEqual(dummyRepos);
    });

    httpMock.expectNone('https://api.github.com/search/repositories?q=user:testuser&page=1&per_page=10');
  });
});

