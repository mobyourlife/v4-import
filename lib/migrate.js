'use strict'

// Export modlue's entry point
module.exports = migrate

/**
 * Migrate legacy schema to the new schema.
 */
function migrate (data) {
  let users = migrateUsers(data.users, data.fanpages)
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
      name: o.facebook.name,
      email: o.facebook.email,
      userToken: o.facebook.token
    }

    // Map fanpages to the new schema
    fb.fanpages = o.fanpages.map((fp) => {
      // Map categories list
      let categoryList = fp.category_list.map((cat) => {
        return {
          id: cat.id,
          name: cat.name
        }
      })

      // Return each fanpage in the new schema
      return {
        id: fp._id,
        name: fp.name,
        accessToken: fp.acess_token,
        permissions: fp.perms,
        category: fp.category,
        categoryList: categoryList
      }
    })
  }
}

/**
 * Get the minimum creation time from user's websites.
 * @param  {Object} userData    User object.
 * @param  {Array} oldFanpages  User fanpages.
 * @return {Date}               Minimum creation time.
 */
function getUserCreationTime(userData, oldFanpages) {
  // Get fanpages with websites
  let refs = userData.fanpages.map((i) => i.id)
  let fanpages = oldFanpages.filter((i) => refs.indexOf(i._id) !== -1)

  // Get the minimum time value
  let times = fanpages.map((i) => i.creation.time)
  let min = new Date(Math.min.apply(null, times))

  return min
}
