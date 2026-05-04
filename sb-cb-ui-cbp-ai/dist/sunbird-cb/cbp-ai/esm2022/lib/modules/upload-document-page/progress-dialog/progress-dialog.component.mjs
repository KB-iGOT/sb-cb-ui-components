import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as i0 from "@angular/core";
export class ProgressDialogComponent {
    constructor(data) {
        this.data = data;
        console.log('data--', data);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ProgressDialogComponent, deps: [{ token: MAT_DIALOG_DATA }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: ProgressDialogComponent, selector: "app-progress-dialog", ngImport: i0, template: `
    <div class="progress-container">
      <h3>Processing Summaries</h3>
      <p>{{ data.message }}</p>
      <p>Please wait , it will take few minutes to complete</p>
      <div class="progress-container">
        <!-- Circular Spinner -->
        <div class="spinner"></div>

        <!-- Linear Progress Bar -->
        <div class="linear-progress">
          <div class="bar"></div>
        </div>

       
      </div>
    </div>
  `, isInline: true, styles: [".progress-container{padding:20px;width:auto;text-align:center}mat-progress-bar{margin-top:20px}.spinner{width:64px;height:64px;border-radius:50%;border:6px solid #e8e6ff;border-top-color:#5b5bf0;border-right-color:#8b7cf7;animation:spin 1.2s linear infinite;margin:0 auto 28px}@keyframes spin{to{transform:rotate(360deg)}}.linear-progress{position:relative;width:100%;height:8px;background:#e8e6ff;border-radius:4px;overflow:hidden;margin-bottom:24px}.linear-progress .bar{position:absolute;height:100%;width:40%;background:linear-gradient(90deg,#b8b1ff,#5b5bf0,#b8b1ff);animation:indeterminate 1.6s infinite ease-in-out}@keyframes indeterminate{0%{left:-40%}to{left:100%}}.label strong{font-size:18px;color:#2f2f44}.label p{margin-top:4px;font-size:14px;color:#6b6b8a}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ProgressDialogComponent, decorators: [{
            type: Component,
            args: [{ selector: 'app-progress-dialog', template: `
    <div class="progress-container">
      <h3>Processing Summaries</h3>
      <p>{{ data.message }}</p>
      <p>Please wait , it will take few minutes to complete</p>
      <div class="progress-container">
        <!-- Circular Spinner -->
        <div class="spinner"></div>

        <!-- Linear Progress Bar -->
        <div class="linear-progress">
          <div class="bar"></div>
        </div>

       
      </div>
    </div>
  `, styles: [".progress-container{padding:20px;width:auto;text-align:center}mat-progress-bar{margin-top:20px}.spinner{width:64px;height:64px;border-radius:50%;border:6px solid #e8e6ff;border-top-color:#5b5bf0;border-right-color:#8b7cf7;animation:spin 1.2s linear infinite;margin:0 auto 28px}@keyframes spin{to{transform:rotate(360deg)}}.linear-progress{position:relative;width:100%;height:8px;background:#e8e6ff;border-radius:4px;overflow:hidden;margin-bottom:24px}.linear-progress .bar{position:absolute;height:100%;width:40%;background:linear-gradient(90deg,#b8b1ff,#5b5bf0,#b8b1ff);animation:indeterminate 1.6s infinite ease-in-out}@keyframes indeterminate{0%{left:-40%}to{left:100%}}.label strong{font-size:18px;color:#2f2f44}.label p{margin-top:4px;font-size:14px;color:#6b6b8a}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DIALOG_DATA]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3MtZGlhbG9nLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2xpYnJhcnkvc3VuYmlyZC1jYi9jYnAtYWkvc3JjL2xpYi9tb2R1bGVzL3VwbG9hZC1kb2N1bWVudC1wYWdlL3Byb2dyZXNzLWRpYWxvZy9wcm9ncmVzcy1kaWFsb2cuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2xELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQzs7QUF3RzNELE1BQU0sT0FBTyx1QkFBdUI7SUFDbEMsWUFBNEMsSUFBMkM7UUFBM0MsU0FBSSxHQUFKLElBQUksQ0FBdUM7UUFDckYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDN0IsQ0FBQzsrR0FIVSx1QkFBdUIsa0JBQ2QsZUFBZTttR0FEeEIsdUJBQXVCLDJEQXBHeEI7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJUOzs0RkFtRlUsdUJBQXVCO2tCQXRHbkMsU0FBUzsrQkFDRSxxQkFBcUIsWUFDckI7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJUOzswQkFvRlksTUFBTTsyQkFBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE1BVF9ESUFMT0dfREFUQSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1wcm9ncmVzcy1kaWFsb2cnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jb250YWluZXJcIj5cbiAgICAgIDxoMz5Qcm9jZXNzaW5nIFN1bW1hcmllczwvaDM+XG4gICAgICA8cD57eyBkYXRhLm1lc3NhZ2UgfX08L3A+XG4gICAgICA8cD5QbGVhc2Ugd2FpdCAsIGl0IHdpbGwgdGFrZSBmZXcgbWludXRlcyB0byBjb21wbGV0ZTwvcD5cbiAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1jb250YWluZXJcIj5cbiAgICAgICAgPCEtLSBDaXJjdWxhciBTcGlubmVyIC0tPlxuICAgICAgICA8ZGl2IGNsYXNzPVwic3Bpbm5lclwiPjwvZGl2PlxuXG4gICAgICAgIDwhLS0gTGluZWFyIFByb2dyZXNzIEJhciAtLT5cbiAgICAgICAgPGRpdiBjbGFzcz1cImxpbmVhci1wcm9ncmVzc1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJiYXJcIj48L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICBcbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgLFxuICBzdHlsZXM6IFtgXG4gICAgLnByb2dyZXNzLWNvbnRhaW5lciB7XG4gICAgICBwYWRkaW5nOiAyMHB4O1xuICAgICAgd2lkdGg6IGF1dG87XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgfVxuICAgIG1hdC1wcm9ncmVzcy1iYXIge1xuICAgICAgbWFyZ2luLXRvcDogMjBweDtcbiAgICB9XG4gICBcblxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgQ2lyY3VsYXIgU3Bpbm5lclxuPT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuLnNwaW5uZXIge1xuICB3aWR0aDogNjRweDtcbiAgaGVpZ2h0OiA2NHB4O1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGJvcmRlcjogNnB4IHNvbGlkICNlOGU2ZmY7XG4gIGJvcmRlci10b3AtY29sb3I6ICM1YjViZjA7XG4gIGJvcmRlci1yaWdodC1jb2xvcjogIzhiN2NmNztcbiAgYW5pbWF0aW9uOiBzcGluIDEuMnMgbGluZWFyIGluZmluaXRlO1xuICBtYXJnaW46IDAgYXV0byAyOHB4O1xufVxuXG5Aa2V5ZnJhbWVzIHNwaW4ge1xuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICB9XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIExpbmVhciBQcm9ncmVzcyBCYXJcbj09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi5saW5lYXItcHJvZ3Jlc3Mge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDhweDtcbiAgYmFja2dyb3VuZDogI2U4ZTZmZjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBtYXJnaW4tYm90dG9tOiAyNHB4O1xufVxuXG4ubGluZWFyLXByb2dyZXNzIC5iYXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDQwJTtcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KFxuICAgIDkwZGVnLFxuICAgICNiOGIxZmYsXG4gICAgIzViNWJmMCxcbiAgICAjYjhiMWZmXG4gICk7XG4gIGFuaW1hdGlvbjogaW5kZXRlcm1pbmF0ZSAxLjZzIGluZmluaXRlIGVhc2UtaW4tb3V0O1xufVxuXG5Aa2V5ZnJhbWVzIGluZGV0ZXJtaW5hdGUge1xuICAwJSB7XG4gICAgbGVmdDogLTQwJTtcbiAgfVxuICAxMDAlIHtcbiAgICBsZWZ0OiAxMDAlO1xuICB9XG59XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgIFRleHRcbj09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi5sYWJlbCBzdHJvbmcge1xuICBmb250LXNpemU6IDE4cHg7XG4gIGNvbG9yOiAjMmYyZjQ0O1xufVxuXG4ubGFiZWwgcCB7XG4gIG1hcmdpbi10b3A6IDRweDtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBjb2xvcjogIzZiNmI4YTtcbn1cblxuICBgXVxufSlcbmV4cG9ydCBjbGFzcyBQcm9ncmVzc0RpYWxvZ0NvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoTUFUX0RJQUxPR19EQVRBKSBwdWJsaWMgZGF0YTogeyBwcm9ncmVzczogbnVtYmVyOyBtZXNzYWdlOiBzdHJpbmcgfSkge1xuICAgIGNvbnNvbGUubG9nKCdkYXRhLS0nLCBkYXRhKVxuICB9XG59Il19