import Base64 from '~/assets/base64'

// simple util function
function f (t, ...args) {
  return t.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] !== 'undefined'
      ? args[number]
      : match
  })
}

// eslint-disable-next-line prefer-const
let $axios = null

const baseRepoOwner = 'pcovellite'

const submissionsSrcRepo = `${baseRepoOwner}/submissions`
const uRepo = '/repos/{0}/{1}'
async function getUserRepo (user, name) {
  try {
    return await this.$axios.$get(f(uRepo, user, name))
  } catch (e) {
    if (e.response.status === 404) { return null } else { throw e }
  }
}

const uForkRepo = '/repos/{0}/forks'
async function forkRepo (target) {
  return await this.$axios.$post(f(uForkRepo, target))
}

const uRef = '/repos/{0}/git/ref/heads/{1}'
const uCreateRef = '/repos/{0}/git/refs'
async function createTempBranch (user) {
  const branchName = 'submit-' +
    Math.abs(Math.random() * 0x7FFFFFFFF | 0).toString(16).padStart(8, '0')
  const repoName = `${user}/submissions`
  const masterRef = await this.$axios.$get(f(uRef, repoName, 'master'))
  await this.$axios.$post(f(uCreateRef, repoName), {
    ref: `refs/heads/${branchName}`,
    sha: masterRef.object.sha
  })

  return branchName
}

async function deleteRef (user, branch) {
  const repoName = `${user}/submissions`
  return await this.$axios.$delete(f(uRef, repoName, branch))
}

const uCreate = '/repos/{0}/{1}/contents/{2}'
async function createFile (user, repo, branch, path, content, message = 'Submit Code') {
  const fileInfo = await this.$axios.$put(f(uCreate, user, repo, path), {
    message,
    branch,
    content: Base64.encode(content)
  })
  return fileInfo
}

const uPull = '/repos/{0}/pulls'
async function createPullToSrc (head, base, title) {
  const pullInfo = await this.$axios.$post(f(uPull, submissionsSrcRepo), {
    base,
    head,
    title
  })
  return pullInfo
}

export default {
  $axios,
  getUserRepo,
  forkRepo,
  createTempBranch,
  createFile,
  createPullToSrc,
  deleteRef,
  submissionsSrcRepo,
  baseRepoOwner
}
