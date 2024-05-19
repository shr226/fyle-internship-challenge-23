
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  username: string = '';
  repositories: any[] = [];
  similarUsers: any[] = [];
  loading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  pageSizes: number[] = [10, 20, 30, 40, 50, 100];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}

  searchUser(): void {
    this.loading = true;
    this.apiService.searchUsers(this.username).subscribe((data: any) => {
      if (data.items.length === 1) {
        this.username = data.items[0].login;
        this.fetchRepositories();
      } else {
        this.similarUsers = data.items;
        this.loading = false;
      }
    });
  }

  fetchRepositories(): void {
    this.apiService.getRepositories(this.username, this.currentPage, this.pageSize).subscribe((data: any) => {
      this.repositories = data.items;
      this.totalPages = Math.ceil(data.total_count / this.pageSize);
      this.loading = false;
    });
  }

  changePageSize(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.pageSize = Number(target.value);
    this.currentPage = 1;
    this.fetchRepositories();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchRepositories();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchRepositories();
    }
  }
}
