// global variables and nodes
const url = "https://jsonplaceholder.typicode.com/posts";
let loadedPosts = [];

const nodes = {
  form: document.querySelector("#postForm"),
  section: document.querySelector("section.posts"),
  main: document.querySelector("main"),
  separator: document.createElement("div")
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

  async changePost(id, updatedContent) {
    const response = await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedContent),
    });

    if (!response.ok) {
      console.error(`Update failed with status: ${response.status}`);
    }
    return response.ok;
  },
};

// UI rendering
const render = {
  post(postInfo) {
    const assay = document.createElement("div");
    assay.classList = "hover assayStyle";
    const header = document.createElement("h1");
    header.classList = "title";
    const text = document.createElement("p");
    text.classList = "text";

    header.innerText = postInfo.title;
    text.innerText = postInfo.body;

    assay.id = postInfo.id;
    assay.appendChild(header);
    assay.innerHTML += "<hr>";
    assay.appendChild(text);
    assay.innerHTML += `<button class='delete'><svg class='delete' width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect class='delete' x="0.5" y="0.5" width="31" height="31" rx="7.5" fill="none" stroke="#000000"/>
        <line class='delete' x1="9.70711" y1="9.00002" x2="23" y2="22.2929" stroke="#000000" stroke-linecap="round"/>
        <line class='delete' x1="9" y1="22.2929" x2="22.2929" y2="9" stroke="#000000" stroke-linecap="round"/>
        </svg></button>`;
    return assay;
  },

  allPosts(posts) {
    nodes.section.innerHTML = "";
    const fragment = document.createDocumentFragment();
    posts.forEach((postObj) => fragment.appendChild(render.post(postObj)));
    nodes.section.appendChild(fragment);
  },

  editForm(post) {
    const form = document.createElement("div");
    const postIndex = loadedPosts.findIndex((p) => p.id === parseInt(post.id));

    nodes.separator.classList = "separator";
    form.id = post.id;
    form.classList = "assayStyle editForm";
    form.innerHTML = `<form id="editForm">
        <textarea name="title"class="title" rows="2" required>${loadedPosts[postIndex].title}</textarea><hr>
        <textarea name="body" class="text" required>${loadedPosts[postIndex].body}</textarea>
        <button class="save">Save</button>
        </form></div>`;
    nodes.separator.appendChild(form);
    nodes.main.appendChild(nodes.separator);
    nodes.editForm = document.querySelector("#editForm");
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
      loadedPosts = loadedPosts.filter((posts) => posts.id !== parseInt(id));
      element.remove();
    }
  } catch (error) {
    console.error("Delete error:", error);
  }
};

const editPost = async (e, id) => {
  e.preventDefault();

  const editFormData = new FormData(nodes.editForm);
  const postUpdate = {
    title: editFormData.get("title"),
    body: editFormData.get("body"),
  };

  const postIndex = loadedPosts.findIndex((p) => p.id === parseInt(id));
  try {
    if (await api.changePost(id, postUpdate)) {
      loadedPosts[postIndex].title = postUpdate.title;
      loadedPosts[postIndex].body = postUpdate.body;
      render.allPosts(loadedPosts);
    }
  } catch (error) {
    console.error("Failed to Edit the post:", error);
  }
};

// Initialization
const Initialization = async (num) => {
  try {
    loadedPosts = await api.fetchPosts(num);
    render.allPosts(loadedPosts);
  } catch (error) {
    nodes.section.innerHTML = "Failed to fetch posts";
  }
};

// Event listeners
nodes.form.addEventListener("submit", addPost);

nodes.section.addEventListener("click", (e) => {
  const post = e.target.closest("div");
  switch (e.target.classList.value) {
    case "delete":
      deletePost(post.id, post);
      break;
    case "save":
      addPost(e);
      break;
    default:
      render.editForm(post);
      break;
  }
});

nodes.separator.addEventListener("submit", (e) => {
    let post = e.target.closest("div");
    editPost(e, post.id);
    post = post.closest(".separator");
    post.remove();
});

Initialization(10);
