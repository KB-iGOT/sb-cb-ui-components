/* eslint-disable */
import { Injectable } from '@angular/core';
import { defaultConfig } from '../constants/app-constant';
import { LLOptions } from '../constants/app-constant';

declare var LeaderLine: any;

interface ConnectedDot {
  target: any;
  line: any;
}

@Injectable()
export class ConnectorService {
  connectorMap: {[key: string]: any} = {};
  elmWrapper: any;
  // assuming following structure
  // {
  //   'box1': {
  //     source: ElementRef,
  //     lines: [
  //       {
  //         target:' card2 of box1', 
  //         line: '_line prototype object'
  //       }
  //     ]
  //   }
  // }

  constructor() { 
    // this.frameworkService.list.forEach((list, index)=> {
    //   this.connectorMap['box'+list.index]= {}
    // })
    console.log('connectorMap -------', this.connectorMap);
  }

  _drawLine(source: any, target: any, options: any = defaultConfig, sourceContainerId: any = undefined, targetContainerId: any = undefined): any {
    const _options = <LLOptions>{...defaultConfig, ...options};
    
    if (Array.isArray(target)) {
      // Remove the unused _line variable
      // target.forEach((_target) => {
      //   _line = this.renderLine(source, _target, _options);
      // });
      
      let connectedDots: ConnectedDot[] = [];
      target.forEach((_target) => {
        const tempLine = this.renderLine(source, _target, _options);
        connectedDots.push({
          target: _target, // ref element
          line: tempLine
        });
        
        if(sourceContainerId) {
          const sourceContainer = document.querySelector(sourceContainerId);
          if (sourceContainer) {
            sourceContainer.addEventListener('scroll', () => {
              try {
                tempLine && tempLine.position();
              } catch(e) {
                // console.log('Error');
              }
            }, true);
          }
        }
        
        if (targetContainerId) {
          const targetContainer = document.querySelector(targetContainerId);
          if (targetContainer) {
            targetContainer.addEventListener('scroll', () => {
              try {
                tempLine && tempLine.position();
              } catch(e) {
                // console.log('Error');
              }
            }, true);
          }
        }
        // tempLine.show('draw')
      });
      
      return connectedDots;
    } else {
      return this.renderLine(source, target, _options);
    }
  }

  private renderLine(source: any, target: any, options: LLOptions): any {
    let _options = {
      animOptions: { duration: 2000, timing: 'linear' },
      hide: true,
      // startSocketGravity: 50,
      // endSocketGravity: [-30, 50]
    };
    
    let _line;
    if(target.targetType === 'id'){
      _line = new LeaderLine(source, document.getElementById(target.target), _options);
    }
    else {
      _line = new LeaderLine(source, target.target, _options);
    }

    _line.endPlugOutline = true;
    _line.startPlugOutline = true;
    _line.positionByWindowResize = true;
    _line.setOptions(options);
    _line.show('draw');
    // this.elmWrapper.appendChild(document.querySelector('.leader-line:last-of-type'));
    // this.position(_line)
    return _line;
  }

  updateConnectorsMap(map: any): void {
    this.connectorMap = map;
  }

  position(line: any): void {
    this.elmWrapper.style.transform = 'none';
    var rectWrapper = this.elmWrapper.getBoundingClientRect();
    // Move to the origin of coordinates as the document
    this.elmWrapper.style.transform = 'translate(' +
      ((rectWrapper.left + pageXOffset) * -1) + 'px, ' +
      ((rectWrapper.top + pageYOffset) * -1) + 'px)';
    line.position();
  }

  removeAllLines(): void {
    if(this.connectorMap) {
      for (const key in this.connectorMap) {
        // Remove all n-1 lines and keep only current selection, also clear n+1 lines
        if(this.connectorMap[key] && this.connectorMap[key].lines && this.connectorMap[key].lines.length > 0) {
          const lines = this.connectorMap[key].lines;
          lines.forEach(async (element: any, index: any) => {
              await element.line && element.line.remove();
              lines.splice(index, 1);
          });
          this.connectorMap[key].lines = lines;
        }
      }
    }
    // to reset connector map after clearing all the lines
    this.updateConnectorsMap({});
  }

  // _drawHeaderLine(source, target, options = defaultConfig) {
  //   console.log(source,target,options);
  //   new LeaderLine(source, target, options);
  // }
}