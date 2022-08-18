<template>
  <v-app id="inspire">
    <div id="fundo">
      <v-container class="all" fill-height cols="6">
        <v-row>
          <v-col cols="6">
            <br />
            <!-- <v-card class="mt-5 py-3 all-80" color="rgb(255, 255, 255, 0.3)"> -->
            <h1>Syslyra</h1>
            <h3>Sistema de apoio administrativo e operacional para a</h3>
            <h3>Escola de Música Lyra Carlos Gomes</h3>
            <br /><br />
            <v-alert>Efetue o login para utilizar o sistema</v-alert>
            <v-alert
              >Caso seja um novo usuário, solicite ao administrador o cadastro
              de suas credenciais</v-alert
            >
            <!-- </v-card> -->
          </v-col>
          <v-col cols="6">
            <v-spacer></v-spacer>
            <v-spacer> </v-spacer>
            <v-card
              outlined
              class="mt-5 pt-5 pa-2 all-80 justify-center"
              color="rgb(255, 255, 255, 0.0)"
            >
              <v-form @submit.prevent="efetuarLogin">
                <v-card class="px-4 py-2">
                  <h1 class="justify-center py-5">Login</h1>
                  <v-text-field
                    outlined
                    v-model="login"
                    label="Login"
                    required
                    class="mt-5"
                  ></v-text-field>

                  <v-text-field
                    outlined
                    v-model="senha"
                    label="Senha"
                    required
                    type="password"
                  ></v-text-field>
                  <v-btn type="submit" class="mb-5 py-5" color="success"
                    >Entrar</v-btn
                  >
                  <v-progress-circular
                    v-if="submeted"
                    :size="50"
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </v-card>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
        <Rodape></Rodape>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import Rodape from "../../components/Rodape.vue";
export default {
  data() {
    return {
      login: "",
      senha: "",
      logado: false,
      submeted: false,
    };
  },
  methods: {
    efetuarLogin() {
      this.submeted = true;
      if (!this.login || !this.senha) {
        this.$toast.fire("Informe os dados corretamente", "", "error");
        this.submeted = false;
        return;
      }
      let data = {
        login: this.login,
        senha: this.senha,
      };
      this.$http
        .post("/login", data)
        .then((response) => {
          console.log(response);
          //localStorage.setItem("token", response.data.token);
          // this.$store.state.token = response.data.token;
          // this.$store.state.usuario = response.data.user;
          this.$store.commit("DEFINIR_USUARIO_LOGADO", {
            token: response.data.token,
            usuario: response.data.user,
          });
          this.logado = true;
          this.$emit("isLogged", this.logado);
          this.$router.push("/home");
          // this.$forceUpdate();
          // console.log("Atualizei");
        })
        .catch((erro) => {
          console.log(erro);
          this.limpar();
          this.$toast.fire("Login inválido", "", "error");
        });
      this.submeted = false;
    },
    limpar() {
      this.login = "";
      this.senha = "";
    },
  },
  components: { Rodape },
};
</script>

<style>
.all {
  height: 100vh;
}

.all-80 {
  height: 80vh;
}

#fundo {
  /* background-image: url("../../assets/lyra-login.png"); */
  background-color: rgb(231, 231, 231);
}

#title {
  color: black;
}
</style>