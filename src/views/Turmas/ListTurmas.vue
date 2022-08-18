<template>
  <v-container>
    <div class="topo my-5 ml-3">
      <h2>Cadastro de Turmas</h2>

      <div>
        <router-link :to="{ name: 'CadTurma', path: '/turmas' }">
          <v-btn elevation="2" color="success" class="btn">Novo</v-btn>
        </router-link>
      </div>
    </div>

    <v-data-table
      :headers="headers"
      :items="turmas"
      :items-per-page="20"
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
        { text: "Turma", value: "descricao", sortable: true },
        { text: "Curso", value: "Curso.nome" },
        { text: "Dias", value: "dias" },
        { text: "Horário", value: "horario" },
        { text: "Ações", value: "actions", sortable: false },
      ],
      turmas: [],
    };
  },
  created() {
    this.getListagem();
  },
  methods: {
    getListagem() {
      this.$http.get("/turmas").then((response) => {
        this.turmas = response.data;
      });
    },
    editItem(turma) {
      this.$router.push(`CadTurmas/${turma.id}`);
    },
    deleteItem(turma) {
      let qtdAulas = 0;
      this.$http.get(`/aulas/turma/${turma.id}`).then((response) => {
        qtdAulas = response.data.length;
        if (qtdAulas > 0) {
          this.$swal({
            title: "ATENÇÃO",
            text: "Existem aulas registradas para essa turma, por isso não será possivel fazer a exclusão dessa turma por enquanto.",
            icon: "error",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
          });
          return;
        }
      });

      this.$swal({
        title: "Você tem certeza?",
        text: "Deseja realmente excluir a turma selecionada?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$http
            .delete(`turmas/${turma.id}`)
            .then(() => {
              let indice = this.turmas.indexOf(turma);
              this.turmas.splice(indice, 1);
              this.$swal(
                "Deleção efetuada!",
                "Exclusão de turma efetuada com sucesso.",
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
    aulasPorTurma: function (id) {
      //let qtdAulas = "";
      this.$http.get(`/aulas/turma/${id}`).then((response) => {
        return response.data.length;
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
