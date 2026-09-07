const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const revealItems = document.querySelectorAll(".reveal");
const year = document.querySelector("#year");
const netlifyForms = document.querySelectorAll("form[data-netlify='true']");
const metaDescription = document.querySelector('meta[name="description"]');
const canonicalLink = document.querySelector('link[rel="canonical"]');
const sanityConfig = {
  projectId: "z69216el",
  dataset: "production",
  apiVersion: "2026-04-05",
};

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
  }
);

revealItems.forEach((item) => observer.observe(item));

function encodeFormData(data) {
  return new URLSearchParams(data).toString();
}

function bootNetlifyForms() {
  netlifyForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submitButton = form.querySelector("button[type='submit']");
      const redirectTarget = form.getAttribute("action") || "/thank-you";
      const formData = new FormData(form);

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.originalText = submitButton.textContent || "";
        submitButton.textContent = "Sending...";
      }

      try {
        const response = await fetch("/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: encodeFormData(formData),
        });

        if (!response.ok) {
          throw new Error("Form submission failed");
        }

        window.location.href = redirectTarget;
      } catch (error) {
        console.error("Form submission error.", error);
        window.alert("Something went wrong while sending your inquiry. Please try again.");
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitButton.dataset.originalText || "Submit";
        }
      }
    });
  });
}

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }

  return response.json();
}

