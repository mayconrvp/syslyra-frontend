<template>
  <v-container>
    <div class="topo my-5 ml-3">
      <h2>Cadastro de Alunos</h2>

      <div>
        <router-link :to="{ name: 'CadAluno', path: '/alunos' }">
          <v-btn elevation="2" color="success" class="btn">Novo</v-btn>
        </router-link>
      </div>
    </div>

    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="alunos"
      :items-per-page="20"
      :search="search"
      class="elevation-1"
    >
      <!-- <template v-slot:top>
        <v-text-field
          v-model="search"
          label="Search (UPPER CASE ONLY)"
          class="mx-4"
        ></v-text-field>
      </template> -->
      <template class="justify-center" v-slot:item.actions="{ item }">
        <v-icon @click="visualizaItem(item)" class="mr-2"
          >mdi-eye-outline</v-icon
        >
        <v-icon color="primary" class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon color="error" class="mr-2" @click="deleteItem(item)">
          mdi-delete
        </v-icon>

        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="brown"
              v-bind="attrs"
              v-on="on"
              @click="matriculaAluno(item)"
            >
              mdi-alpha-m-box
            </v-icon>
          </template>
          <span>Matrícula</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { logoutMixin } from "../../mixins";
//import CategoriaService from "../services/AlunoService";
//import AlunoService from "../../services/AlunoService";

export default {
  mixins: [logoutMixin],
  data() {
    return {
      nome: "",
      alunos: [],
      search: "",
      // categoriaEdit: new Categoria(),
      headers: [
        { text: "Id", value: "id", sortable: true },
        { text: "Nome", value: "nome", sortable: true },
        { text: "Telefone", value: "telefone" },
        { text: "Email", value: "email" },
        { text: "Turno", value: "turno" },
        { text: "Ações", value: "actions", sortable: false },
      ],
    };
  },
  created() {
    this.getListagem();
  },
  methods: {
    getListagem() {
      this.$http
        .get("alunos")
        .then((response) => {
          this.alunos = response.data;
        })
        .catch((err) => {
          if (
            err.response.status == 401 ||
            err.response.data.message == "Token está invalido"
          ) {
            this.efetuarLogout();
            ("");
          }
          console.log(err);
        });
    },
    editItem(aluno) {
      this.$router.push("CadAlunos/" + aluno.id);
    },
    visualizaItem(aluno) {
      this.$router.push({
        name: "VisualizarAluno",
        params: { id: aluno.id },
      });
    },
    matriculaAluno(aluno) {
      this.$router.push({
        name: "MatriculasPorAluno",
        params: { idAluno: aluno.id },
      });
    },
    deleteItem(aluno) {
      console.log(aluno);
      this.$swal({
        title: "Você tem certeza?",
        text: `Deseja realmente excluir o(a) aluno(a) selecionado(a)? Item: ${aluno.nome}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$http
            .delete(`alunos/${aluno.id}`)
            .then(() => {
              let indice = this.alunos.indexOf(aluno);
              this.alunos.splice(indice, 1);
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
