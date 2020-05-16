import ApiHelper from '~/assets/api-helper'

export default function (ctx, inject) {
  ApiHelper.$axios = ctx.$axios
  inject('api', ApiHelper)
}
