<template>
  <div id="app">

    <b-navbar toggleable="md" type="dark" variant="secondary" class="mb-4">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="/">Kinksley <small class="text-light">Beta</small></b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav>
          <b-nav-item href="/shoots">Shoots</b-nav-item>
          <b-nav-item href="#" disabled>Models</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <!-- <b-navbar-nav class="ml-auto">

          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"/>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>

          <b-nav-item-dropdown right>
            <template slot="button-content">
              <em>User</em>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Signout</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav> -->

      </b-collapse>
    </b-navbar>

    <b-container fluid>
      <b-col>
        <div :class="{ 'd-none': this.$cookie.get('cookieConsent') }" class="alert alert-info alert-dismissible fade show text-center" role="alert">
          <strong>Cookies!</strong> Kinksley uses them to save your search preferences.
          <button type="button" class="btn btn-primary" @click="setCookieConsent" data-dismiss="alert" aria-label="Close">
            ✓ Great!
          </button>
          <button type="button" class="btn btn-secondary" data-dismiss="alert" aria-label="Close">
            &times; Nope! I don't want cookies.
          </button>
        </div>
      </b-col>
    </b-container>

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    setCookieConsent () {
      this.$cookie.set('cookieConsent', 'true', 1)
    }
  }
}
</script>

<style>
</style>
