<template>
  <v-container>
    <div class="topo my-5 ml-3">
      <h2>Relatório de Alunos</h2>
      <div>
        <v-btn @click="gerarPDF" elevation="2" color="success" class="btn"
          >Gerar PDF</v-btn
        >
      </div>
    </div>

    <v-data-table
      :headers="headers"
      :items="alunos"
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
        { text: "Nome", value: "nome", sortable: true },
        { text: "Telefone", value: "telefone" },
        { text: "Email", value: "email" },
        { text: "Turno", value: "turno" },
        { text: "Responsável", value: "Responsavei.responsavel" },
      ],
      alunos: [],
    };
  },
  created() {
    this.getListagem();
  },
  methods: {
    getListagem() {
      this.$http.get("/alunos").then((response) => {
        this.alunos = response.data;
      });
    },
    gerarPDF() {
      this.$http
        .get("/alunos/rel")
        .then((response) => {
          console.log(response);
          this.$toast.fire("PDF Gerado com sucesso", "", "success");
          window.open(`${this.$http.defaults.baseURL}alunos/rel`);
        })
        .catch((err) => {
          this.$toast.fire("Erro ao gerar PDF", "", "error");
          console.log(err);
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
