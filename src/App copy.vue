<template>
  <div class="card">
    <div class="flex flex-row flex-wrap card-container" id="tipoclass">
      <div class="flex align-items-center justify-content-center">
        <div class="formatacaoGeral">
          <h4>País de origem</h4>
          <Dropdown
            v-model="paisOrigem"
            :options="countriesList"
            optionLabel="country"
            placeholder="Selecione o País"
            @change="getCidadesOrigem(paisOrigem)"
          />
        </div>

        <div class="formatacaoGeral">
          <h4>Cidade de Origem</h4>
          <Dropdown
            id="cityOrigin"
            v-model="cidadeOrigem"
            :options="listCidadeOrigem"
            optionLabel="city"
            placeholder="Selecione a cidade"
          />
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="flex flex-row flex-wrap card-container" id="tipoclass">
      <div class="flex align-items-center justify-content-center">
        <div class="formatacaoGeral">
          <h4>País de Destino</h4>
          <Dropdown
            v-model="paisDestino"
            :options="countriesList"
            optionLabel="country"
            placeholder="Selecione o País"
            @change="getCidadeDestino(paisDestino)"
          />
        </div>

        <div class="formatacaoGeral">
          <h4>Cidade de destino</h4>
          <Dropdown
            v-model="cidadeDestino"
            :options="listCidadeDestino"
            optionLabel="city"
            placeholder="Selecione a cidade"
          />
        </div>
      </div>
    </div>
  </div>

  <div>
    <div class="card">
      <div class="flex flex-row flex-wrap card-container">
        <div class="flex align-items-center justify-content-center">
          <div id="adultos">
            <h4>Adultos</h4>
            <Button label="+" @click="addAdulto" />
            <span> {{ countAdultos }} </span>
            <Button label="-" @click="removerAdulto" />
          </div>

          <div id="criancas">
            <h4>Crianças</h4>
            <Button label="+" @click="addCrianca" />
            <span> {{ countCrianca }} </span>
            <Button label="-" @click="removerCrianca" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="flex flex-row flex-wrap card-container" id="tipoclass">
      <div class="flex align-items-center justify-content-center">
        <div class="field-radiobutton">
          <div id="radion">
            <RadioButton
              inputId="economica"
              name="economica"
              value="economica"
              v-model="tipoClass"
            />
            <label for="economica">Economica</label>
          </div>
        </div>
      </div>
      <div class="flex align-items-center justify-content-center">
        <div class="field-radiobutton">
          <div id="radion">
            <RadioButton
              inputId="executiva"
              name="executiva"
              value="executiva"
              v-model="tipoClass"
            />
            <label for="executiva">Executiva</label>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div>
    <h5>Utilizar : {{ countMilhas }} Milhas</h5>
    <InputNumber inputId="withoutgrouping" v-model="countMilhas" mode="decimal" :useGrouping="false" />
    <Slider id="milhas" v-model="countMilhas" :max="100000" />
  </div>

  <br />
  <br />
  <br />
  <div>
    <Button type="submit" @click="calculcar()">Calcular</Button>
  </div>
</template>

<script>
import { getCountries } from "./service/countries.service";
import { onMounted, ref, watch } from "vue";

