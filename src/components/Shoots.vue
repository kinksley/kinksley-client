<template>

<b-container>
  <b-row>
    <b-col>
      <h2>Shoots</h2>
    </b-col>
  </b-row>
  <b-row class="mb-5">
    <b-col>

      <b-form @submit.prevent="getShoots('true')">

      <b-tabs>

        <b-tab title="Title Search">

          <b-form-group class="mt-3" id="exampleInputGroup1"
                              label=""
                              label-for="titleSearchInput"
                              description="No filters except straight/gay/everything will be applied.">
                  <b-form-input id="titleSearchInput"
                                type="text"
                                v-model="titleToSearch"
                                placeholder="Search by shoot title">
                  </b-form-input>
                </b-form-group>

        </b-tab>

        <b-tab :title="'Orientation (' + this.orientationSelected + ')'">
          <b-form-group class="mt-3" label="Orientation">
            <b-form-radio-group v-model="orientationSelected"
                                :options="orientationOptions"
                                name="radioOrientation">
            </b-form-radio-group>
          </b-form-group>
        </b-tab>

        <b-tab :title="'Sites (' + ((this.siteNamesSelected.length) > 0 ? this.siteNamesSelected.length : 'all') + ')'">

          <div v-for="siteCategory in sites" :key="siteCategory.category">
            <b-form-group class="mt-3" :label="siteCategory.category">

              <b-form-checkbox v-model="siteCategory.allSelected"
                                :value="{category: siteCategory.category, checked: true}"
                                :unchecked-value="{category: siteCategory.category, checked: false}"
                                :indeterminate="indeterminate[siteCategory.category]"
                                :aria-describedby="siteCategory.category + ' category selector'"
                                :aria-controls="'Selects all ' + siteCategory.category + ' sites'"
                                @change="sitesCategoryToggleAll"
              >{{ siteCategory.allSelected && siteCategory.allSelected.checked ? 'Un-select All' : 'Select All' }}
              </b-form-checkbox>

              <b-form-checkbox-group v-model="siteNamesSelected" :options="siteCategory.sites" class="ml-4">
              </b-form-checkbox-group>

            </b-form-group>
          </div>

        </b-tab>

        <!-- <b-tab :title="'Tags (' + ((this.tagsSelected.length - 1) > -1 ? this.tagsSelected.length - 1 : 0) + ')' +  this.tagsSelected.length"> -->
          <b-tab :title="'Tags (' + this._.filter(this.tagsSelected, function(t) { return t !== 'gay' && t !== 'straight' }).length + ')'">
          <b-form-group class="mt-3" label="Tags">
                <b-form-checkbox-group v-model="tagsSelected" :options="tagsOptions">
                </b-form-checkbox-group>
          </b-form-group>
        </b-tab>

        <b-tab :title="'Sort by (' + this.sortBySelected + ')'">
          <b-form-group class="mt-3" label="Sort by">
            <b-form-radio-group v-model="sortBySelected"
                                :options="sortByOptions"
                                name="radioSortBy">
            </b-form-radio-group>
          </b-form-group>

          <b-form-group class="mt-3" label="Sort order">
            <b-form-radio-group v-model="sortOrderSelected"
                                :options="sortOrderOptions"
                                name="radioSortOrder">
            </b-form-radio-group>
          </b-form-group>
        </b-tab>

      </b-tabs>

      <b-button type="submit" class="btn btn-success">Search</b-button>

      </b-form>

    </b-col>
  </b-row>
  <b-row v-if="errorDisplay">
    <b-col>
      <b-alert show>Something went wrong :( {{ errorDisplay }}</b-alert>
    </b-col>
  </b-row>
  <b-row>
      <b-col md="6" lg="3" v-for="shoot in shoots" :key="shoot.id">
        <ShootCard :shoot="shoot"></ShootCard>
      </b-col>
  </b-row>
  <b-row v-if="loaderShow" class="my-5">
    <b-col class="text-center">
        <img style="max-height: 3em" src="../assets/spinner.gif">
    </b-col>
  </b-row>
</b-container>

</template>

<script>
import ShootsService from '@/services/ShootsService'
import SitesService from '@/services/SitesService'
import TagsService from '@/services/TagsService'
import ShootCard from '@/components/ShootCard.vue'
export default {
  name: 'shoots',
  components: {
    ShootCard
  },
  data () {
    return {
      shoots: [],
      orientationOptions: ['straight', 'gay', 'everything'],
      orientationSelected: 'everything',
      sites: sites,
      siteNamesSelected: [],
      sitesCategorySelected: [],
      titleToSearch: '',
      tags: [],
      tagsOptions: [],
      tagsSelected: [],
      sortByOptions: ['title', 'rating', 'votes', 'date'],
      sortBySelected: 'rating',
      sortOrderOptions: [
        { text: 'Descending', value: '-1' },
        { text: 'Ascending', value: '1' }
      ],
      sortOrderSelected: '-1',
      indeterminate: {},
      loaderShow: true,
      errorDisplay: '',
      noMoreResults: false
    }
  },
  mounted () {
    this.readCookies()
    this.getShoots()
    this.getSites()
    this.getTags()
    // this.selectAllSites()
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    readCookies () {
      if (this.$cookie.get('siteNamesSelected') && this.$cookie.get('siteNamesSelected') !== 'null') {
        // todo: fix: if all sites in a category are selected, the tristate checkbox will remain unchecked
        try {
          this.siteNamesSelected = JSON.parse(this.$cookie.get('siteNamesSelected'))
        } catch (error) {
          console.warn('Bad value saved in the siteNamesSelected cookie')
        }
      }
      if (this.$cookie.get('orientationSelected') && this.$cookie.get('siteNamesSelected') !== 'null') {
        try {
          this.orientationSelected = this.$cookie.get('orientationSelected')
        } catch (error) {
          console.warn('Bad value saved in the orientationSelected cookie')
        }
      }
      if (this.$cookie.get('sortBySelected') && this.$cookie.get('sortBySelected') !== 'null') {
        try {
          this.sortBySelected = this.$cookie.get('sortBySelected')
        } catch (error) {
          console.warn('Bad value saved in the sortBySelected cookie')
        }
      }
    },
    async getShoots (removeOldResults) {
      if (!this.noMoreResults || (this.noMoreResults && removeOldResults)) {
        this.loaderShow = true
        this.noMoreResults = false

        if (this.$cookie.get('cookieConsent')) {
          this.$cookie.set('siteNamesSelected', JSON.stringify(this.siteNamesSelected), 1)
          this.$cookie.set('orientationSelected', this.orientationSelected, 1)
          this.$cookie.set('sortBySelected', this.sortBySelected, 1)
        }

        try {
          var response = await ShootsService.fetchShoots({
            modelId: this.$route.query.id,
            title: this.titleToSearch,
            tags: this.tagsSelected,
            siteNames: this.siteNamesSelected,
            sortBy: this.sortBySelected,
            sortOrder: this.sortOrderSelected,
            skip: removeOldResults ? 0 : this.shoots.length
          })
        } catch (error) {
          this.errorDisplay = error.message
          this.loaderShow = false
          console.error(error.message)
        }

        if (response && response.data.shoots.length !== 0) {
          // load results into this.shoots
          if (removeOldResults) {
            this.shoots = response.data.shoots
          } else {
            this.shoots = this.shoots.concat(response.data.shoots)
          }

          for (const shoot of this.shoots) {
            var descriptionShort = shorten(shoot.description, 150)
            if (descriptionShort.substr(descriptionShort.length - 1).match(/\?|!|\./)) {
              descriptionShort = descriptionShort.slice(0, -1)
            }
            shoot.descriptionShort = descriptionShort + '...'
          }

          this.loaderShow = false

          if (response.data.shoots.length < 12) {
            this.noMoreResults = true
          }
        } else {
          this.noMoreResults = true
          this.loaderShow = false
        }
      }
      // truncate the description
      function shorten (str, maxLen, separator = ' ') {
        if (str.length <= maxLen) return str
        return str.substr(0, str.lastIndexOf(separator, maxLen))
      }
    },
    async getSites () {
      try {
        var response = await SitesService.fetchSites()
      } catch (error) {
        this.errorDisplay = error.message
        console.error(error.message)
      }

      if (response) {
        var sitesStats = response.data.sites

        for (let i = 0; i < sites.length; i++) {
          for (const site of sites[i].sites) {
            var count
            for (const stat of sitesStats) {
              if (stat._id === site.value) {
                count = stat.count
              }
            }
            // this.siteNamesOptions.push({
            //   text: site.title + " (" + count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ")",
            //   value: site.siteName
            // });
            site.count = count
            site.text =
              site.text +
              ' (' +
              site.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
              ')'
          }

          // sort by count of videos
          sites[i].sites.sort(function (a, b) {
            return a.count > b.count ? -1 : b.count > a.count ? 1 : 0
          })
        }
      }
    },
    async getTags () {
      try {
        var response = await TagsService.fetchTags()
      } catch (error) {
        this.errorDisplay = error.message
        console.error(error.message)
      }

      if (response) {
        var tagsToDisplay = response.data.tags.filter(function (item) {
          return item._id !== 'straight' && item._id !== 'gay'
        })
        this.tags = tagsToDisplay
        for (let i = 0; i < this.tags.length; i++) {
          this.tagsOptions.push({
            text:
              this.tags[i]._id +
              ' (' +
              this.tags[i].count
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
              ')',
            value: this.tags[i]._id
          })
        }
      }
    },
    sitesCategoryToggleAll (checked) {
      if (checked.checked) {
        var cat = this._.find(this.sites, {category: checked.category})
        for (const site of cat.sites) {
          this.siteNamesSelected.push(site.value)
        }
      } else {
        cat = this._.find(this.sites, {category: checked.category})
        for (const site of cat.sites) {
          this.siteNamesSelected = this._.reject(this.siteNamesSelected, (n) => { return n === site.value })
        }
      }
    },
    selectAllSites () {
      var siteNamesAll = []
      for (let i = 0; i < sites.length; i++) {
        for (const site of sites[i].sites) {
          siteNamesAll.push(site.value)
        }
        this.sites[i].allSelected = {category: this.sites[i].category, checked: true}
        this.siteNamesSelected = siteNamesAll
      }
    },
    handleScroll: function (event) {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if (!this.loaderShow) {
          this.getShoots()
        }
      }
    }
  },
  watch: {
    orientationSelected (newVal, oldVal) {
      if (newVal === 'everything') {
        var index = this.tagsSelected.indexOf('straight')
        if (index > -1) {
          this.tagsSelected.splice(index, 1)
        }
        index = this.tagsSelected.indexOf('gay')
        if (index > -1) {
          this.tagsSelected.splice(index, 1)
        }
      } else if (oldVal === 'gay' || oldVal === 'straight') {
        index = this.tagsSelected.indexOf(oldVal)
        if (index > -1) {
          this.tagsSelected.splice(index, 1)
        }
        this.tagsSelected.push(newVal)
      } else if (oldVal === 'everything') {
        this.tagsSelected.push(newVal)
      }
    },
    siteNamesSelected (newVal, oldVal) {
      // Handle changes in individual site checkboxes
      if (newVal.length > 0) {
        for (let i = 0; i < sites.length; i++) {
          var siteNamesInCategory = []
          for (const site of sites[i].sites) {
            siteNamesInCategory.push(site.value)
          }

          if (this._.difference(siteNamesInCategory, newVal).length === 0) {
          // all in category are checked
            this.indeterminate[sites[i].category] = false
            this.sites[i].allSelected.checked = true
          } else if (this._.difference(siteNamesInCategory, newVal).length < siteNamesInCategory.length) {
          // some in category are checked
            this.indeterminate[sites[i].category] = true
            this.sites[i].allSelected.checked = false
          } else {
          // none in category are checked
            this.indeterminate[sites[i].category] = false
            this.sites[i].allSelected.checked = false
          }
        }
      } else {
        // no sites are checked at all
        for (let i = 0; i < sites.length; i++) {
          this.sites[i].allSelected.checked = false
          this.indeterminate[sites[i].category] = false
        }
      }
    }
  }
}

