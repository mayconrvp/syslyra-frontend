<template>
  <v-container>
    <v-card>
      <v-toolbar color="cyan" dark>
        <v-toolbar-title
          >Cadastro de Endereço
          {{ this.idAluno ? "- Aluno: " + aluno : "" }}</v-toolbar-title
        >

        <v-spacer></v-spacer>
      </v-toolbar>

      <v-form @submit.prevent="grava()">
        <v-card>
          <v-container>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="logradouro"
                  :error-messages="logradouroErrors"
                  @change="$v.logradouro.$touch()"
                  :counter="60"
                  label="Logradouro"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="numero"
                  :error-messages="numeroErrors"
                  label="Número"
                  required
                  @change="$v.numero.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="cep"
                  :error-messages="cepErrors"
                  label="CEP"
                  v-mask="['#####-###']"
                  @change="$v.cep.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-text-field
                  v-model="bairro"
                  label="Bairro"
                  :error-messages="bairroErrors"
                  @change="$v.bairro.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="cidade"
                  label="Cidade"
                  @change="$v.cidade.$touch()"
                  :error-messages="cidadeErrors"
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-select
                  v-model="estado"
                  :items="estados"
                  item-value="id"
                  item-text="nome"
                  :error-messages="estadoErrors"
                  label="Estado"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="complemento"
                  label="Complemento"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-card>
          <v-container>
            <v-btn
              v-if="this.idEndereco"
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
// import { required } from "vuelidate/lib/validators"
import { mask } from "vue-the-mask";

import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    logradouro: { required },
    numero: { required },
    cep: { required, minLength: minLength(9) },
    cidade: { required },
    bairro: { required },
    estado: { required },
  },

  directives: { mask },

  data() {
    return {
      idAluno: this.$route.params.idAluno,
      idEndereco: this.$route.params.idEndereco,
      aluno: "",
      alunos: [],
      estados: [],
      estado: "",
      cidade: "",
      bairro: "",
      cep: "",
      numero: "",
      complemento: "",
      logradouro: "",
    };
  },
  created() {
    console.log(this);
    this.$http.get("estados/").then((response) => {
      this.estados = response.data;
    });
    this.$http.get(`/alunos/${this.idAluno}`).then((response) => {
      console.log(response.data);
      this.aluno = response.data.nome;
    });

    if (this.idEndereco) {
      console.log(this.idEndereco);
      this.$http.get(`enderecos/${this.idEndereco}`).then((response) => {
        //Dados de Endereco
        console.log(response);

        this.logradouro = response.data.logradouro;
        this.numero = response.data.numero;
        this.cep = response.data.cep;
        this.complemento = response.data.complemento;
        this.bairro = response.data.bairro;
        this.cidade = response.data.cidade;
        this.estado = response.data.Estado.id;
      });

      // this.$http.get(`enderecos/${this.idEndereco}`).then((response) => {
      //   console.log(this.idEndereco);
      //   console.log(response.data);
      // });
    }
  },

  computed: {
    logradouroErrors() {
      const errors = [];
      if (!this.$v.logradouro.$dirty) return errors;
      !this.$v.logradouro.required && errors.push("Logradouro é obrigatório");
      return errors;
    },
    numeroErrors() {
      const errors = [];
      if (!this.$v.numero.$dirty) return errors;
      !this.$v.numero.required && errors.push("Número é obrigatório");
      return errors;
    },
    cepErrors() {
      const errors = [];
      if (!this.$v.cep.$dirty) return errors;
      !this.$v.cep.minLength && errors.push("CEP inválido");
      !this.$v.cep.required && errors.push("CEP é obrigatório");
      return errors;
    },
    bairroErrors() {
      const errors = [];
      if (!this.$v.bairro.$dirty) return errors;
      !this.$v.bairro.required && errors.push("Bairro é obrigatório");
      return errors;
    },
    cidadeErrors() {
      const errors = [];
      if (!this.$v.cidade.$dirty) return errors;
      !this.$v.cidade.required && errors.push("Cidade é obrigatório");
      return errors;
    },
    estadoErrors() {
      const errors = [];
      if (!this.$v.estado.$dirty) return errors;
      !this.$v.estado.required && errors.push("Estado é obrigatório");
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
          logradouro: this.logradouro,
          numero: this.numero,
          bairro: this.bairro,
          cep: this.cep,
          complemento: this.complemento,
          cidade: this.cidade,
          idEstado: this.estado,
        };

        this.$http
          .post(`enderecos/${this.idAluno}`, data)
          .then((response) => {
            console.log(response);

            this.$toast.fire("Endereço cadastrado com sucesso", "", "success");
            this.$router.push({
              name: "AlteraAluno",
              params: { id: this.idAluno },
            });
            // this.$http.put(`/alunos/${idAluno}`, idEndereco)
            //   .then(resposta)
          })
          .catch((err) => {
            console.log(err);
            return this.$toast.fire(
              "Não foi possível cadastrar o endereço.",
              "",
              "error"
            );
          });
      } else {
        this.$v.$touch();
      }
    },
    gravaDadosGerais() {},

    buscaEndereco(id) {
      this.$http.get(`/enderecos/${id}`).then((response) => {
        this.idEndereco = response.data.id;
        console.log("Endereco da função busca: " + this.idEndereco);
        return this.idEndereco;
      });
    },

    atualizaDados() {
      let data = {
        logradouro: this.logradouro,
        numero: this.numero,
        bairro: this.bairro,
        cep: this.cep,
        complemento: this.complemento,
        cidade: this.cidade,
        idEstado: this.estado,
      };
      console.log(data);

      this.$http
        .put(`/enderecos/${this.idEndereco}`, data)
        .then((response) => {
          console.log(data, response);
          this.$router.push("/alunos");
          this.$toast.fire("Endereço atualizado com sucesso", "", "success");
        })
        .catch((err) => {
          this.$toast.fire("Erro ao atualizar", "", "error");
          console.log(err);
        });
    },

    limpar() {
      this.logradouro = "";
      this.numero = "";
      this.bairro = "";
      this.cep = "";
      this.complemento = "";
      this.cidade = "";
      this.estado = "";
    },
    cancelar() {
      this.$router.push(`/CadAlunos/${this.idAluno}`);
    },
  },
};
</script>

<style></style>
