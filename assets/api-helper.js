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

const baseRepoOwner = 'EtherOJ'

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

async function deleteRef (repoName, branch) {
  return await this.$axios.$delete(`/repos/${repoName}/git/refs/heads/${branch}`)
}

async function getRef (repo, ref) {
  try {
    const resp = await this.$axios.$get(`/repos/${repo}/git/refs/${ref}`)
    return resp
  } catch (e) {
    return undefined
  }
}

async function getBranchHeadSHA (repo, branch) {
  const resp = await this.$axios.$get(`/repos/${repo}/branches/${branch}`)
  return resp.commit.sha
}

async function pushFilesToRef (repo, files, baseTree, ref) {
  const tree = await this.$axios.$post(`/repos/${repo}/git/trees`, {
    tree: files,
    base_tree: baseTree
  })
  const commit = await this.$axios.$post(`/repos/${repo}/git/commits`, {
    message: 'Submit Code',
    tree: tree.sha,
    parents: [baseTree]
  })
  const refw = await this.$axios.$post(`/repos/${repo}/git/refs`, {
    ref,
    sha: commit.sha
  })

  return refw
}

const uPull = '/repos/{0}/pulls'
async function createPullToSrc (head, base, title, closeImmediately) {
  const pullInfo = await this.$axios.$post(f(uPull, submissionsSrcRepo), {
    base,
    head,
    title
  })
  return pullInfo
}

async function closePull (repo, pullId) {
  await this.$axios.$patch(`/repos/${repo}/pulls/${pullId}`, {
    state: 'closed'
  })
}

async function getFile (repo, path, ref) {
  const refQuery = ref !== undefined ? `?ref=${ref}` : ''
  try {
    const file = await this.$axios.$get(`/repos/${repo}/contents/${path}${refQuery}`)
    file.text = Base64.decode(file.content)
    return file
  } catch (e) {
    return undefined
  }
}

export default {
  $axios,
  getUserRepo,
  forkRepo,
  createPullToSrc,
  closePull,
  deleteRef,
  getRef,
  pushFilesToRef,
  submissionsSrcRepo,
  baseRepoOwner,
  getFile,
  getBranchHeadSHA
}
