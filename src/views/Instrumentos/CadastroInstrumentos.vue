<template>
  <v-container>
    <v-card>
      <v-toolbar color="cyan" dark>
        <v-toolbar-title>Cadastro de Instrumentos</v-toolbar-title>

        <v-spacer></v-spacer>
        <template v-slot:extension> </template>
      </v-toolbar>

      <v-form @submit.prevent="grava()">
        <v-card>
          <v-container>
            <v-text-field
              v-model="descricao"
              :counter="100"
              label="Descrição*"
              :error-messages="descricaoErrors"
              @change="$v.descricao.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="modelo"
              :counter="100"
              label="Modelo"
            ></v-text-field>
            <v-text-field
              v-model="marca"
              :counter="100"
              label="Marca*"
              :error-messages="marcaErrors"
              @change="$v.marca.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="numeroSerie"
              :counter="100"
              label="Numero de Série"
            ></v-text-field>
            <v-textarea
              v-model="observacoes"
              :counter="100"
              label="Observações"
            ></v-textarea>
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
// import { required } from "vuelidate/lib/validators"
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    descricao: { required },
    marca: { required },
  },

  data() {
    return {
      id: this.$route.params.id,
      descricao: "",
      modelo: "",
      marca: "",
      numeroSerie: "",
      observacoes: "",

      nameRules: [
        (v) => !!v || "Nome é obrigatório",
        (v) => (v && v.length <= 5) || "O nome está menor que 5 caracteres",
      ],
    };
  },
  created() {
    if (this.id) {
      this.$http.get(`instrumentos/${this.id}`).then((response) => {
        console.log(response.data);
        this.descricao = response.data.descricao;
        this.modelo = response.data.modelo;
        this.marca = response.data.marca;
        this.numeroSerie = response.data.numeroSerie;
        this.observacoes = response.data.observacoes;
      });
    }
  },

  computed: {
    descricaoErrors() {
      const errors = [];
      if (!this.$v.descricao.$dirty) return errors;
      !this.$v.descricao.required &&
        errors.push("Nome do instrumento é obrigatório");
      return errors;
    },
    marcaErrors() {
      const errors = [];
      if (!this.$v.marca.$dirty) return errors;
      !this.$v.marca.required &&
        errors.push("Marca do instrumento é obrigatória");
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
          descricao: this.descricao,
          modelo: this.modelo,
          marca: this.marca,
          numeroSerie: this.numeroSerie,
          observacoes: this.observacoes,
        };

        this.$http
          .post("instrumentos", data)
          .then(() => {
            this.$toast.fire(
              "Instrumento cadastrado com sucesso",
              "",
              "success"
            );
            this.$router.push({ name: "Instrumento" });
          })
          .catch((err) => {
            console.log(err);
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
          descricao: this.descricao,
          modelo: this.modelo,
          marca: this.marca,
          numeroSerie: this.numeroSerie,
          observacoes: this.observacoes,
        };

        this.$http
          .put(`/instrumentos/${this.id}`, data)
          .then(() => {
            this.$toast.fire(
              "Instrumento atualizado com sucesso",
              "",
              "success"
            );

            this.$router.push("/instrumentos");
          })
          .catch((err) => {
            console.log(err);
            this.$toast.fire(
              "Não foi possível atualizar o instrumento.",
              "",
              "error"
            );
          });
      } else {
        this.$v.$touch();
      }
    },

    limpar() {
      this.descricao = "";
      this.modelo = "";
      this.marca = "";
      this.numeroSerie = "";
      this.observacoes = "";
    },
    cancelar() {
      this.$router.push("/instrumentos");
    },
  },
};
</script>

<style></style>
