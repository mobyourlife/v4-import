'use strict'

// Export modlue's entry point
module.exports = upgrade

/**
 * Upgrade legacy schema to the new schema.
 */
function upgrade (data) {
  let promise = new Promise((resolve, reject) => {
    let users = migrateUsers(data.users, data.fanpages)
    let sites = migrateSites(data.fanpages, data.domains)

    let result = {
      users: users,
      sites: sites
    }
    resolve(result)
  })

  return promise
}

/**
 * Migrate user's schema.
 * @param  {Array} oldUsers    Legacy users list.
 * @param  {Array} oldFanpages Legacy fanpages list.
 * @return {Array}             Users list in the new schema.
 */
function migrateUsers (oldUsers, oldFanpages) {
  let newUsers = []

  for (var o of oldUsers) {
    // Copy basic info from Facebook to local account
    let n = {
      name: o.facebook.name,
      email: o.facebook.email,
      social: {}
    }

    // Find creation time from the earliest created website
    n.createdTime = getUserCreationTime(o, oldFanpages)
    n.updatedTime = new Date()

    // Set Facebook login info
    let fb = n.social.facebook = {
      _id: o._id,
      name: o.facebook.name,
      email: o.facebook.email,
      userToken: o.facebook.token
    }

    // Map fanpages to the new schema
    fb.fanpages = o.fanpages.map((fp) => {
      // Map categories list
      let categoryList = fp.category_list.map((cat) => {
        return {
          _id: cat.id,
          name: cat.name
        }
      })

      // Return each fanpage in the new schema
      return {
        _id: fp.id,
        name: fp.name,
        accessToken: fp.acess_token,
        permissions: fp.perms,
        category: fp.category,
        categoryList: categoryList
      }
    })

    newUsers.push(n)
  }

  return newUsers
}

/**
 * Get the minimum creation time from user's websites.
 * @param  {Object} userData    User object.
 * @param  {Array} oldFanpages  User fanpages.
 * @return {Date}               Minimum creation time.
 */
function getUserCreationTime (userData, oldFanpages) {
  // Get fanpages with websites
  let refs = userData.fanpages.map((i) => i.id)
  let fanpages = oldFanpages.filter((i) => refs.indexOf(i._id) !== -1)

  // Get the minimum time value
  let times = fanpages.map((i) => i.creation.time)
  let min = new Date(Math.min.apply(null, times))

  return min
}

/**
 * Migrate sites' schema.
 * @param  {Array} oldFanpages Legacy fanpages list.
 * @param  {Array} oldDomains  Legacy domains list.
 * @return {Array}             Sites list in the new schema.
 */
function migrateSites (oldFanpages, oldDomains) {
  let newSites = []

  for (var o of oldFanpages) {
    // Basic website info
    let n = {
      name: o.facebook.name
    }

    // Creation and update time
    if (o.creation && o.creation.time) {
      n.createdTime = o.creation.time
    } else {
      n.createdTime = new Date()
    }
    n.updatedTime = new Date()

    // Copy site description for SEO
    if (o.facebook) {
      n.description = o.facebook.about || o.facebook.description
    }

    // Domains list
    n.domains = oldDomains.filter((i) => i.ref === o._id).map((i) => {
      let d = {
        _id: i._id,
        updatedTime: new Date()
      }

      if (i.creation) {
        d.createdTime = i.creation.time
      }

      return d
    })

    // Sort domains list
    n.domains = n.domains.sort((a, b) => {
      if (a._id.indexOf('meusitemob.com.br') != -1) {
        return -1
      } else if (a.createdTime && b.createdTime) {
        if (a.createdTime < b.createdTime) {
          return -1
        } else {
          return 1
        }
      }

      return 0
    })

    // The latest created domain will be marked as primary
    n.domains[n.domains.length - 1].primary = true

    // Link fanpage to the website
    let fanpageLink = {
      _id: o._id
    }

    // Latest job execution times
    if (o.jobs) {
      fanpageLink.latestSync = {
        about: o.jobs.update_page_info,
        picture: o.jobs.update_profile_picture,
        posts: o.jobs.sync_feeds,
        albums: o.jobs.sync_albums,
        photos: o.jobs.sync_albums,
        videos: o.jobs.sync_videos
      }
    }

    n.sources = {
      facebook: {
        fanpages: [fanpageLink]
      }
    }

    newSites.push(n)
  }

  return newSites
}