export default {
  setup() {
    const countriesList = ref([]);
    const paisOrigem = ref();
    const cidadeOrigem = ref();
    const paisDestino = ref();
    const cidadeDestino = ref();
    const tipoClass = ref(null);
    const countAdultos = ref(0);
    const countCrianca = ref(0);
    const countMilhas = ref(0);

    onMounted(() => {
      getCountries().then((resp) => {
        countriesList.value = resp;
      });
    });

    const addAdulto = () => {
      countAdultos.value++;
    };

    watch(countAdultos, () => {});

    const removerAdulto = () => {
      countAdultos.value--;
    };
    watch(countAdultos, () => {});

    const addCrianca = () => {
      countCrianca.value++;
    };
    watch(countCrianca, () => {});

    const removerCrianca = () => {
      countCrianca.value--;
    };
    watch(countCrianca, () => {});

    return {
      countriesList,
      paisOrigem,
      countAdultos,
      addAdulto,
      removerAdulto,
      countCrianca,
      addCrianca,
      removerCrianca,
      cidadeOrigem,
      tipoClass,
      countMilhas,
      paisDestino,
      cidadeDestino,
    };
  },

  methods: {
    listCidadeOrigem: [],
    listCidadeDestino: [],
    valorPassagemAdulto: 0,
    valorPassagemCrianca: 0,
    totalPassagem: 0,


    degreesToRadians(degrees) {
      var pi = Math.PI;
      return degrees * (pi / 180);
    },

    getDistance(
      originLatitude,
      originLongitude,
      destinationLatitude,
      destinationLongitude
    ) {
      const EARTH_RADIUS = 6_371.071; // Earth

      const diffLatitudeRadians = this.degreesToRadians(destinationLatitude - originLatitude);

      const diffLongitudeRadians = this.degreesToRadians(destinationLongitude - originLongitude);

      const originLatitudeRadians = this.degreesToRadians(originLatitude);
      const destinationLatitudeRadians = this.degreesToRadians(destinationLatitude);
      
      const kmDistance =
        2 *
        EARTH_RADIUS *
        Math.asin(
          Math.sqrt(
            Math.sin(diffLatitudeRadians / 2) *
              Math.sin(diffLatitudeRadians / 2) +
              Math.cos(originLatitudeRadians) *
                Math.cos(destinationLatitudeRadians) *
                Math.sin(diffLongitudeRadians / 2) *
                Math.sin(diffLongitudeRadians / 2)
          )
        );

      return kmDistance;
    },

    getCidadesOrigem(indexCidade) {
      this.listCidadeOrigem = indexCidade.cities;
    },

    getCidadeDestino(indexCidade) {
      this.listCidadeDestino = indexCidade.cities;
    },

    calculcar() {

      this.valorPassagemAdulto = 0;
      this.valorPassagemCrianca = 0;
      this.valorDesconto = 0;

      
      const distancia = this.getDistance(
        this.cidadeOrigem.latitude,
        this.cidadeOrigem.longitude,
        this.cidadeDestino.latitude,
        this.cidadeDestino.longitude
      );

      if (this.paisOrigem.country === this.paisDestino.country) {
        // Quando for adulto usamos 0.3
        // Quando for crianças usamos 0.15
        if (this.countAdultos > 0) {
          this.valorPassagemAdulto = (distancia * 0.3) * this.countAdultos;
        }

        if (this.countCrianca > 0) {
          this.valorPassagemCrianca = (distancia * 0.15) * this.countCrianca;
        }
      } else {
        /**
         * Quando for para fora do pais, o valor por adulto é 0.5 e crianças 0,25
         */
        if (this.countAdultos > 0) {
          this.valorPassagemAdulto = (distancia * 0.5) * this.countAdultos;
        }

        if (this.countCrianca > 0) {
          this.valorPassagemCrianca = (distancia * 0.25) * this.countCrianca;
        }
      }

      /**
       * Caso o tipo da classe seja executiva
       * Adultos multiplicar a passagem por 1.8
       * Crianças multiplicar a passagem por 1.4
       */
      if (this.tipoClass === "executiva") {
        this.valorPassagemAdulto = this.valorPassagemAdulto * 1.8;
        this.valorPassagemCrianca = this.valorPassagemCrianca * 1.4;
      }

      if (this.countMilhas > 0) {
        let valorDesconto = this.countMilhas * 0.02;
        this.totalPassagem = (this.valorPassagemAdulto + this.valorPassagemCrianca) - valorDesconto;
      }

      console.log(`Total das passagens ${ this.totalPassagem }`)
    },
  },
};
</script>

<style scoped>
#adultos {
  margin-right: 10px;
}

#adultos button,
span {
  margin-right: 10px;
}

#criancas button,
span {
  margin-right: 10px;
}

#tipoclass {
  margin-top: 10px;
  margin-right: 10px;
}
.formatacaoGeral {
  margin-right: 10px;
}

#radion {
  margin-top: 20px;
  margin-right: 10px;
}

#radion RadioButton {
  margin-right: 10px;
}
</style>
