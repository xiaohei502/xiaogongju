const STATUS_LABELS = {
  available: "可用",
  planned: "规划中",
};

const state = {
  tools: [],
  query: "",
  category: "all",
  status: "all",
};

const elements = {
  searchInput: document.querySelector("#searchInput"),
  categoryFilter: document.querySelector("#categoryFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  toolGrid: document.querySelector("#toolGrid"),
  emptyState: document.querySelector("#emptyState"),
  resultSummary: document.querySelector("#resultSummary"),
};

function normalizeText(value) {
  return String(value || "").trim().toLocaleLowerCase("zh-CN");
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getStatusLabel(status) {
  return STATUS_LABELS[status] || status || "未知";
}

function getToolSearchText(tool) {
  return normalizeText([
    tool.title,
    tool.description,
    tool.category,
    ...(tool.tags || []),
  ].join(" "));
}

function populateCategoryFilter(tools) {
  const categories = [...new Set(tools.map((tool) => tool.category).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, "zh-CN"),
  );

  elements.categoryFilter.insertAdjacentHTML(
    "beforeend",
    categories
      .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
      .join(""),
  );
}

function getFilteredTools() {
  const query = normalizeText(state.query);

  return state.tools.filter((tool) => {
    const matchesQuery = !query || getToolSearchText(tool).includes(query);
    const matchesCategory = state.category === "all" || tool.category === state.category;
    const matchesStatus = state.status === "all" || tool.status === state.status;

    return matchesQuery && matchesCategory && matchesStatus;
  });
}

function createToolCard(tool) {
  const tags = (tool.tags || [])
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join("");
  const statusLabel = getStatusLabel(tool.status);
  const isAvailable = tool.status === "available";
  const linkText = isAvailable ? "打开工具 →" : "敬请期待";
  const linkClass = isAvailable ? "open-tool" : "open-tool is-disabled";
  const linkHref = isAvailable && tool.path ? tool.path : "#";
  const linkAttributes = isAvailable ? "" : 'aria-disabled="true" tabindex="-1"';

  return `
    <article class="tool-card">
      <div class="card-header">
        <div class="card-icon" aria-hidden="true">${escapeHtml(tool.icon || "✦")}</div>
        <span class="status-badge status-${escapeHtml(tool.status)}">${escapeHtml(statusLabel)}</span>
      </div>
      <div>
        <h3>${escapeHtml(tool.title)}</h3>
        <p>${escapeHtml(tool.description)}</p>
      </div>
      <div class="tag-list" aria-label="工具标签">${tags}</div>
      <div class="card-footer">
        <span class="category">${escapeHtml(tool.category || "未分类")}</span>
        <a class="${linkClass}" href="${escapeHtml(linkHref)}" ${linkAttributes}>${linkText}</a>
      </div>
    </article>
  `;
}

function renderTools() {
  const filteredTools = getFilteredTools();

  elements.toolGrid.innerHTML = filteredTools.map(createToolCard).join("");
  elements.emptyState.hidden = filteredTools.length > 0;
  elements.resultSummary.textContent = `共 ${filteredTools.length} / ${state.tools.length} 个工具`;
}

function bindEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderTools();
  });

  elements.categoryFilter.addEventListener("change", (event) => {
    state.category = event.target.value;
    renderTools();
  });

  elements.statusFilter.addEventListener("change", (event) => {
    state.status = event.target.value;
    renderTools();
  });
}

async function loadTools() {
  try {
    const response = await fetch("tools.json");

    if (!response.ok) {
      throw new Error(`工具配置加载失败：${response.status}`);
    }

    const data = await response.json();
    state.tools = Array.isArray(data.tools) ? data.tools : [];
    populateCategoryFilter(state.tools);
    renderTools();
  } catch (error) {
    elements.resultSummary.textContent = "工具配置加载失败";
    elements.toolGrid.innerHTML = `
      <div class="empty-state">
        <strong>无法读取 tools.json</strong>
        <p>${escapeHtml(error.message)}</p>
      </div>
    `;
  }
}

bindEvents();
loadTools();
