        const portfolioState = {
            activeProjectId: null,
            expandedVideo: null,
            expandedData: {
                1: {
                    title: "DSA Insight Website",
                    videoSrc: "Pics/DSA-Web.mp4",
                    posterSrc: "Pics/DSA-Poster.png",
                    timeline: { start: "November 2025", end: "January 2026" },
                    description: "A dynamic React-based web application that brings data structures and algorithms to life through interactive visual animations. Users can explore how core structures such as stacks, queues, linked lists, trees, and graphs behave step-by-step, with intuitive controls to play, pause, and step through operations. This tool transforms abstract concepts into visual learning experiences, making it easier to grasp algorithm execution flow and state changes in real time.",
                    collaborators: [
                        {
                            name: "Abdullah Umar",
                            avatar: "Pics/Abdullah_Umar.png",
                            link: "https://www.linkedin.com/in/abdullah-umar-990562352/",
                            commentShort: "Focused on UI/UX design and responsive layout implementation.",
                            commentFull: "Designed and implemented the user interface with a focus on intuitive controls and responsive design. Created the visual theme and animation system that makes complex algorithms easy to understand.",
                        },
                    ],
                },
                2: {
                    title: "Flood Aid Website",
                    videoSrc: "Pics/DSA-Web.webm",
                    posterSrc: "Pics/Flood-Aid-Poster.png",
                    timeline: { start: "November 2025", end: "January 2026" },
                    description: "A responsive, full-stack web platform to support flood relief coordination and assistance efforts. Built with a React frontend, C# backend API, and MongoDB database, the site enables users to submit and view requests for aid, connect with volunteers or helpers, and access essential information during flood emergencies. The system streamlines relief efforts by organizing real-time requests, fostering community support, and ensuring effective resource distribution when every moment counts.",
                    collaborators: [
                        {
                            name: "Farhan Shakeel",
                            avatar: "Pics/Farhan_Shakeel.png",
                            link: "https://www.linkedin.com/in/farhan-shakeel-47b505349/",
                            commentShort: "Backend development and database architecture.",
                            commentFull: "Developed the C# backend API with secure authentication and data validation. Architected the MongoDB database schema for optimal performance and scalability, implementing geospatial queries for location-based services.",
                        },
                        {
                            name: "M Umair",
                            avatar: "Pics/Muhammad_Umair.png",
                            link: "https://www.linkedin.com/in/muhammad-umair-03037b338/",
                            commentShort: "Frontend development and user interface architecture.",
                            commentFull: "Developed an intuitive React frontend with focus on user experience: implemented smooth animations with Framer Motion, accessible navigation patterns, dark/light theme toggling, and offline-first capabilities. Integrated interactive maps for location services and real-time notifications, ensuring cross-browser compatibility and mobile responsiveness.",
                        },
                    ],
                },
                3: {
                    title: "Collaborative White Board",
                    videoSrc: "Pics/DSA-Web.webm",
                    posterSrc: "Pics/Whiteboard-Poster.png",
                    timeline: { start: "November 2025", end: "January 2026" },
                    description: "A Windows desktop application built with C# and .NET Framework, designed for real-time collaborative whiteboarding. Users can draw, write, and share ideas simultaneously, making it ideal for team collaboration, brainstorming sessions, and interactive presentations. The system supports multiple users, session management, and intuitive drawing tools, providing a seamless and responsive experience on Windows platforms.",
                    collaborators: [
                        {
                            name: "Adil Ur Rehman",
                            avatar: "Pics/Adil.png",
                            link: "https://www.linkedin.com/in/adilurrehmanofficial/",
                            commentShort: "Frontend development and UI architecture.",
                            commentFull: "Developed the Windows Forms frontend with focus on usability and responsiveness: implemented drawing tools, real-time collaboration features, session management, and an intuitive user interface. Ensured smooth performance, keyboard shortcuts, and an accessible, user-friendly experience for desktop users.",
                        },
                        {
                            name: "Farhan Shakeel",
                            avatar: "Pics/Farhan_Shakeel.png",
                            link: "https://www.linkedin.com/in/farhan-shakeel-47b505349/",
                            commentShort: "Backend logic and application architecture.",
                            commentFull: "Implemented the C# backend logic to handle real-time updates, user sessions, and data synchronization across multiple clients. Designed an efficient architecture using .NET Framework for performance, stability, and scalability of the collaborative features.",
                        },
                    ],
                },
            },
        };

        function portfolioToggleDetails(projectId) {
            const isOpening = portfolioState.activeProjectId !== projectId;
            if (isOpening) {
                openExpandedView(projectId);
            } else {
                closeExpandedView();
            }
        }

        function openExpandedView(projectId) {
            document.querySelectorAll(".portfolio-project-video").forEach((video) => {
                video.pause();
            });

            if (portfolioState.expandedVideo) {
                portfolioState.expandedVideo.pause();
                portfolioState.expandedVideo = null;
            }

            const grid = document.getElementById("portfolio-project-grid");
            grid.classList.add("portfolio-expanded");

            document.querySelectorAll(".portfolio-project-card").forEach((card) => {
                if (card.dataset.portfolioProjectId !== projectId) {
                    card.classList.add("portfolio-inactive");
                } else {
                    card.classList.add("portfolio-active");
                }
            });

            portfolioState.activeProjectId = projectId;
            loadExpandedContent(projectId);

            document.getElementById("portfolio-expanded-overlay").classList.add("active");
            document.getElementById("portfolio-expanded-container").style.display = "flex";
            document.body.style.overflow = "hidden";
        }

        function closeExpandedView() {
            if (portfolioState.expandedVideo) {
                portfolioState.expandedVideo.pause();
                portfolioState.expandedVideo = null;
            }

            const grid = document.getElementById("portfolio-project-grid");
            grid.classList.remove("portfolio-expanded");

            document.querySelectorAll(".portfolio-project-card").forEach((card) => {
                card.classList.remove("portfolio-active", "portfolio-inactive");
            });

            document.getElementById("portfolio-expanded-content").innerHTML = "";
            portfolioState.activeProjectId = null;
            document.getElementById("portfolio-expanded-overlay").classList.remove("active");
            document.getElementById("portfolio-expanded-container").style.display = "none";
            document.body.style.overflow = "";

            restartGridVideos();
        }

        function loadExpandedContent(projectId) {
            const data = portfolioState.expandedData[projectId];
            if (!data) return;

            const contentDiv = document.getElementById("portfolio-expanded-content");

            contentDiv.innerHTML = `
                <div class="portfolio-expanded-left">
                    <h2>${data.title}</h2>
                    <div class="portfolio-expanded-video-container">
                        <video class="portfolio-expanded-video" autoplay loop playsinline poster="${data.posterSrc}">
                            <source src="${data.videoSrc}" type="video/mp4">
                        </video>
                    </div>
                    ${window.innerWidth > 900 ? `<div class="portfolio-vertical-separator"><div class="portfolio-separator-dot"></div></div>` : ""}
                </div>
                <div class="portfolio-expanded-right">
                    <div class="portfolio-project-timeline">
                        <span class="portfolio-start-date">${data.timeline.start}</span>
                        <div class="portfolio-timeline-dot"></div>
                        <span class="portfolio-end-date">${data.timeline.end}</span>
                    </div>
                    <p class="portfolio-project-description">${data.description}</p>
                    ${data.collaborators.length > 0 ? `
                    <div class="portfolio-collaborators-section">
                        <h3 class="portfolio-collaborators-title"><i class="fas fa-users"></i> Collaborators</h3>
                        ${data.collaborators.map((collab, i) => `
                            <div class="portfolio-collaborator">
                                <a href="${collab.link}" target="_blank" class="portfolio-collaborator-avatar">
                                    <img src="${collab.avatar || "https://via.placeholder.com/60"}" alt="${collab.name}">
                                </a>
                                <div class="portfolio-collaborator-info">
                                    <div class="portfolio-collaborator-name">${collab.name}</div>
                                    <div class="portfolio-collaborator-comment portfolio-collapsed" id="portfolio-comment-${projectId}-${i}">"${collab.commentShort}"</div>
                                    <div class="portfolio-collaborator-comment portfolio-full" id="portfolio-full-comment-${projectId}-${i}" style="display: none">"${collab.commentFull}"</div>
                                    <button class="portfolio-read-more-btn" onclick="portfolioToggleComment('${projectId}-${i}')">Read more</button>
                                </div>
                            </div>
                        `).join("")}
                    </div>` : ""}
                </div>
            `;

            const video = contentDiv.querySelector(".portfolio-expanded-video");
            if (video) {
                portfolioState.expandedVideo = video;
                video.muted = false;
                video.play().catch(() => {
                    video.muted = true;
                    video.play();
                });
            }
        }

        function portfolioToggleComment(commentId) {
            const short = document.getElementById(`portfolio-comment-${commentId}`);
            const full = document.getElementById(`portfolio-full-comment-${commentId}`);
            const btn = document.querySelector(`button[onclick*="${commentId}"]`);
            if (full.style.display === "none") {
                short.style.display = "none";
                full.style.display = "block";
                btn.textContent = "Show less";
            } else {
                short.style.display = "block";
                full.style.display = "none";
                btn.textContent = "Read more";
            }
        }

        function restartGridVideos() {
            if (window.portfolioVideoObserver) window.portfolioVideoObserver.disconnect();

            window.portfolioVideoObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        const video = entry.target.querySelector(".portfolio-project-video");
                        if (video) {
                            video.muted = true;

                            if (entry.isIntersecting && window.innerWidth > 600) {
                                video.play().catch(() => console.log("Grid playback blocked"));
                            } else {
                                video.pause();
                                video.currentTime = 0;
                            }
                        }
                    });
                },
                { threshold: 0.5 }
            );

            document.querySelectorAll(".portfolio-project-card").forEach((card) => window.portfolioVideoObserver.observe(card));
        }

        document.addEventListener("DOMContentLoaded", () => {
            restartGridVideos();

            document.getElementById("portfolio-close-expanded").addEventListener("click", function (e) {
                e.stopPropagation();
                closeExpandedView();
            });

            document.getElementById("portfolio-expanded-overlay").addEventListener("click", closeExpandedView);

            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && portfolioState.activeProjectId) {
                    closeExpandedView();
                }
            });

            let resizeTimeout;
            window.addEventListener("resize", () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    if (portfolioState.activeProjectId) {
                        loadExpandedContent(portfolioState.activeProjectId);
                    }
                }, 250);
            });

            document.addEventListener("visibilitychange", () => {
                if (document.hidden && portfolioState.expandedVideo) {
                    portfolioState.expandedVideo.pause();
                }
            });
        });

        const videoObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        const source = video.querySelector("source[data-src]");
                        if (source) {
                            source.src = source.dataset.src;
                            video.load();
                            videoObserver.unobserve(video);
                        }
                    }
                });
            },
            { rootMargin: "50px" }
        );

        document.querySelectorAll(".portfolio-project-video[data-lazy]").forEach((video) => {
            videoObserver.observe(video);
        });