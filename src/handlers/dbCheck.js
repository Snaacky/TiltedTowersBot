/* eslint-disable indent */

module.exports = (db, snoowrap) => {
  const expired = db.filterArray(o => o.time < Date.now());

  expired.forEach(async ({ id }) => {
    const post = snoowrap.getSubmission(id);
    
    if (await post.link_flair_text || await post.link_flair_css_class)
      return db.delete(id);
    
    await db.delete(id);
    
    sleep(1000);

    await post.reply(
`**Unfortunately, we've had to remove your post.** 
___


### Post Flair Guidelines

We require all users to set a post flair for their own post. There is a 30 minute grace period, and this has passed for this post. 

Don't know how to flair your post? Click [here](http://imgur.com/a/m3FI3) to view this helpful guide on how to flair your post. 

For more information, please read [this post](https://www.reddit.com/r/FortNiteBR/comments/8bznpy/state_of_the_subreddit_new_moderators_survey/).


___
[**Here are our subreddit rules.**](https://www.reddit.com/r/FortNiteBR/wiki/rules) - If you have any queries about this, you can contact us via [Moderator Mail](https://www.reddit.com/message/compose?to=%2Fr%2FFortNiteBR).`
    ).then(c => c.distinguish({ sticky: true }));

    sleep(1000);

    await post.remove();
    sleep(1000);
    await post.lock();
    sleep(1000);
    return;
  });
};


function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}