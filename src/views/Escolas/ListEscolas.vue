<template>
  <v-container>
    <div class="topo my-5 ml-3">
      <h2>Cadastro de Escolas</h2>

      <div>
        <router-link :to="{ name: 'CadEscola', path: '/escolas' }">
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
      :items="escolas"
      :items-per-page="20"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.actions="{ item }">
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
        { text: "Escola", value: "nome", sortable: true },
        { text: "Telefone", value: "telefone" },
        { text: "Ações", value: "actions", sortable: false },
      ],
      escolas: [],
      search: "",
    };
  },
  created() {
    this.getListagem();
  },
  methods: {
    getListagem() {
      this.$http.get("/escolas").then((response) => {
        this.escolas = response.data;
        console.log(this.escolas);
      });
      console.log(this.escolas);
    },
    editItem(escola) {
      this.$router.push(`CadEscolas/${escola.id}`);
    },
    deleteItem(escola) {
      console.log(escola);
      this.$swal({
        title: "Você tem certeza?",
        text: `Deseja realmente excluir a escola selecionada? "${escola.nome}"`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$http
            .delete(`escolas/${escola.id}`)
            .then(() => {
              let indice = this.escolas.indexOf(escola);
              this.escolas.splice(indice, 1);
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
