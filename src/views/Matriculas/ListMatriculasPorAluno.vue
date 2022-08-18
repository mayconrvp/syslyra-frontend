<template>
  <v-container>
    <div class="topo my-5 ml-3">
      <div>
        <h2>Matriculas do aluno:</h2>
        <h3 style="color: ##483d8b">{{ nome }}</h3>
      </div>

      <div>
        <router-link
          :to="{
            name: 'CadMatricula',
          }"
        >
          <v-btn elevation="2" color="success" class="btn">Novo</v-btn>
        </router-link>
      </div>
    </div>

    <v-data-table
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
  filters: {
    formataDataEUA(date) {
      let data = new Date(date);
      let dia = String(data.getDate()).padStart(2, "0");
      let mes = String(data.getMonth() + 1).padStart(2, "0");
      let ano = data.getFullYear();
      return `${ano}-${mes}-${dia}`;
    },
    formataDataBR(date) {
      let data = new Date(date);
      let dia = String(data.getDate()).padStart(2, "0");
      let mes = String(data.getMonth() + 1).padStart(2, "0");
      let ano = data.getFullYear();
      return `${dia}-${mes}-${ano}`;
    },
  },
  data() {
    return {
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
    this.getListagem();
  },
  methods: {
    getListagem() {
      this.$http.get(`/alunos/${this.idAluno}`).then((response) => {
        this.nome = response.data.nome;
      });
      this.$http.get(`/alunos/${this.idAluno}/matricula`).then((response) => {
        this.matriculasAluno = response.data;
        this.nome = response.data[0].Aluno.nome;
        console.log(response.data);
      });
    },
    editItem(matricula) {
      this.$router.push({
        name: "AlteraMatricula",
        params: { idAluno: this.idAluno, idMatricula: matricula.id },
      });
    },
    deleteItem(matricula) {
      console.log(matricula);
      this.$swal({
        title: "Você tem certeza?",
        text: `Deseja realmente excluir a matrícula selecionada?\n 
          Item: "Id ${matricula.id} - ${matricula.Aluno.nome}" - ${matricula.Turma.descricao}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$http
            .delete(`alunos/${this.idAluno}/matricula/${matricula.id}`)
            .then(() => {
              let indice = this.matriculasAluno.indexOf(matricula);
              this.matriculasAluno.splice(indice, 1);
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
