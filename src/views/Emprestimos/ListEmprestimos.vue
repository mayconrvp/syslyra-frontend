<template>
  <v-container>
    <div class="topo my-5 ml-3">
      <h2>Registro de Empréstimos</h2>

      <div>
        <router-link :to="{ name: 'CadEmprestimo', path: '/emprestimos' }">
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
      :items="emprestimos"
      :items-per-page="20"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.dataEmprestimo="{ item }">
        <span>{{ item.dataEmprestimo | formataDataBR }}</span>
      </template>
      <template v-slot:item.dataDevolucao="{ item }">
        <span v-if="item.dataDevolucao">{{
          item.dataDevolucao | formataDataBR
        }}</span>
        <span v-else class="red--text font-italic caption">Não definido</span>
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
      if (date) {
        let data = new Date(date);
        let dia = String(data.getDate()).padStart(2, "0");
        let mes = String(data.getMonth() + 1).padStart(2, "0");
        let ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
      }
      return "Não definida";
    },
  },
  data() {
    return {
      headers: [
        { text: "Id", value: "id", sortable: true },
        { text: "Data de Empréstimo", value: "dataEmprestimo" },
        { text: "Data de Devolução", value: "dataDevolucao" },
        { text: "Aluno", value: "Aluno.nome" },
        { text: "Instrumento", value: "Instrumento.descricao" },
        { text: "Ações", value: "actions", sortable: false },
      ],
      emprestimos: [],
      search: "",
    };
  },
  created() {
    this.getListagem();
  },
  methods: {
    showAlert(text) {
      this.$swal(text);
    },
    getListagem() {
      this.$http.get("/emprestimos").then((response) => {
        this.emprestimos = response.data;
        console.log(this.emprestimos);
      });
      console.log(this.emprestimos);
    },
    editItem(emprestimo) {
      this.$router.push(`CadEmprestimos/${emprestimo.id}`);
    },
    visualizaItem(emprestimo) {
      this.$router.push(`emprestimos/${emprestimo.id}`);
    },
    deleteItem(emprestimo) {
      console.log(emprestimo);
      this.$swal({
        title: "Você tem certeza?",
        text: `A operação excluirá o registro de empréstimo de id ${emprestimo.id} e fará a devolução do instrumento "${emprestimo.Instrumento.descricao}" automaticamente.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$http
            .delete(`emprestimos/${emprestimo.id}`)
            .then(() => {
              let indice = this.emprestimos.indexOf(emprestimo);
              this.emprestimos.splice(indice, 1);
              this.$swal(
                "Deleção efetuada!",
                "Exclusão efetuada com sucesso.",
                "success"
              );
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
