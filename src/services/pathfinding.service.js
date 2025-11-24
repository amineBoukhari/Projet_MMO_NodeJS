// Service de pathfinding A* sur une grille de cases

/**
 * Construire une grille 2D à partir des cases de la BDD.
 * @param {Array} cases - liste de Case avec x, y, blocked
 * @param {number} width
 * @param {number} height
 */
export function buildGridFromCases(cases, width, height) {
  const grid = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({ blocked: true }))
  );

  for (const c of cases) {
    if (
      c.x >= 0 &&
      c.x < width &&
      c.y >= 0 &&
      c.y < height
    ) {
      grid[c.y][c.x] = { blocked: !!c.blocked };
    }
  }

  return grid;
}

function heuristic(a, b) {
  // distance de Manhattan (4 directions)
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * A* sur grille 4 directions.
 * @param {Array<Array<{blocked:boolean}>>} grid
 * @param {{x:number,y:number}} start
 * @param {{x:number,y:number}} goal
 * @returns {Array<{x:number,y:number}> | null}
 */
export function findPath(grid, start, goal) {
  const height = grid.length;
  const width = grid[0]?.length || 0;

  const inBounds = (x, y) => x >= 0 && x < width && y >= 0 && y < height;
  const neighbors = (x, y) => [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 }
  ];

  const openSet = [];
  const cameFrom = new Map(); // key: "x,y" -> value: "x,y"
  const gScore = new Map();
  const fScore = new Map();

  const key = (x, y) => `${x},${y}`;

  const startKey = key(start.x, start.y);
  openSet.push({ ...start, f: 0 });
  gScore.set(startKey, 0);
  fScore.set(startKey, heuristic(start, goal));

  while (openSet.length > 0) {
    // prendre le noeud avec le plus petit f
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    if (!current) break;

    const currKey = key(current.x, current.y);
    if (current.x === goal.x && current.y === goal.y) {
      // reconstituer le chemin
      const path = [];
      let k = currKey;
      while (k) {
        const [cx, cy] = k.split(',').map(Number);
        path.push({ x: cx, y: cy });
        k = cameFrom.get(k);
      }
      return path.reverse();
    }

    for (const n of neighbors(current.x, current.y)) {
      if (!inBounds(n.x, n.y)) continue;
      if (grid[n.y][n.x]?.blocked) continue;

      const nk = key(n.x, n.y);
      const tentativeG = (gScore.get(currKey) ?? Infinity) + 1;

      if (tentativeG < (gScore.get(nk) ?? Infinity)) {
        cameFrom.set(nk, currKey);
        gScore.set(nk, tentativeG);
        const f = tentativeG + heuristic(n, goal);
        fScore.set(nk, f);

        const existing = openSet.find((o) => o.x === n.x && o.y === n.y);
        if (existing) {
          existing.f = f;
        } else {
          openSet.push({ ...n, f });
        }
      }
    }
  }

  return null; // pas de chemin
}
