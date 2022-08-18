<template>
  <v-container>
    <div class="my-5 ml-3">
      <h2>Aulas por turma</h2>

      <v-text-field v-model="nomeTurma" readonly label="Turma"></v-text-field>
      <div class="text-center">
        <v-btn
          id="btnA"
          outlined
          elevation="2"
          color="indigo"
          class="btn"
          @click="novaAula()"
          :disabled="isDisabled"
          >NOVA AULA</v-btn
        >
      </div>
    </div>

    <v-row>
      <v-col cols="12">
        <v-text-field
          v-show="mostraTable"
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>
    <v-data-table
      v-show="mostraTable"
      :headers="headers"
      :items="aulas"
      :items-per-page="20"
      :search="search"
      class="elevation-1"
    >
      <template class="justify-center" v-slot:item.concluida="{ item }">
        <v-simple-checkbox
          disabled
          v-model="item.concluida"
          color="success"
        ></v-simple-checkbox>
      </template>
      <!-- <template v-slot:item.concluida="{ item }">
        <span>{{ item.concluida }}</span>
      </template> -->
      <template v-slot:item.data="{ item }">
        <span>{{ item.data | formataDataBR }}</span>
      </template>
      <template v-slot:item.actions="{ item }" class="justify-center">
        <v-icon @click="visualizaItem(item)" class="mx-1"
          >mdi-eye-outline</v-icon
        >
        <v-icon color="primary" class="mx-1" @click="editItem(item)"
          >mdi-pencil</v-icon
        >
        <v-icon color="error" class="mx-1" @click="deleteItem(item)"
          >mdi-delete</v-icon
        >
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-if="!item.concluida"
              class="mx-1"
              color="warning"
              @click="concluirItem(item)"
              v-bind="attrs"
              v-on="on"
              >mdi-check-circle</v-icon
            >
          </template>
          <span>Concluir aula</span>
        </v-tooltip>
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
      turma: this.$route.params.idTurma,
      headers: [
        { text: "Descrição", value: "descricao", sortable: true },
        { text: "Tipo", value: "tipo" },
        { text: "Turma", value: "Turma.descricao" },
        { text: "Data", value: "data" },
        { text: "Concluida", value: "concluida" },
        { text: "Ações", value: "actions", sortable: false },
      ],
      turmas: [],
      aulas: [],
      search: "",
      concluida: "",
      nomeTurma: "",
    };
  },
  computed: {
    verificaTurmaSelecionada: function () {
      return this.turma ? true : false;
    },
    isDisabled: function () {
      return this.turma ? false : true;
    },
    isConcluida: function (item) {
      return item.concluida ? true : false;
    },
    mostraTable: function () {
      return !this.turma ? false : true;
    },
  },
  created() {
    this.$http.get("turmas/").then((response) => {
      this.turmas = response.data;
    });
    this.$http.get("turmas/21").then((response) => {
      this.nomeTurma = response.data.descricao;
      console.log(response.data);
    });
    this.getListagem();
  },
  methods: {
    getListagem() {
      this.$http.get(`/aulas/turma/${this.turma}`).then((response) => {
        this.aulas = response.data;

        //console.log(this.nomeTurma);
      });
    },
    novaAula() {
      let idTurma = this.turma;
      if (!idTurma) {
        this.$swal(
          "Nenhuma turma selecionada. Selecione uma turma para efetuar o registro da aula",
          "",
          "info"
        );
      } else {
        this.$router.push(`/cadAulas/turma/${idTurma}`);
      }
    },
    editItem(aula) {
      console.log(aula);
      this.$router.push(`/cadAulas/${aula.id}/turma/${this.turma}`);
    },
    deleteItem(aula) {
      console.log(aula);
      this.$swal({
        title: "Você tem certeza?",
        text: `Deseja realmente excluir a aula selecionada? Item: ${aula.descricao}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$http
            .delete(`aulas/${aula.id}/turma/${this.turma}`)
            .then(() => {
              let indice = this.aulas.indexOf(aula);
              this.aulas.splice(indice, 1);
              this.$swal("Exclusão efetuada!", "", "success");
            })
            .catch((err) => {
              this.$toast.fire(
                "Não foi possivel efetuar a deleção.",
                "",
                "error"
              );
              console.log(err);
            });
        }
      });
    },
    visualizaItem(aula) {
      this.$router.push({
        name: "VisualizarAula",
        params: { idTurma: this.turma, idAula: aula.id },
      });
    },
    concluirItem(aula) {
      if (aula.concluida) {
        return this.$swal("Essa aula já foi concluida", "", "info");
      }
      this.$swal({
        title: "Você tem certeza?",
        text: `Deseja realmente marcar a aula "${aula.descricao}" como concluída? Esse processo não poder ser revertido.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "SIM",
        cancelButtonText: "CANCELAR",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$http
            .get(`aulas/close/${aula.id}/turma/${this.turma}`)
            .then(() => {
              this.$toast.fire("Aula marcada concluída.", "", "success");
              this.$router.go();
            })
            .catch(() => {
              this.$toast.fire(
                "Não foi possivel efetuar a conclusão da aula.",
                "",
                "error"
              );
            });
        }
      });
    },

    formataData(date) {
      let dia = String(date.getDate()).padStart(2, "0");
      let mes = String(date.getMonth() + 1).padStart(2, "0");
      let ano = date.getFullYear();
      return `${ano}-${mes}-${dia}`;
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
</style>