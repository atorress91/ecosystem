import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts4/themes/animated';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { ChartComponent } from 'ng-apexcharts';

import { BalanceInformation } from '@app/core/models/wallet-model/balance-information.model';
import { AuthService } from '@app/core/service/authentication-service/auth.service';
import { WalletService } from '@app/core/service/wallet-service/wallet.service';
import { UserAffiliate } from '@app/core/models/user-affiliate-model/user.affiliate.model';
import { ToastrService } from 'ngx-toastr';
import { AffiliateService } from '@app/core/service/affiliate-service/affiliate.service';
import { EChartsOption } from 'echarts';
import { PurchasePerMonthDto } from '@app/core/models/wallet-model/network-purchases.model';
import { WalletModel1AService } from '@app/core/service/wallet-model-1a-service/wallet-model-1a.service';
import { WalletModel1BService } from '@app/core/service/wallet-model-1b-service/wallet-model-1b.service';
import { ModelsVisibilityService } from '@app/core/service/models-visibility-service/models-visibility.service';
import { BalanceInformationModel1A } from '@app/core/models/wallet-model-1a/balance-information-1a.model';
import { BalanceInformationModel1B } from '@app/core/models/wallet-model-1b/balance-information-1b.model';
am4core.useTheme(am5themes_Animated);

