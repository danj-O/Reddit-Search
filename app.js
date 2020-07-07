const navBox = document.querySelector('#nav')
const postsContainer = document.querySelector("#posts-container")
const inputChannelName = document.querySelector('#inputChannelName')
const searchButton = document.querySelector('#searchBtn')
// const inputSearchField = document.querySelector('#inputSearchField')
// const searchTermBtn = document.querySelector('#searchTermBtn')
searchButton.onclick = fetchData

//listener for hitting enter key while typing
inputChannelName.addEventListener("keyup", function(e){
  if (event.keyCode === 13){
    console.log("yep")
    searchButton.click();
  }
})

function fetchData(){
  //remove previous search results if they exist
  const posts = document.querySelectorAll('.post')
  if (posts){
    for (i=0; i < posts.length; i++){
      posts[i].remove()
    }
  }

  let channelUrl = "https://www.reddit.com/r/"
  channelUrl = channelUrl.concat(inputChannelName.value.replace(/\s+/g, '')).concat(".json")

  fetch(channelUrl)
    .then(resp => resp.json())
    .then(data => {
      data.data.children.map(post => {
        console.log(post)
        const newPost = document.createElement('div')
        newPost.classList.add("post")
        let postUrl = "https://www.reddit.com"
        postUrl = postUrl.concat(post.data.permalink)
        postUrl = postUrl.substring(0, postUrl.length-1).concat(".json")
        
        //fetching comments on each thread
        fetch(postUrl)
        .then(resp => resp.json())
        .then(data => {
          let comments = [];
          data[1].data.children.map(comment => {
            comments.push(`Comment Author: ${comment.data.author} \n Comment Body: ${comment.data.body}`)
          })

          // console.log(comments)

          newPost.innerHTML = `
          <h2> TITLE: ${post.data.title} </h2>
          <h3> AUTHOR: ${post.data.author} </h3>
          <p> Upvote Ratio: ${post.data.upvote_ratio} </p>
          <p> Number of Comments: ${post.data.num_comments} </p>
          <p> ${post.data.selftext} </p>
          <img src=${post.data.thumbnail}>
          <div> ${comments.map((comment, i) => {i++; return `<p>#${i}, ${comment}</p>`})}</div>
          <div> ${comments.length}</div>
          `
          postsContainer.appendChild(newPost)
        })
      })
    })
}


