import { Component } from '@angular/core';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [
  {
    type: 'info',
    message: '',
  },
];

@Component({
  selector: 'app-calculate-commissions',
  templateUrl: './calculate-commissions.component.html',
})
export class CalculateCommissionsComponent {
  alerts: Alert[];
  show: Boolean = true;
  linkMsj: String = 'hide';

  constructor() {
    this.alerts = Array.from(ALERTS);
  }

  close(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  showMsj() {
    if (this.show) {
      this.show = false;
      this.linkMsj = 'show';
    } else {
      this.show = true;
      this.linkMsj = 'hide';
    }
  }
}
