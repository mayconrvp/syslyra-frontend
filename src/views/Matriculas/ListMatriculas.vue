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
        @change="getListagem"
        label="Aluno"
        required
      ></v-autocomplete>
      <div class="text-center">
        <v-btn
          id="btnA"
          outlined
          elevation="2"
          color="indigo"
          :disabled="isDisabled"
          class="btn"
          @click="novaMatricula()"
          >NOVA MATRÍCULA</v-btn
        >
      </div>
    </div>
    <v-text-field
      v-show="mostraTable"
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
    ></v-text-field>
    <v-data-table
      v-show="mostraTable"
      :headers="headers"
      :items="matriculasAluno"
      :items-per-page="20"
      class="elevation-1"
    >
      <template v-slot:item.data="{ item }">
        <span>{{ item.data | formataDataBR }}</span>
      </template>
      <template v-slot:item.actions="{ item }" class="justify-center">
        <v-icon @click="visualizaItem(item)" class="mr-2"
          >mdi-eye-outline</v-icon
        >
        <v-icon color="primary" class="mr-2" @click="editItem(item)"
          >mdi-pencil</v-icon
        >
        <v-icon color="error" @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      aluno: "",
      alunos: [],
      headers: [
        { text: "Id da Matricula", value: "id", sortable: true },
        { text: "Turma", value: "Turma.descricao", sortable: true },
        { text: "Data da Matricula", value: "data", dataType: "Date" },
        { text: "Ações", value: "actions", sortable: false },
      ],
      matriculasAluno: [],
      matricula: "",
      idAluno: this.$route.params.idAluno,
      nomeTurma: "",
      nome: "",
    };
  },
  created() {
    this.getListagemAlunos();
  },
  computed: {
    verificaAlunoSelecionado: function () {
      return this.aluno ? true : false;
    },
    isDisabled: function () {
      return this.aluno ? false : true;
    },
    mostraTable: function () {
      return !this.aluno ? false : true;
    },
  },
  methods: {
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
    getListagem() {
      this.$http.get(`/alunos/${this.aluno}/matricula`).then((response) => {
        this.matriculasAluno = response.data;
        this.nome = response.data[0].Aluno.nome;
      });
    },

    novaMatricula() {
      let idAluno = this.aluno;
      if (!idAluno) {
        alert("Nenhum aluno selecionado");
      } else {
        this.$router.push(`CadMatricula/${idAluno}/matricula`);
      }
    },

    editItem(matricula) {
      this.$router.push({
        name: "AlteraMatricula",
        params: { idAluno: this.idAluno, idMatricula: matricula.id },
      });
    },
    deleteItem(matricula) {
      if (confirm("Confirma exclusão?")) {
        this.$http
          .delete(`alunos/${this.idAluno}/matricula/${matricula.id}`)
          .then(
            () => {
              let indice = this.matriculasAluno.indexOf(matricula);
              this.matriculasAluno.splice(indice, 1);
              alert(`Deleção efetuada com sucesso`);
            },
            (err) => {
              alert("Não foi possivel efetuar a deleção. Erro: " + err);
              console.log(err);
            }
          );
      }
    },
    visualizaItem(matricula) {
      this.$router.push({
        name: "VisualizarMatricula",
        params: { idAluno: this.idAluno, idMatricula: matricula.id },
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