@Component({
  selector: 'app-main',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public user: UserAffiliate;
  private destroy$ = new Subject();
  balanceInformation: BalanceInformation = new BalanceInformation();
  balanceInformationModel1A: BalanceInformationModel1A = new BalanceInformationModel1A();
  balanceInformationModel1B: BalanceInformationModel1B = new BalanceInformationModel1B();
  withdrawalBalance: number = 0;
  totalPaid: number = 0;
  maps: any[] = [];
  circles = [];
  currentYearPurchases: PurchasePerMonthDto[] = [];
  previousYearPurchases: PurchasePerMonthDto[] = [];
  area_line_chart: EChartsOption;
  currentYear: number;
  previousYear: number;
  @ViewChild('chart') chart1: ChartComponent;
  canSeePaymentModels: boolean = false;

  private chart: am4maps.MapChart;
  public pieChartOptions: any;
  public avgLecChartOptions: any;
  public pieChartOptionsModel1A: any;
  public pieChartOptionsModel1B: any;
  constructor(
    private authService: AuthService,
    private walletService: WalletService,
    private toastr: ToastrService,
    private affiliateService: AffiliateService,
    private walletModel1AService: WalletModel1AService,
    private walletModel1BService: WalletModel1BService,
    private modelsVisibilityService: ModelsVisibilityService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.pieChartOptions = { series: [], chart: {}, labels: [], responsive: [], dataLabels: {}, legend: {} };
    this.pieChartOptionsModel1A = { series: [], chart: {}, labels: [], responsive: [], dataLabels: {}, legend: {} };
    this.pieChartOptionsModel1B = { series: [], chart: {}, labels: [], responsive: [], dataLabels: {}, legend: {} };

    this.currentYear = new Date().getFullYear();
    this.previousYear = this.currentYear - 1;
    this.OnInitMethod();
  }

  OnInitMethod() {
    this.modelsVisibilityService.canUserSeePaymentModels().pipe(
      takeUntil(this.destroy$),
      switchMap(canSee => {
        this.canSeePaymentModels = canSee;
        return this.authService.currentUserAffiliate;
      })
    ).subscribe((user) => {
      if (user && user.id) {
        this.user = user;
        this.loadUserData(user.id);
      }
    });

    this.loadLocations();
  }

  loadUserData(userId: number) {
    Promise.all([
      this.getPurchasesInMyNetwork(),
      this.getBalanceInformationModel2(userId),
      this.getBalanceInformationModel1A(userId),
      this.canSeePaymentModels ? this.getBalanceInformationModel1B(userId) : Promise.resolve()
    ]).then(() => {
      this.ngZone.run(() => {
        this.initializeAllCharts();
        this.cdr.detectChanges();
      });
    });
  }

  initializeAllCharts() {
    this.initChartModel2();
    this.initChartModel1A();
    if (this.canSeePaymentModels) {
      this.initChartModel1B();
    }
    this.initializeAreaLineChart();
  }

  get registerUrl() {
    return `https://www.ecosystemfx.net/main-options/${this.user.user_name.toString()}`;
  }

  showSuccess(message) {
    this.toastr.success(message);
  }

  showError(message) {
    this.toastr.error(message);
  }

  setMapInfo() {
    this.chart = am4core.create('chartdiv', am4maps.MapChart);
    this.chart.geodata = am4geodata_worldLow;
    this.chart.projection = new am4maps.projections.Miller();

    let polygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.exclude = ['AQ'];
    polygonSeries.useGeodata = true;

    const imageSeries = this.chart.series.push(new am4maps.MapImageSeries());
    const imageSeriesTemplate = imageSeries.mapImages.template;
    const circle = imageSeriesTemplate.createChild(am4core.Circle);

    circle.radius = 14;
    circle.fill = am4core.color('#765cbf');
    circle.stroke = am4core.color('#B27799');
    circle.strokeWidth = 1;
    circle.nonScaling = true;

    circle.tooltipText = '[bold]{title}[/]\nCantidad: {value}';

    imageSeriesTemplate.propertyFields.latitude = 'lat';
    imageSeriesTemplate.propertyFields.longitude = 'lng';

    const centerLabel = imageSeriesTemplate.createChild(am4core.Label);
    centerLabel.text = '{value}';
    centerLabel.horizontalCenter = 'middle';
    centerLabel.verticalCenter = 'middle';
    centerLabel.fill = am4core.color('#55555');
    centerLabel.nonScaling = true;

    const data = this.maps.map(item => item);
    imageSeries.addData(data);

    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = '{name}';
    polygonTemplate.fill = am4core.color('#96a2b4');
    let hs = polygonTemplate.states.create('hover');
    hs.properties.fill = am4core.color('#74X999');
  }

  initializeAreaLineChart() {
    const currentYearData = this.fillMissingMonths(this.currentYearPurchases);
    const previousYearData = this.fillMissingMonths(this.previousYearPurchases);

    this.area_line_chart = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: [this.previousYear.toString(), this.currentYear.toString()],
        textStyle: {
          color: '#9aa0ac',
          padding: [0, 5, 0, 5],
        },
      },
      toolbox: {
        show: !0,
        feature: {
          magicType: {
            show: !0,
            title: {
              line: 'Line',
              bar: 'Bar',
              stack: 'Stack',
            },
            type: ['line'],
          },
          restore: {
            show: !0,
            title: 'Restore',
          },
          saveAsImage: {
            show: !0,
            title: 'Save Image',
          },
        },
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: !1,
          data: [
            'ENE',
            'FEB',
            'MAR',
            'ABR',
            'MAY',
            'JUN',
            'JUL',
            'AGO',
            'SEP',
            'OCT',
            'NOV',
            'DIC',
          ],
          axisLabel: {
            fontSize: 10,
            color: '#9aa0ac',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            fontSize: 10,
            color: '#9aa0ac',
          },
        },
      ],
      series: [
        {
          name: this.currentYear.toString(),
          type: 'line',
          smooth: !0,
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: currentYearData,
        },
        {
          name: this.previousYear.toString(),
          type: 'line',
          smooth: !0,
          areaStyle: {},
          emphasis: {
            focus: 'series',
          },
          data: previousYearData,
        },
      ],
      color: ['#9f78ff', '#fa626b'],
    }
  };

  private initChartModel2() {
    this.pieChartOptions = {
      series: [
        this.balanceInformation.serviceBalance,
        this.balanceInformation.availableBalance,
        this.balanceInformation.totalCommissionsPaid,
        this.balanceInformation.totalAcquisitions,
        this.balanceInformation.reverseBalance
      ],

      colors: ['#f44336', '#2196f3', '#96a2b4', '#4caf50', '#9c27b0'],
      chart: {
        type: 'donut',
        width: 200,
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      labels: [
        'Saldo de servicios',
        'Saldo Disponible',
        'Total Pagado',
        'Total Adquisiciones',
        'Saldo balance'
      ],
      responsive: [
        {
          breakpoint: 480,
          options: {
            dataLabels: {
              enabled: true,
              formatter: function (val) {
                return val + "%"
              },
              plotOptions: {
                pie: {
                  expandOnClick: false
                }
              }
            }
          },
        },
      ],
    };
  }

  private initChartModel1A() {
    this.pieChartOptionsModel1A = {
      series: [
        this.balanceInformationModel1A.serviceBalance,
        this.balanceInformationModel1A.availableBalance,
        this.balanceInformationModel1A.totalCommissionsPaid,
        this.balanceInformationModel1A.totalAcquisitions,
        this.balanceInformationModel1A.reverseBalance
      ],

      colors: ['#f44336', '#2196f3', '#96a2b4', '#4caf50', '#9c27b0'],
      chart: {
        type: 'donut',
        width: 200,
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      labels: [
        'Saldo de servicios',
        'Saldo Disponible',
        'Total Pagado',
        'Total Adquisiciones',
        'Saldo balance'
      ],
      responsive: [
        {
          breakpoint: 480,
          options: {
            dataLabels: {
              enabled: true,
              formatter: function (val) {
                return val + "%"
              },
              plotOptions: {
                pie: {
                  expandOnClick: false
                }
              }
            }
          },
        },
      ],
    };
  }

  private initChartModel1B() {
    this.pieChartOptionsModel1B = {
      series: [
        this.balanceInformationModel1B.serviceBalance,
        this.balanceInformationModel1B.availableBalance,
        this.balanceInformationModel1B.totalCommissionsPaid,
        this.balanceInformationModel1B.totalAcquisitions,
        this.balanceInformationModel1B.reverseBalance
      ],

      colors: ['#f44336', '#2196f3', '#96a2b4', '#4caf50', '#9c27b0'],
      chart: {
        type: 'donut',
        width: 200,
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      labels: [
        'Saldo de servicios',
        'Saldo Disponible',
        'Total Pagado',
        'Total Adquisiciones',
        'Saldo balance'
      ],
      responsive: [
        {
          breakpoint: 480,
          options: {
            dataLabels: {
              enabled: true,
              formatter: function (val) {
                return val + "%"
              },
              plotOptions: {
                pie: {
                  expandOnClick: false
                }
              }
            }
          },
        },
      ],
    };
  }

  loadLocations() {
    this.affiliateService.getTotalAffiliatesByCountries().subscribe({
      next: (value) => {
        this.maps = value.data;
        this.setMapInfo();
      },
      error: (err) => {
        this.showError("Error");
      },
    })
  }

  openNewWindow(url: string) {
    window.open(url)
  }

  getPurchasesInMyNetwork() {
    this.walletService.getPurchasesInMyNetwork(this.user.id).subscribe(data => {
      if (data) {
        this.currentYearPurchases = data.currentYearPurchases;
        this.previousYearPurchases = data.previousYearPurchases;
        this.initializeAreaLineChart();
      }
    });
  }

  fillMissingMonths(yearPurchases: PurchasePerMonthDto[]): number[] {
    const monthlyData = new Array(12).fill(0);

    for (let purchase of yearPurchases) {
      monthlyData[purchase.month - 1] = purchase.totalPurchases;
    }

    return monthlyData;
  }

  getBalanceInformationModel2(id: number): Promise<void> {
    return new Promise((resolve) => {
      this.walletService.getBalanceInformationByAffiliateId(id).subscribe({
        next: (value: BalanceInformation) => {
          this.balanceInformation = value;
          resolve();
        },
        error: (err) => {
          console.log(err);
          resolve();
        }
      });
    });
  }

  getBalanceInformationModel1A(id: number): Promise<void> {
    return new Promise((resolve) => {
      this.walletModel1AService.getBalanceInformationByAffiliateId(id).subscribe({
        next: (value: BalanceInformationModel1A) => {
          this.balanceInformationModel1A = value;
          resolve();
        },
        error: (err) => {
          console.log(err);
          resolve();
        }
      });
    });
  }

  getBalanceInformationModel1B(id: number): Promise<void> {
    if (!this.canSeePaymentModels) return;

    return new Promise((resolve) => {
      this.walletModel1BService.getBalanceInformationByAffiliateId(id).subscribe({
        next: (value: BalanceInformationModel1B) => {
          this.balanceInformationModel1B = value;
          resolve();
        },
        error: (err) => {
          console.log(err);
          resolve();
        }
      });
    });
  }
}
