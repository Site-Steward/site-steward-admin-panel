import "./ToolsView.css";

const TOOL_CARDS = [
  {
    name: "New Blog Post",
    description:
      "Placeholder tool for drafting and preparing a new blog post workflow.",
  },
  {
    name: "Products Catalog",
    description:
      "Placeholder tool for managing and organizing product catalog content.",
  },
];

export default function ToolsView() {
  return (
    <section className="tools-view" aria-label="Tools">
      <header className="tools-view-header">
        <h2>Tools</h2>
        <p>Shortcuts for common content workflows.</p>
      </header>

      <div className="tools-grid">
        {TOOL_CARDS.map((tool) => (
          <article key={tool.name} className="tool-card">
            <div className="tool-card-copy">
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
            </div>

            <button
              type="button"
              className="ui secondary"
              disabled
              title="This tool is not implemented yet"
            >
              Open
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
