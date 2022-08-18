<template>
  <v-container>
    <div class="topo my-5 ml-3">
      <h2>Cadastro de Instrumentos</h2>

      <div>
        <router-link :to="{ name: 'CadInstrumento', path: '/instrumentos' }">
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
      :items="instrumentos"
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
        { text: "Descrição", value: "descricao", sortable: true },
        { text: "Modelo", value: "modelo" },
        { text: "Marca", value: "marca" },
        { text: "Numero de Série", value: "numeroSerie" },
        { text: "Ações", value: "actions", sortable: false },
      ],
      instrumentos: [],
      search: "",
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
    editItem(instrumento) {
      this.$router.push(`CadInstrumentos/${instrumento.id}`);
    },
    deleteItem(instrumento) {
      console.log(instrumento);
      this.$swal({
        title: "Você tem certeza?",
        text: `Deseja realmente excluir o instrumento selecionado? Instrumento a ser excluido: ${instrumento.descricao} ${instrumento.marca} ${instrumento.numeroSerie}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$http
            .delete(`instrumentos/${instrumento.id}`)
            .then(() => {
              let indice = this.instrumentos.indexOf(instrumento);
              this.instrumentos.splice(indice, 1);
              this.$swal("Deleção efetuada!", "", "success");
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
