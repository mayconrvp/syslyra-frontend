<template>
  <div @isLogged="logado = $event">
    <div v-if="usuarioEstaLogado">
      <v-app id="inspire" class="overflow-hidden">
        <v-navigation-drawer v-model="drawer" app>
          <MenuLat></MenuLat>
        </v-navigation-drawer>

        <v-app-bar
          absolute
          color="#6A76AB"
          prominent
          src="./assets/trumpet-wallpaper.jpg"
          scroll-target="#scrolling-techniques-3"
          app
        >
          <template v-slot:img="{ props }">
            <v-img
              v-bind="props"
              gradient="to top right, rgba(100,115,100,.7), rgba(255,255,255,.7)"
            ></v-img>
          </template>
          <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

          <v-toolbar-title style="margin: 0 auto"
            ><h3 class="titulo">Escola Lyra Carlos Gomes</h3></v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-btn icon class="mr-2" @click.prevent="efetuarLogout()">
            Sair
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </v-app-bar>

        <v-main>
          <v-slide-x-transition mode="out-in">
            <router-view />
          </v-slide-x-transition>
        </v-main>

        <Rodape />
      </v-app>
    </div>
    <Login v-else />
  </div>
</template>

<script>
import MenuLat from "./components/MenuLat.vue";
import Rodape from "./components/Rodape.vue";
import "./styles/global.css";
import Login from "./views/Login/Login.vue";

export default {
  computed: {
    usuarioEstaLogado() {
      return Boolean(this.$store.state.token);
    },
  },
  data: () => ({
    drawer: null,
    logado: "",
  }),
  methods: {
    efetuarLogout() {
      this.$store.commit("DESLOGAR_USUARIO");
      this.$router.push("/");
    },
  },
  components: { Login, MenuLat, Rodape },
};
</script>

<style scoped>
.titulo {
  color: rgb(55, 57, 61);
  margin: 0 auto;
}
</style>
