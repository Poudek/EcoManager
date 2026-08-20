/**
 * Utilitários de parsing e regras de negócio para pesagem e demonstrativos.
 */

function parsePesoFormatado(valorTexto) {
  if (!valorTexto) return 0;
  const apenasDigitos = String(valorTexto).replace(/\D/g, '');
  return parseFloat(apenasDigitos) / 1000 || 0;
}

function parseMoedaFormatada(valorTexto) {
  if (!valorTexto) return 0;
  const apenasDigitos = String(valorTexto).replace(/\D/g, '');
  return parseFloat(apenasDigitos) / 100 || 0;
}

function calcularSubtotalItem(precoKg, peso) {
  const preco = parseFloat(precoKg) || 0;
  const p = typeof peso === 'string' ? parsePesoFormatado(peso) : (parseFloat(peso) || 0);
  return Number((preco * p).toFixed(2));
}

function calcularResumoPesagem(itens = [], descontos = []) {
  const pesoTotal = itens.reduce((acc, item) => acc + (parseFloat(item.peso) || 0), 0);
  const valorBruto = itens.reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0);
  const totalDescontos = descontos.reduce((acc, desc) => acc + (parseFloat(desc.valor) || 0), 0);
  const valorFinal = Math.max(0, valorBruto - totalDescontos);

  return {
    pesoTotal: Number(pesoTotal.toFixed(3)),
    valorBruto: Number(valorBruto.toFixed(2)),
    totalDescontos: Number(totalDescontos.toFixed(2)),
    valorFinal: Number(valorFinal.toFixed(2))
  };
}

// Compatibilidade Node.js / Jest e Navegador
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parsePesoFormatado,
    parseMoedaFormatada,
    calcularSubtotalItem,
    calcularResumoPesagem
  };
}