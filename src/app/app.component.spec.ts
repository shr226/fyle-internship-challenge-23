import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService } from '../../services/api.service';
import { of } from 'rxjs';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let apiService: ApiService;

  beforeEach(async () => {
    const apiServiceMock = {
      searchUsers: jasmine.createSpy('searchUsers').and.returnValue(of({ items: [{ login: 'testuser' }] })),
      getRepositories: jasmine.createSpy('getRepositories').and.returnValue(of({ items: [], total_count: 0 }))
    };

    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [RouterTestingModule, FormsModule],
      providers: [
        { provide: ApiService, useValue: apiServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search users and fetch repositories', () => {
    component.username = 'testuser';
    component.searchUser();
    expect(apiService.searchUsers).toHaveBeenCalledWith('testuser');
    expect(apiService.getRepositories).toHaveBeenCalledWith('testuser', 1, 10);
  });

  it('should fetch repositories on changing page size', () => {
    component.username = 'testuser';
    component.pageSize = 20;
    component.changePageSize({ target: { value: '20' } } as any);
    expect(apiService.getRepositories).toHaveBeenCalledWith('testuser', 1, 20);
  });

  it('should fetch repositories on next page', () => {
    component.username = 'testuser';
    component.currentPage = 1;
    component.totalPages = 2;
    component.nextPage();
    expect(apiService.getRepositories).toHaveBeenCalledWith('testuser', 2, 10);
  });

  it('should fetch repositories on previous page', () => {
    component.username = 'testuser';
    component.currentPage = 2;
    component.prevPage();
    expect(apiService.getRepositories).toHaveBeenCalledWith('testuser', 1, 10);
  });
});
