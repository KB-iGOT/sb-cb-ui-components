import { Component } from '@angular/core';

@Component({
  selector: 'sb-peer-read-overlay',
  standalone: true,
  host: {
    style: 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:99999;display:block;'
  },
  template: `
    <div class="peer-ripple-container">
      <div class="peer-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
  `,
  styles: [`
    .peer-ripple-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .peer-ripple {
      display: inline-block;
      position: relative;
      width: 84px;
      height: 84px;
    }
    .peer-ripple div {
      position: absolute;
      border: 4px solid #000000;
      opacity: 1;
      border-radius: 50%;
      animation: loader-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
    }
    .peer-ripple div:nth-child(2) {
      animation-delay: -0.5s;
    }
    @keyframes loader-ripple {
      0%   { top: 38px; left: 38px; width: 0;   height: 0;   opacity: 1; }
      100% { top: -1px; left: -1px; width: 78px; height: 78px; opacity: 0; }
    }
  `]
})
export class PeerReadOverlayComponent {}
