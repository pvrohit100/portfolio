(function() {
  var Building, Skyline, dt, sketch, skylines;

  sketch = Sketch.create();

  sketch.mouse.x = sketch.width / 10;

  sketch.mouse.y = sketch.height;

  skylines = [];

  dt = 1;

  
  // BUILDINGS

  Building = function(config) {
    return this.reset(config);
  };

  Building.prototype.reset = function(config) {
    this.layer = config.layer;
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.color = config.color;
    this.slantedTop = floor(random(0, 10)) === 0;
    this.slantedTopHeight = this.width / random(2, 4);
    this.slantedTopDirection = round(random(0, 1)) === 0;
    this.spireTop = floor(random(0, 15)) === 0;
    this.spireTopWidth = random(this.width * .01, this.width * .07);
    this.spireTopHeight = random(10, 20);
    this.antennaTop = !this.spireTop && floor(random(0, 10)) === 0;
    this.antennaTopWidth = this.layer / 2;
    return this.antennaTopHeight = random(5, 20);
  };

  Building.prototype.render = function() {
    sketch.fillStyle = sketch.strokeStyle = this.color;
    sketch.lineWidth = 2;
    sketch.beginPath();
    sketch.rect(this.x, this.y, this.width, this.height);
    sketch.fill();
    sketch.stroke();
    if (this.slantedTop) {
      sketch.beginPath();
      sketch.moveTo(this.x, this.y);
      sketch.lineTo(this.x + this.width, this.y);
      if (this.slantedTopDirection) {
        sketch.lineTo(this.x + this.width, this.y - this.slantedTopHeight);
      } else {
        sketch.lineTo(this.x, this.y - this.slantedTopHeight);
      }
      sketch.closePath();
      sketch.fill();
      sketch.stroke();
    }
    if (this.spireTop) {
      sketch.beginPath();
      sketch.moveTo(this.x + (this.width / 2), this.y - this.spireTopHeight);
      sketch.lineTo(this.x + (this.width / 2) + this.spireTopWidth, this.y);
      sketch.lineTo(this.x + (this.width / 2) - this.spireTopWidth, this.y);
      sketch.closePath();
      sketch.fill();
      sketch.stroke();
    }
    if (this.antennaTop) {
      sketch.beginPath();
      sketch.moveTo(this.x + (this.width / 2), this.y - this.antennaTopHeight);
      sketch.lineTo(this.x + (this.width / 2), this.y);
      sketch.lineWidth = this.antennaTopWidth;
      return sketch.stroke();
    }
  };

  
  // SKYLINES

  Skyline = function(config) {
    this.x = 0;
    this.buildings = [];
    this.layer = config.layer;
    this.width = {
      min: config.width.min,
      max: config.width.max
    };
    this.height = {
      min: config.height.min,
      max: config.height.max
    };
    this.speed = config.speed;
    this.color = config.color;
    this.populate();
    return this;
  };

  Skyline.prototype.populate = function() {
    var newHeight, newWidth, results, totalWidth;
    totalWidth = 0;
    results = [];
    while (totalWidth <= sketch.width + (this.width.max * 2)) {
      newWidth = round(random(this.width.min, this.width.max));
      newHeight = round(random(this.height.min, this.height.max));
      this.buildings.push(new Building({
        layer: this.layer,
        x: this.buildings.length === 0 ? 0 : this.buildings[this.buildings.length - 1].x + this.buildings[this.buildings.length - 1].width,
        y: sketch.height - newHeight,
        width: newWidth,
        height: newHeight,
        color: this.color
      }));
      results.push(totalWidth += newWidth);
    }
    return results;
  };

  Skyline.prototype.update = function() {
    var firstBuilding, lastBuilding, newHeight, newWidth;
    this.x -= (sketch.mouse.x * this.speed) * dt;
    firstBuilding = this.buildings[0];
    if (firstBuilding.width + firstBuilding.x + this.x < 0) {
      newWidth = round(random(this.width.min, this.width.max));
      newHeight = round(random(this.height.min, this.height.max));
      lastBuilding = this.buildings[this.buildings.length - 1];
      firstBuilding.reset({
        layer: this.layer,
        x: lastBuilding.x + lastBuilding.width,
        y: sketch.height - newHeight,
        width: newWidth,
        height: newHeight,
        color: this.color
      });
      return this.buildings.push(this.buildings.shift());
    }
  };

  Skyline.prototype.render = function() {
    var i;
    i = this.buildings.length;
    sketch.save();
    sketch.translate(this.x, (sketch.height - sketch.mouse.y) / 20 * this.layer);
    while (i--) {
      this.buildings[i].render(i);
    }
    return sketch.restore();
  };

  
  // SETUP

  sketch.setup = function() {
    var i, results;
    i = 5;
    results = [];
    while (i--) {
      results.push(skylines.push(new Skyline({
        layer: i + 1,
        width: {
          min: (i + 1) * 30,
          max: (i + 1) * 40
        },
        height: {
          min: 150 - (i * 35),
          max: 300 - (i * 35)
        },
        speed: (i + 1) * .0009,
        color: 'hsl( 168, ' + (((i + 1) * 1) + 70) + '%, ' + (95 - (i * 13)) + '% )'
      })));
    }
    return results;
  };

  
  // CLEAR

  sketch.clear = function() {
    return sketch.clearRect(0, 0, sketch.width, sketch.height);
  };

  
  // UPDATE

  sketch.update = function() {
    var i, results;
    dt = sketch.dt < .1 ? .1 : sketch.dt / 16;
    dt = dt > 5 ? 5 : dt;
    i = skylines.length;
    results = [];
    while (i--) {
      results.push(skylines[i].update(i));
    }
    return results;
  };

  
  // DRAW

  sketch.draw = function() {
    var i, results;
    i = skylines.length;
    results = [];
    while (i--) {
      results.push(skylines[i].render(i));
    }
    return results;
  };

  
  // Mousemove Fix

  $(window).on('mousemove', function(e) {
    sketch.mouse.x = e.pageX;
    return sketch.mouse.y = e.pageY;
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLFFBQUEsRUFBQSxPQUFBLEVBQUEsRUFBQSxFQUFBLE1BQUEsRUFBQTs7RUFBQSxNQUFBLEdBQVMsTUFBTSxDQUFDLE1BQVAsQ0FBQTs7RUFDVCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQWIsR0FBaUIsTUFBTSxDQUFDLEtBQVAsR0FBZTs7RUFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFiLEdBQWlCLE1BQU0sQ0FBQzs7RUFDeEIsUUFBQSxHQUFXOztFQUNYLEVBQUEsR0FBSyxFQUpMOzs7OztFQVVBLFFBQUEsR0FBVyxRQUFBLENBQUUsTUFBRixDQUFBO1dBQ1QsSUFBSSxDQUFDLEtBQUwsQ0FBWSxNQUFaO0VBRFM7O0VBR1gsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFuQixHQUEyQixRQUFBLENBQUMsTUFBRCxDQUFBO0lBQ3pCLElBQUksQ0FBQyxLQUFMLEdBQWEsTUFBTSxDQUFDO0lBQ3BCLElBQUksQ0FBQyxDQUFMLEdBQVMsTUFBTSxDQUFDO0lBQ2hCLElBQUksQ0FBQyxDQUFMLEdBQVMsTUFBTSxDQUFDO0lBQ2hCLElBQUksQ0FBQyxLQUFMLEdBQWEsTUFBTSxDQUFDO0lBQ3BCLElBQUksQ0FBQyxNQUFMLEdBQWMsTUFBTSxDQUFDO0lBQ3JCLElBQUksQ0FBQyxLQUFMLEdBQWEsTUFBTSxDQUFDO0lBQ3BCLElBQUksQ0FBQyxVQUFMLEdBQWtCLEtBQUEsQ0FBTyxNQUFBLENBQVEsQ0FBUixFQUFXLEVBQVgsQ0FBUCxDQUFBLEtBQTRCO0lBQzlDLElBQUksQ0FBQyxnQkFBTCxHQUF3QixJQUFJLENBQUMsS0FBTCxHQUFhLE1BQUEsQ0FBUSxDQUFSLEVBQVcsQ0FBWDtJQUNyQyxJQUFJLENBQUMsbUJBQUwsR0FBMkIsS0FBQSxDQUFPLE1BQUEsQ0FBUSxDQUFSLEVBQVcsQ0FBWCxDQUFQLENBQUEsS0FBMkI7SUFDdEQsSUFBSSxDQUFDLFFBQUwsR0FBZ0IsS0FBQSxDQUFPLE1BQUEsQ0FBUSxDQUFSLEVBQVcsRUFBWCxDQUFQLENBQUEsS0FBNEI7SUFDNUMsSUFBSSxDQUFDLGFBQUwsR0FBcUIsTUFBQSxDQUFRLElBQUksQ0FBQyxLQUFMLEdBQWEsR0FBckIsRUFBMEIsSUFBSSxDQUFDLEtBQUwsR0FBYSxHQUF2QztJQUNyQixJQUFJLENBQUMsY0FBTCxHQUFzQixNQUFBLENBQVEsRUFBUixFQUFZLEVBQVo7SUFDdEIsSUFBSSxDQUFDLFVBQUwsR0FBa0IsQ0FBQyxJQUFJLENBQUMsUUFBTixJQUFrQixLQUFBLENBQU8sTUFBQSxDQUFRLENBQVIsRUFBVyxFQUFYLENBQVAsQ0FBQSxLQUE0QjtJQUNoRSxJQUFJLENBQUMsZUFBTCxHQUF1QixJQUFJLENBQUMsS0FBTCxHQUFhO1dBQ3BDLElBQUksQ0FBQyxnQkFBTCxHQUF3QixNQUFBLENBQU8sQ0FBUCxFQUFVLEVBQVY7RUFmQzs7RUFpQjNCLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBbkIsR0FBNEIsUUFBQSxDQUFBLENBQUE7SUFDMUIsTUFBTSxDQUFDLFNBQVAsR0FBbUIsTUFBTSxDQUFDLFdBQVAsR0FBcUIsSUFBSSxDQUFDO0lBQzdDLE1BQU0sQ0FBQyxTQUFQLEdBQW1CO0lBRW5CLE1BQU0sQ0FBQyxTQUFQLENBQUE7SUFDQSxNQUFNLENBQUMsSUFBUCxDQUFhLElBQUksQ0FBQyxDQUFsQixFQUFxQixJQUFJLENBQUMsQ0FBMUIsRUFBNkIsSUFBSSxDQUFDLEtBQWxDLEVBQXlDLElBQUksQ0FBQyxNQUE5QztJQUNBLE1BQU0sQ0FBQyxJQUFQLENBQUE7SUFDQSxNQUFNLENBQUMsTUFBUCxDQUFBO0lBRUEsSUFBRyxJQUFJLENBQUMsVUFBUjtNQUNFLE1BQU0sQ0FBQyxTQUFQLENBQUE7TUFDQSxNQUFNLENBQUMsTUFBUCxDQUFlLElBQUksQ0FBQyxDQUFwQixFQUF1QixJQUFJLENBQUMsQ0FBNUI7TUFDQSxNQUFNLENBQUMsTUFBUCxDQUFlLElBQUksQ0FBQyxDQUFMLEdBQVMsSUFBSSxDQUFDLEtBQTdCLEVBQW9DLElBQUksQ0FBQyxDQUF6QztNQUNBLElBQUcsSUFBSSxDQUFDLG1CQUFSO1FBQ0UsTUFBTSxDQUFDLE1BQVAsQ0FBZSxJQUFJLENBQUMsQ0FBTCxHQUFTLElBQUksQ0FBQyxLQUE3QixFQUFvQyxJQUFJLENBQUMsQ0FBTCxHQUFTLElBQUksQ0FBQyxnQkFBbEQsRUFERjtPQUFBLE1BQUE7UUFHRSxNQUFNLENBQUMsTUFBUCxDQUFlLElBQUksQ0FBQyxDQUFwQixFQUF1QixJQUFJLENBQUMsQ0FBTCxHQUFTLElBQUksQ0FBQyxnQkFBckMsRUFIRjs7TUFJQSxNQUFNLENBQUMsU0FBUCxDQUFBO01BQ0EsTUFBTSxDQUFDLElBQVAsQ0FBQTtNQUNBLE1BQU0sQ0FBQyxNQUFQLENBQUEsRUFWRjs7SUFZQSxJQUFHLElBQUksQ0FBQyxRQUFSO01BQ0UsTUFBTSxDQUFDLFNBQVAsQ0FBQTtNQUNBLE1BQU0sQ0FBQyxNQUFQLENBQWUsSUFBSSxDQUFDLENBQUwsR0FBUyxDQUFFLElBQUksQ0FBQyxLQUFMLEdBQWEsQ0FBZixDQUF4QixFQUE0QyxJQUFJLENBQUMsQ0FBTCxHQUFTLElBQUksQ0FBQyxjQUExRDtNQUNBLE1BQU0sQ0FBQyxNQUFQLENBQWUsSUFBSSxDQUFDLENBQUwsR0FBUyxDQUFFLElBQUksQ0FBQyxLQUFMLEdBQWEsQ0FBZixDQUFULEdBQThCLElBQUksQ0FBQyxhQUFsRCxFQUFpRSxJQUFJLENBQUMsQ0FBdEU7TUFDQSxNQUFNLENBQUMsTUFBUCxDQUFlLElBQUksQ0FBQyxDQUFMLEdBQVMsQ0FBRSxJQUFJLENBQUMsS0FBTCxHQUFhLENBQWYsQ0FBVCxHQUE4QixJQUFJLENBQUMsYUFBbEQsRUFBaUUsSUFBSSxDQUFDLENBQXRFO01BQ0EsTUFBTSxDQUFDLFNBQVAsQ0FBQTtNQUNBLE1BQU0sQ0FBQyxJQUFQLENBQUE7TUFDQSxNQUFNLENBQUMsTUFBUCxDQUFBLEVBUEY7O0lBU0EsSUFBRyxJQUFJLENBQUMsVUFBUjtNQUNFLE1BQU0sQ0FBQyxTQUFQLENBQUE7TUFDQSxNQUFNLENBQUMsTUFBUCxDQUFlLElBQUksQ0FBQyxDQUFMLEdBQVMsQ0FBRSxJQUFJLENBQUMsS0FBTCxHQUFhLENBQWYsQ0FBeEIsRUFBNEMsSUFBSSxDQUFDLENBQUwsR0FBUyxJQUFJLENBQUMsZ0JBQTFEO01BQ0EsTUFBTSxDQUFDLE1BQVAsQ0FBZSxJQUFJLENBQUMsQ0FBTCxHQUFTLENBQUUsSUFBSSxDQUFDLEtBQUwsR0FBYSxDQUFmLENBQXhCLEVBQTRDLElBQUksQ0FBQyxDQUFqRDtNQUNBLE1BQU0sQ0FBQyxTQUFQLEdBQW1CLElBQUksQ0FBQzthQUN4QixNQUFNLENBQUMsTUFBUCxDQUFBLEVBTEY7O0VBOUIwQixFQTlCNUI7Ozs7O0VBdUVBLE9BQUEsR0FBVSxRQUFBLENBQUMsTUFBRCxDQUFBO0lBQ1IsSUFBSSxDQUFDLENBQUwsR0FBUztJQUNULElBQUksQ0FBQyxTQUFMLEdBQWlCO0lBQ2pCLElBQUksQ0FBQyxLQUFMLEdBQWEsTUFBTSxDQUFDO0lBQ3BCLElBQUksQ0FBQyxLQUFMLEdBQ0U7TUFBQSxHQUFBLEVBQUssTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFsQjtNQUNBLEdBQUEsRUFBSyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBRGxCO0lBRUYsSUFBSSxDQUFDLE1BQUwsR0FDRTtNQUFBLEdBQUEsRUFBSyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQW5CO01BQ0EsR0FBQSxFQUFLLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFEbkI7SUFFRixJQUFJLENBQUMsS0FBTCxHQUFhLE1BQU0sQ0FBQztJQUNwQixJQUFJLENBQUMsS0FBTCxHQUFhLE1BQU0sQ0FBQztJQUNwQixJQUFJLENBQUMsUUFBTCxDQUFBO0FBQ0EsV0FBTztFQWJDOztFQWVWLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBbEIsR0FBNkIsUUFBQSxDQUFBLENBQUE7QUFDM0IsUUFBQSxTQUFBLEVBQUEsUUFBQSxFQUFBLE9BQUEsRUFBQTtJQUFBLFVBQUEsR0FBYTtBQUNiO1dBQU0sVUFBQSxJQUFjLE1BQU0sQ0FBQyxLQUFQLEdBQWUsQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQVgsR0FBaUIsQ0FBbkIsQ0FBbkM7TUFDRSxRQUFBLEdBQVcsS0FBQSxDQUFRLE1BQUEsQ0FBUSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQW5CLEVBQXdCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBbkMsQ0FBUjtNQUNYLFNBQUEsR0FBWSxLQUFBLENBQVEsTUFBQSxDQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBcEIsRUFBeUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFyQyxDQUFSO01BQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQXFCLElBQUksUUFBSixDQUNuQjtRQUFBLEtBQUEsRUFBTyxJQUFJLENBQUMsS0FBWjtRQUNBLENBQUEsRUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQWYsS0FBeUIsQ0FBNUIsR0FBbUMsQ0FBbkMsR0FBNEMsSUFBSSxDQUFDLFNBQVcsQ0FBQSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQWYsR0FBd0IsQ0FBeEIsQ0FBMkIsQ0FBQyxDQUE1QyxHQUFnRCxJQUFJLENBQUMsU0FBVyxDQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBZixHQUF3QixDQUF4QixDQUEyQixDQUFDLEtBRDNJO1FBRUEsQ0FBQSxFQUFHLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLFNBRm5CO1FBR0EsS0FBQSxFQUFPLFFBSFA7UUFJQSxNQUFBLEVBQVEsU0FKUjtRQUtBLEtBQUEsRUFBTyxJQUFJLENBQUM7TUFMWixDQURtQixDQUFyQjttQkFRQSxVQUFBLElBQWM7SUFYaEIsQ0FBQTs7RUFGMkI7O0VBZTdCLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBbEIsR0FBMkIsUUFBQSxDQUFBLENBQUE7QUFDekIsUUFBQSxhQUFBLEVBQUEsWUFBQSxFQUFBLFNBQUEsRUFBQTtJQUFBLElBQUksQ0FBQyxDQUFMLElBQVUsQ0FBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQWIsR0FBaUIsSUFBSSxDQUFDLEtBQXhCLENBQUEsR0FBa0M7SUFFNUMsYUFBQSxHQUFnQixJQUFJLENBQUMsU0FBVyxDQUFBLENBQUE7SUFDaEMsSUFBRyxhQUFhLENBQUMsS0FBZCxHQUFzQixhQUFhLENBQUMsQ0FBcEMsR0FBd0MsSUFBSSxDQUFDLENBQTdDLEdBQWlELENBQXBEO01BQ0UsUUFBQSxHQUFXLEtBQUEsQ0FBUSxNQUFBLENBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFuQixFQUF3QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQW5DLENBQVI7TUFDWCxTQUFBLEdBQVksS0FBQSxDQUFRLE1BQUEsQ0FBUSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQXBCLEVBQXlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBckMsQ0FBUjtNQUNaLFlBQUEsR0FBZSxJQUFJLENBQUMsU0FBVyxDQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBZixHQUF3QixDQUF4QjtNQUMvQixhQUFhLENBQUMsS0FBZCxDQUNFO1FBQUEsS0FBQSxFQUFPLElBQUksQ0FBQyxLQUFaO1FBQ0EsQ0FBQSxFQUFHLFlBQVksQ0FBQyxDQUFiLEdBQWlCLFlBQVksQ0FBQyxLQURqQztRQUVBLENBQUEsRUFBRyxNQUFNLENBQUMsTUFBUCxHQUFnQixTQUZuQjtRQUdBLEtBQUEsRUFBTyxRQUhQO1FBSUEsTUFBQSxFQUFRLFNBSlI7UUFLQSxLQUFBLEVBQU8sSUFBSSxDQUFDO01BTFosQ0FERjthQVFBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFxQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQWYsQ0FBQSxDQUFyQixFQVpGOztFQUp5Qjs7RUFrQjNCLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBbEIsR0FBMkIsUUFBQSxDQUFBLENBQUE7QUFDekIsUUFBQTtJQUFBLENBQUEsR0FBSSxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ25CLE1BQU0sQ0FBQyxJQUFQLENBQUE7SUFDQSxNQUFNLENBQUMsU0FBUCxDQUFrQixJQUFJLENBQUMsQ0FBdkIsRUFBMEIsQ0FBRSxNQUFNLENBQUMsTUFBUCxHQUFnQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQS9CLENBQUEsR0FBcUMsRUFBckMsR0FBMEMsSUFBSSxDQUFDLEtBQXpFO0FBQ2lDLFdBQU0sQ0FBQSxFQUFOO01BQWpDLElBQUksQ0FBQyxTQUFXLENBQUEsQ0FBQSxDQUFHLENBQUMsTUFBcEIsQ0FBNkIsQ0FBN0I7SUFBaUM7V0FDakMsTUFBTSxDQUFDLE9BQVAsQ0FBQTtFQUx5QixFQXZIM0I7Ozs7O0VBa0lBLE1BQU0sQ0FBQyxLQUFQLEdBQWUsUUFBQSxDQUFBLENBQUE7QUFDYixRQUFBLENBQUEsRUFBQTtJQUFBLENBQUEsR0FBSTtBQUNKO1dBQU0sQ0FBQSxFQUFOO21CQUNFLFFBQVEsQ0FBQyxJQUFULENBQWUsSUFBSSxPQUFKLENBQ2I7UUFBQSxLQUFBLEVBQU8sQ0FBQSxHQUFJLENBQVg7UUFDQSxLQUFBLEVBQ0U7VUFBQSxHQUFBLEVBQUssQ0FBRSxDQUFBLEdBQUksQ0FBTixDQUFBLEdBQVksRUFBakI7VUFDQSxHQUFBLEVBQUssQ0FBRSxDQUFBLEdBQUksQ0FBTixDQUFBLEdBQVk7UUFEakIsQ0FGRjtRQUlBLE1BQUEsRUFDRTtVQUFBLEdBQUEsRUFBSyxHQUFBLEdBQU0sQ0FBSSxDQUFGLEdBQVEsRUFBVixDQUFYO1VBQ0EsR0FBQSxFQUFLLEdBQUEsR0FBTSxDQUFJLENBQUYsR0FBUSxFQUFWO1FBRFgsQ0FMRjtRQU9BLEtBQUEsRUFBTyxDQUFFLENBQUEsR0FBSSxDQUFOLENBQUEsR0FBWSxJQVBuQjtRQVFBLEtBQUEsRUFBTyxZQUFBLEdBQWUsQ0FBRSxDQUFFLENBQUUsQ0FBQSxHQUFJLENBQU4sQ0FBQSxHQUFZLENBQWQsQ0FBQSxHQUFvQixFQUF0QixDQUFmLEdBQTRDLEtBQTVDLEdBQW9ELENBQUUsRUFBQSxHQUFLLENBQUUsQ0FBQSxHQUFJLEVBQU4sQ0FBUCxDQUFwRCxHQUEwRTtNQVJqRixDQURhLENBQWY7SUFERixDQUFBOztFQUZhLEVBbElmOzs7OztFQXFKQSxNQUFNLENBQUMsS0FBUCxHQUFlLFFBQUEsQ0FBQSxDQUFBO1dBQ2IsTUFBTSxDQUFDLFNBQVAsQ0FBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsRUFBd0IsTUFBTSxDQUFDLEtBQS9CLEVBQXNDLE1BQU0sQ0FBQyxNQUE3QztFQURhLEVBckpmOzs7OztFQTRKQSxNQUFNLENBQUMsTUFBUCxHQUFnQixRQUFBLENBQUEsQ0FBQTtBQUNkLFFBQUEsQ0FBQSxFQUFBO0lBQUEsRUFBQSxHQUFRLE1BQU0sQ0FBQyxFQUFQLEdBQVksRUFBZixHQUF1QixFQUF2QixHQUErQixNQUFNLENBQUMsRUFBUCxHQUFZO0lBQ2hELEVBQUEsR0FBUSxFQUFBLEdBQUssQ0FBUixHQUFlLENBQWYsR0FBc0I7SUFDM0IsQ0FBQSxHQUFJLFFBQVEsQ0FBQztBQUNhO1dBQU0sQ0FBQSxFQUFOO21CQUExQixRQUFVLENBQUEsQ0FBQSxDQUFHLENBQUMsTUFBZCxDQUFzQixDQUF0QjtJQUEwQixDQUFBOztFQUpaLEVBNUpoQjs7Ozs7RUFzS0EsTUFBTSxDQUFDLElBQVAsR0FBYyxRQUFBLENBQUEsQ0FBQTtBQUNaLFFBQUEsQ0FBQSxFQUFBO0lBQUEsQ0FBQSxHQUFJLFFBQVEsQ0FBQztBQUNhO1dBQU0sQ0FBQSxFQUFOO21CQUExQixRQUFVLENBQUEsQ0FBQSxDQUFHLENBQUMsTUFBZCxDQUFzQixDQUF0QjtJQUEwQixDQUFBOztFQUZkLEVBdEtkOzs7OztFQThLQSxDQUFBLENBQUcsTUFBSCxDQUFXLENBQUMsRUFBWixDQUFlLFdBQWYsRUFBNEIsUUFBQSxDQUFDLENBQUQsQ0FBQTtJQUMxQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQWIsR0FBaUIsQ0FBQyxDQUFDO1dBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBYixHQUFpQixDQUFDLENBQUM7RUFGTyxDQUE1QjtBQTlLQSIsInNvdXJjZXNDb250ZW50IjpbInNrZXRjaCA9IFNrZXRjaC5jcmVhdGUoKVxuc2tldGNoLm1vdXNlLnggPSBza2V0Y2gud2lkdGggLyAxMFxuc2tldGNoLm1vdXNlLnkgPSBza2V0Y2guaGVpZ2h0XG5za3lsaW5lcyA9IFtdXG5kdCA9IDFcblxuI1xuIyBCVUlMRElOR1NcbiNcbiAgXG5CdWlsZGluZyA9ICggY29uZmlnICkgLT5cbiAgdGhpcy5yZXNldCggY29uZmlnIClcblxuQnVpbGRpbmcucHJvdG90eXBlLnJlc2V0ID0gKGNvbmZpZykgLT5cbiAgdGhpcy5sYXllciA9IGNvbmZpZy5sYXllclxuICB0aGlzLnggPSBjb25maWcueFxuICB0aGlzLnkgPSBjb25maWcueVxuICB0aGlzLndpZHRoID0gY29uZmlnLndpZHRoXG4gIHRoaXMuaGVpZ2h0ID0gY29uZmlnLmhlaWdodFxuICB0aGlzLmNvbG9yID0gY29uZmlnLmNvbG9yICBcbiAgdGhpcy5zbGFudGVkVG9wID0gZmxvb3IoIHJhbmRvbSggMCwgMTAgKSApID09IDBcbiAgdGhpcy5zbGFudGVkVG9wSGVpZ2h0ID0gdGhpcy53aWR0aCAvIHJhbmRvbSggMiwgNCApXG4gIHRoaXMuc2xhbnRlZFRvcERpcmVjdGlvbiA9IHJvdW5kKCByYW5kb20oIDAsIDEgKSApID09IDBcbiAgdGhpcy5zcGlyZVRvcCA9IGZsb29yKCByYW5kb20oIDAsIDE1ICkgKSA9PSAwXG4gIHRoaXMuc3BpcmVUb3BXaWR0aCA9IHJhbmRvbSggdGhpcy53aWR0aCAqIC4wMSwgdGhpcy53aWR0aCAqIC4wNyApXG4gIHRoaXMuc3BpcmVUb3BIZWlnaHQgPSByYW5kb20oIDEwLCAyMCApXG4gIHRoaXMuYW50ZW5uYVRvcCA9ICF0aGlzLnNwaXJlVG9wICYmIGZsb29yKCByYW5kb20oIDAsIDEwICkgKSA9PSAwXG4gIHRoaXMuYW50ZW5uYVRvcFdpZHRoID0gdGhpcy5sYXllciAvIDJcbiAgdGhpcy5hbnRlbm5hVG9wSGVpZ2h0ID0gcmFuZG9tKDUsIDIwKSBcbiAgICBcbkJ1aWxkaW5nLnByb3RvdHlwZS5yZW5kZXIgPSAtPlxuICBza2V0Y2guZmlsbFN0eWxlID0gc2tldGNoLnN0cm9rZVN0eWxlID0gdGhpcy5jb2xvclxuICBza2V0Y2gubGluZVdpZHRoID0gMlxuICBcbiAgc2tldGNoLmJlZ2luUGF0aCgpXG4gIHNrZXRjaC5yZWN0KCB0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQgKVxuICBza2V0Y2guZmlsbCgpXG4gIHNrZXRjaC5zdHJva2UoKVxuICAgIFxuICBpZiB0aGlzLnNsYW50ZWRUb3BcbiAgICBza2V0Y2guYmVnaW5QYXRoKClcbiAgICBza2V0Y2gubW92ZVRvKCB0aGlzLngsIHRoaXMueSApXG4gICAgc2tldGNoLmxpbmVUbyggdGhpcy54ICsgdGhpcy53aWR0aCwgdGhpcy55IClcbiAgICBpZiB0aGlzLnNsYW50ZWRUb3BEaXJlY3Rpb25cbiAgICAgIHNrZXRjaC5saW5lVG8oIHRoaXMueCArIHRoaXMud2lkdGgsIHRoaXMueSAtIHRoaXMuc2xhbnRlZFRvcEhlaWdodCApXG4gICAgZWxzZVxuICAgICAgc2tldGNoLmxpbmVUbyggdGhpcy54LCB0aGlzLnkgLSB0aGlzLnNsYW50ZWRUb3BIZWlnaHQgKVxuICAgIHNrZXRjaC5jbG9zZVBhdGgoKVxuICAgIHNrZXRjaC5maWxsKClcbiAgICBza2V0Y2guc3Ryb2tlKClcbiAgICAgXG4gIGlmIHRoaXMuc3BpcmVUb3BcbiAgICBza2V0Y2guYmVnaW5QYXRoKClcbiAgICBza2V0Y2gubW92ZVRvKCB0aGlzLnggKyAoIHRoaXMud2lkdGggLyAyICksIHRoaXMueSAtIHRoaXMuc3BpcmVUb3BIZWlnaHQgKVxuICAgIHNrZXRjaC5saW5lVG8oIHRoaXMueCArICggdGhpcy53aWR0aCAvIDIgKSArIHRoaXMuc3BpcmVUb3BXaWR0aCwgdGhpcy55IClcbiAgICBza2V0Y2gubGluZVRvKCB0aGlzLnggKyAoIHRoaXMud2lkdGggLyAyICkgLSB0aGlzLnNwaXJlVG9wV2lkdGgsIHRoaXMueSApXG4gICAgc2tldGNoLmNsb3NlUGF0aCgpXG4gICAgc2tldGNoLmZpbGwoKVxuICAgIHNrZXRjaC5zdHJva2UoKVxuICAgXG4gIGlmIHRoaXMuYW50ZW5uYVRvcFxuICAgIHNrZXRjaC5iZWdpblBhdGgoKVxuICAgIHNrZXRjaC5tb3ZlVG8oIHRoaXMueCArICggdGhpcy53aWR0aCAvIDIgKSwgdGhpcy55IC0gdGhpcy5hbnRlbm5hVG9wSGVpZ2h0IClcbiAgICBza2V0Y2gubGluZVRvKCB0aGlzLnggKyAoIHRoaXMud2lkdGggLyAyICksIHRoaXMueSApXG4gICAgc2tldGNoLmxpbmVXaWR0aCA9IHRoaXMuYW50ZW5uYVRvcFdpZHRoXG4gICAgc2tldGNoLnN0cm9rZSgpXG5cbiNcbiMgU0tZTElORVNcbiNcblxuU2t5bGluZSA9IChjb25maWcpIC0+IFxuICB0aGlzLnggPSAwXG4gIHRoaXMuYnVpbGRpbmdzID0gW11cbiAgdGhpcy5sYXllciA9IGNvbmZpZy5sYXllclxuICB0aGlzLndpZHRoID1cbiAgICBtaW46IGNvbmZpZy53aWR0aC5taW5cbiAgICBtYXg6IGNvbmZpZy53aWR0aC5tYXhcbiAgdGhpcy5oZWlnaHQgPVxuICAgIG1pbjogY29uZmlnLmhlaWdodC5taW5cbiAgICBtYXg6IGNvbmZpZy5oZWlnaHQubWF4XG4gIHRoaXMuc3BlZWQgPSBjb25maWcuc3BlZWRcbiAgdGhpcy5jb2xvciA9IGNvbmZpZy5jb2xvclxuICB0aGlzLnBvcHVsYXRlKClcbiAgcmV0dXJuIHRoaXNcbiAgXG5Ta3lsaW5lLnByb3RvdHlwZS5wb3B1bGF0ZSA9IC0+XG4gIHRvdGFsV2lkdGggPSAwXG4gIHdoaWxlIHRvdGFsV2lkdGggPD0gc2tldGNoLndpZHRoICsgKCB0aGlzLndpZHRoLm1heCAqIDIgKVxuICAgIG5ld1dpZHRoID0gcm91bmQgKCByYW5kb20oIHRoaXMud2lkdGgubWluLCB0aGlzLndpZHRoLm1heCApIClcbiAgICBuZXdIZWlnaHQgPSByb3VuZCAoIHJhbmRvbSggdGhpcy5oZWlnaHQubWluLCB0aGlzLmhlaWdodC5tYXggKSApXG4gICAgdGhpcy5idWlsZGluZ3MucHVzaCggbmV3IEJ1aWxkaW5nKFxuICAgICAgbGF5ZXI6IHRoaXMubGF5ZXJcbiAgICAgIHg6IGlmIHRoaXMuYnVpbGRpbmdzLmxlbmd0aCA9PSAwIHRoZW4gMCBlbHNlICggdGhpcy5idWlsZGluZ3NbIHRoaXMuYnVpbGRpbmdzLmxlbmd0aCAtIDEgXS54ICsgdGhpcy5idWlsZGluZ3NbIHRoaXMuYnVpbGRpbmdzLmxlbmd0aCAtIDEgXS53aWR0aCApXG4gICAgICB5OiBza2V0Y2guaGVpZ2h0IC0gbmV3SGVpZ2h0XG4gICAgICB3aWR0aDogbmV3V2lkdGhcbiAgICAgIGhlaWdodDogbmV3SGVpZ2h0XG4gICAgICBjb2xvcjogdGhpcy5jb2xvclxuICAgICkgKVxuICAgIHRvdGFsV2lkdGggKz0gbmV3V2lkdGhcblxuU2t5bGluZS5wcm90b3R5cGUudXBkYXRlID0gLT5cbiAgdGhpcy54IC09ICggc2tldGNoLm1vdXNlLnggKiB0aGlzLnNwZWVkICkgKiBkdFxuICAgICAgXG4gIGZpcnN0QnVpbGRpbmcgPSB0aGlzLmJ1aWxkaW5nc1sgMCBdXG4gIGlmIGZpcnN0QnVpbGRpbmcud2lkdGggKyBmaXJzdEJ1aWxkaW5nLnggKyB0aGlzLnggPCAwXG4gICAgbmV3V2lkdGggPSByb3VuZCAoIHJhbmRvbSggdGhpcy53aWR0aC5taW4sIHRoaXMud2lkdGgubWF4ICkgKVxuICAgIG5ld0hlaWdodCA9IHJvdW5kICggcmFuZG9tKCB0aGlzLmhlaWdodC5taW4sIHRoaXMuaGVpZ2h0Lm1heCApIClcbiAgICBsYXN0QnVpbGRpbmcgPSB0aGlzLmJ1aWxkaW5nc1sgdGhpcy5idWlsZGluZ3MubGVuZ3RoIC0gMSBdICAgIFxuICAgIGZpcnN0QnVpbGRpbmcucmVzZXQoXG4gICAgICBsYXllcjogdGhpcy5sYXllclxuICAgICAgeDogbGFzdEJ1aWxkaW5nLnggKyBsYXN0QnVpbGRpbmcud2lkdGhcbiAgICAgIHk6IHNrZXRjaC5oZWlnaHQgLSBuZXdIZWlnaHRcbiAgICAgIHdpZHRoOiBuZXdXaWR0aFxuICAgICAgaGVpZ2h0OiBuZXdIZWlnaHRcbiAgICAgIGNvbG9yOiB0aGlzLmNvbG9yXG4gICAgKSAgICBcbiAgICB0aGlzLmJ1aWxkaW5ncy5wdXNoKCB0aGlzLmJ1aWxkaW5ncy5zaGlmdCgpIClcblxuU2t5bGluZS5wcm90b3R5cGUucmVuZGVyID0gLT5cbiAgaSA9IHRoaXMuYnVpbGRpbmdzLmxlbmd0aFxuICBza2V0Y2guc2F2ZSgpXG4gIHNrZXRjaC50cmFuc2xhdGUoIHRoaXMueCwgKCBza2V0Y2guaGVpZ2h0IC0gc2tldGNoLm1vdXNlLnkgKSAvIDIwICogdGhpcy5sYXllciApICBcbiAgdGhpcy5idWlsZGluZ3NbIGkgXS5yZW5kZXIgKCBpICkgd2hpbGUgaS0tXG4gIHNrZXRjaC5yZXN0b3JlKClcblxuI1xuIyBTRVRVUFxuI1xuICBcbnNrZXRjaC5zZXR1cCA9IC0+ICAgIFxuICBpID0gNVxuICB3aGlsZSBpLS1cbiAgICBza3lsaW5lcy5wdXNoKCBuZXcgU2t5bGluZShcbiAgICAgIGxheWVyOiBpICsgMVxuICAgICAgd2lkdGg6XG4gICAgICAgIG1pbjogKCBpICsgMSApICogMzBcbiAgICAgICAgbWF4OiAoIGkgKyAxICkgKiA0MFxuICAgICAgaGVpZ2h0OlxuICAgICAgICBtaW46IDE1MCAtICggKCBpICkgKiAzNSApXG4gICAgICAgIG1heDogMzAwIC0gKCAoIGkgKSAqIDM1IClcbiAgICAgIHNwZWVkOiAoIGkgKyAxICkgKiAuMDAzXG4gICAgICBjb2xvcjogJ2hzbCggMjAwLCAnICsgKCAoICggaSArIDEgKSAqIDEgKSArIDEwICkgKyAnJSwgJyArICggNzUgLSAoIGkgKiAxMyApICkgKyAnJSApJ1xuICAgICkgKVxuXG4jXG4jIENMRUFSXG4jXG4gIFxuc2tldGNoLmNsZWFyID0gLT5cbiAgc2tldGNoLmNsZWFyUmVjdCggMCwgMCwgc2tldGNoLndpZHRoLCBza2V0Y2guaGVpZ2h0IClcblxuI1xuIyBVUERBVEVcbiNcbiAgXG5za2V0Y2gudXBkYXRlID0gLT5cbiAgZHQgPSBpZiBza2V0Y2guZHQgPCAuMSB0aGVuIC4xIGVsc2Ugc2tldGNoLmR0IC8gMTZcbiAgZHQgPSBpZiBkdCA+IDUgdGhlbiA1IGVsc2UgZHRcbiAgaSA9IHNreWxpbmVzLmxlbmd0aFxuICBza3lsaW5lc1sgaSBdLnVwZGF0ZSggaSApIHdoaWxlIGktLVxuICBcbiNcbiMgRFJBV1xuI1xuICBcbnNrZXRjaC5kcmF3ID0gLT5cbiAgaSA9IHNreWxpbmVzLmxlbmd0aFxuICBza3lsaW5lc1sgaSBdLnJlbmRlciggaSApIHdoaWxlIGktLVxuXG4jXG4jIE1vdXNlbW92ZSBGaXhcbiMgIFxuICAgIFxuJCggd2luZG93ICkub24gJ21vdXNlbW92ZScsIChlKSAtPlxuICBza2V0Y2gubW91c2UueCA9IGUucGFnZVhcbiAgc2tldGNoLm1vdXNlLnkgPSBlLnBhZ2VZIl19
//# sourceURL=coffeescript
