import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// NG-ZORRO
import { NzInputModule } from 'ng-zorro-antd/input';

/**
 * SearchBarComponent — Reusable Search Bar
 *
 * Sử dụng:
 *   <app-search-bar
 *     placeholder="Tìm kiếm nhân viên..."
 *     (searchQuery)="onSearch($event)">
 *   </app-search-bar>
 *
 * Kỹ thuật:
 *   - @Input() placeholder: Tuỳ chỉnh placeholder text
 *   - @Output() searchQuery: Emit giá trị sau debounceTime (300ms)
 *   - Dùng RxJS Subject + debounceTime + distinctUntilChanged
 *     để tránh gọi filter liên tục khi người dùng gõ nhanh
 */
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, NzInputModule],
  template: `
    <div class="search-bar-wrapper">
      <nz-input-group [nzPrefix]="prefixIcon" nzSize="large">
        <input
          nz-input
          [placeholder]="placeholder"
          [(ngModel)]="searchText"
          (ngModelChange)="onInputChange($event)"
        />
      </nz-input-group>

      <!-- Icon tìm kiếm dùng text thay vì NzIconModule -->
      <ng-template #prefixIcon>
        <span class="search-icon">🔍</span>
      </ng-template>
    </div>
  `,
  styles: [`
    .search-bar-wrapper {
      width: 100%;
      max-width: 400px;
    }

    .search-icon {
      font-size: 14px;
      margin-right: 4px;
    }

    /* Styling cho input bên trong nz-input-group */
    :host ::ng-deep .ant-input-affix-wrapper {
      border-radius: 10px;
      background: #f8f9fb;
      border: 1.5px solid #e5e7eb;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      padding: 6px 14px;
    }

    :host ::ng-deep .ant-input-affix-wrapper:hover {
      border-color: #6366f1;
      background: #fff;
    }

    :host ::ng-deep .ant-input-affix-wrapper-focused {
      border-color: #6366f1;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
    }

    :host ::ng-deep .ant-input {
      background: transparent;
      font-size: 14px;
    }

    :host ::ng-deep .ant-input-prefix {
      color: #9ca3af;
      margin-right: 8px;
      font-size: 16px;
    }
  `]
})
export class SearchBarComponent implements OnInit, OnDestroy {

  /**
   * @Input — Placeholder text cho ô tìm kiếm
   * Mặc định: 'Tìm kiếm...'
   */
  @Input() placeholder: string = 'Tìm kiếm...';

  /**
   * @Output — Emit giá trị tìm kiếm đã qua debounce
   * Parent component lắng nghe event này để thực hiện filter
   */
  @Output() searchQuery = new EventEmitter<string>();

  /** Giá trị text hiện tại trong input (two-way binding với ngModel) */
  searchText: string = '';

  /**
   * RxJS Subject — Nhận giá trị mỗi khi người dùng gõ
   * Kết hợp với debounceTime để tối ưu hiệu suất
   */
  private searchSubject = new Subject<string>();
  private subscription!: Subscription;

  ngOnInit(): void {
    // Pipe: debounceTime(300ms) → distinctUntilChanged → emit
    // - debounceTime: Đợi 300ms sau khi người dùng ngừng gõ mới emit
    // - distinctUntilChanged: Chỉ emit nếu giá trị thực sự thay đổi
    this.subscription = this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(query => {
        this.searchQuery.emit(query);
      });
  }

  /**
   * Gọi khi ngModel thay đổi (người dùng gõ)
   * Push giá trị mới vào Subject → qua pipeline debounce
   */
  onInputChange(value: string): void {
    this.searchSubject.next(value);
  }

  ngOnDestroy(): void {
    // Cleanup subscription để tránh memory leak
    this.subscription?.unsubscribe();
  }
}
