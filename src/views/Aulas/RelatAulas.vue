<template>
  <v-container>
    <div class="my-5 ml-3">
      <div class="topo my-5 ml-3">
        <h2>Relatório de Aulas</h2>
        <div v-if="mostraTable">
          <v-btn @click="gerarPdf" elevation="2" color="success" class="btn"
            >Gerar PDF</v-btn
          >
        </div>
      </div>
      <v-autocomplete
        v-model="turma"
        :items="turmas"
        item-value="id"
        item-text="descricao"
        label="Selecione a turma"
        @change="getListagem"
        clearable
      ></v-autocomplete>
    </div>
    <v-data-table
      v-show="mostraTable"
      :headers="headers"
      :items="aulas"
      :items-per-page="20"
      class="elevation-1"
    >
      <template v-slot:item.data="{ item }">
        <span>{{ item.data | formataDataBR }}</span>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  filters: {
    formataDataBR(date) {
      let data = new Date(date);
      let dia = String(data.getDate()).padStart(2, "0");
      let mes = String(data.getMonth() + 1).padStart(2, "0");
      let ano = data.getFullYear();
      return `${dia}/${mes}/${ano}`;
    },
  },
  data() {
    return {
      headers: [
        { text: "Id", value: "id", sortable: true },
        { text: "Descrição", value: "descricao", sortable: true },
        { text: "Tipo", value: "tipo" },
        { text: "Turma", value: "Turma.descricao" },
        { text: "Data", value: "data" },
      ],
      turmas: [],
      aulas: [],
      turma: "",
    };
  },
  computed: {
    verificaTurmaSelecionada: function () {
      return this.turma ? true : false;
    },
    isDisabled: function () {
      return this.turma ? false : true;
    },
    mostraTable: function () {
      return !this.turma ? false : true;
    },
  },
  created() {
    this.$http.get("turmas/").then((response) => {
      this.turmas = response.data;
    });
    //this.getListagem();
  },
  methods: {
    getListagem() {
      this.$http.get(`/aulas/turma/${this.turma}`).then((response) => {
        this.aulas = response.data;
      });
    },
    formataData(date) {
      let dia = String(date.getDate()).padStart(2, "0");
      let mes = String(date.getMonth() + 1).padStart(2, "0");
      let ano = date.getFullYear();
      return `${ano}-${mes}-${dia}`;
    },
    gerarPdf() {
      this.$http
        .get(`/aulas/rel/${this.turma}`)
        .then(() => {
          this.$toast.fire("PDF Gerado com sucesso", "", "success");
          window.open(`${this.$http.defaults.baseURL}aulas/rel/${this.turma}`);
        })
        .catch((err) => {
          console.log(err);
          this.$toast.fire("Erro ao gerar PDF", "", "error");
        });
    },
  },
};
</script>

<style>
.controle {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 1.2em;
  margin-bottom: 20px;
  gap: 10px;
}

a {
  text-decoration: none;
}

.topo {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
