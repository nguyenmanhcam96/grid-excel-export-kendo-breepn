import { Component, ViewChild } from '@angular/core';
import { aggregateBy, process } from '@progress/kendo-data-query';
import { ExcelExportComponent } from '@progress/kendo-angular-excel-export';
import { products } from './products';

@Component({
  selector: 'my-app',
  template: `
        <button type="button" class="k-button" (click)="onExcelExport()">Export To Excel</button>

        <kendo-excelexport [data]="data" [group]="group" [collapsible]="true" fileName="Products.xlsx" #excelexport>
            <kendo-excelexport-column field="ProductID" [locked]="true" title="Product ID" [width]="200">
            </kendo-excelexport-column>
            <kendo-excelexport-column field="ProductName" title="Product Name" [width]="350">
            </kendo-excelexport-column>
            <kendo-excelexport-column-group title="Availability" [headerCellOptions]="{ textAlign: 'center' }">
                <kendo-excelexport-column field="UnitPrice" title="Unit Price" [width]="120"
                    [cellOptions]="{ format: '$#,##0.00' }"
                    [groupFooterCellOptions]="{ textAlign: 'right' }"
                    [footerCellOptions]="{ wrap: true, textAlign: 'center' }">
                    <ng-template kendoExcelExportGroupFooterTemplate let-aggregates>
                        Sum: {{aggregates["UnitPrice"].sum | currency}}
                    </ng-template>
                    <ng-template kendoExcelExportFooterTemplate let-column="column">
                        Total {{column.title}}: {{total["UnitPrice"].sum | currency}}
                    </ng-template>
                </kendo-excelexport-column>
                <kendo-excelexport-column field="UnitsOnOrder" title="Units On Order" [width]="120">
                </kendo-excelexport-column>
                <kendo-excelexport-column field="UnitsInStock" title="Units In Stock" [width]="120">
                </kendo-excelexport-column>
            </kendo-excelexport-column-group>
            <kendo-excelexport-column field="Discontinued" width="120" [hidden]="true">
                <ng-template kendoExcelExportGroupHeaderTemplate  let-value="value">
                   Discontinued: {{value}}
                </ng-template>
            </kendo-excelexport-column>
      </kendo-excelexport>
    `,
})
export class AppComponent {
  public aggregates: any[] = [{ field: 'UnitPrice', aggregate: 'sum' }];
  @ViewChild('excelexport', { static: false })
  excelexport: ExcelExportComponent;
  public group: any[] = [
    {
      field: 'Discontinued',
      aggregates: this.aggregates,
    },
  ];

  public data: any[] = process([], {
    group: this.group,
  }).data;

  public total: any = aggregateBy(products, this.aggregates);

  public onExcelExport() {
    if (this.data.length === 0) {
      alert('No records');
      return;
    }
    this.excelexport.save();
  }
}
