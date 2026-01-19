document.addEventListener("DOMContentLoaded", function () {
            const modal = document.querySelector(".modal");
            const closeModal = document.querySelector(".close-modal");
            const modalContent = document.querySelector(".modal-content");

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("visible");
                        }
                    });
                },
                { threshold: 0.1 }
            );

            function applyAnimationsToCards(container = document) {
                container.querySelectorAll(".project-card").forEach((card) => {
                    if (!card.classList.contains("from-left") && !card.classList.contains("from-right") && !card.classList.contains("from-bottom")) {
                        const rect = card.getBoundingClientRect();
                        const center = window.innerWidth / 2;
                        const cardCenter = rect.left + rect.width / 2;

                        if (cardCenter < center - 100) {
                            card.classList.add("from-right");
                        } else if (cardCenter > center + 100) {
                            card.classList.add("from-left");
                        } else {
                            card.classList.add("from-bottom");
                        }
                    }

                    observer.observe(card);
                });

                setTimeout(() => {
                    container.querySelectorAll(".project-card").forEach((card) => {
                        card.classList.add("visible");
                    });
                }, 200);
            }

            applyAnimationsToCards();

            document.querySelectorAll(".view-output-btn").forEach((button) => {
                button.addEventListener("click", function () {
                    const card = this.closest(".project-card");
                    const images = card.getAttribute("data-output-images").split(",");

                    modalContent.innerHTML = "";
                    images.forEach((imgSrc) => {
                        const img = document.createElement("img");
                        img.src = imgSrc.trim();
                        img.className = "output-image";
                        img.alt = "Project output";
                        modalContent.appendChild(img);
                    });

                    modal.classList.add("active");
                });
            });

            closeModal.addEventListener("click", () => modal.classList.remove("active"));
            modal.addEventListener("click", (e) => {
                if (e.target === modal) modal.classList.remove("active");
            });

            document.querySelectorAll(".download-btn").forEach((button) => {
                button.addEventListener("click", function () {
                    const url = this.getAttribute("data-url");
                    const btnText = this.querySelector(".btn-text");
                    const checkmark = this.querySelector(".checkmark");
                    
                    this.classList.add("downloading");
                    btnText.textContent = "Downloading...";
                    checkmark.style.display = "none";

                    const a = document.createElement("a");
                    a.href = url;
                    a.download = url.split("/").pop();
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);

                    setTimeout(() => {
                        this.classList.remove("downloading");
                        btnText.style.display = "none";
                        checkmark.style.display = "inline";

                        setTimeout(() => {
                            btnText.style.display = "inline";
                            btnText.textContent = "Download";
                            checkmark.style.display = "none";
                        }, 2000);
                    }, 1500);
                });
            });
        });