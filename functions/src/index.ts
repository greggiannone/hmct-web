import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const ACTIVITY_TIMEOUT = (60 * 1000) * 15 // 15 minutes

// Unclear if we're using this but ideally this would be used to set 
// users to 'offline' if they are inactive for more than 8 hours.
//const LOGIN_TIMEOUT = ((60 * 1000) * 60) * 8 // 8 Hours. 

exports.updateUserStatusDBTrigger = functions.database.instance('hmct-1f8e5').ref('/users/{pathId}').onWrite(checkUserActivity);
//exports.updateUserStatusTimerTrigger = functions.pubsub.schedule('every minute').onRun(checkUserActivity);

async function checkUserActivity(change){
    const ref = change.after.ref.parent; // reference to the parent
    const now = Date.now();
    const activeUserCutoff = now - ACTIVITY_TIMEOUT;
    //const onlineUserCutoff = now - LOGIN_TIMEOUT;

    const snapshot = await ref.once('value');
    // create a map with all children that need to be removed
    const updates = {};
    snapshot.forEach(child => {
        //Make sure this value exists, otherwise we know the user is ancient.
        if(child.val().lastActive){
            var lastActiveDate = new Date(child.val().lastActive).valueOf();
            if(lastActiveDate < activeUserCutoff){
                updates[child.key+"/isActive"] = false;
              }
            //If we want to log users off after a period of inactivity this should do it.
            /*if(child.val().lastActive < onlineUserCutoff){
                child.val().isActive = false;
                child.val().status = "offline";
            }*/      
            else{
                updates[child.key+"/isActive"] = true;
            }
        }
        else{
            //User record is so old they must be inactive :V
            updates[child.key+"/isActive"] = false;
        }
    });
    // execute all updates in one go and return the result to end the function
    return ref.update(updates);
  }