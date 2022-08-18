<template>
  <v-container>
    <v-card class="mt-5">
      <v-form @submit.prevent="grava()">
        <v-card>
          <v-container>
            <div class="my-3">
              <h2>Visualização de aula</h2>
            </div>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="descricao"
                  label="Descrição"
                  outlined
                  readonly
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="tipo"
                  label="Tipo de Aula"
                  outlined
                  readonly
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="turma"
                  label="Turma"
                  outlined
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="data"
                  label="Data da aula"
                  type="date"
                  outlined
                  readonly
                >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="professor"
                  label="Professor"
                  outlined
                  readonly
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="link"
                  label="Link para diretório/arquivo"
                  outlined
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-textarea
                  v-model="observacoes"
                  label="Plano de aula"
                  outlined
                  readonly
                ></v-textarea>
              </v-col>
            </v-row>
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
      idAula: this.$route.params.idAula,
      idTurma: this.$route.params.idTurma,
      aula: "",
      data: "",
      turma: "",
      tipo: "",
      link: "",
      descricao: "",
      professor: "Não definido",
      observacoes: "",
    };
  },
  created() {
    this.getListagem();
  },

  computed: {},

  methods: {
    cancelar() {
      this.$router.push(`/aulas/turma/${this.idTurma}`);
    },
    getListagem() {
      this.$http
        .get(`/aulas/${this.idAula}/turma/${this.idTurma}`)
        .then((response) => {
          console.log(response.data);
          this.descricao = response.data[0].descricao;
          this.data = this.formataDataBR(response.data[0].data);
          this.tipo = response.data[0].tipo;
          this.link = response.data[0].link;
          this.turma = response.data[0].Turma.descricao;
          this.observacoes = response.data[0].planoAula;
          this.professor = response.data[0].Funcionario.nome;
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
