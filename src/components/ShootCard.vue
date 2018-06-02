<template>
<div>
        <b-row class="mb-2">
          <b-col sm="6">
            <img class="img-fluid" :src="'https://cdnp.kink.com/assets/channels/logo-300x100/home-logo-' + ( shoot.siteName !== 'publicdisgrace' ? shoot.siteName : 'publicdiscrace') + '.png'" alt="">
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <a :href="'https://www.kink.com/shoot/' + shoot.id">
              <!-- <img class="img-fluid" :src="'https://cdnp.kink.com/imagedb/' + shoot.id + '/i/h/410/0.jpg'" alt=""> -->
              <div v-if="shoot.photos && shoot.photos[0]" class="embed-responsive embed-responsive-16by9 mb-1" :style="{ backgroundColor: '#003846', backgroundImage: 'url(' + shoot.photos[0] + ')', backgroundPosition: 'center', backgroundSize: 'cover' }">
              </div>
              <div v-else class="embed-responsive embed-responsive-16by9 mb-1" :style="{ backgroundColor: '#003846', backgroundImage: 'url(https://cdnp.kink.com/imagedb/' + shoot.id + '/i/h/410/0.jpg)', backgroundPosition: 'center', backgroundSize: 'cover' }">
              </div>
              <!-- <img v-else class="img-fluid" :src="'https://cdnp.kink.com/imagedb/' + shoot.id + '/i/h/410/0.jpg'" alt=""> -->
              <h3 class="h4">{{ shoot.title }}</h3>
            </a>
          </b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col>
            <p class="mb-0"><strong>Date:</strong> {{ shoot.date.substr(0,10) }}</p>
            <p class="mb-0">
              <strong>{{ shoot.models.length > 1 ? 'Models: ' : 'Model: ' }}</strong>
              <span v-for="(model, index) in shoot.models" :key="model.id"><a :href="'/model?id=' + model.id">{{ model.name ? model.name : model.id }}</a><span>{{ model.gender === 'female' ? ' ♀' : '' }}{{ model.gender === 'male' ? ' ♂️' : ''}}</span><span v-if="index != shoot.models.length - 1">, </span>
              </span>
            </p>
            <p class="mb-1"><strong>Rating:</strong> {{ Math.round( shoot.rating.avgRating * 10) / 10 }} ({{ shoot.rating.numRatings }} votes)</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <p class="shoot-description">{{ shoot.descriptionShort }}</p>
          </b-col>
        </b-row>
</div>

</template>

<script>
// todo: typo rewrites - publicdiscrace, harmony-fetish - for images
export default {
  name: 'ShootCard',
  props: ['shoot'],
  data () {
    return {
      count: 0
    }
  }
}
</script>
