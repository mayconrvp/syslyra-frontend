<template>
  <v-container>
    <v-card>
      <v-toolbar color="cyan" dark>
        <v-toolbar-title>Cadastro de Cursos</v-toolbar-title>

        <v-spacer></v-spacer>
        <template v-slot:extension> </template>
      </v-toolbar>

      <v-form>
        <v-card>
          <v-container>
            <v-text-field
              v-model="nome"
              :counter="60"
              label="Nome do Curso"
              :error-messages="nomeErrors"
              @change="$v.nome.$touch()"
            ></v-text-field>

            <v-textarea
              v-model="descricao"
              name="input-7-1"
              label="Descrição"
              hint="Hint text"
              :error-messages="descricaoErrors"
              @change="$v.descricao.$touch()"
            ></v-textarea>

            <v-row>
              <v-col cols="12" sm="6" class="d-flex">
                <v-text-field
                  v-model="cargaHoraria"
                  type="number"
                  label="Carga Horária"
                  :error-messages="cargaHorariaErrors"
                  @change="$v.cargaHoraria.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-card>
          <v-container>
            <v-btn
              v-if="this.id"
              primary
              type="submit"
              color="success"
              @click.prevent="atualiza"
            >
              Atualizar
            </v-btn>
            <v-btn
              v-else
              v-show="!this.id"
              type="submit"
              color="success"
              class="mr-4"
              @click.prevent="grava"
            >
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
// import { required } from "vuelidate/lib/validators"
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    nome: { required, minLength: minLength(5) },
    descricao: { minLength: minLength(5) },
    cargaHoraria: { required },
  },

  data() {
    return {
      id: this.$route.params.id,
      nome: "",
      descricao: "",
      cargaHoraria: "",
    };
  },
  created() {
    if (this.id) {
      this.$http.get(`cursos/${this.id}`).then((response) => {
        console.log(response.data);
        this.nome = response.data.nome;
        this.descricao = response.data.descricao;
        this.cargaHoraria = response.data.cargaHoraria;
      });
    }
  },

  computed: {
    nomeErrors() {
      const errors = [];
      if (!this.$v.nome.$dirty) return errors;
      !this.$v.nome.minLength &&
        errors.push("Nome do cursos deve ter no mínimo 5 caracteres");
      !this.$v.nome.required && errors.push("Nome do curso é obrigatório");
      return errors;
    },
    descricaoErrors() {
      const errors = [];
      if (!this.$v.descricao.$dirty) return errors;
      !this.$v.descricao.minLength &&
        errors.push("A descrição do curso deve ter no mínimo 5 caracteres");
      return errors;
    },
    cargaHorariaErrors() {
      const errors = [];
      if (!this.$v.cargaHoraria.$dirty) return errors;
      !this.$v.cargaHoraria.required &&
        errors.push("Carga Horária é obrigatório.");
      return errors;
    },
  },

  methods: {
    validate() {
      this.$refs.form.validate();
    },
    grava() {
      if (!this.$v.$invalid) {
        console.log("To entrando aqui");
        let data = {
          nome: this.nome,
          cargaHoraria: this.cargaHoraria,
          descricao: this.descricao,
        };

        this.$http
          .post("cursos", data)
          .then((response) => {
            console.log(response);
            this.$toast.fire("Curso cadastrado com sucesso", "", "success");
            this.$router.push({ name: "Curso" });
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

    atualiza() {
      if (!this.$v.$invalid) {
        let data = {
          nome: this.nome,
          descricao: this.descricao,
          cargaHoraria: this.cargaHoraria,
        };

        this.$http
          .put(`/cursos/${this.id}`, data)
          .then(() => {
            this.$toast.fire("Curso atualizado com sucesso", "", "success");
            this.$router.push({ name: "Curso" });
          })
          .catch((err) => {
            console.log(err);
            this.$toast.fire(
              "Não foi possível atualizar o curso.",
              "",
              "error"
            );
          });
      } else {
        this.$v.$touch();
      }
    },

    limpar() {
      this.nome = "";
      this.desccricao = "";
      this.cargaHoraria = "";
    },
    cancelar() {
      this.$router.push("/cursos");
    },
  },
};
</script>

<style></style>
