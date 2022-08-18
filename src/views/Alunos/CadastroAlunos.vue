<template>
  <v-container>
    <v-card>
      <v-toolbar color="cyan" dark>
        <v-toolbar-title>Cadastro de Alunos</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-form>
        <v-card>
          <v-container>
            <v-row>
              <v-col cols="6">
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
              <v-col cols="3">
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
              <v-col cols="4">
                <v-text-field
                  v-model="email"
                  :error-messages="emailErrors"
                  label="E-mail"
                  @blur="$v.email.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="turno"
                  :items="turnos"
                  label="Turno"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="cpf"
                  v-mask="['###.###.###-##']"
                  :error-messages="cpfErrors"
                  @change="$v.cpf.$touch()"
                  label="CPF"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider></v-divider>

            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-if="this.responsavel"
                  v-model="responsavel"
                  readonly
                  label="Responsável"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-if="this.responsavel"
                  v-model="telefoneResp"
                  readonly
                  label="Contato do responsável"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider></v-divider>

            <v-row v-if="this.idEscola">
              <v-col cols="4">
                <v-text-field
                  v-model="escola"
                  readonly
                  label="Escola"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row v-if="this.idEndereco">
              <v-col>
                <v-text-field readonly label="Endereço" v-model="endereco">
                </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <div class="container2">
          <v-btn
            v-if="this.idEndereco != null"
            class="mr-1"
            :disabled="isDisabled"
            color="primary"
            @click="altEndereco"
            ><v-icon> mdi-home </v-icon>Endereço</v-btn
          >
          <v-btn
            v-else
            class="mr-1"
            :disabled="isDisabled"
            color="primary"
            @click="cadEndereco"
            ><v-icon> mdi-home </v-icon>Endereço</v-btn
          >

          <v-btn
            v-if="this.idResponsavel != null"
            v-show="mostraBtns"
            class="mr-1"
            :disabled="isDisabled"
            color="primary"
            @click="altResponsavel"
            ><v-icon> mdi-account-child </v-icon>Responsável</v-btn
          >
          <v-btn
            v-else
            v-show="mostraBtns"
            class="mr-1"
            :disabled="isDisabled"
            color="primary"
            @click="cadResponsavel"
            ><v-icon> mdi-account-child</v-icon>Responsável</v-btn
          >

          <v-btn
            v-if="this.idEscola != null"
            v-show="mostraBtns"
            class="mr-1"
            :disabled="isDisabled"
            color="primary"
            @click="altEscola"
            ><v-icon> mdi-school </v-icon>Escola</v-btn
          >
          <v-btn
            v-else
            v-show="mostraBtns"
            class="mr-1"
            :disabled="isDisabled"
            color="primary"
            @click="cadEscola"
            ><v-icon> mdi-school </v-icon>Escola</v-btn
          >
        </div>

        <v-card>
          <v-container>
            <v-btn
              type="submit"
              v-show="!this.id"
              color="success"
              class="mr-4"
              @click.prevent="grava()"
            >
              Salvar
            </v-btn>
            <v-btn
              type="submit"
              v-show="this.id"
              color="success"
              class="mr-4"
              @click.prevent="atualiza()"
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
      idEndereco: "",
      alunos: [],
      nome: "",
      dataNascimento: "",
      turno: "",
      telefone: "",
      email: "",
      cpf: "",
      turnos: [
        "Matutino",
        "Vespertino",
        "Noturno",
        "Matutino e Vespertino",
        "Matutino e Noturno",
        "Vespertino e Noturno",
      ],
      mostraBtns: "",
      telefoneResp: "",
      escola: "",
      responsavel: "",
      endereco: "",
    };
  },
  created() {
    console.log(this.id);

    if (this.id) {
      this.$http.get(`alunos/${this.id}`).then((response) => {
        this.nome = response.data.nome;
        this.dataNascimento = response.data.dataNascimento;
        this.turno = response.data.turno;
        this.telefone = response.data.telefone;
        this.email = response.data.email;
        this.cpf = response.data.cpf;
        this.idEndereco = response.data.idEndereco;
        if (this.idEndereco) {
          this.logradouro = response.data.Endereco.logradouro;
          this.numero = response.data.Endereco.numero;
          this.bairro = response.data.Endereco.bairro;
          this.cidade = response.data.Endereco.cidade;
          this.estado = response.data.Endereco.Estado.uf;
          this.cep = response.data.Endereco.cep;
          this.endereco =
            this.logradouro +
            ", " +
            this.numero +
            ", " +
            this.bairro +
            ", " +
            this.cidade +
            "/" +
            this.estado +
            " - CEP: " +
            this.cep;
          console.log(this.endereco);
        }
        this.idResponsavel = response.data.idResponsavel;
        this.idEscola = response.data.idEscola;
        this.mostraBtns = this.verificaMaioridade(this.dataNascimento);

        this.escola = response.data.Escola.nome
          ? response.data.Escola.nome
          : null;
        this.responsavel = response.data.Responsavei.responsavel
          ? response.data.Responsavei.responsavel
          : null;
        this.telefoneResp = response.data.Responsavei.telefone
          ? response.data.Responsavei.telefone
          : null;
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
    dataErrors() {
      const errors = [];
      if (!this.$v.dataNascimento.$dirty) return errors;
      this.$v.dataNascimento.$invalid && errors.push("Data inválida");
      return errors;
    },

    isDisabled: function () {
      return this.id ? false : true;
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
          dataNascimento: this.dataNascimento + " 00:00:00",
          turno: this.turno,
          telefone: this.telefone,
          email: this.email.toLowerCase(),
          cpf: this.cpf,
        };
        console.log(data);
        this.$http
          .post("alunos", data)
          .then((response) => {
            this.$swal("Efetue o cadastro do Endereço do aluno", "", "info");
            this.$router.push(`/CadEnderecos/${response.data.id}`);
          })
          .catch((err) => {
            console.log(err);
            this.$toast.fire(
              "Não foi possível cadastrar o Aluno.",
              "",
              "error"
            );
          });
      } else {
        this.$v.$touch();
      }
    },
    cadEndereco() {
      this.$router.push(`/CadEnderecos/${this.id}`);
    },
    altEndereco() {
      this.$router.push(`/CadEnderecos/edit/${this.idEndereco}/alu/${this.id}`);
    },
    cadResponsavel() {
      this.$router.push(`/CadResponsaveis/${this.id}`);
    },
    altResponsavel() {
      this.$router.push(
        `/CadResponsaveis/edit/${this.idResponsavel}/alu/${this.id}`
      );
    },
    cadEscola() {
      this.$router.push(`/SelectEscolas/alu/${this.id}`);
    },
    altEscola() {
      this.$router.push(`/SelectEscolas/esc/${this.idEscola}/alu/${this.id}`);
    },

    atualiza() {
      if (!this.$v.$invalid) {
        let data = {
          nome: this.nome,
          dataNascimento: this.dataNascimento + " 00:00:00",
          turno: this.turno,
          telefone: this.telefone,
          email: this.email.toLowerCase(),
          cpf: this.cpf,
        };

        this.$http
          .put(`/alunos/${this.id}`, data)
          .then((response) => {
            console.log(response);
            this.$router.go();
            this.$toast.fire("Aluno atualizado com sucesso", "", "success");
          })
          .catch((err) => {
            console.log(err);
            this.$toast.fire(
              "Não foi possível atualizar o aluno.",
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
      this.dataNascimento = "";
      this.turno = "";
      this.telefone = "";
      this.email = "";
      this.cpf = "";
    },
    cancelar() {
      this.$router.push("/alunos");
    },
    verificaMaioridade(dateNasc) {
      console.log(dateNasc);
      let date = new Date();
      let ano = date.getFullYear();
      let mes = date.getMonth() + 1;
      let dia = date.getDate();
      console.log(dia, mes, ano);

      let data = new Date(dateNasc);
      let diaNasc = String(data.getDate()).padStart(2, "0");
      let mesNasc = String(data.getMonth() + 1).padStart(2, "0");
      let anoNasc = data.getFullYear();
      console.log(diaNasc, mesNasc, anoNasc);

      let idade = ano - anoNasc;

      if (mes < mesNasc || (mes == mesNasc && dia < diaNasc)) idade--;
      console.log(idade);
      if (idade < 18) {
        return true;
      } else {
        return false;
      }
    },
    editarEndereco(id) {
      console.log(id);
    },
  },
};
</script>

<style>
.container2 {
  display: flex;
  justify-content: center;
  margin: 20px 2px;
}
</style>
