import { Component } from '@angular/core';
import { CardReporte } from '../../components/card-reporte/card-reporte';
import { TrendingUp, TrendingDown, PiggyBank, Calendar } from 'lucide-angular';
import { GraficoResumenAnual } from '../../components/grafico-resumen-anual/grafico-resumen-anual';
  
@Component({
  selector: 'app-reportes-page',
  imports: [CardReporte,GraficoResumenAnual],
  templateUrl: './reportes-page.html',
  styleUrl: './reportes-page.css',
})
export class ReportesPage {

  TrendingUp = TrendingUp;
  TrendingDown = TrendingDown;
  PiggyBank = PiggyBank;
  Calendar = Calendar;

}
