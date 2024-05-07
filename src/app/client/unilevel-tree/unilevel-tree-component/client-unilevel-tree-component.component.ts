import {
  Component,
  Input,
  ViewEncapsulation,
  TemplateRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { MyTreeNodeClient } from '@app/core/models/unilevel-tree-model/tree-node';

@Component({
  selector: 'app-client-unilevel-tree-component',
  exportAs: 'orgChart',
  templateUrl: './client-unilevel-tree-component.component.html',
  styleUrls: ['./client-unilevel-tree-component.component.scss'],
  host: {
    '[class.ng13-org-chart-zoom-out]': 'zoomOut',
  },
  encapsulation: ViewEncapsulation.None,
})
export class ClientUnilevelTreeComponentComponent {
  @Input('data') data: MyTreeNodeClient | undefined;
  @Input() hasParent = false;
  @Input('nodeTemplate') nodeTemplate!: TemplateRef<any>;
  @Output('loadFamilyTree') loadFamilyTree: EventEmitter<number> = new EventEmitter();
  zoomOut = true;

  constructor() { }

  public onloadFamilyTree(id: number) {
    if (id !== 0) {
      this.loadFamilyTree.emit(id);
    }
  }

  public onClick() {
    if (this.data && this.data.onClick) {
      this.data.onClick();
    }
  }

  public toggleZoom() {
    this.zoomOut = !this.zoomOut;
  }
}
