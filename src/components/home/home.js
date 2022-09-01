const degreesToRadians = async (degrees) => {
  var pi = Math.PI;
  return degrees * (pi / 180);
};

const getDistancia = async (
  originLatitude,
  originLongitude,
  destinationLatitude,
  destinationLongitude
) => {
  const EARTH_RADIUS = 6_371.071; // Earth

  const diffLatitudeRadians = await degreesToRadians(
    destinationLatitude - originLatitude
  );

  const diffLongitudeRadians = await degreesToRadians(
    destinationLongitude - originLongitude
  );

  const originLatitudeRadians = await degreesToRadians(originLatitude);
  const destinationLatitudeRadians = await degreesToRadians(
    destinationLatitude
  );

  const kmDistance =
    2 *
    EARTH_RADIUS *
    Math.asin(
      Math.sqrt(
        Math.sin(diffLatitudeRadians / 2) * Math.sin(diffLatitudeRadians / 2) +
          Math.cos(originLatitudeRadians) *
            Math.cos(destinationLatitudeRadians) *
            Math.sin(diffLongitudeRadians / 2) *
            Math.sin(diffLongitudeRadians / 2)
      )
    );

  return kmDistance;
};

const calcularPassagens = async (baseCalculos) => {
  try {
    let valorPassagemAdulto = 0;
    let valorPassagemCrianca = 0;
    let totalPassagem = 0;
    let valorDesconto = 0;

    const distancia = await getDistancia(
      baseCalculos.latitudeOrigem,
      baseCalculos.longitudeOrigem,
      baseCalculos.latitudeDestino,
      baseCalculos.longitudeDestino
    );

    if (baseCalculos.paisOrigem === baseCalculos.paisDestino) {
      // Quando for adulto usamos 0.3
      // Quando for crianças usamos 0.15
      if (baseCalculos.totalAdultos > 0) {
        valorPassagemAdulto = distancia * 0.3 * baseCalculos.totalAdultos;
      }

      if (baseCalculos.totalCriancas > 0) {
        valorPassagemCrianca = distancia * 0.15 * baseCalculos.totalCriancas;
      }
    } else {
      /**
       * Quando for para fora do pais, o valor por adulto é 0.5 e crianças 0,25
       */
      if (baseCalculos.totalAdultos > 0) {
        valorPassagemAdulto = distancia * 0.5 * baseCalculos.totalAdultos;
      }

      if (baseCalculos.totalCriancas > 0) {
        valorPassagemCrianca = distancia * 0.25 * baseCalculos.totalCriancas;
      }
    }

    /**
     * Caso o tipo da classe seja executiva
     * Adultos multiplicar a passagem por 1.8
     * Crianças multiplicar a passagem por 1.4
     */
    if (baseCalculos.tipoClass === "executiva") {
      valorPassagemAdulto = valorPassagemAdulto * 1.8;
      valorPassagemCrianca = valorPassagemCrianca * 1.4;
    }

    if (baseCalculos.milhas > 0) {
      valorDesconto = milhas * 0.02;
      totalPassagem =
        valorPassagemAdulto + valorPassagemCrianca - valorDesconto;
    } else {
      totalPassagem = valorPassagemAdulto + valorPassagemCrianca;
    }

    let teste = {
      origem: baseCalculos.paisOrigem,
      destino: baseCalculos.paisDestino,
      distancia: distancia,
      adultos: baseCalculos.totalAdultos,
      criancas: baseCalculos.totalCriancas,
      tipoVoo: baseCalculos.tipoClass,
      valorPorAdulto: valorPassagemAdulto,
      valorPorCrianca: valorPassagemCrianca,
      milhas: baseCalculos.milhas,
      descontoMilhas: valorDesconto,
      totalPassagem: totalPassagem,
    };

    return teste;
  } catch (error) {
    console.log(`Falha ao realizar calculo Passagem ${error}`);
  }
};

export { calcularPassagens };
