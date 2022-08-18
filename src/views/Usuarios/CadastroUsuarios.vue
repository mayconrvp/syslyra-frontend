<template>
  <v-container>
    <v-card>
      <v-toolbar color="cyan" dark>
        <v-toolbar-title>Usuários</v-toolbar-title>
        <v-spacer></v-spacer>
        <template v-slot:extension> </template>
      </v-toolbar>

      <v-form @submit.prevent="grava()">
        <v-card>
          <v-container>
            <v-select
              v-model="funcionario"
              :items="funcionarios"
              item-value="id"
              item-text="nome"
              label="Selecione o funcionario"
              clearable
            ></v-select>
            <v-text-field v-model="login" label="Login"></v-text-field>
            <v-text-field
              v-model="senha"
              type="password"
              label="Senha"
            ></v-text-field>
            <v-text-field
              v-model="senhaConfirm"
              type="password"
              label="Repita a Senha"
            ></v-text-field>
            <v-select v-model="nivel" :items="niveis" label="Nível"></v-select>
          </v-container>
        </v-card>

        <v-card>
          <v-container>
            <v-btn
              v-if="this.id"
              class="mr-4"
              primary
              color="success"
              @click="validaUpdate"
            >
              Atualizar
            </v-btn>
            <v-btn
              v-else
              v-show="!this.id"
              color="success"
              class="mr-4"
              @click="valida"
            >
              Salvar
            </v-btn>

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
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    name: { required, maxLength: maxLength(10) },
    select: { required },
    checkbox: {
      checked(val) {
        return val;
      },
    },
  },

  data() {
    return {
      id: this.$route.params.id,
      login: "",
      senha: "",
      funcionario: "",
      funcionarios: [],
      usuarios: [],
      niveis: [1, 2, 3, 4],
    };
  },
  created() {
    if (this.id) {
      this.$http.get(`usuarios/${this.id}`).then((response) => {
        console.log(response.data);
        this.login = response.data.login;
        this.funcionario = response.data.idFuncionario;
        this.nivel = response.data.nivel;
        this.senha = response.data.senha;
        this.senhaConfirm = response.data.senha;
      });
    }

    this.$http.get(`funcionarios/`).then((response) => {
      this.funcionarios = response.data;
    });
    this.$http.get(`usuarios/`).then((response) => {
      this.usuarios = response.data;
    });
  },

  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push("Name must be at most 10 characters long");
      !this.$v.name.required && errors.push("Name is required.");
      return errors;
    },
  },

  methods: {
    validate() {
      this.$refs.form.validate();
    },
    valida: function () {
      if (!this.funcionario) {
        this.$swal(
          "Atenção",
          "Selecione um funcionário para criar um usuário",
          "info"
        );
        return false;
      }
      if (!this.login) {
        this.$swal("Atenção", "Informe um login para o usuário", "info");
        return false;
      }
      if (!this.nivel) {
        this.$swal("Atenção", "Selecione um nivel para o usuário", "info");
        return false;
      }
      if (this.senha !== this.senhaConfirm) {
        this.$swal("Atenção", "Senhas não conferem", "info");
        return false;
      }
      for (let i = 0; i < this.usuarios.length; i++) {
        console.log(this.usuarios[i]);
        if (this.usuarios[i].idFuncionario == this.funcionario) {
          this.$swal(
            "Atenção",
            "Usuário já cadastrado para o funcionário selecionado",
            "info"
          );
          return false;
        }
      }
      this.grava();
    },

    validaUpdate: function () {
      if (!this.funcionario) {
        alert("Selecione um funcionário");
        return false;
      }
      if (!this.login) {
        alert("Informe um login para o usuário");
        return false;
      }
      if (this.login) {
        for (let i = 0; i < this.usuarios.length; i++) {
          console.log(this.usuarios[i]);
          if (
            this.usuarios[i].login === this.login &&
            this.usuarios[i].id != this.id
          ) {
            console.log(this.usuarios[i].id);
            console.log(this.id);
            alert("Login já utilizado para outro usuário. Tente outro login");
            return false;
          }
        }
      }
      if (!this.nivel) {
        alert("Selecione um nivel para o usuário");
        return false;
      }
      if (this.senha !== this.senhaConfirm) {
        alert("Senhas não conferem");
        return false;
      }
      for (let i = 0; i < this.usuarios.length; i++) {
        console.log(this.usuarios[i]);
        if (
          this.usuarios[i].idFuncionario == this.funcionario &&
          this.usuarios[i].id != this.id
        ) {
          alert("Usuário já cadastrado para o funcionário selecionado");
          return false;
        }
      }
      this.atualizaDadosGerais();
    },
    grava() {
      let data = {
        idFuncionario: this.funcionario,
        login: this.login,
        senha: this.senha,
        nivel: this.nivel,
      };

      try {
        this.$http.post("usuarios", data).then(() => {
          alert("Usuário cadastrado com sucesso");
          this.$router.push({ name: "Usuario" });
        });
      } catch (err) {
        alert("Não foi possível efetuar o cadastro. Erro: " + err.message);
      }
    },

    atualizaDadosGerais() {
      let data = {
        idFuncionario: this.funcionario,
        login: this.login,
        senha: this.senha,
        nivel: this.nivel,
      };

      this.$http.put(`/usuarios/${this.id}`, data).then(
        () => {
          alert("Atualizado com sucesso");
          this.$router.push("/usuarios");
        },
        (err) => {
          console.log(err);
          alert("Erro ao atualizar. Erro: " + err);
        }
      );
    },

    cancelar() {
      this.$router.push("/usuarios");
    },
  },
};
</script>

<style></style>
