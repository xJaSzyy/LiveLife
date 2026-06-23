window.canvasService = {
  canvas: null,
  world: null,
  ctx: null,
  gridSize: 64,
  pixelSize: 16,

  init: function (id, gridSize, pixelSize) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");

    this.gridSize = gridSize;
    this.pixelSize = pixelSize;
  },

  setWorld: function(world) {
    this.world = world;
  },

  startLoop: function () {
    const loop = () => {
      if (this.world != null) {
        this.updateWorld(this.world);
        this.drawWorld(this.world);
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  },

  paint: function(x, y, type, component) {
    const i = y * 64 + x;

    this.world[i].type = type;
    
    if (component != null) {
      this.world[i].component = component;
    }
  },

  updateWorld: function(world) {
    const size = this.gridSize;

    for (let i = world.length - 1; i >= 0; i--) {
      if (world[i].type === 2) {
        this.updateGrass(world, i, size);
      }
      else if (world[i].type === 3) {
        this.updateWater(world, i, size);
      }
      else if (world[i].type === 4) {
        this.updateSand(world, i, size);
      }
    }
  },

  updateGrass: function(world, i, size) {
    const x = i % size;
    const y = Math.floor(i / size);

    const dirs = [[0, -1], [-1,  0], [1,  0], [0,  1]];

    for (let d = 0; d < dirs.length; d++) {
      const nx = x + dirs[d][0];
      const ny = y + dirs[d][1];

      if (nx < 0 || nx >= size || ny < 0 || ny >= size) {
        continue;
      }

      const nIndex = ny * size + nx;

      if (world[nIndex].type === 1) {
        if (Math.random() < 0.025) {
          world[nIndex].type = 2;
        }

        return;
      }
    }
  },

  updateWater(world, i, size) {
    const x = i % size;
    const y = Math.floor(i / size);

    const down = (y + 1) * size + x;

    if (y < size - 1) {
      const target = world[down].type;

      if (target === 0) {
        world[down].type = 3;
        world[i].type = 0;
        return;
      }

      if (target === 4) {
        world[down].type = 4;
        world[down].component.humidity += 1;
        if (world[down].component.humidity >= 1) {
          world[down].type = 5;
        }
        
        world[i].type = 0;
        return;
      }
    }

    const diagonals = Math.random() < 0.5 ? [-1, 1] : [1, -1];

    for (const dx of diagonals) {
      const nx = x + dx;
      const ny = y + 1;

      if (nx < 0 || nx >= size || ny >= size) continue;

      const ni = ny * size + nx;
      const target = world[ni].type;

      if (target === 0) {
        world[ni].type = 3;
        world[i].type = 0;
        return;
      }

      if (target === 4) {
        world[ni].type = 4;
        world[ni].component.humidity += 1;
        if (world[ni].component.humidity >= 1) {
          world[ni].type = 5;
        }
        
        world[i].type = 0;
        return;
      }
    }

    const sides = Math.random() < 0.5 ? [-1, 1] : [1, -1];

    for (const dx of sides) {
      const nx = x + dx;
      if (nx < 0 || nx >= size) continue;

      const ni = y * size + nx;

      if (world[ni].type === 0) {
        world[ni].type = 3;
        world[i].type = 0;
        return;
      }
    }
  },

  updateSand(world, i, size) {
    const x = i % size;
    const y = Math.floor(i / size);

    const down = (y + 1) * size + x;

    if (y < size - 1) {
      const target = world[down].type;

      if (target === 0) {
        world[down].type = 4;
        world[down].component = world[i].component;
        world[i].type = 0;
        world[i].component = null;
        return;
      }

      if (target === 3) {
        world[down].type = 4;
        world[down].component = world[i].component;
        
        world[i].type = 0;
        world[i].component = null;
        return;
      }
    }

    const dirs = Math.random() < 0.5 ? [-1, 1] : [1, -1];

    for (const dx of dirs) {
      const nx = x + dx;
      const ny = y + 1;

      if (nx < 0 || nx >= size || ny >= size) continue;

      const ni = ny * size + nx;
      const target = world[ni].type;

      if (target === 0) {
        world[ni].type = 4;
        world[ni].component = world[i].component;
        world[i].type = 0;
        world[i].component = null;
        return;
      }

      if (target === 3) {
        world[ni].type = 4;
        world[ni].component = world[i].component;
        
        world[i].type = 0;
        world[i].component = null;
        return;
      }
    }
  },

  isEmpty: function (world, i) {
    return world[i] && world[i].type === 0
  },

  drawWorld: function (world) {
    const size = 64;
    const ps = this.pixelSize;

    for (let i = 0; i < world.length; i++) {
      const x = i % size;
      const y = Math.floor(i / size);

      const cell = world[i];

      if (cell.type === 0) this.ctx.fillStyle = "skyblue";
      if (cell.type === 1) this.ctx.fillStyle = "darkgray";
      if (cell.type === 2) this.ctx.fillStyle = "seagreen";
      if (cell.type === 3) this.ctx.fillStyle = "cornflowerblue";
      if (cell.type === 4) this.ctx.fillStyle = "sandybrown";
      if (cell.type === 5) this.ctx.fillStyle = "peru";

      this.ctx.fillRect(x * ps, y * ps, ps, ps);
    }
  },

  exportWorld: function () {
    if (!this.world) return null;

    const data = {
      size: this.gridSize,
      pixels: this.world.map(c => ({
        type: c.type,
        ...c.component ? { component: c.component } : {}
      }))
    };

    return JSON.stringify(data);
  },

  importWorld: function (json) {
    const data = JSON.parse(json);

    this.gridSize = data.size;

    this.world = data.pixels.map(t => ({
      type: t
    }));
  },
};