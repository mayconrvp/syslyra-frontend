<template>
  <v-container>
    <div class="my-5 ml-3">
      <h2>Aulas por turma</h2>

      <v-autocomplete
        v-model="turma"
        :items="turmas"
        item-value="id"
        item-text="descricao"
        label="Selecione a turma"
        @change="getListagem"
        clearable
      ></v-autocomplete>
      <div class="text-center">
        <v-btn
          id="btnA"
          outlined
          elevation="2"
          color="indigo"
          class="btn"
          @click="visualizarAulas()"
          :disabled="isDisabled"
          >Visualizar aulas</v-btn
        >
      </div>
    </div>
  </v-container>
</template>


<script>
export default {
  data() {
    return {
      turmas: [],
      aulas: [],
      turma: "",
    };
  },
  computed: {
    isDisabled: function () {
      return this.turma ? false : true;
    },
  },
  created() {
    this.$http.get("turmas/").then((response) => {
      this.turmas = response.data;
    });
    this.getListagem();
  },
  methods: {
    getListagem() {
      this.$http.get(`/aulas/turma/${this.turma}`).then((response) => {
        this.aulas = response.data;
        console.log(this.aulas);
      });
    },
    visualizarAulas() {
      let idTurma = this.turma;
      if (!idTurma) {
        this.$swal(
          "Nenhuma turma selecionada. Selecione uma turma para efetuar o registro da aula",
          "",
          "info"
        );
      } else {
        this.$router.push(`/aulas/turma/${this.turma}`);
      }
    },
    editItem(aula) {
      console.log(aula);
      this.$router.push(`cadAulas/${aula.id}/turma/${this.turma}`);
    },
  },
};
</script>