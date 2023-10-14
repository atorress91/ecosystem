import {
  Component,
  Input,
  ViewEncapsulation,
  TemplateRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { MyTreeNode } from '@app/core/models/unilevel-tree-model/tree-node';

@Component({
  selector: 'app-unilevel-tree-component',
  exportAs: 'orgChart',
  templateUrl: './unilevel-tree-component.component.html',
  styleUrls: ['./unilevel-tree-component.component.scss'],
  host: {
    '[class.ng13-org-chart-zoom-out]': 'zoomOut',
  },
  encapsulation: ViewEncapsulation.None,
})
export class UnilevelTreeComponentComponent {
  @Input('data') data: MyTreeNode | undefined;
  @Input() hasParent = false;
  @Input('nodeTemplate') nodeTemplate!: TemplateRef<any>;
  @Output('loadFamilyTree') loadFamilyTree: EventEmitter<number> = new EventEmitter();
  zoomOut = false;

  constructor() {}

  public onloadFamilyTree(id: number) {
    if (id !== 0) {
      this.loadFamilyTree.emit(id);
    }
  }
}
