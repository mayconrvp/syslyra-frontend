<template>
  <v-container>
    <v-card class="mt-5">
      <v-form @submit.prevent="grava()">
        <v-card>
          <v-container>
            <div class="my-3">
              <h2>Visualização de Empréstimo</h2>
            </div>
            <v-row>
              <v-col cols="6">
                <v-text-field v-model="aluno" label="Aluno" outlined readonly>
                </v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="instrumento"
                  label="Instrumento"
                  outlined
                  readonly
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="dataEmprestimo"
                  label="Data de Empréstimo"
                  type="date"
                  outlined
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-if="dataDevolucao"
                  v-model="dataDevolucao"
                  label="Data de Devolução"
                  type="date"
                  outlined
                  readonly
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-textarea
                  v-model="observacoes"
                  label="Observações"
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
      id: this.$route.params.id,

      aluno: "",
      instrumento: "",
      nomeInstrumento: "",
      dataEmprestimo: "",
      dataDevolucao: "",
      observacoes: "",
    };
  },
  created() {
    this.getListagem();
  },

  computed: {},

  methods: {
    cancelar() {
      this.$router.push(`/emprestimos`);
    },
    getListagem() {
      this.$http.get(`/emprestimos/${this.id}`).then((response) => {
        this.instrumento = response.data.Instrumento.descricao;
        this.aluno = response.data.Aluno.nome;
        this.dataDevolucao = response.data.dataDevolucao
          ? this.formataDataBR(response.data.dataDevolucao)
          : null;
        this.dataEmprestimo = this.formataDataBR(response.data.dataEmprestimo);
        this.observacoes = response.data.observacao;
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
