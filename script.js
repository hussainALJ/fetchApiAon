let loadedPosts;

const postForm = document.querySelector("#postForm");
const postsSection = document.querySelector("section.posts");

const load = async (num) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const posts = await response.json();
    posts.length = num;

    if (response.ok) {
      loadedPosts = posts;
      console.log("Posts successfully loaded");
    }
  } catch (error) {
    console.log(error);
  }
};

const showPosts = async () => {
  if (loadedPosts == null) {
    await load(10);
  }

  postsSection.innerHTML = "";

  for (const post of loadedPosts) {
    // Make the structure for every post
    const postStructure = document.createElement("div");
    postStructure.id = post["id"];
    const titleText = document.createElement("h1");
    titleText.innerText = post["title"];
    const bodyText = document.createElement("p");
    bodyText.innerText = post["body"];
    postStructure.appendChild(titleText);
    postStructure.appendChild(bodyText);
    postStructure.innerHTML +=
      "<button class = 'edit'>Edit</button><button class = 'delete'>Delete</button>";

    // Add the post to the posts section
    postsSection.appendChild(postStructure);
  }
};

showPosts();

const addPost = async (e) => {
  e.preventDefault();

  const formData = new FormData(postForm);
  const newPost = {
    title: formData.get("title"),
    body: formData.get("body"),
    id: loadedPosts[loadedPosts.length - 1]["id"] + 1,
  };

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });

    if (response.ok) {
      const postObj = await response.json();
      postObj.id = newPost.id;
      loadedPosts.push(postObj);
      showPosts();
      postForm.reset();
      console.log("You have Posted new content");
    }
  } catch (error) {
    console.log(error);
  }
};

postForm.addEventListener("submit", addPost);

const deletePost = async (event) => {
  const button = event.target;
  const postToDelete = button.closest("div");

  try {
    const deleteResponse = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postToDelete.id}`,
      {
        method: "DElETE",
      },
    );

    if (deleteResponse.ok) {
      postToDelete.remove();
      console.log("Post Deleted")
    }
  } catch (error) {
    console.log(error);
  }
};

postsSection.addEventListener("click", (event) => {
    const btn = event.target;
    switch (btn.classList.value) {
        case "delete":
            deletePost(event);
            break;
        case "edit":
            editPost(event);
            break;
    }
});
