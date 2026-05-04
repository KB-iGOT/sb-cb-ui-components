import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class OrderByNamePipe {
    transform(value, property = 'name') {
        if (!Array.isArray(value)) {
            return value;
        }
        return value.slice().sort((a, b) => {
            const nameA = a[property]?.toLowerCase();
            const nameB = b[property]?.toLowerCase();
            return nameA.localeCompare(nameB);
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: OrderByNamePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: OrderByNamePipe, name: "orderByName" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: OrderByNamePipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'orderByName'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXItYnktbmFtZS5waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbGlicmFyeS9zdW5iaXJkLWNiL2NicC1haS9zcmMvbGliL21vZHVsZXMvc2hhcmVkL3BpcGVzL29yZGVyLWJ5LW5hbWUucGlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFpQixNQUFNLGVBQWUsQ0FBQzs7QUFLcEQsTUFBTSxPQUFPLGVBQWU7SUFDMUIsU0FBUyxDQUFDLEtBQVksRUFBRSxXQUFtQixNQUFNO1FBRS9DLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3pCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDakMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDO1lBQ3pDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQztZQUN6QyxPQUFPLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOytHQVhVLGVBQWU7NkdBQWYsZUFBZTs7NEZBQWYsZUFBZTtrQkFIM0IsSUFBSTttQkFBQztvQkFDSixJQUFJLEVBQUUsYUFBYTtpQkFDcEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBQaXBlKHtcbiAgbmFtZTogJ29yZGVyQnlOYW1lJ1xufSlcbmV4cG9ydCBjbGFzcyBPcmRlckJ5TmFtZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgdHJhbnNmb3JtKHZhbHVlOiBhbnlbXSwgcHJvcGVydHk6IHN0cmluZyA9ICduYW1lJyk6IGFueVtdIHtcbiAgICBcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZS5zbGljZSgpLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGNvbnN0IG5hbWVBID0gYVtwcm9wZXJ0eV0/LnRvTG93ZXJDYXNlKCk7XG4gICAgICBjb25zdCBuYW1lQiA9IGJbcHJvcGVydHldPy50b0xvd2VyQ2FzZSgpO1xuICAgICAgcmV0dXJuIG5hbWVBLmxvY2FsZUNvbXBhcmUobmFtZUIpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=