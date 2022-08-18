<template>
  <v-container>
    <v-card>
      <v-toolbar color="cyan" dark>
        <v-toolbar-title>Escola</v-toolbar-title>
        <v-spacer></v-spacer>
        <template v-slot:extension> </template>
      </v-toolbar>
      <v-form @submit.prevent="grava()">
        <v-card>
          <v-container>
            <h4>Aluno: {{ aluno }}</h4>
            <v-row>
              <v-col cols="9">
                <v-text-field
                  v-if="this.idEscola"
                  label="Escola Atual"
                  v-model="escola"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-if="this.idEscola"
                  label="Telefone"
                  v-model="telefone"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
            <h4 v-show="idEscola">
              Selecione uma escola abaixo caso queira alterar a escola
            </h4>
            <v-select
              v-model="escolaAlt"
              :items="escolas"
              clearable
              :error-messages="selectErrors"
              item-value="id"
              item-text="nome"
              label="Selecione a escola"
              @change="$v.escolaAlt.$touch()"
            ></v-select>
          </v-container>
        </v-card>

        <v-card>
          <v-container>
            <v-btn
              v-if="this.idEscola"
              class="mr-4"
              primary
              color="success"
              @click="atualizaDados"
            >
              Atualizar
            </v-btn>
            <v-btn v-else color="success" class="mr-4" @click="grava">
              Salvar
            </v-btn>

            <v-btn color="red accent-1" class="mr-4" @click="cancelar">
              {{ !this.idEscola ? "Cancelar" : "Voltar" }}
            </v-btn>

            <v-btn
              v-show="this.idEscola"
              color="warning"
              class="mr-4"
              @click="desvincular"
            >
              Desvincular escola
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
    escolaAlt: { required },
  },

  data() {
    return {
      idAluno: this.$route.params.idAluno,
      idEscola: this.$route.params.idEscola,
      escola: "",
      escolaAlt: "",
      telefone: "",
      aluno: "",
      escolas: [],
    };
  },
  created() {
    this.$http.get(`/escolas`).then((response) => {
      this.escolas = response.data;
    });
    if (this.idAluno) {
      this.$http.get(`/alunos/${this.idAluno}`).then((response) => {
        this.aluno = response.data.nome;
      });
    }

    if (this.idEscola) {
      this.$http.get(`/escolas/${this.idEscola}`).then((response) => {
        this.escola = response.data.nome;
        this.telefone = response.data.telefone;
        this.escolaAlt = response.data.id;
      });
    }
  },

  computed: {
    selectErrors() {
      const errors = [];
      if (!this.$v.escolaAlt.$dirty) return errors;
      !this.$v.escolaAlt.required && errors.push("Escola é obrigatório");
      return errors;
    },
  },

  methods: {
    validate() {
      this.$refs.form.validate();
    },
    grava() {
      if (!this.$v.$invalid) {
        let data = {
          idEscola: this.escolaAlt,
        };
        this.$http
          .put(`alunos/${this.idAluno}`, data)
          .then((response) => {
            console.log(response);

            this.$toast.fire("Escola vinculada com sucesso", "", "success");
            this.$router.push({
              name: "AlteraAluno",
              params: { id: this.idAluno },
            });
          })
          .catch((err) => {
            console.log(err);
            this.$toast.fire("Erro ao vincular escola.", "", "error");
          });
      } else {
        this.$v.$touch();
      }
    },

    atualizaDados() {
      console.log("Estou entrando no atualizar");
      if (this.escolaAlt) {
        let data = {
          idEscola: this.escolaAlt,
        };
        this.$http
          .put(`alunos/${this.idAluno}`, data)
          .then((response) => {
            console.log(response);

            this.$toast.fire("Escola vinculada com sucesso", "", "success");
            this.$router.push({
              name: "AlteraAluno",
              params: { id: this.idAluno },
            });
          })
          .catch((err) => {
            console.log(err);
            this.$toast.fire("Erro ao vincular escola.", "", "error");
          });
      } else {
        this.$toast.fire("Nenhuma escola selecionada.", "", "");
      }
    },
    cancelar() {
      this.$router.push(`/CadAlunos/${this.idAluno}`);
    },
    desvincular() {
      let data = {
        idEscola: null,
      };

      this.$http
        .put(`alunos/${this.idAluno}`, data)
        .then((response) => {
          console.log(response);

          this.$toast.fire("Escola desvinculada.", "", "info");
          this.$router.push({
            name: "AlteraAluno",
            params: { id: this.idAluno },
          });
        })
        .catch((err) => {
          console.log(err);
          this.$toast.fire("Erro ao desvincular escola.", "", "error");
        });
    },
  },
};
</script>

<style></style>