async function fetchSanity(query) {
  const params = new URLSearchParams({
    query,
    perspective: "published",
  });
  const url = `https://${sanityConfig.projectId}.api.sanity.io/v${sanityConfig.apiVersion}/data/query/${sanityConfig.dataset}?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to load Sanity content");
  }

  const data = await response.json();
  return data.result;
}

function hasItems(value) {
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderProjects(projects) {
  const container = document.querySelector("[data-cms-projects]");
  if (!container) {
    return;
  }

  container.innerHTML = projects
    .map(
      (project) => `
        <article class="case-study-card reveal is-visible">
          <a class="insight-card-link" href="${getProjectHref(project.slug)}">
            ${renderProjectCardVisual(project)}
          </a>
          <div class="case-study-copy">
            <p class="project-tag">${escapeHtml(project.tag)}</p>
            <h2><a class="insight-title-link" href="${getProjectHref(project.slug)}">${escapeHtml(project.title)}</a></h2>
            <p>${escapeHtml(project.summary)}</p>
            <div class="case-study-meta">
              <span>Industry: ${escapeHtml(project.industry)}</span>
              <span>Focus: ${escapeHtml(project.focus)}</span>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderInsights(content) {
  const featuredContainer = document.querySelector("[data-cms-featured-insight]");
  const categoriesContainer = document.querySelector("[data-cms-categories]");
  const articlesContainer = document.querySelector("[data-cms-articles]");

  if (featuredContainer) {
    featuredContainer.innerHTML = `
      <div class="featured-insight reveal is-visible">
        ${renderInsightVisual(content.featured, "featured-insight-visual")}
        <div class="featured-insight-copy">
          <p class="project-tag">${escapeHtml(content.featured.tag)}</p>
          <h2><a class="insight-title-link" href="${getPostHref(content.featured.slug)}">${escapeHtml(content.featured.title)}</a></h2>
          <p>${escapeHtml(content.featured.summary)}</p>
        </div>
      </div>
    `;
  }

  if (categoriesContainer) {
    categoriesContainer.innerHTML = content.categories
      .map(
        (category) => `
          <article class="category-card reveal is-visible">
            <h3>${escapeHtml(category.title)}</h3>
            <p>${escapeHtml(category.summary)}</p>
          </article>
        `
      )
      .join("");
  }

  if (articlesContainer) {
    articlesContainer.innerHTML = content.articles
      .map(
        (article) => `
          <article class="article-card reveal is-visible">
            <a class="insight-card-link" href="${getPostHref(article.slug)}">
              ${renderInsightVisual(article, "article-card-visual")}
            </a>
            <p class="project-tag">${escapeHtml(article.tag)}</p>
            <h3><a class="insight-title-link" href="${getPostHref(article.slug)}">${escapeHtml(article.title)}</a></h3>
            <p>${escapeHtml(article.summary)}</p>
          </article>
        `
      )
      .join("");
  }
}

function getPostHref(slug) {
  return `post.html?slug=${encodeURIComponent(slug || "")}`;
}

function getProjectHref(slug) {
  return `project-detail.html?slug=${encodeURIComponent(slug || "")}`;
}

function getServiceHref(slug) {
  return `service-detail.html?slug=${encodeURIComponent(slug || "")}`;
}

function renderInsightVisual(item, className) {
  if (item?.imageUrl) {
    return `
      <img
        class="${className} insight-image"
        src="${escapeHtml(item.imageUrl)}"
        alt="${escapeHtml(item.imageAlt || item.title || "Insight image")}"
        loading="lazy"
      >
    `;
  }

  return `<div class="${className}"></div>`;
}

function renderProjectCardVisual(project) {
  if (project?.imageUrl) {
    return `
      <img
        class="case-study-visual insight-image"
        src="${escapeHtml(project.imageUrl)}"
        alt="${escapeHtml(project.imageAlt || project.title || "Project image")}"
        loading="lazy"
      >
    `;
  }

  return `<div class="case-study-visual ${project.visualClass || "case-study-visual-one"}"></div>`;
}

function renderServices(content) {
  const highlightsContainer = document.querySelector("[data-cms-service-highlights]");
  const servicesContainer = document.querySelector("[data-cms-services]");

  if (highlightsContainer) {
    highlightsContainer.innerHTML = content.highlights
      .map(
        (highlight) => `
          <div class="stat-card reveal is-visible">
            <strong>${escapeHtml(highlight.title)}</strong>
            <span>${escapeHtml(highlight.summary)}</span>
          </div>
        `
      )
      .join("");
  }

  if (servicesContainer) {
    servicesContainer.innerHTML = content.services
      .map(
        (service) => `
          <article class="service-detail-card reveal is-visible">
            <p class="service-index">${escapeHtml(service.index)}</p>
            <h2><a class="insight-title-link" href="${getServiceHref(service.slug)}">${escapeHtml(service.title)}</a></h2>
            <p>${escapeHtml(service.description)}</p>
            <ul class="detail-list">
              ${service.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
            <a class="service-detail-link" href="${getServiceHref(service.slug)}">View Service Details</a>
          </article>
        `
      )
      .join("");
  }
}

function renderSiteSettings(settings) {
  const socialContainers = document.querySelectorAll("[data-cms-social-links]");
  const footerLinkContainers = document.querySelectorAll("[data-cms-footer-links]");
  const taglineContainers = document.querySelectorAll("[data-cms-tagline]");

  socialContainers.forEach((container) => {
    container.innerHTML = settings.socialLinks
      .map(
        (item) => `
          <a href="${item.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.label)}</a>
        `
      )
      .join("");
  });

  footerLinkContainers.forEach((container) => {
    container.innerHTML = settings.footerLinks
      .map(
        (item) => `
          <a href="${item.href || item.url}">${escapeHtml(item.label)}</a>
        `
      )
      .join("");
  });

  taglineContainers.forEach((container) => {
    container.textContent = settings.tagline || "";
  });
}

function normalizeServicesFromSanity(items) {
  const services = items.map((service, index) => ({
    index: String(index + 1).padStart(2, "0"),
    title: service.title,
    slug: service.slug?.current || service.slug || "",
    description: service.description,
    items: service.items || [],
    imageUrl: service.coverImage?.asset?.url || service.imageUrl || "",
    imageAlt: service.coverImage?.alt || service.imageAlt || service.title,
    body: service.body || [],
  }));

  const highlights = items
    .filter((service) => service.featured)
    .slice(0, 3)
    .map((service) => ({
      title: service.title,
      summary: service.description,
    }));

  return {highlights, services};
}

function normalizeProjectsFromSanity(items) {
  const visualClasses = [
    "case-study-visual-one",
    "case-study-visual-two",
    "case-study-visual-three",
  ];

  return items.map((project, index) => ({
    tag: project.tag,
    title: project.title,
    slug: project.slug?.current || project.slug || "",
    summary: project.summary,
    industry: project.industry || "General",
    focus: (project.focus || []).join(", ") || "Branding",
    imageUrl: project.coverImage?.asset?.url || project.imageUrl || "",
    imageAlt: project.coverImage?.alt || project.imageAlt || project.title,
    body: project.body || [],
    visualClass: visualClasses[index % visualClasses.length],
  }));
}

function buildExcerptFromPortableText(body) {
  if (!Array.isArray(body)) {
    return "";
  }

  return body
    .flatMap((block) => block.children || [])
    .map((child) => child.text || "")
    .join(" ")
    .trim();
}

function renderPortableText(body) {
  if (!Array.isArray(body) || !body.length) {
    return "<p>Full article content will appear here soon.</p>";
  }

  return body
    .map((block) => {
      const text = (block.children || []).map((child) => child.text || "").join("").trim();
      if (!text) {
        return "";
      }

      if (block.style === "h2") {
        return `<h2>${escapeHtml(text)}</h2>`;
      }

      if (block.style === "h3") {
        return `<h3>${escapeHtml(text)}</h3>`;
      }

      return `<p>${escapeHtml(text)}</p>`;
    })
    .join("");
}

function getDefaultServiceBody(service) {
  const title = (service?.title || "").toLowerCase();

  if (title.includes("web design")) {
    return `
      <p>
        This service is ideal for businesses that want a website that feels modern, credible, and aligned with
        their brand direction. We focus on visual clarity, strong first impressions, and page structure that helps
        visitors understand the business quickly and take the next step with confidence.
      </p>
    `;
  }

  if (title.includes("website development")) {
    return `
      <p>
        This service is for businesses that already have a direction in mind and need it turned into a clean,
        responsive website build. The goal is to create a frontend experience that works smoothly across devices,
        feels polished in use, and is structured for future updates and growth.
      </p>
    `;
  }

  if (title.includes("web app")) {
    return `
      <p>
        This service supports businesses that need more than marketing pages and want a functional digital tool.
        We focus on interfaces and workflows that make tasks easier to complete, improve usability, and create a
        stronger product experience for teams or customers.
      </p>
    `;
  }

  if (title.includes("seo") || title.includes("content")) {
    return `
      <p>
        This service is designed for businesses that want the message behind the website to be clearer, more
        strategic, and easier to discover through search. We help shape page structure, content flow, and written
        messaging so the site supports both visibility and trust.
      </p>
    `;
  }

  return `
    <p>
      This service is built for businesses that want a clearer digital presence, a stronger user experience,
      and a more professional online foundation. Each project is shaped around the business goal, the audience,
      and the result the website or product needs to support.
    </p>
  `;
}

function renderServiceBody(service) {
  const body = service?.body;
  if (!Array.isArray(body) || !body.length) {
    return getDefaultServiceBody(service);
  }

  return renderPortableText(body);
}

function renderPostPage(post) {
  const container = document.querySelector("[data-cms-post-page]");
  if (!container) {
    return;
  }

  document.title = `${post.title} | Lito Tech Limited`;
  if (metaDescription) {
    metaDescription.setAttribute("content", post.summary || "Read insight articles from Lito Tech Limited.");
  }
  if (canonicalLink) {
    canonicalLink.setAttribute("href", `${window.location.origin}${window.location.pathname}?slug=${encodeURIComponent(post.slug || "")}`);
  }

    container.innerHTML = `
      <article class="post-page reveal is-visible">
        <div class="post-header">
          <p class="eyebrow">${escapeHtml(post.tag)}</p>
          <h1>${escapeHtml(post.title)}</h1>
          <p class="hero-text">${escapeHtml(post.summary)}</p>
          <div class="post-actions">
            <a class="button button-secondary" href="insights.html">Back to Insights</a>
            <a class="button button-primary" href="start-project.html">Start a Project</a>
          </div>
        </div>
        <div class="post-body">
          ${renderPortableText(post.body)}
          <div class="post-closing">
            <p>
              If this insight reflects the kind of digital direction you want for your business, the next step is
              a project conversation where we can turn the idea into a clearer plan.
            </p>
          </div>
        </div>
      </article>
    `;
  }

function renderProjectPage(project) {
  const container = document.querySelector("[data-cms-project-page]");
  if (!container) {
    return;
  }

  document.title = `${project.title} | Lito Tech Limited`;
  if (metaDescription) {
    metaDescription.setAttribute("content", project.summary || "Read project details from Lito Tech Limited.");
  }
  if (canonicalLink) {
    canonicalLink.setAttribute("href", `${window.location.origin}${window.location.pathname}?slug=${encodeURIComponent(project.slug || "")}`);
  }

    container.innerHTML = `
      <article class="post-page reveal is-visible">
        <div class="post-header">
          <p class="eyebrow">${escapeHtml(project.tag)}</p>
          <h1>${escapeHtml(project.title)}</h1>
          <p class="hero-text">${escapeHtml(project.summary)}</p>
          <div class="case-study-meta">
            <span>Industry: ${escapeHtml(project.industry)}</span>
            <span>Focus: ${escapeHtml(project.focus)}</span>
          </div>
          <div class="post-actions">
            <a class="button button-secondary" href="projects.html">Back to Projects</a>
            <a class="button button-primary" href="start-project.html">Start a Project</a>
          </div>
        </div>
        <div class="post-body">
          ${renderPortableText(project.body)}
          <div class="post-closing">
            <p>
              If you want this kind of clarity, polish, and structure in your own project, the next step is to
              share what you want to build so we can shape the right direction together.
            </p>
          </div>
        </div>
      </article>
    `;
  }

function renderServicePage(service) {
  const container = document.querySelector("[data-cms-service-page]");
  if (!container) {
    return;
  }

  document.title = `${service.title} | Lito Tech Limited`;
  if (metaDescription) {
    metaDescription.setAttribute("content", service.description || "Read service details from Lito Tech Limited.");
  }
  if (canonicalLink) {
    canonicalLink.setAttribute("href", `${window.location.origin}${window.location.pathname}?slug=${encodeURIComponent(service.slug || "")}`);
  }

  container.innerHTML = `
    <article class="post-page reveal is-visible">
      <div class="post-header">
        <p class="eyebrow">Service Detail</p>
        <h1>${escapeHtml(service.title)}</h1>
        <p class="hero-text">${escapeHtml(service.description)}</p>
        <div class="post-actions">
          <a class="button button-secondary" href="services.html">Back to Services</a>
          <a class="button button-primary" href="start-project.html">Start a Project</a>
        </div>
      </div>
      <div class="post-body">
        ${renderServiceBody(service)}
        ${service.items?.length ? `
          <div class="post-list-block">
            <h2>What is included</h2>
            <ul class="detail-list">
              ${service.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </div>
        ` : ""}
        <div class="post-closing">
          <p>
            If this service matches what you want to build, the next step is a simple project conversation where
            we clarify your goals, the right scope, and the best direction for execution.
          </p>
        </div>
      </div>
    </article>
  `;
}

function normalizeInsightsFromSanity(items) {
  const posts = items.map((post) => {
    return normalizeInsightPost(post);
  });

  const featuredPost = posts.find((post) => post.featured) || posts[0] || {
    tag: "Featured Insight",
    title: "Insights coming soon",
    slug: "",
    summary: "New articles will appear here as they are published in Sanity.",
    url: "#",
    imageUrl: "",
    imageAlt: "",
    body: [],
  };

  return {
    featured: featuredPost,
    articles: posts,
  };
}

function normalizeInsightPost(post) {
  const bodyText = buildExcerptFromPortableText(post.body);

  return {
    tag: post.category?.title || "General",
    title: post.title,
    slug: post.slug?.current || post.slug || "",
    summary: post.excerpt || post.summary || bodyText,
    url: "#",
    featured: Boolean(post.featured),
    imageUrl: post.coverImage?.asset?.url || post.imageUrl || "",
    imageAlt: post.coverImage?.alt || post.imageAlt || post.title,
    body: post.body || [],
  };
}

function normalizeCategoriesFromSanity(items) {
  return items.map((category) => ({
    title: category.title,
    summary: category.summary,
  }));
}

function normalizeSiteSettingsFromSanity(settings) {
  return {
    tagline: settings?.tagline || "",
    socialLinks: (settings?.socialLinks || []).map((item) => ({
      label: item.label,
      url: item.url,
    })),
    footerLinks: (settings?.footerLinks || []).map((item) => ({
      label: item.label,
      href: item.href,
    })),
  };
}

async function bootCmsContent() {
  try {
    if (
      document.querySelector("[data-cms-social-links]") ||
      document.querySelector("[data-cms-footer-links]")
    ) {
      let siteSettings;
      try {
        const sanitySettings = await fetchSanity(`*[_type == "siteSettings" && _id == "site-settings-main"][0]{
          tagline,
          socialLinks[]{
            label,
            url
          },
          footerLinks[]{
            label,
            href
          }
        }`);
        if (!hasItems(sanitySettings)) {
          throw new Error("No published Sanity site settings found");
        }
        siteSettings = normalizeSiteSettingsFromSanity(sanitySettings);
      } catch (error) {
        siteSettings = await loadJson("content/site-settings.json");
      }
      renderSiteSettings(siteSettings);
    }

    if (
      document.querySelector("[data-cms-service-highlights]") ||
      document.querySelector("[data-cms-services]")
    ) {
      let services;
      try {
        const sanityServices = await fetchSanity(`*[_type == "service"] | order(_createdAt asc){
          title,
          slug,
          description,
          items,
          featured,
          body,
          coverImage{
            alt,
            asset->{
              url
            }
          }
        }`);
        if (!hasItems(sanityServices)) {
          throw new Error("No published Sanity services found");
        }
        services = normalizeServicesFromSanity(sanityServices);
      } catch (error) {
        services = await loadJson("content/services.json");
      }
      renderServices(services);
    }

    if (document.querySelector("[data-cms-projects]")) {
      let projects;
      try {
        const sanityProjects = await fetchSanity(`*[_type == "project"] | order(_createdAt asc){
          title,
          slug,
          tag,
          summary,
          industry,
          focus,
          body,
          coverImage{
            alt,
            asset->{
              url
            }
          }
        }`);
        if (!hasItems(sanityProjects)) {
          throw new Error("No published Sanity projects found");
        }
        projects = normalizeProjectsFromSanity(sanityProjects);
      } catch (error) {
        projects = await loadJson("content/projects.json");
      }
      renderProjects(projects);
    }

    if (
      document.querySelector("[data-cms-featured-insight]") ||
      document.querySelector("[data-cms-categories]") ||
      document.querySelector("[data-cms-articles]")
    ) {
      let insights;
      try {
        const [sanityCategories, sanityPosts] = await Promise.all([
          fetchSanity(`*[_type == "category"] | order(title asc){
            title,
            summary
          }`),
          fetchSanity(`*[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc){
            title,
            slug,
            category->{
              title
            },
            excerpt,
            coverImage{
              alt,
              asset->{
                url
              }
            },
            body,
            featured
          }`),
        ]);

        if (!hasItems(sanityCategories) || !hasItems(sanityPosts)) {
          throw new Error("Sanity insights are incomplete");
        }

        insights = {
          ...normalizeInsightsFromSanity(sanityPosts),
          categories: normalizeCategoriesFromSanity(sanityCategories),
        };
      } catch (error) {
        insights = await loadJson("content/insights.json");
      }
      renderInsights(insights);
    }

    if (document.querySelector("[data-cms-post-page]")) {
      const slug = new URLSearchParams(window.location.search).get("slug");
      let post;

      try {
        if (!slug) {
          throw new Error("No post slug provided");
        }

        const sanityPost = await fetchSanity(`*[_type == "post" && slug.current == "${slug}"][0]{
          title,
          slug,
          category->{
            title
          },
          excerpt,
          coverImage{
            alt,
            asset->{
              url
            }
          },
          body
        }`);

        if (!hasItems(sanityPost)) {
          throw new Error("Post not found in Sanity");
        }

        post = normalizeInsightPost(sanityPost);
      } catch (error) {
        const localInsights = await loadJson("content/insights.json");
        post =
          [localInsights.featured, ...(localInsights.articles || [])].find((item) => item.slug === slug) ||
          null;
      }

      if (post) {
        renderPostPage(post);
      } else {
        window.location.href = "404.html";
      }
    }

    if (document.querySelector("[data-cms-project-page]")) {
      const slug = new URLSearchParams(window.location.search).get("slug");
      let project;

      try {
        if (!slug) {
          throw new Error("No project slug provided");
        }

        const sanityProject = await fetchSanity(`*[_type == "project" && slug.current == "${slug}"][0]{
          title,
          slug,
          tag,
          summary,
          industry,
          focus,
          body,
          coverImage{
            alt,
            asset->{
              url
            }
          }
        }`);

        if (!hasItems(sanityProject)) {
          throw new Error("Project not found in Sanity");
        }

        project = normalizeProjectsFromSanity([sanityProject])[0];
      } catch (error) {
        const localProjects = await loadJson("content/projects.json");
        project = (localProjects || []).find((item) => item.slug === slug) || null;
      }

      if (project) {
        renderProjectPage(project);
      } else {
        window.location.href = "404.html";
      }
    }

    if (document.querySelector("[data-cms-service-page]")) {
      const slug = new URLSearchParams(window.location.search).get("slug");
      let service;

      try {
        if (!slug) {
          throw new Error("No service slug provided");
        }

        const sanityService = await fetchSanity(`*[_type == "service" && slug.current == "${slug}"][0]{
          title,
          slug,
          description,
          items,
          body,
          coverImage{
            alt,
            asset->{
              url
            }
          }
        }`);

        if (!hasItems(sanityService)) {
          throw new Error("Service not found in Sanity");
        }

        service = normalizeServicesFromSanity([sanityService]).services[0];
      } catch (error) {
        const localServices = await loadJson("content/services.json");
        service = (localServices.services || []).find((item) => item.slug === slug) || null;
      }

      if (service) {
        renderServicePage(service);
      } else {
        window.location.href = "404.html";
      }
    }
  } catch (error) {
    console.error("CMS content could not be loaded.", error);
  }
}

bootCmsContent();
bootNetlifyForms();
