<template>
  <v-container>
    <div class="topo my-5 ml-3">
      <h2>Relatório de Instrumentos</h2>
      <div>
        <v-btn @click="gerarPDF" elevation="2" color="success" class="btn"
          >Gerar PDF</v-btn
        >
      </div>
    </div>

    <v-data-table
      :headers="headers"
      :items="instrumentos"
      :items-per-page="20"
      class="elevation-1"
    >
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  filters: {},
  data() {
    return {
      headers: [
        { text: "Id", value: "id", sortable: true },
        { text: "Descrição", value: "descricao", sortable: true },
        { text: "Modelo", value: "modelo" },
        { text: "Marca", value: "marca" },
        { text: "Numero de Série", value: "numeroSerie" },
        { text: "Ações", value: "actions", sortable: false },
      ],
      instrumentos: [],
    };
  },
  created() {
    this.getListagem();
  },
  methods: {
    getListagem() {
      this.$http.get("/instrumentos").then((response) => {
        this.instrumentos = response.data;
        console.log(this.instrumentos);
      });
      console.log(this.instrumentos);
    },
    gerarPDF() {
      this.$http
        .get("/instrumentos/rel")
        .then((response) => {
          console.log(response);
          this.$toast.fire("PDF Gerado com sucesso", "", "success");
          window.open("http://localhost:3000/instrumentos/rel");
        })
        .catch(() => {
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
