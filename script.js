// global variables and nodes
const url = "https://jsonplaceholder.typicode.com/posts";
let loadedPosts = [];

const nodes = {
  form: document.querySelector("#postForm"),
  section: document.querySelector("section.posts"),
};

// API Services
const api = {
  async fetchPosts(limit = 10) {
    const response = await fetch(`${url}?_limit=${limit}`);
    if (!response.ok) throw new Error("Failed to load posts");
    return response.json();
  },

  async createPost(postData) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    return response.json();
  },

  async deletePost(id) {
    const response = await fetch(`${url}/${id}`, {
      method: "DELETE",
    });
    return response.ok;
  },
};

// UI rendering
const render = {
  post(postInfo) {
    const assay = document.createElement("div");
    const header = document.createElement("h1");
    const text = document.createElement("p");

    header.innerText = postInfo.title;
    text.innerText = postInfo.body;

    assay.id = postInfo.id;
    assay.appendChild(header);
    assay.appendChild(text);
    assay.innerHTML +=
      "<button class='edit'>Edit</button><button class='delete'>Delete</button>";

    return assay;
  },

  allPosts(posts) {
    nodes.section.innerHTML = "";
    const fragment = document.createDocumentFragment();
    posts.forEach((postObj) => fragment.appendChild(render.post(postObj)));
    nodes.section.appendChild(fragment);
  },
};

// Control the posts
const addPost = async (e) => {
  e.preventDefault();

  const formData = new FormData(nodes.form);
  const newPost = {
    title: formData.get("title"),
    body: formData.get("body"),
    id: loadedPosts[loadedPosts.length - 1].id + 1,
  };

  try {
    const savedPost = await api.createPost(newPost);
    savedPost.id = newPost.id;

    loadedPosts.push(savedPost);
    render.allPosts(loadedPosts);
    nodes.form.reset();
  } catch (error) {
    console.error("Failed to post:", error);
  }
};

const deletePost = async (id, element) => {
  try {
    if (await api.deletePost(id)) {
        loadedPosts = loadedPosts.filter(posts => posts.id !== parseInt(id));
        element.remove();
    }
  } catch (error) {
    console.error("Delete error:", error)
  }
}

// Initialization
const Initialization = async (num) => {
    try {
        loadedPosts = await api.fetchPosts(num);
        render.allPosts(loadedPosts)
    } catch (error) {
        nodes.section.innerHTML = "Failed to fetch posts";
    }
}

// Event listeners
nodes.form.addEventListener("submit", addPost);

nodes.section.addEventListener("click", (e) => {
    const post = e.target.closest("div");

    switch (e.target.classList.value) {
        case "delete":
            deletePost(post.id, post)
            break;
        case "edit":
            editPost();
            break;
    }
});

Initialization(10);