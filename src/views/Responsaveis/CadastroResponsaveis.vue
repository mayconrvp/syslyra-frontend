<template>
  <v-container>
    <v-card>
      <v-toolbar color="cyan" dark>
        <v-toolbar-title>Cadastro de Responsáveis</v-toolbar-title>

        <v-spacer></v-spacer>
      </v-toolbar>

      <v-form @submit.prevent="grava()">
        <v-card>
          <v-container>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="responsavel"
                  :error-messages="nomeErrors"
                  :counter="60"
                  label="Nome do Responsável"
                  required
                  @change="$v.responsavel.$touch()"
                ></v-text-field>
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="telefone"
                  :error-messages="telefoneErrors"
                  @change="$v.email.$touch()"
                  label="Telefone"
                  v-mask="['(##) #####-####', '(##) ####-####']"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="email"
                  :error-messages="emailErrors"
                  label="E-mail"
                  @change="$v.email.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-card>
          <v-container>
            <v-btn
              v-if="this.idResponsavel"
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
            <v-btn class="mr-4" @click="limpar"> Limpar </v-btn>
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
import { mask } from "vue-the-mask";

import { validationMixin } from "vuelidate";
import { required, email, minLength } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    responsavel: { required, minLength: minLength(5) },
    email: { email },
    telefone: { required },
  },

  directives: { mask },

  data() {
    return {
      idAluno: this.$route.params.idAluno,
      idResponsavel: this.$route.params.idResponsavel,

      responsavel: "",
      telefone: "",
      email: "",
    };
  },
  created() {
    if (this.idResponsavel) {
      console.log(this.idResponsavel);
      this.$http.get(`responsaveis/${this.idResponsavel}`).then((response) => {
        //Dados de Endereco
        console.log(response);

        this.responsavel = response.data.responsavel;
        this.telefone = response.data.telefone;
        this.email = response.data.email;
      });
    }
  },

  computed: {
    nomeErrors() {
      const errors = [];
      if (!this.$v.responsavel.$dirty) return errors;
      !this.$v.responsavel.required && errors.push("Nome é obrigatório");
      !this.$v.responsavel.minLength &&
        errors.push("Nome deve ter mais que 5 caracteres");
      return errors;
    },
    telefoneErrors() {
      const errors = [];
      if (!this.$v.telefone.$dirty) return errors;
      !this.$v.telefone.required && errors.push("Telefone é obrigatório");
      !this.$v.telefone.minLength && errors.push("Telefone inválido");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Endereço de email inválido");
      return errors;
    },
    isDisabled: function () {
      return this.id ? false : true;
    },
  },

  methods: {
    grava() {
      if (!this.$v.$invalid) {
        let data = {
          responsavel: this.responsavel,
          telefone: this.telefone,
          email: this.email,
        };

        this.$http
          .post(`responsaveis/${this.idAluno}`, data)
          .then((response) => {
            console.log(response);

            this.$toast.fire(
              "Responsável cadastrado com sucesso",
              "",
              "success"
            );
            this.$router.push({
              name: "AlteraAluno",
              params: { id: this.idAluno },
            });
          })
          .catch((err) => {
            console.log(err);
            this.$toast.fire(
              "Não foi possível cadastrar o/a Responsável.",
              "",
              "error"
            );
          });
      } else {
        this.$v.$touch();
      }
    },

    atualizaDados() {
      if (!this.$v.$invalid) {
        let data = {
          responsavel: this.responsavel,
          telefone: this.telefone,
          email: this.email,
        };

        this.$http
          .put(`/responsaveis/${this.idResponsavel}`, data)
          .then((response) => {
            console.log(data, response);
            this.$router.push({
              name: "AlteraAluno",
              params: { id: this.idAluno },
            });
            this.$toast.fire(
              "Responsável atualizado com sucesso",
              "",
              "success"
            );
          })
          .catch((err) => {
            console.log(err);
            alert("Erro ao atualizar. Erro: " + err);
          });
      } else {
        this.$v.$touch();
      }
    },

    limpar() {
      this.responsavel = "";
      this.telefone = "";
      this.email = "";
    },
    cancelar() {
      this.$router.push(`/CadAlunos/${this.idAluno}`);
    },
  },
};
</script>

<style></style>
