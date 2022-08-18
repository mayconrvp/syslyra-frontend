<template>
  <v-container>
    <v-card class="mt-5">
      <v-form @submit.prevent="grava()">
        <v-card>
          <v-container>
            <div class="my-3">
              <h2>Matrícula: {{ this.idMatricula }}</h2>
            </div>
            <v-text-field
              v-model="nome"
              label="Nome do aluno"
              outlined
              readonly
            >
            </v-text-field>
            <v-text-field
              v-model="dataMatricula"
              label="Data da matrícula"
              type="date"
              outlined
              readonly
            >
            </v-text-field>
            <v-text-field
              v-model="turma"
              label="Turma"
              outlined
              readonly
            ></v-text-field>
          </v-container>
        </v-card>

        <v-card>
          <v-container>
            <v-btn color="red accent-1" class="mr-4" @click="cancelar">
              Voltar
            </v-btn>
          </v-container>
        </v-card>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      idAluno: this.$route.params.idAluno,
      idMatricula: this.$route.params.idMatricula,
      matricula: "",
      nomeAluno: "",
      dataMatricula: "",
      turma: "",
      media: "",
    };
  },
  created() {
    this.getListagem();
  },

  computed: {},

  methods: {
    cancelar() {
      this.$router.push(`/MatriculaAluno/${this.idAluno}/matricula`);
    },
    getListagem() {
      this.$http
        .get(`/alunos/${this.idAluno}/matricula/${this.idMatricula}`)
        .then((response) => {
          this.nome = response.data.Aluno.nome;
          this.dataMatricula = this.formataDataBR(response.data.data);
          this.media = response.data.media;
          this.turma = response.data.Turma.descricao;
        });
    },
    formataDataBR(value) {
      let data = new Date(value);
      let dia = String(data.getDate()).padStart(2, "0");
      let mes = String(data.getMonth() + 1).padStart(2, "0");
      let ano = data.getFullYear();
      return `${ano}-${mes}-${dia}`;
    },
  },
};
</script>

<style></style>
