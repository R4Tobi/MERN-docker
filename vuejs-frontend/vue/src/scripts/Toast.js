class Toast {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  showAlert(data) {
    this.queue.push(data);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const data = this.queue.shift();
    let { type, message } = data;
    let autoClose = data.autoClose === undefined ? 5000 : data.autoClose;

    let toastContainer = document.createElement("div");
    toastContainer.classList.add("toast-container");
    var container = document.querySelector(".toast-container");
    if (typeof container != "undefined" && container != null) return;
    document.body.appendChild(toastContainer);

    let icon = "&#9432;";

    let alert = `<div class="inAlert ${type}">
                    <div class="wrapper">
                        <div class="details">
                            <div class="title">${type}</div>
                            <div class="message">${message}</div>
                        </div>
                    </div>
                    <i>${icon}</i>
                </div>`;
    toastContainer.insertAdjacentHTML("afterbegin", alert);
    setTimeout(() => {
      var isAlert = document.querySelector(".inAlert");
      if (typeof isAlert != "undefined" && isAlert != null)
        isAlert.classList.add("slide-in");
    }, 100);

    setTimeout(() => {
      var isAlert = document.querySelector(".inAlert");
      if (typeof isAlert != "undefined" && isAlert != null)
        isAlert.classList.remove("slide-in");
      setTimeout(() => {
        var currentAlert = document.querySelector(".inAlert");
        if (currentAlert) currentAlert.remove();
        this.removeToast();
        this.processQueue();
      }, 100);
    }, autoClose);
  }

  removeToast() {
    var container = document.querySelector(".toast-container");
    if (!container.hasChildNodes()) container.remove();
  }
}

export default Toast;
