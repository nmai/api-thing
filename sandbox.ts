import { UserManager } from './lib/user-manager'

let userManager = new UserManager();

(async function() {
  let user2 = await userManager.createUser('user2', '123456');
  console.log(user2)

  try {
    let hash1 = await userManager.loginWithCredentials('user2', 'asdf');
    console.log(hash1);
  } catch(e) {
    console.log(e);
  }

  try {
    let hash2 = await userManager.loginWithCredentials('user2', '123456');
    console.log(hash2);
  } catch(e) {
    console.log(e)
  }
})()
