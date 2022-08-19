<template>
  <v-container>
    <div class="topo my-5 ml-3">
      <h2>Matrículas</h2>
    </div>
    <div class="subtitle my-5 ml-3">
      <h4>Selecione o aluno para ser matriculado</h4>

      <v-autocomplete
        clearable
        v-model="aluno"
        :items="alunos"
        item-value="id"
        item-text="nome"
        :error-messages="selectErrors"
        label="Aluno"
        required
      ></v-autocomplete>
      <div class="text-center">
        <v-btn
          id="btnA"
          outlined
          elevation="2"
          color="indigo"
          class="btn"
          @click="novaMatricula()"
          >NOVA MATRÍCULA</v-btn
        >
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "Id", value: "id", sortable: true },
        { text: "Turma", value: "descricao", sortable: true },
        { text: "Curso", value: "Curso.nome" },
        { text: "Dias", value: "dias" },
        { text: "Horário", value: "horario" },
        { text: "Ações", value: "actions", sortable: false },
      ],
      aluno: "",
      turmas: [],
      alunos: [],
    };
  },
  created() {
    this.getListagemTurmas();
    this.getListagemAlunos();
  },
  computed: {},
  methods: {
    getListagemTurmas() {
      this.$http.get("/turmas").then((response) => {
        this.turmas = response.data;
        console.log(this.turmas);
      });
      console.log(this.turmas);
    },
    getListagemAlunos() {
      this.$http.get("/alunos").then(
        (response) => {
          this.alunos = response.data;
          console.log(this.alunos);
        },
        (err) => {
          console.log(err);
        }
      );
    },

    novaMatricula() {
      let idAluno = this.aluno;
      if (!idAluno) {
        alert("Nenhum aluno selecionado");
      }
    },

    editItem(turma) {
      this.$router.push(`CadTurmas/${turma.id}`);
    },
    deleteItem(turma) {
      if (confirm("Confirma exclusão?")) {
        this.$http.delete(`turmas/${turma.id}`).then(
          () => {
            let indice = this.turmas.indexOf(turma);
            this.turmas.splice(indice, 1);
            alert(`Deleção efetuada com sucesso`);
          },
          (err) => {
            alert("Não foi possivel efetuar a deleção. Erro: " + err);
            console.log(err);
          }
        );
      }
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
