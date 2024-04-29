class Toast {
  constructor(data) {
    this.data = data;
  }
  showAlert(data) {
    let { type, message } = data;
    let autoClose;
    data.autoClose === undefined
      ? (autoClose = 5000)
      : (autoClose = data.autoClose);

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
        document.querySelector(".inAlert").remove();
        this.removeToast();
      }, 100);
    }, autoClose);
  }
  removeToast = () => {
    var container = document.querySelector(".toast-container");
    if (!container.hasChildNodes()) container.remove();
  };
}

export default Toast;
