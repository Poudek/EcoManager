const {
  parsePesoFormatado,
  parseMoedaFormatada,
  calcularSubtotalItem,
  calcularResumoPesagem
} = require('../src/calculos');

describe('Suite de Testes Unitários - EcoManager', () => {

  describe('Formatações de Peso e Moeda', () => {
    test('Deve converter string de balança em número correto (kg)', () => {
      expect(parsePesoFormatado('12,411')).toBe(12.411);
      expect(parsePesoFormatado('500')).toBe(0.5);
      expect(parsePesoFormatado('')).toBe(0);
    });

    test('Deve converter máscara de moeda para float numérico', () => {
      expect(parseMoedaFormatada('R$ 339,00')).toBe(339.0);
      expect(parseMoedaFormatada('R$ 15,50')).toBe(15.5);
      expect(parseMoedaFormatada('')).toBe(0);
    });
  });

  describe('Cálculos de Itens e Resumo da Pesagem', () => {
    test('Deve calcular o subtotal de um item com precisão', () => {
      // 10.5 kg a R$ 30,00/kg = R$ 315,00
      const subtotal = calcularSubtotalItem(30.0, 10.5);
      expect(subtotal).toBe(315.0);
    });

    test('Deve calcular o resumo total com dedução de descontos', () => {
      const itens = [
        { peso: 10.0, total: 300.0 },
        { peso: 2.5, total: 50.0 }
      ];
      const descontos = [
        { motivo: 'IMPUREZA', valor: 20.0 },
        { motivo: 'EMBALAGEM', valor: 10.0 }
      ];

      const resultado = calcularResumoPesagem(itens, descontos);

      expect(resultado.pesoTotal).toBe(12.5);
      expect(resultado.valorBruto).toBe(350.0);
      expect(resultado.totalDescontos).toBe(30.0);
      expect(resultado.valorFinal).toBe(320.0);
    });

    test('Não deve permitir valor final negativo caso o desconto supere o total', () => {
      const itens = [{ peso: 1.0, total: 50.0 }];
      const descontos = [{ motivo: 'ADIANTAMENTO', valor: 100.0 }];

      const resultado = calcularResumoPesagem(itens, descontos);
      expect(resultado.valorFinal).toBe(0);
    });
  });

});