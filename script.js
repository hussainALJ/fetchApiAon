const loadedPosts =
  localStorage.getItem("posts") === null
    ? []
    : JSON.parse(localStorage.getItem("posts"));

const load = async (postsNum) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const posts = await response.json();
    posts.length = postsNum;

    localStorage.setItem("posts", JSON.stringify(posts));
    console.log(response);

    if (!response.ok) {
      return new Error("Failed to fetch");
    }
  } catch (error) {
    console.log(error);
  }
};

const showPosts = (Num) => {
  load(Num);

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
    const postsSection = document.querySelector("section.posts");
    postsSection.appendChild(postStructure);
    postsSection.innerHTML += "<button>Edit</button><button>Delete</button>";
  }
};

showPosts(10);
