<template>
  <v-container>
    <v-card>
      <div class="mx-3 my-3">
        <template>
          <h2>Matricula</h2>
          <h3>Aluno: {{ nome }}</h3>
        </template>
      </div>

      <v-form @submit.prevent="grava()">
        <v-card>
          <v-container>
            <template>
              <v-select
                v-model="turma"
                :items="turmas"
                item-value="id"
                item-text="descricao"
                label="Turma"
                :error-messages="turmaErrors"
                required
                @change="$v.turma.$touch()"
              ></v-select>
            </template>

            <v-text-field
              v-model="dataMatricula"
              type="date"
              label="Data de matrícula"
            ></v-text-field>
          </v-container>
        </v-card>

        <v-card>
          <v-container>
            <v-btn
              v-if="this.idAluno && this.idMatricula == ''"
              color="success"
              class="mr-4"
              @click="grava"
            >
              Salvar
            </v-btn>
            <v-btn
              v-else
              class="mr-4"
              primary
              color="success"
              @click="atualizaDadosGerais"
            >
              Atualizar
            </v-btn>

            <v-btn color="red accent-1" class="mr-4" @click="cancelar">
              {{ !this.idMatricula ? "Cancelar" : "Voltar" }}
            </v-btn>
          </v-container>
        </v-card>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
// import { required } from "vuelidate/lib/validators"
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    turma: { required },
  },

  data() {
    return {
      idAluno: this.$route.params.idAluno,
      idMatricula: this.$route.params.idMatricula
        ? this.$route.params.idMatricula
        : "",
      dataMatricula: "",
      turma: "",
      turmas: [],
      turmasMatriculadas: [],
      matriculasDoAluno: [],
      nome: "",
    };
  },
  created() {
    this.dataMatricula = this.obterDataAtual();
    if (this.idAluno != "" && this.idMatricula != "") {
      this.$http
        .get(`alunos/${this.idAluno}/matricula/${this.idMatricula}`)
        .then((response) => {
          this.turma = response.data.Turma.id;
          this.dataMatricula = this.formataData(response.data.data);
          this.idTurmaToVerify = response.data.Turma.id;
        });
    }
    if (this.idAluno != "") {
      this.$http.get(`alunos/${this.idAluno}`).then((response) => {
        console.log(response.data);
        this.nome = response.data.nome;
      });
    }
    this.$http.get(`turmas/`).then((response) => {
      this.turmas = response.data;
    });
    this.obterTurmasMatriculadas();
  },

  computed: {
    turmaErrors() {
      const errors = [];
      if (!this.$v.turma.$dirty) return errors;
      !this.$v.turma.required &&
        errors.push("A seleção da turma é obrigatória");
      return errors;
    },
  },

  methods: {
    validaCadastroEmTurmas(data) {
      for (let i = 0; i < this.turmasMatriculadas.length; i++) {
        if (parseInt(data) == this.turmasMatriculadas[i]) {
          this.$swal("Matricula já efetuada para o aluno na turma selecionada");
          return true;
        }
      }
      return false;
    },
    validate() {
      this.$refs.form.validate();
    },
    formataData(date) {
      let data = new Date(date);
      let dia = String(data.getDate()).padStart(2, "0");
      let mes = String(data.getMonth() + 1).padStart(2, "0");
      let ano = data.getFullYear();
      return `${ano}-${mes}-${dia}`;
    },
    obterTurmasMatriculadas() {
      this.$http.get(`alunos/${this.idAluno}/matricula/`).then((response) => {
        this.matriculasDoAluno = response.data;
        for (let i = 0; i < this.matriculasDoAluno.length; i++) {
          this.turmasMatriculadas[i] = this.matriculasDoAluno[i].Turma.id;
        }
      });
    },
    grava() {
      if (!this.$v.$invalid) {
        let data = {
          idTurma: this.turma,
          idAluno: this.idAluno,
          data: this.dataMatricula + " 00:00:00",
        };
        console.log(this.turmasMatriculadas.length);

        if (this.validaCadastroEmTurmas(data.idTurma)) return;

        this.$http.post(`alunos/${this.idAluno}/matricula/`, data).then(
          () => {
            this.$toast.fire("Matricula efetuada com sucesso");
            this.$router.push(`/MatriculaAluno/${this.idAluno}/matricula`);
          },
          (err) => {
            this.$toast.fire(
              "Não foi possível efetuar o cadastro.",
              err,
              "error"
            );
          }
        );
      } else {
        this.$v.$touch();
      }
    },

    obterDataAtual() {
      let date = new Date();
      let ano = date.getFullYear();
      let mes = String(date.getMonth() + 1).padStart(2, "0");
      let dia = String(date.getDate()).padStart(2, "0");
      let dataAtual = `${ano}-${mes}-${dia}`;
      console.dataAtual;
      return dataAtual;
    },

    atualizaDadosGerais() {
      if (!this.$v.$invalid) {
        let data = {
          idTurma: this.turma,
          data: this.dataMatricula + " 00:00:00",
          media: this.media,
          idAluno: this.idAluno,
        };

        if (data.idTurma != this.idTurmaToVerify) {
          if (this.validaCadastroEmTurmas(data.idTurma)) return;
        }

        this.$http
          .put(`/alunos/${this.idAluno}/matricula/${this.idMatricula}`, data)
          .then(
            () => {
              this.$toast.fire("Atualizado com sucesso");
              this.$router.push(`/MatriculaAluno/${this.idAluno}/matricula`);
            },
            (err) => {
              console.log(err);
              this.$toast.fire("Erro ao atualizar. Erro: " + err);
            }
          );
      } else {
        this.$v.$touch();
      }
    },

    cancelar() {
      this.$router.push(`/MatriculaAluno/${this.idAluno}/matricula`);
    },
  },
};
</script>

<style></style>
