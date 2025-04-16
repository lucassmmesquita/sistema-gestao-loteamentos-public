import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData() {
    try {
      // Buscar dados para o dashboard
      const totalClientes = await this.prisma.cliente.count();
      const totalContratos = await this.prisma.contrato.count();
      const totalLotes = await this.prisma.lote.count();
      
      // Calcular estatísticas de lotes
      const lotesDisponiveis = await this.prisma.lote.count({
        where: { status: 'disponivel' }
      });
      
      const lotesReservados = await this.prisma.lote.count({
        where: { status: 'reservado' }
      });
      
      const lotesVendidos = await this.prisma.lote.count({
        where: { status: 'vendido' }
      });
      
      // Calcular valor total de vendas (soma dos valores dos contratos)
      const resultadoValorTotal = await this.prisma.contrato.aggregate({
        _sum: {
          valorTotal: true
        }
      });
      
      // Convertendo para número para evitar problemas de formatação
      const valorTotalContratos = Number(resultadoValorTotal._sum.valorTotal || 0);
      
      // Calcular valor médio dos contratos
      let valorMedioContratos = 0;
      if (totalContratos > 0) {
        valorMedioContratos = valorTotalContratos / totalContratos;
      }
      
      return {
        totalClientes,
        totalContratos,
        totalLotes,
        lotesDisponiveis,
        lotesReservados,
        lotesVendidos,
        valorTotalContratos,
        valorMedioContratos
      };
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      throw new Error('Não foi possível carregar os dados do dashboard');
    }
  }
}