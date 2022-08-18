<template>
  <v-container>
    <v-card>
      <v-toolbar color="cyan" dark>
        <v-toolbar-title>Cadastro de Escolas</v-toolbar-title>
        <template v-slot:extension> </template>
      </v-toolbar>

      <v-form @submit.prevent="grava()">
        <v-card>
          <v-container>
            <v-text-field
              v-model="nome"
              :counter="100"
              label="Nome da Escola"
              :error-messages="nomeErrors"
              @change="$v.nome.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="telefone"
              :counter="100"
              label="Telefone"
              v-mask="['(##) #####-####', '(##) ####-####']"
              :error-messages="telefoneErrors"
              @blur="$v.telefone.$touch()"
            ></v-text-field>
          </v-container>
        </v-card>

        <v-card>
          <v-container>
            <v-btn
              v-if="this.id"
              class="mr-4"
              primary
              color="success"
              @click="atualiza"
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
            <v-btn class="mr-4" @click="limpar"> Limpar </v-btn>

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
import { mask } from "vue-the-mask";

import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    nome: { required, minLength: minLength(5) },
    telefone: { required, minLength: minLength(14) },
  },

  directives: { mask },

  data() {
    return {
      id: this.$route.params.id,
      nome: "",
      telefone: "",
    };
  },
  created() {
    if (this.id) {
      this.$http.get(`escolas/${this.id}`).then((response) => {
        this.nome = response.data.nome;
        this.telefone = response.data.telefone;
      });
    }
  },

  computed: {
    nomeErrors() {
      const errors = [];
      if (!this.$v.nome.$dirty) return errors;
      !this.$v.nome.required && errors.push("Nome é obrigatório");
      !this.$v.nome.minLength &&
        errors.push("Nome da escola deve ter mais que 5 caracteres");
      return errors;
    },
    telefoneErrors() {
      const errors = [];
      if (!this.$v.telefone.$dirty) return errors;
      !this.$v.telefone.required && errors.push("Telefone é obrigatório");
      !this.$v.telefone.minLength && errors.push("Telefone inválido");
      return errors;
    },
  },

  methods: {
    grava() {
      if (!this.$v.$invalid) {
        let data = {
          nome: this.nome,
          telefone: this.telefone,
        };
        console.log(data);
        this.$http
          .post("/escolas", data)
          .then(() => {
            this.$toast.fire("Escola cadastrada com sucesso", "", "success");
            this.$router.push({ name: "Escola" });
          })
          .catch(() => {
            this.$toast.fire(
              "Não foi possível efetuar o cadastro",
              "",
              "error"
            );
          });
      } else {
        this.$v.$touch();
      }
    },

    atualiza() {
      if (!this.$v.$invalid) {
        let data = {
          nome: this.nome,
          telefone: this.telefone,
        };

        this.$http
          .put(`/escolas/${this.id}`, data)
          .then(() => {
            this.$toast.fire("Atualizado com sucesso", "", "success");
            this.$router.push("/escolas");
          })
          .catch((err) => {
            console.log(err);
            this.$toast.fire("Erro ao atualizar", "", "error");
          });
      } else {
        this.$v.$touch();
      }
    },

    limpar() {
      this.nome = "";
      this.telefone = "";
    },
    cancelar() {
      this.$router.push("/escolas");
    },
  },
};
</script>

<style></style>
