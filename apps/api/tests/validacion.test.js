describe('Validacion de piezas', () => {
  test('no debe exceder el total de piezas requeridas', () => {
    const totalRequeridas = 100;
    const piezasAcumuladas = 80;
    const piezasNuevas = 30;
    const excede = piezasAcumuladas + piezasNuevas > totalRequeridas;
    expect(excede).toBe(true);
  });

  test('debe permitir registrar si no excede el limite', () => {
    const totalRequeridas = 100;
    const piezasAcumuladas = 60;
    const piezasNuevas = 20;
    const excede = piezasAcumuladas + piezasNuevas > totalRequeridas;
    expect(excede).toBe(false);
  });

  test('debe detectar cuando el lote se completa exactamente', () => {
    const totalRequeridas = 100;
    const piezasAcumuladas = 80;
    const piezasNuevas = 20;
    const completo = piezasAcumuladas + piezasNuevas === totalRequeridas;
    expect(completo).toBe(true);
  });
});