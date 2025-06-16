import { Component, Input, OnInit, Output, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FrameworkService } from '../../services/framework.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CreateTermComponent } from '../create-term/create-term.component';
import { ConnectorComponent } from '../connector/connector.component';
import { LocalConnectionService } from '../../services/local-connection.service';
import { IConnectionType } from '../../models/connection-type.model';
import { Subscription } from 'rxjs';
import { ConnectorService } from '../../services/connector.service';
import { ApprovalService } from '../../services/approval.service';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { defaultConfig, headerLineConfig } from '../../constants/app-constant';
import { labels } from '../../labels/strings';
import { Card } from '../../models/variable-type.model';
import { CreateTermFromFrameworkComponent } from '../create-term-from-framework/create-term-from-framework.component';
import { OrgHierarchyAddModalComponent } from '../org-hierarchy-add-modal/org-hierarchy-add-modal.component';
import { TreeHierarchyService } from '../../tree-hierarchy.service';
import { v4 as uuidv4 } from 'uuid'
import { ConforamtionPopupComponent } from '../conforamtion-popup/conforamtion-popup.component';

declare var LeaderLine: any;
@Component({
  selector: 'lib-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent implements OnInit, OnDestroy {
  @Input() approvalList: Array<Card> = [];
  @Input() isApprovalView: boolean = false;
  @Input() workFlowStatus: string = '';
  @Input() environment:any;
  @Input() taxonomyConfig: any;
  @Input() orgSelectedData: any;
  @Output() sentForApprove = new EventEmitter<any>()
  @Output() loaderEnable = new EventEmitter<any>()
  mapping = {};
  heightLighted = []
  localList = []
  showPublish: boolean = false
  newTermSubscription: Subscription | undefined = undefined
  loaded: any = {}
  showActionBar: boolean = false
  approvalRequiredTerms = []
  draftTerms: Array<Card> = [];
  isLoading: boolean = false;
  categoryList:any = [];
  app_strings: any = labels;
  isHideBtnEna:boolean =true;
  columnId:string = '';
  configCodeBtn:any;
  dataConfig:any
  isFraworkLoading = true
  loaderSubscription!: Subscription
  constructor(private frameworkService: FrameworkService, 
    private localSvc: LocalConnectionService, 
    public dialog: MatDialog, 
    private approvalService: ApprovalService,
    private _snackBar: MatSnackBar,
    private connectorSvc: ConnectorService,
    private cdr: ChangeDetectorRef,
    private treeHierarchySvc: TreeHierarchyService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    
  }

  ngOnChanges() {
    this.draftTerms = this.approvalList;
    this.init()
    this.showActionBar = this.isApprovalView?true:false;
    this.frameworkService.afterAddOrEditSubject.subscribe(responseData => {
      if(responseData && responseData.res && responseData.data) {
        this.refreshData(responseData)
      }
    })
    this.isEnableds()
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
 } 

  init() {
    this.initConfig();
    this.frameworkService.getFrameworkInfo((this.orgSelectedData) ? this.orgSelectedData : '').subscribe(() => {
      this.connectorSvc.removeAllLines()
      this.frameworkService.categoriesHash.value.forEach((cat:any) => {
        this.loaded[cat.code] = true
      })
      this.isLoading = false
        setTimeout(() => {
            //  this.drawHeaderLine(res.result.framework.categories.length);  
             this.makeFirstTermSelected()
        },500)
    }, (err) => {
      console.error('error in fetching framework', err)
    })

    this.loaderSubscription = this.treeHierarchySvc.loaderState$.subscribe(
      data => {
        this.loaderEnable.emit(data)
        this.changeDetector.detectChanges()
      },
    )
  
  }
  refreshData(resData: any) {
    const res = resData.res
    if (res && res.created) {
      this.showPublish = true
    }
    if(res.multi && Array.isArray(res.term) && res.term.length){
      res.term = res.term[0]
    } 
    this.loaded[res.term.category] = false
    // wait
    const parentColumn = this.frameworkService.getPreviousCategory(res.term.category)
    res.parent = null
    if (parentColumn) {
      res.parent = this.frameworkService.selectionList.get(parentColumn.code)
      if(resData.type === 'update'){
        
        res.parent.children[res.parent.children.findIndex((el: any) => el.identifier === res.term.identifier)] =  res.term
        // this.frameworkService.list.get(res.parent.category).children = [...res.parent.children]
        
        

        // this.frameworkService.currentSelection.next({ type: res.term.category, data: res.term.children, cardRef:resData.cardRef })
        // this.updateSelection(res.term.category, res.term.code);
        // this.updateSelection(res.parent.category, res.parent.code);
        // setTimeout(() => {
        //   this.frameworkService.currentSelection.next({ type: res.term.category, data: res.term.children, cardRef:resData.cardRef })
        // }, 100);
        // this.updateFinalList({ selectedTerm: res.term, isSelected: true, parentData: res.parent, colIndex:resData.index })
         this.loaded[res.term.category] = true
        res.term.selected = false
        this.frameworkService.selectionList.delete(res.term.category)
         this.frameworkService.insertUpdateDeleteNotifier.next({ action: res.term.category, type:'update', data: res.term })
         this.updateFinalList({ selectedTerm: res.term, isSelected: true, parentData: res.parent, colIndex:resData.index }, 'update')
         res.term.selected = true
        // const next = this.frameworkService.getNextCategory(res.term.category)
        
        //   if (next && next.code) {
        //     this.frameworkService.selectionList.delete(next.code)
        //   }
      } else {
        if(!res.multi){
          res.parent.children? res.parent.children.push(res.term) :res.parent['children'] = [res.term]
        } 
        this.updateFinalList({ selectedTerm: res.term, isSelected: false, parentData: res.parent, colIndex:resData.index },)
      }
    }
   
  }

  makeFirstTermSelected() {
    const firstListItem = this.frameworkService.list.entries().next().value as any
    if(firstListItem && firstListItem.length >= 2){
      if(firstListItem[1] && firstListItem[1].children && firstListItem[1].children.length) {
        const firstTerm = firstListItem[1].children[0] as any
        const cardRef = document.getElementById(firstTerm.name)
        // this.categoryList = []
        firstTerm.selected = true
        this.frameworkService.cardClkData = firstTerm;
        this.frameworkService.CurrentCardClk.next(firstTerm.category)
        this.frameworkService.currentSelection.next({ type: firstTerm.category, data: firstTerm, cardRef })
        this.isFraworkLoading = false
      }
    }
  }

  updateTaxonomyTerm(data: { selectedTerm: any, isSelected: boolean, isUpdate?:any}) {
    if(data && data.selectedTerm && data.selectedTerm.category) {
      if(!data.isUpdate){
        this.updateFinalList(data)
      } else {
        this.updateFinalList(data, 'update')
      }
      this.updateSelection(data.selectedTerm.category, data.selectedTerm.code);
    }
  }
  updateSelection(category: string, selectedTermCode: string) {
    const categoryData = this.frameworkService.list.get(category);
    if (categoryData && categoryData.children) {
      categoryData.children.map(item => {
        item.selected = selectedTermCode === item.code ? true : false
        return item
      })
    }
  }

  //need to refactor at heigh level
  updateFinalList(data: { selectedTerm: any, isSelected: boolean, parentData?: any, colIndex?: any}, type?: any) {
    
    if (data.isSelected) {
      // data.selectedTerm.selected = data.isSelected
      this.frameworkService.selectionList.set(data.selectedTerm.category, data.selectedTerm);
      const next = this.frameworkService.getNextCategory(data.selectedTerm.category)
      if (next && next.code) {
        this.frameworkService.selectionList.delete(next.code)
      }
      // notify next
      this.frameworkService.insertUpdateDeleteNotifier.next({ action: data.selectedTerm.category, type: type ? type : 'select', data: data.selectedTerm })
    } 
    if(data.colIndex === 0 && !data.isSelected) {
      this.isLoading = true;
      setTimeout(()=> {
        this.init()
      },3000)
    }
    setTimeout(() => {
      this.loaded[data.selectedTerm.category] = true
      // if(type && type === 'update'){
      //   this.frameworkService.selectionList.delete(data.selectedTerm.category);
      //   this.frameworkService.currentSelection.next({ type: data.parentData.category, data: data.parentData.children })
      // }
    }, 100);

  }
  isEnabled(columnCode: string): boolean {    
    return !!this.frameworkService.selectionList.get(columnCode)
  }

  isEnableds() {
  //  return this.frameworkService.cardClkData
  if(this.frameworkService.CurrentCardClk){
    this.frameworkService.CurrentCardClk.subscribe((item)=>{
     const dataCode: any = this.frameworkService.getNextCategory(item)
      if (dataCode && dataCode.code){
        this.dataConfig = this.frameworkService.getConfig(dataCode.code)
      }
     if(dataCode){
      this.configCodeBtn = dataCode.code
     }
     })
  }
  
  
  }

  // getbtnEnableFn(_item: any) {
  //   const allSelectedTerm: any = this.frameworkService.getAllSelectedTerms()
  //   if (allSelectedTerm && allSelectedTerm.length && allSelectedTerm.filter((t: any) => t.category === _item.code).length > 0) {
  //     return true
  //   }
  //   return false
  // }


  openCreateTermDialog(column: any, colIndex: any) {
    if (!this.isEnabled(column.code)) {
      const nextCat = column.code
      const nextNextCat = this.frameworkService.getNextCategory(nextCat)
      if(nextCat) {
        const selectedTerms = this.frameworkService.getPreviousSelectedTerms(nextCat)
        const colInfo = Array.from(this.frameworkService.list.values()).filter(l => l.code === nextCat )
        let nextColInfo: any = []
        if(nextNextCat && nextNextCat.code) {
          nextColInfo = Array.from(this.frameworkService.list.values()).filter(l => l.code === nextNextCat.code )
        }
        let dialog: any
        if(this.environment && this.environment.frameworkType === 'MDO_DESIGNATION'){
          dialog = this.dialog.open(CreateTermFromFrameworkComponent, {
            data: { 
              mode:'multi-create',
              // cardColInfo: this.data.columnInfo,
              columnInfo: colInfo && colInfo.length ? colInfo[0] : [],
              nextColInfo: nextColInfo && nextColInfo.length ? nextColInfo[0] : [],
              frameworkId: this.frameworkService.getFrameworkId(),
              selectedparents: this.heightLighted,
              colIndex: nextCat.index,
              // childrenData: data.children,
              selectedParentTerms: selectedTerms
            },
            width: '800px',
            panelClass: 'custom-dialog-container',
            position: { top: '50px' }
          })
        } else {
          dialog = this.dialog.open(CreateTermComponent, {
            // data: {
            //   mode:'create',
            //   columnInfo: column,
            //   frameworkId: this.frameworkService.getFrameworkId(),
            //   selectedparents: this.heightLighted,
            //   colIndex: colIndex,
            //   selectedParentTerms: selectedTerms
            // },
            data: { 
              mode:'multi-create',
              columnInfo: colInfo && colInfo.length ? colInfo[0] : [],
              frameworkId: this.frameworkService.getFrameworkId(),
              selectedparents: this.heightLighted,
              colIndex: nextCat.index,
              // childrenData: data.children,
              selectedParentTerms: selectedTerms
            },
            width: '800px',
            panelClass: 'custom-dialog-container',
            position: { top: '50px' }
          })
        }
        dialog.afterClosed().subscribe((res: any) => {
          if(!res) {
            return;
          }

          if (res && res.created) {
            this.showPublish = true
          }
         const data  = this.frameworkService.cardClkData
         
          const responseData = {
            res,
            index: nextCat.index,
            data,
            type: 'multi-create'
          }
          if(!(res && res.stopUpdate)){
            this.frameworkService.updateAfterAddOrEditSubject(responseData)
          }
          
          
          this.loaded[res.term.category] = false
          // wait
          const parentColumn = this.frameworkService.getPreviousCategory(res.term[0].category)
          res.parent = null
          if (parentColumn) {
            res.parent = this.frameworkService.selectionList.get(parentColumn.code)
            res.parent.children? res.parent.children.push(res.term[0]) :res.parent['children'] = [res.term[0]]
          }
          this.updateFinalList({ selectedTerm: res.term[0], isSelected: false, parentData: res.parent, colIndex:colIndex })
        })
      }
    }
  }

  openOrganizationDialog(column: any, _index: any) {
    const treeListData = this.frameworkService.getPreviousSelectedTerms(column.code)     
    const dialog = this.dialog.open(OrgHierarchyAddModalComponent, {
      data: {
        previous: treeListData,
        currentData: column,
        selectedOrgData: this.orgSelectedData,
      },
      autoFocus: true,
      restoreFocus: true,
      position: { right: '0' },
      height: '100vh',
      width: '50%',
      panelClass: 'right-side-modal',
      maxWidth: '100vw'
    });
    
    dialog.afterClosed().subscribe((_res: any) => {
        if (_res && _res.length > 0) {
          this.treeHierarchySvc.setLoaderState(true);
          this.createTerms(_res, column)
        }
    });
  }

  get list(): any[] {
    return Array.from(this.frameworkService.list.values())
  }
  
  drawHeaderLine(len: number){
    const options = {...defaultConfig,...headerLineConfig }
    for(let i=1; i<=len; i++){
      const startEle = document.querySelector(`#box${i}count`)
      const endEle = document.querySelector(`#box${i}Header`)
      if(startEle && endEle) {
        new LeaderLine(startEle, endEle, options);
      }
    }
  }

  getColumn(columnCode: string) {
    return this.frameworkService.list.get(columnCode)
  }
  
  newConnection() { 
    const dialog = this.dialog.open(ConnectorComponent, {
      data: {},
      width: '90%',
      // panelClass: 'custom-dialog-container' 
    })
    dialog.afterClosed().subscribe((res: IConnectionType) => {
      if ((res.source === 'online' && res.data.endpoint) || (res.source === 'offline')) {
        this.localSvc.localStorage = res
        this.init()
      } else if (res.source === 'online' && !res.data.endpoint) {
        this.localSvc.localStorage = res
        this.init()
      }
    })
  }

  updateDraftStatusTerms(event: any){
    if(event.checked) {
      this.draftTerms.push(event.term)
      } else {
      this.draftTerms = this.draftTerms.filter(d => event.term.identifier !== d.identifier)
    }
    this.showActionBar = this.draftTerms.length>0?true:false
  }

  getNoOfCards(event:any) {
    if(this.categoryList.length > 0 && event.category !== '') {
      let index = this.categoryList.findIndex((obj:any) => obj.category == event.category);
      if(index > -1) {
        this.categoryList.splice(index);
      }
    }
    if(event.category == '') {
      this.categoryList[this.categoryList.length-1].count = 0;
    }
    this.categoryList.push(event);
  }
  
  getCount(code: string): number {
    let count = 0
    if (this.categoryList) {
      const category = this.categoryList.find((category: any) => category.category === code)
      count = category && category.count ? category.count : 0
    }
    return count
  }

  sendForApproval(){
    if(!this.isApprovalView){
        let parentList: any = []
        this.list.forEach(ele => {
          const t = ele.children.filter((term: any) => term.selected === true)
          if(t[0]){
            parentList.push(t[0])
          } 
        })
        const req = {
          updateFieldValues:[...parentList, ...this.draftTerms]
        }
        this.approvalService.createApproval(req).subscribe(() => {
          this.frameworkService.removeOldLine()
          this._snackBar.open('Terms successfully sent for Approval.', 'cancel')
        })
    } else {
      this.sentForApprove.emit(this.draftTerms)
    }
   
  }

  closeActionBar(_e:any){ 
    this.showActionBar = false;
  }

  initConfig() {
    if(this.environment){
      this.frameworkService.updateEnvironment(this.environment);
      this.frameworkService.setConfig(this.taxonomyConfig);
    }
  }

  ngOnDestroy(){
      this.frameworkService.removeOldLine();
      // this.environment = null
      // this.frameworkService.resetAndFresh()
      // this.connectorSvc.removeAllLines()
      // this.connectorSvc.updateConnectorsMap({})
  }

  getNextCat(data: any) {
    if(data  && data.code){
      const nextCat = this.frameworkService.getNextCategory(data.code)
      return nextCat
    }
    return null
  }

  isCurrentOrNextTerm(_column: any, index: number): boolean {
    // If there's no current selection, only enable the first column
    if (!this.frameworkService.currentSelection.value) {
      return index === 0;
    }
    
    // Get the current selected category from the currentSelection
    const currentCategory = this.frameworkService.currentSelection.value.type;
    if (!currentCategory) {
      return index === 0;
    }
    
    // Find the index of the current active column
    let currentIndex = -1;
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].code === currentCategory) {
        currentIndex = i;
        break;
      }
    }
    
    // If we couldn't find the current index, only enable the first column
    if (currentIndex === -1) {
      return index === 0;
    }
    
    // Enable the current column and the next one
    return index === currentIndex || index === currentIndex + 1;
  }

  shouldShowSvgBorderWrapper(column: any, index: number): boolean {
    if (this.isCurrentOrNextTerm(column, index) && this.getCount(column.code) === 0) {
      return true;
    } 
    return false
  }

  async createTerms(selectedList:any, column:any) {
    const frameworkData = {
      id: this.orgSelectedData.orgHierarchyFrameworkId || '',
      category: column.code || '',
    }
    let createdNodeId:any = []
    for await (const ele of selectedList) { 
      const requestBody = {
        request: {
            term: {
              name: ele.orgName || '',
              description: ele.description || '',
              code: uuidv4(),
              additionalProperties: {
                identifier: ele.ministryOrStateId || '',
                parentOrgName: ele.ministryOrStateName || '',
                orgId: ele.identifier || '',
                orgName: ele.orgName || '',
              }
            }
          }
        }
      const createTremsRes:any = await this.treeHierarchySvc.createTerm(requestBody, frameworkData).toPromise().catch(err => {
        console.error('Error in creating term', err);
      })
      if (createTremsRes && createTremsRes.result && createTremsRes.result.node_id) {
        createdNodeId.push(createTremsRes.result.node_id[0]);
      } else {
        this._snackBar.open('Error in creating term', 'cancel');
        this.treeHierarchySvc.setLoaderState(false);
        return;
      }
    }
    if (createdNodeId.length === selectedList.length) {
      if (column.index >1) {
        await this.updateAssociation(createdNodeId, frameworkData, column);
      } 
      this.publishFramework(frameworkData);
    }
  }

  async updateAssociation(nodeId: any, frameworkData: any, column: any) {
    const prev:any = this.frameworkService.getPreviousCategory(column.code);
    let prevTrem:any = this.frameworkService.getPreviousSelectedTerms(column.code)
    const requestBody:any = {
      request: {
        term: {
          associations: []
        }
      }
    } 
    if (prevTrem && prevTrem) {
      prevTrem = prevTrem.filter((ele:any) => ele.category === prev.code)[0]
      if (prevTrem && prevTrem.associations && prevTrem.associations.length > 0) {
        prevTrem.associations.forEach((ele:any) => {
            requestBody.request.term.associations.push({
            identifier: ele.identifier
          })
        }) 
      }
    }
    if (nodeId && nodeId.length > 0) {
      nodeId.forEach((ele:any) => {
        requestBody.request.term.associations.push({
          identifier: ele
        })
      })
    }
    frameworkData.category = prevTrem.category || '';
    const nodeIdParts = prevTrem.identifier.split('_');
    const codeId = nodeIdParts[nodeIdParts.length - 1];
    const updateAssociationRes:any = await this.treeHierarchySvc.updateFrameworkAssociation(requestBody, frameworkData, codeId).toPromise().catch(err => {
      console.error('Error in updating association', err);
    })
    if (updateAssociationRes && updateAssociationRes.result && updateAssociationRes.result.node_id) {
      // this.publishFramework(frameworkData);
    }
  }

  publishFramework(frameworkData: any) {
    this.treeHierarchySvc.publishFreamework(frameworkData).subscribe((res:any) => {
      if (res && res.result && res.result.publishStatus) {
        setTimeout(() => {
          this._snackBar.open(`Organization Hierarchy updated. Will reflect in sometime`, 'cancel');
          this.treeHierarchySvc.setLoaderState(false);
          this.init();
        }, 10000);
      } else {
        this._snackBar.open('Error in publishing framework', 'cancel');
        this.treeHierarchySvc.setLoaderState(false);
      }
    }, (err) => {
      console.error('Error in publishing framework', err);
      this.treeHierarchySvc.setLoaderState(false);
    });
  }

  removeConnection(data: any) {
    const dialogData = {
      dialogType: 'warning',
      descriptions: [
        {
          header: `${data?.children?.children?.length || 0} Organisation${data?.children?.children?.length > 1 ? 's' : ''} will be removed from organisation hierarchy.`,
          headerClass: 'flex items-center justify-center text-blue',
          messages: [
            {
              msgClass: 'text-blue margin-bottom-s',
              msg: `Do you want to proceed?`,
            },
          ],
        },
      ],
      footerClass: 'items-center justify-center',
      buttons: [
        {
          btnText: 'No',
          btnClass: 'btn-common btn-secondary',
          response: false,
        },
        {
          btnText: 'Yes',
          btnClass: 'btn-common btn-primary',
          response: true,
        },
      ],
    }
    const dialogRef = this.dialog.open(ConforamtionPopupComponent, {
      data: dialogData,
      autoFocus: false,
      width: '600px',
      maxWidth: '80vw',
      maxHeight: '90vh',
      disableClose: true,
    })
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        this.retireTermFunction(data)
      }
    })
  }

  async retireTermFunction(data: any) {
    const requestBody = {
      request: {
        contentIds: [
          data.children.code
        ]
      }
    }
    const identifierParts = data.children.identifier.split('_');
    const frameworkObj = {
      id: identifierParts.slice(0, 3).join('_'),
      category: data.category
    }
    this.treeHierarchySvc.setLoaderState(true)
    const retireRes = await this.treeHierarchySvc.retireTerm(requestBody, frameworkObj).toPromise().catch((_err: any) => {
      this.treeHierarchySvc.setLoaderState(false)
      this._snackBar.open(`Failed to remove connection.`, 'cancel')
    }
    )
    if (retireRes && retireRes.params && retireRes.params.status?.toLowerCase() === 'successful') {
      await this.publishFramework(frameworkObj)
    } else {
      this.treeHierarchySvc.setLoaderState(false)
      this._snackBar.open(`Failed to remove connection.`, 'cancel')
    }
  }

  cardActionEmit(event:any) {
    switch(event.action) {
      case 'remove-term':
        this.removeConnection(event.data);
        break;
    }
  }
}