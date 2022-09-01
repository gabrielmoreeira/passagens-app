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
    <InputNumber
      inputId="withoutgrouping"
      v-model="countMilhas"
      mode="decimal"
      :useGrouping="false"
    />
    <Slider id="milhas" v-model="countMilhas" :max="100000" />
  </div>

  <br />
  <br />
  <br />
  <div>
    <Button type="submit" @click="calcular()">Calcular</Button>
  </div>
</template>

<script>
import { getCountries } from "../../service/countries.service.js";
import { calcularPassagens } from "../home/home.js";
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

  data() {
    return {
      listCidadeOrigem: [],
      listCidadeDestino: [],
      baseCalculos: {},
    };
  },

  methods: {
 
    async calcular() {
      this.baseCalculos = {
        latitudeOrigem: this.cidadeOrigem.latitude,
        longitudeOrigem: this.cidadeOrigem.longitude,
        latitudeDestino: this.cidadeDestino.latitude,
        longitudeDestino: this.cidadeDestino.longitude,
        paisOrigem: this.paisOrigem.country,
        paisDestino: this.paisDestino.country,
        totalAdultos: this.countAdultos,
        totalCriancas: this.countCrianca,
        tipoClass: this.tipoClass,
        totalMilhas: this.countMilhas,
      };

      let result = await calcularPassagens(this.baseCalculos);

      console.log(`retorno do calcularPassagens: ${JSON.stringify(result)}`);
    },

    getCidadesOrigem(indexCidade) {
      this.listCidadeOrigem = indexCidade.cities;
    },

    getCidadeDestino(indexCidade) {
      this.listCidadeDestino = indexCidade.cities;
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
