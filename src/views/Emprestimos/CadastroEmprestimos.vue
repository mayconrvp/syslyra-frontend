<template>
  <v-container>
    <v-card>
      <v-toolbar color="cyan" dark>
        <v-toolbar-title>Empréstimo de instrumentos</v-toolbar-title>

        <v-spacer></v-spacer>
        <template v-slot:extension> </template>
      </v-toolbar>

      <v-form @submit.prevent="grava()">
        <v-card>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-select
                  v-if="!this.id"
                  v-model="instrumento"
                  :items="instrumentos"
                  item-value="id"
                  item-text="descricao"
                  label="Instrumento"
                  :error-messages="instrumentoErrors"
                  @change="$v.instrumento.$touch()"
                ></v-select>
                <v-text-field
                  v-else
                  :value="nomeInstrumento"
                  label="Instrumento"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col>
                <v-select
                  v-model="aluno"
                  :items="alunos"
                  item-value="id"
                  item-text="nome"
                  label="Aluno"
                  :error-messages="alunoErrors"
                  @blur="$v.aluno.$touch()"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="dataEmprestimo"
                  type="date"
                  label="Data de Empréstimo"
                  :error-messages="dataErrors"
                  @blur="$v.dataEmprestimo.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-checkbox
                  v-model="selected"
                  label="Incluir a data de devolução"
                ></v-checkbox>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-if="this.selected"
                  v-model="dataDevolucao"
                  type="date"
                  :allowed-dates="allowedDates"
                  @change="verificaDatas"
                  label="Data de Devolução"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="observacao"
                  label="Observacao"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <template>
          <v-slot></v-slot>
        </template>

        <v-card>
          <v-container>
            <v-btn
              v-if="this.id"
              class="mr-4"
              primary
              color="success"
              @click="atualizaDadosGerais"
            >
              Atualizar
            </v-btn>
            <v-btn
              v-else
              v-show="!this.id"
              color="success"
              class="mr-4"
              @click="grava"
            >
              Salvar
            </v-btn>

            <v-btn color="red accent-1" class="mr-4" @click="cancelar">
              {{ !this.id ? "Cancelar" : "Voltar" }}
            </v-btn>
          </v-container>
        </v-card>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    instrumento: { required },
    aluno: { required },
    dataEmprestimo: { required },
  },

  data() {
    return {
      id: this.$route.params.id,
      alunos: [],
      aluno: "",
      instrumentos: [],
      instrumento: "",
      dataDevolucao: "",
      dataEmprestimo: "",
      observacao: "",
      selected: false,
    };
  },

  created() {
    this.$http.get("instrumentos/disp").then((response) => {
      console.log(response.data);
      this.instrumentos = response.data;
    });
    if (this.id) {
      this.$http.get(`emprestimos/${this.id}`).then((response) => {
        this.instrumento = response.data.idInstrumento;
        this.nomeInstrumento = response.data.Instrumento.descricao;
        this.aluno = response.data.idAluno;
        this.dataDevolucao = response.data.dataDevolucao
          ? this.formataData(response.data.dataDevolucao)
          : null;
        this.dataEmprestimo = this.formataData(response.data.dataEmprestimo);
        this.observacao = response.data.observacao;
        console.log("O id do instrumento é " + this.instrumento);

        this.selected = this.dataDevolucao ? true : false;
        console.log(response);
      });
    }
    this.$http.get(`/alunos`).then((response) => {
      console.log(response.data);
      this.alunos = response.data;
    });
  },

  computed: {
    instrumentoErrors() {
      const errors = [];
      if (!this.$v.instrumento.$dirty) return errors;
      !this.$v.instrumento.required && errors.push("Instrumento é obrigatório");
      return errors;
    },
    alunoErrors() {
      const errors = [];
      if (!this.$v.aluno.$dirty) return errors;
      !this.$v.aluno.required && errors.push("Aluno é obrigatório.");
      return errors;
    },
    dataErrors() {
      const errors = [];
      if (!this.$v.dataEmprestimo.$dirty) return errors;
      this.$v.dataEmprestimo.$invalid && errors.push("Data inválida");
      return errors;
    },
  },

  methods: {
    showAlert() {
      this.$swal("Modal do SweetAlert");
    },
    validate() {
      this.$refs.form.validate();
    },
    verificaDatas() {
      if (this.dataDevolucao) {
        if (this.dataDevolucao <= this.dataEmprestimo) {
          this.$toast.fire(
            "Data de devolução não pode ser inferior à data do emprestimo",
            "",
            "error"
          );
          return false;
        }
      }
      return true;
    },
    formataData(date) {
      let data = new Date(date);
      let dia = String(data.getDate()).padStart(2, "0");
      let mes = String(data.getMonth() + 1).padStart(2, "0");
      let ano = data.getFullYear();
      return `${ano}-${mes}-${dia}`;
    },
    grava() {
      if (!this.$v.$invalid) {
        if (!this.verificaDatas()) {
          return;
        }
        let data = {
          idAluno: this.aluno,
          idInstrumento: this.instrumento,
          dataEmprestimo: this.dataEmprestimo + " 00:00:00",
          dataDevolucao: this.dataDevolucao
            ? this.dataDevolucao + " 00:00:00"
            : null,
          observacao: this.observacao,
        };
        console.log(data);
        this.$http
          .post("/emprestimos", data)
          .then(() => {
            this.$toast.fire(
              "Empréstimo cadastrado com sucesso",
              "",
              "success"
            );
            this.$router.push({ name: "Emprestimo" });
          })
          .catch(() => {
            this.$toast.fire(
              "Não foi possível efetuar o cadastro.",
              "",
              "error"
            );
          });
      } else {
        this.$v.$touch();
      }
    },

    atualizaDadosGerais() {
      if (!this.$v.$invalid) {
        if (!this.verificaDatas()) {
          return;
        }
        let data = {
          idAluno: this.aluno,
          idInstrumento: this.instrumento,
          dataEmprestimo: this.dataEmprestimo + " 00:00:00",
          dataDevolucao: this.selected
            ? this.dataDevolucao + " 00:00:00"
            : null,
          observacao: this.observacao,
        };

        this.$http.put(`/emprestimos/${this.id}`, data).then(
          () => {
            this.$toast.fire("Atualizado com sucesso", "", "success");
            this.$router.push("/emprestimos");
          },
          (err) => {
            console.log(err);
            this.$toast.fire("Erro ao atualizar. Erro: ", err, "error");
          }
        );
      } else {
        this.$v.$touch();
      }
    },
    cancelar() {
      this.$router.push("/emprestimos");
    },
  },
};
</script>

<style></style>
