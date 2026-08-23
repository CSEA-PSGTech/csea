import "./BackgroundGrid.css";

function BackgroundGrid() {
  return (
    <div className="background-grid" aria-hidden="true">
      <div className="grid-canvas">

        {/* Grid cells */}
        {Array.from({ length: 9 }, (_, index) => (
          <div
            key={index}
            className="grid-cell"
          />
        ))}

        {/* Cross markers */}
        <span className="grid-cross cross-1" />
        <span className="grid-cross cross-2" />
        <span className="grid-cross cross-3" />
        <span className="grid-cross cross-4" />

      </div>
    </div>
  );
}

export default BackgroundGrid;