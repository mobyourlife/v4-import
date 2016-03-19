'use strict'

// Export modlue's entry point
module.exports = migrate

/**
 * Migrate legacy schema to the new schema.
 */
function migrate (data) {
  let users = migrateUsers(data.users)
}

function migrateUsers (oldUsers) {
  let newUsers = []

  for (var o of oldUsers) {
    // Copy basic info from Facebook to local account
    let n = {
      name: o.facebook.name,
      email: o.facebook.email,
      social: {}
    }

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
        id: fp.id,
        name: fp.name,
        accessToken: fp.acess_token,
        permissions: fp.perms,
        category: fp.category,
        categoryList: categoryList
      }
    })
  }
}
