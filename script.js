let loadedPosts;

const postForm = document.querySelector("#postForm");

const load = async (Num) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const posts = await response.json();
    // posts.length = postsNum;

    if (response.ok) {
      loadedPosts =
        localStorage.getItem("addedPosts") === null
          ? posts
          : JSON.parse(localStorage.getItem("addedPosts"));
      loadedPosts = loadedPosts.splice(loadedPosts.length - Num, Num);
    } else {
      return new Error("Failed to fetch");
    }
  } catch (error) {
    console.log(error);
  }
};

const showPosts = async (Num = 10) => {
  await load(Num);

  const postsSection = document.querySelector("section.posts");
  postsSection.innerHTML = "";

  for (const post of loadedPosts) {
    // Make the structure for every post
    const postStructure = document.createElement("div");
    const titleText = document.createElement("h1");
    titleText.innerText = post["title"];
    const bodyText = document.createElement("p");
    bodyText.innerText = post["body"];
    postStructure.appendChild(titleText);
    postStructure.appendChild(bodyText);

    // Add the post to the posts section
    postsSection.appendChild(postStructure);
    postsSection.innerHTML +=
      "<button>Edit</button><button class = 'delete'>Delete</button>";
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
      localStorage.setItem("addedPosts", JSON.stringify(loadedPosts));
      showPosts();
      postForm.reset();
    }
  } catch (error) {
    console.log(error);
  }
};

postForm.addEventListener("submit", addPost);

