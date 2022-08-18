<template>
  <v-container>
    <v-card>
      <v-toolbar color="cyan" dark>
        <v-toolbar-title>Cadastro de Funcionários</v-toolbar-title>

        <v-spacer></v-spacer>
      </v-toolbar>

      <v-form>
        <v-card>
          <v-container>
            <v-row>
              <v-col cols="9">
                <v-text-field
                  v-model="nome"
                  :error-messages="nomeErrors"
                  :counter="60"
                  label="Nome"
                  @input="$v.nome.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="dataNascimento"
                  label="Data de Nascimento"
                  :error-messages="dataErrors"
                  @change="$v.dataNascimento.$touch()"
                  type="date"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="cpf"
                  v-mask="['###.###.###-##']"
                  :error-messages="cpfErrors"
                  @change="$v.cpf.$touch()"
                  label="CPF"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="email"
                  :error-messages="emailErrors"
                  label="E-mail"
                  @blur="$v.email.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="telefone"
                  :error-messages="telefoneErrors"
                  @blur="$v.telefone.$touch()"
                  label="Telefone"
                  v-mask="['(##) #####-####', '(##) ####-####']"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-select
                  v-model="cargo"
                  :items="cargos"
                  :error-messages="cargoErrors"
                  label="Cargo"
                  required
                  @change="$v.cargo.$touch()"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-card>
          <v-container>
            <v-btn
              v-if="!this.id"
              type="submit"
              color="success"
              class="mr-4"
              @click.prevent="grava"
            >
              Salvar
            </v-btn>
            <v-btn
              v-else
              type="submit"
              color="success"
              class="mr-4"
              @click.prevent="atualiza"
            >
              Atualizar
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
    nome: { required, minLength: minLength(5) },
    email: { email },
    cargo: { required },
    telefone: { required, minLength: minLength(14) },
    dataNascimento: {
      required,
      minLength: minLength(8),
    },
    cpf: { minLength: minLength(14) },
  },

  directives: { mask },

  data() {
    return {
      id: this.$route.params.id,
      funcionarios: [],
      nome: "",
      dataNascimento: "",
      telefone: "",
      email: "",
      cpf: "",
      cargo: "",
      items: ["Dados Gerais"],
      cargos: ["Professor", "Diretor", "Assistente"],
    };
  },
  created() {
    this.$http.get("estados/").then((response) => {
      this.estados = response.data;
    });

    if (this.id) {
      this.$http.get(`funcionarios/${this.id}`).then((response) => {
        console.log(response.data);
        this.nome = response.data.nome;
        this.cargo = response.data.cargo;
        this.telefone = response.data.telefone;
        this.email = response.data.email;
        this.cpf = response.data.cpf;
        this.dataNascimento = response.data.dataNascimento;
      });
    }
  },

  computed: {
    nomeErrors() {
      const errors = [];
      if (!this.$v.nome.$dirty) return errors;
      !this.$v.nome.required && errors.push("Nome é obrigatório");
      !this.$v.nome.minLength &&
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
    cpfErrors() {
      const errors = [];
      if (!this.$v.cpf.$dirty) return errors;
      !this.$v.cpf.minLength && errors.push("Digite todos os dígitos do CPF");
      return errors;
    },
    cargoErrors() {
      const errors = [];
      if (!this.$v.cargo.$dirty) return errors;
      !this.$v.cargo.required && errors.push("Cargo é obrigatório");
      return errors;
    },
    dataErrors() {
      const errors = [];
      if (!this.$v.dataNascimento.$dirty) return errors;
      this.$v.dataNascimento.$invalid && errors.push("Data inválida");
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
          nome: this.nome,
          cargo: this.cargo,
          telefone: this.telefone,
          email: this.email.toLowerCase(),
          cpf: this.cpf,
          dataNascimento: this.dataNascimento,
        };

        this.$http.post("funcionarios", data).then(
          () => {
            this.$toast.fire(
              "Colaborador cadastrado com sucesso",
              "",
              "success"
            );
            this.$router.push({ name: "Funcionario" });
          },
          (err) => {
            console.log(err);
            this.$toast.fire(
              "Não foi possível efetuar o cadastro.",
              "",
              "error"
            );
          }
        );
      } else {
        this.$v.$touch();
      }
    },
    atualiza() {
      if (!this.$v.$invalid) {
        let data = {
          nome: this.nome,
          cargo: this.cargo,
          cpf: this.cpf,
          telefone: this.telefone,
          email: this.email.toLowerCase(),
          dataNascimento: this.dataNascimento,
        };

        this.$http
          .put(`/funcionarios/${this.id}`, data)
          .then((response) => {
            console.log(response);
            this.$toast.fire("Atualizado com sucesso", "", "success");
            this.$router.push({ name: "Funcionario" });
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
      this.cpf = "";
      this.cargo = "";
      this.telefone = "";
      this.email = "";
      this.dataNascimento = "";
    },
    cancelar() {
      this.$router.push("/funcionarios");
    },
  },
};
</script>

<style></style>