var sites = [
  {
    category: 'BDSM',
    allSelected: {},
    sites: [
      { text: 'Ballgaggers', value: 'ballgaggers' },
      { text: 'Badtime Stories', value: 'badtimestories' },
      { text: 'Bizarre Video', value: 'bizarrevideo' },
      { text: 'BLEU', value: 'bleufilms' },
      { text: 'Device Bondage', value: 'devicebondage' },
      { text: 'Hogtied', value: 'hogtied' },
      { text: 'Hogtied Up', value: 'hogtiedup' },
      { text: 'Infernal Restraints', value: 'infernalrestraints' },
      { text: 'Kink Features', value: 'kinkfeatures' },
      { text: 'Kink University', value: 'kinkuniversity' },
      { text: 'Proud and Perverted', value: 'proudandperverted' },
      { text: 'Sadistic Rope', value: 'sadisticrope' },
      { text: 'Severe Sex Films', value: 'severesexfilms' },
      { text: 'Struggling Babes', value: 'strugglingbabes' },
      { text: 'The Training Of O', value: 'thetrainingofo' },
      { text: 'The Upper Floor', value: 'theupperfloor' },
      { text: 'Families Tied', value: 'familiestied' },
      { text: 'Wasteland', value: 'wasteland' },
      { text: 'Water Bondage', value: 'waterbondage' }
    ]
  },
  {
    category: 'Hardcore',
    allSelected: {},
    sites: [
      { text: 'Animated Kink', value: 'animatedkink' },
      { text: 'Bound Gang Bangs', value: 'boundgangbangs' },
      { text: 'Brutal Sessions', value: 'brutalsessions' },
      { text: 'Deviant Hardcore', value: 'devianthardcore' },
      { text: 'Digital Sin', value: 'digitalsin' },
      { text: 'Dungeon Sex', value: 'dungeonsex' },
      { text: 'Fucked and Bound', value: 'fuckedandbound' },
      { text: 'Fucking Machines', value: 'fuckingmachines' },
      { text: 'Hardcore Gangbang', value: 'hardcoregangbang' },
      { text: 'Harmony Fetish', value: 'harmonyfetish' },
      { text: 'Machine Dom', value: 'machinedom' },
      { text: "Pascal's Sub Sluts", value: 'pascalssubsluts' },
      { text: 'Pornstar Platinum', value: 'pornstarplatinum' },
      { text: 'Public Disgrace', value: 'publicdisgrace' },
      { text: 'Sex And Submission', value: 'sexandsubmission' },
      { text: 'Sexual Disgrace', value: 'sexualdisgrace' },
      { text: 'Sexually Broken', value: 'sexuallybroken' },
      { text: 'Spizoo', value: 'spizoo' }
    ]
  },
  {
    category: 'Femdom',
    allSelected: {},
    sites: [
      { text: 'Bound Men Wanked', value: 'boundmenwanked' },
      { text: 'Captive Male', value: 'captivemale' },
      { text: 'Carmen Rivera', value: 'carmenrivera' },
      { text: 'Chantas Bitches', value: 'chantasbitches' },
      { text: 'Divine Bitches', value: 'divinebitches' },
      { text: 'Electrosluts', value: 'electrosluts' },
      { text: 'Everything Butt', value: 'everythingbutt' },
      { text: 'FemDum', value: 'femdum' },
      { text: 'Foot Worship', value: 'footworship' },
      { text: 'Men in Pain', value: 'meninpain' },
      { text: 'Plumperd', value: 'plumperd' },
      { text: 'Revenge of the Baroness', value: 'revengeofthebaroness' },
      { text: 'Strapon Squad', value: 'straponsquad' },
      { text: 'Ultimate Surrender', value: 'ultimatesurrender' },
      { text: 'Whipped Ass', value: 'whippedass' },
      { text: 'Wired Pussy', value: 'wiredpussy' }
    ]
  },
  {
    category: 'TS',
    allSelected: {},
    sites: [
      { text: 'TS Pussy Hunters', value: 'tspussyhunters' },
      { text: 'TS Seduction', value: 'tsseduction' }
    ]
  },
  {
    category: 'KinkMen',
    allSelected: {},
    sites: [
      { text: '30 Minutes of Torment', value: '30minutesoftorment' },
      { text: 'Bound in Public', value: 'boundinpublic' },
      { text: 'Bound Gods', value: 'boundgods' },
      { text: 'Butt Machine Boys', value: 'buttmachineboys' },
      { text: 'Men On Edge', value: 'menonedge' },
      { text: 'Naked Kombat', value: 'nakedkombat' },
      { text: 'SW Nude', value: 'swnude' }
    ]
  },
  {
    category: 'Gay',
    allSelected: {},
    sites: [
      { text: 'Alternadudes', value: 'alternadudes' },
      { text: 'Bonus Hole Boys', value: 'bonusholeboys' },
      { text: 'Bound And Gagged', value: 'boundandgagged' },
      { text: 'Boynapped', value: 'boynapped' },
      { text: "Gentleman's Closet", value: 'gentlemenscloset' },
      { text: "My Friends' Feet", value: 'myfriendsfeet' },
      { text: 'Nasty Daddy', value: 'nastydaddy' },
      { text: 'Str8Hell', value: 'str8hell' },
      { text: 'SW Nude', value: 'swnude' },
      { text: 'Yesirboys', value: 'yesirboys' }
    ]
  }
]

</script>

<style>
.shoot-description {
  max-height: 30em;
}
</style>
