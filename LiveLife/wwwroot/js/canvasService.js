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
        this.updateWorld(this.world);
        this.drawWorld(this.world);
  
        requestAnimationFrame(loop);
      };
  
      requestAnimationFrame(loop);
    },

    paint: function(x, y, type) {
      const i = y * 64 + x;
  
      this.world[i].type = type;
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
  
    updateWater: function(world, i, size) {
      const x = i % size;
      const y = Math.floor(i / size);

      const down = (y + 1) * size + x;

      if (this.isEmpty(world, down)) {
        world[down].type = 3;
        world[i].type = 0;
        return;
      }

      const inBounds = (idx) => idx >= 0 && idx < world.length;

      const downLeft = (y + 1) * size + (x - 1);
      const downRight = (y + 1) * size + (x + 1);

      const canDownLeft =
        x > 0 &&
        inBounds(downLeft) &&
        this.isEmpty(world, downLeft);

      const canDownRight =
        x < size - 1 &&
        inBounds(downRight) &&
        this.isEmpty(world, downRight);

      if (canDownLeft && canDownRight) {
        const dir = Math.random() < 0.5 ? downLeft : downRight;
        world[dir].type = 3;
        world[i].type = 0;
        return;
      }

      const leftBlocked = x > 0 && !this.isEmpty(world, i - 1);
      const rightBlocked = x < size - 1 && !this.isEmpty(world, i + 1);

      if (canDownLeft && !leftBlocked) {
        world[downLeft].type = 3;
        world[i].type = 0;
        return;
      }

      if (canDownRight && !rightBlocked) {
        world[downRight].type = 3;
        world[i].type = 0;
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
        if (cell.type === 1) this.ctx.fillStyle = "gray";
        if (cell.type === 2) this.ctx.fillStyle = "green";
        if (cell.type === 3) this.ctx.fillStyle = "darkblue";
  
        this.ctx.fillRect(x * ps, y * ps, ps, ps);
      }
    }
};