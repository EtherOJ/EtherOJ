<template>
  <div v-if="!$auth.loggedIn">
    <zi-spacer />
    <zi-note type="warning">
      You're not logged in. Due to GitHub API quota limitations, you'll be
      restricted to continue use this site in current quota window soon.
      Please <nuxt-link to="/login">
        log in
      </nuxt-link> for best experience.
    </zi-note>
    <zi-spacer />
  </div>
</template>
