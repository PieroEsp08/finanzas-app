import { Component } from '@angular/core';
import { CardMetrica } from '../../components/card-metrica/card-metrica';
import { GraficoTendenciaFinanciera } from '../../components/grafico-tendencia-financiera/grafico-tendencia-financiera';
import { GraficoGastosCategoria } from '../../components/grafico-gastos-categoria/grafico-gastos-categoria';
import { TransaccionesRecientes } from '../../components/transacciones-recientes/transacciones-recientes';
import { MetasAhorro } from '../../components/metas-ahorro/metas-ahorro';
import { PresupuestoCategoria } from '../../components/presupuesto-categoria/presupuesto-categoria';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-angular';
  
@Component({
  selector: 'app-dashboard-page',
  imports: [CardMetrica, GraficoTendenciaFinanciera,GraficoGastosCategoria,TransaccionesRecientes,MetasAhorro,PresupuestoCategoria],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {

  walletIcon = Wallet;

  trendingUpIcon = TrendingUp;

  trendingDownIcon = TrendingDown;

  piggyBankIcon = PiggyBank;

}
