<template>
  <v-container>
    <div class="topo my-5 ml-3">
      <h2>Cadastro de Funcionários</h2>

      <div>
        <router-link :to="{ name: 'CadFuncionario', path: '/funcionarios' }">
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
      :items="funcionarios"
      :items-per-page="20"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
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
      headers: [
        { text: "Id", value: "id", sortable: true },
        { text: "Nome", value: "nome", sortable: true },
        { text: "Cargo", value: "cargo" },
        { text: "Telefone", value: "telefone" },
        { text: "Ações", value: "actions", sortable: false },
      ],
      funcionarios: [],
      search: "",
    };
  },
  created() {
    this.getListagem();
  },
  methods: {
    getListagem() {
      this.$http.get("/funcionarios").then((response) => {
        this.funcionarios = response.data;
      });
    },
    editItem(funcionario) {
      this.$router.push(`cadFuncionarios/${funcionario.id}`);
    },
    visualizaItem(funcionario) {
      this.$router.push({
        name: "VisualizarFuncionario",
        params: { id: funcionario.id },
      });
    },

    deleteItem(funcionario) {
      console.log(funcionario);
      this.$swal({
        title: "Você tem certeza?",
        text: `Deseja realmente excluir o(a) funcionario(a) selecionado(a)? "${funcionario.nome}"`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$http
            .delete(`funcionarios/${funcionario.id}`)
            .then(() => {
              let indice = this.funcionarios.indexOf(funcionario);
              this.funcionarios.splice(indice, 1);
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
