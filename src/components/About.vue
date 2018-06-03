<template>

<b-container>
  <b-row>
    <b-col>
      <h1>About</h1>
    </b-col>
  </b-row>
  <b-row v-if="errorDisplay">
    <b-col>
      <b-alert show>Something went wrong :( {{ errorDisplay }}</b-alert>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <p class="lead">Kinksley helps you search through <a href="//kink.com">Kink.com</a> videos using advanced filters not readily available on the <a href="//kink.com">Kink.com</a> website itself.</p>
      <p>This is a personal project <strong>not associated with <a href="//kink.com">Kink.com</a></strong>.</p><!-- /.lead -->
      <h2>Bugs? Suggestions?</h2>
      <p>This is very much a work in progress - you can find the source code on <a href="https://github.com/kinksley/kinksley-client">Github</a>. You are welcome to <a href="https://github.com/kinksley/kinksley-client/issues">report issues</a>, add ideas and generally contribute to this project there.</p>
      <h2>Support</h2>
      <p>Developing and running even a modest a project like this costs time and money. If you enjoy Kinksley and would like to support its development, please consider donating 🙏.</p>
      <ul>
        <li>BTC: 1LLxmEQFDt9TSZjg6xbwZyqT6dBe4Gg4M7</li>
        <li>LTC: LPVuTdNryRX5vFDUo4xkJpr7UNoiBV4ysY</li>
        <li>ETH: 0xFed3e2941885290a4855bbdc6713D22CA6576d1b</li>
      </ul>
    </b-col>
  </b-row>
</b-container>

</template>

<script>
export default {
  name: 'about',
  components: {
  },
  data () {
    return {
    }
  }
}

</script>

<style>
.shoot-description {
  max-height: 30em;
}
</style>
