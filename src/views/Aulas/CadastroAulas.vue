<template>
  <v-container>
    <v-card>
      <div class="mx-3 my-3">
        <template>
          <h2>Cadastro de Aula</h2>
          <h3>Turma: {{ nomeTurma }}</h3>
        </template>
      </div>

      <v-form @submit.prevent="grava()">
        <v-card>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="descricao"
                  label="Descrição"
                  :error-messages="descricaoErrors"
                  @change="$v.descricao.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="data"
                  type="date"
                  label="Data da Aula"
                  :error-messages="dataErrors"
                  @change="$v.data.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="tipo"
                  :items="tiposDeAulas"
                  label="Tipo da aula"
                  :error-messages="tipoErrors"
                  @change="$v.tipo.$touch()"
                ></v-select>
              </v-col>
              <v-col>
                <v-select
                  v-model="professor"
                  :items="professores"
                  item-value="id"
                  item-text="nome"
                  label="Professor"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-textarea
                  v-model="planoAula"
                  label="Plano de Aula"
                ></v-textarea>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="link"
                  label="Link para repositório (Drive)"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-card>
          <v-container>
            <v-btn
              v-if="this.idTurma && this.idAula == ''"
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
              @click="atualiza"
            >
              Atualizar
            </v-btn>

            <v-btn color="red accent-1" class="mr-4" @click="cancelar">
              Cancelar
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
import { required, minLength, maxLength } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    descricao: { required, minLength: minLength(5) },
    tipo: { required },
    data: { required, maxLength: maxLength(10) },
  },

  data() {
    return {
      idTurma: this.$route.params.idTurma,
      idAula: this.$route.params.idAula ? this.$route.params.idAula : "",
      data: "",
      descricao: "",
      tipo: "",
      turma: "",
      nomeTurma: "",
      professores: [],
      professor: "",
      link: "",
      // turmas: [],
      // turmasMatriculadas: [],
      // matriculasDoAluno: [],
      planoAula: "",
      tiposDeAulas: ["Teórica", "Prática"],
    };
  },
  created() {
    if (this.idTurma != "" && this.idAula != "") {
      this.$http
        .get(`aulas/${this.idAula}/turma/${this.idTurma}`)
        .then((response) => {
          console.log(response.data[0]);
          this.data = this.formataData(response.data[0].data);
          this.descricao = response.data[0].descricao;
          this.tipo = response.data[0].tipo;
          this.link = response.data[0].link;
          this.planoAula = response.data[0].planoAula;
          this.professor = response.data[0].idFuncionario;
        });
    }
    this.$http.get(`/funcionarios/cg/Professor`).then((response) => {
      this.professores = response.data;
    });

    this.$http.get(`turmas/${this.idTurma}`).then((response) => {
      this.nomeTurma = response.data.descricao;
    });
    //this.obterTurmasMatriculadas();
  },

  computed: {
    descricaoErrors() {
      const errors = [];
      if (!this.$v.descricao.$dirty) return errors;
      !this.$v.descricao.required && errors.push("Descrição é obrigatória");
      !this.$v.descricao.minLength &&
        errors.push("A descrição deve ter mais que 5 caracteres");
      return errors;
    },
    tipoErrors() {
      const errors = [];
      if (!this.$v.tipo.$dirty) return errors;
      !this.$v.tipo.required && errors.push("Tipo de aula é obrigatório");
      return errors;
    },
    dataErrors() {
      const errors = [];
      if (!this.$v.data.$dirty) return errors;
      this.$v.data.$invalid && errors.push("Data inválida");
      !this.$v.data.maxLength &&
        errors.push("A descrição deve ter mais que 5 caracteres");
      return errors;
    },
  },

  methods: {
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
    // obterTurmasMatriculadas() {
    //   this.$http.get(`alunos/${this.idTurma}/matricula/`).then((response) => {
    //     this.matriculasDoAluno = response.data[0];
    //     for (let i = 0; i < this.matriculasDoAluno.length; i++) {
    //       this.turmasMatriculadas[i] = this.matriculasDoAluno[i].Turma.id;
    //     }
    //   });
    // },
    grava() {
      if (!this.$v.$invalid) {
        let data = {
          idTurma: this.idTurma,
          descricao: this.descricao,
          tipo: this.tipo,
          data: this.data,
          planoAula: this.planoAula,
          idFuncionario: this.professor ? this.professor : null,
          link: this.link ? this.link : null,
        };

        this.$http
          .post(`aulas/turma/${this.idTurma}`, data)
          .then((response) => {
            console.log(response.data);
            this.$toast.fire("Aula cadastrada com sucesso.", "", "success");
            this.$router.push({
              name: "VisualizarAula",
              params: { idTurma: this.idTurma, idAula: response.data.id },
            });
          })
          .catch((err) => {
            console.log(err);
            this.$toast.fire("Não foi possível cadastrar a aula.", "", "error");
          });
      } else {
        this.$v.$touch();
      }
    },

    atualiza() {
      if (!this.$v.$invalid) {
        let data = {
          id: this.idAula,
          idTurma: this.idTurma,
          descricao: this.descricao,
          tipo: this.tipo,
          data: this.data,
          planoAula: this.planoAula,
          link: this.link,
          idFuncionario: this.professor,
        };

        this.$http
          .put(`/aulas/${this.idAula}/turma/${this.idTurma}`, data)
          .then(
            () => {
              this.$toast.fire("Aula atualizada com sucesso", "", "success");
              this.$router.push({
                name: "VisualizarAula",
                params: { idAula: this.idAula, idTurma: this.idTurma },
              });
            },
            (err) => {
              console.log(err);
              this.$toast.fire("Não foi possível atualizar aula.", "", "error");
            }
          );
      } else {
        this.$v.$touch();
      }
    },

    cancelar() {
      this.$router.push(`/aulas/turma/${this.idTurma}`);
    },
  },
};
</script>

<style></style>
