// src/hooks/useAuth.js

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  const { user } = context;
  
  // Funções com verificações de segurança
  const isPerfil = (perfil) => {
    return user?.perfil === perfil;
  };
  
  const isLoteadora = () => isPerfil('loteadora');
  const isVendedor = () => isPerfil('vendedor');
  const isDonoTerreno = () => isPerfil('dono_terreno');
  
  // Verificações específicas por tipo de recurso
  const canCreateContrato = () => {
    return isLoteadora() || isVendedor();
  };
  
  const canViewContrato = (contrato) => {
    if (!contrato) return false;
    if (isLoteadora()) return true;
    if (isVendedor() && contrato.vendedorId === user?.id) return true;
    if (isDonoTerreno() && contrato.proprietarioId === user?.id) return true;
    return false;
  };
  
  const canEditContrato = (contrato) => {
    if (!contrato) return false;
    if (contrato.estado === 'oficializado') return false;
    if (isLoteadora()) return true;
    if (isVendedor() && contrato.vendedorId === user?.id && contrato.estado === 'pre_contrato') return true;
    return false;
  };
  
  const canCreateCliente = () => {
    return isLoteadora() || isVendedor();
  };
  
  const canViewCliente = (cliente) => {
    if (!cliente) return false;
    if (isLoteadora()) return true;
    if (isVendedor() && cliente.vendedorId === user?.id) return true;
    return false;
  };
  
  const canEditCliente = (cliente) => {
    if (!cliente) return false;
    if (isLoteadora()) return true;
    if (isVendedor() && cliente.vendedorId === user?.id) return true;
    return false;
  };
  
  const canViewLote = (lote) => {
    if (!lote) return false;
    if (isLoteadora()) return true;
    if (isDonoTerreno() && lote.loteamentoId) {
      const loteamento = lote.loteamentoRef;
      return loteamento && loteamento.proprietarioId === user?.id;
    }
    return true; // Vendedores podem ver todos os lotes para venda
  };
  
  const canEditLote = (lote) => {
    if (!lote) return false;
    if (isLoteadora()) return true;
    return false; // Apenas loteadora pode editar lotes
  };
  
  return {
    ...context,
    user: user || {}, // Garantir que user não seja undefined
    isPerfil,
    isLoteadora,
    isVendedor,
    isDonoTerreno,
    canCreateContrato,
    canViewContrato,
    canEditContrato,
    canCreateCliente,
    canViewCliente,
    canEditCliente,
    canViewLote,
    canEditLote
  };
};

export default useAuth;