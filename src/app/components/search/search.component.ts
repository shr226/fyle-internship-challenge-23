import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  username: string = '';
  user: any = null;
  similarUsers: any[] = [];
  repositories: any[] = [];
  loading: boolean = false;
  pageSize: number = 10;
  pageSizes: number[] = [10, 20, 30, 40, 50, 100];
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private apiService: ApiService) {}

  searchUser() {
    this.loading = true;
    this.apiService.getUser(this.username).subscribe(user => {
      this.user = user;
      this.apiService.getRepositories(this.username, this.currentPage, this.pageSize).subscribe(repos => {
        this.repositories = repos.items;
        this.totalPages = Math.ceil(repos.total_count / this.pageSize);
        this.loading = false;
      });
    }, error => {
      this.apiService.searchUsers(this.username).subscribe(response => {
        this.similarUsers = response.items;
        this.loading = false;
      }, err => {
        console.error(err);
        this.loading = false;
      });
    });
  }

  changePageSize(event: any) {
    this.pageSize = event.target.value;
    this.searchUser();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.searchUser();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.searchUser();
    }
  }
}
