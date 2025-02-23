const { Client, Databases } = Appwrite;
  const DATABASE_ID = "67b9b8db00288cb3b0ec";
  const COLLECTION_ID = "67b9b8e90009de0b198e";
  
  const client = new Client();
  client.setProject('67b9b83d0025fda6fe0f');
  
  const databases = new Databases(client);
  
  async function getBooks() {
    let response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
    return response.documents;
  }
  
  const bookContainer = document.getElementById("bookcontainer");
  
  async function displayData() {
    const books = await getBooks();
    books.reverse();
    books.forEach((book, index) => {
      bookContainer.innerHTML += `
                <div class="col">
                    <div class="card shadow-sm rounded-4 book-card" data-index="${index}" data-url="${book.url}">
                        <img src="${book.image}" class="card-img-top" alt="Book image">
                        <div class="card-body">
                            <h5 class="card-title fw-bold">${book.title}</h5>
                        </div>
                    </div>
                </div>
            `;
    });
    
    document.getElementById("loading_text").style.display = "none";
  }
  
  displayData();
  
  // Event delegation for dynamically created book cards
  document.getElementById("bookcontainer").addEventListener("click", function(event) {
    let card = event.target.closest(".book-card");
    if (!card) return;
    
    let bookUrl = card.getAttribute("data-url");
    
    showModal(bookUrl);
  });
  
  function showModal(bookUrl) {
    let modalHtml = `
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5">Download?</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                Are you sure you want to download this book?
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <a href="#" class="btn btn-primary" id="confirmDownload">Yes</a>
              </div>
            </div>
          </div>
        </div>
    `;

    let modalContainer = document.createElement("div");
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);

    let modal = new bootstrap.Modal(document.getElementById("staticBackdrop"));
    modal.show();

    document.getElementById("confirmDownload").onclick = function (event) {
        event.preventDefault();
        modal.hide();
        setTimeout(() => window.open(bookUrl, "_blank"), 300);
    };

    document.getElementById("staticBackdrop").addEventListener("hidden.bs.modal", function () {
        modalContainer.remove();
    });
}