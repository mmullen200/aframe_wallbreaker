

AFRAME.registerComponent('rain-of-entities', {
  schema: {
    // tagname: HTML DOM property, returns the tag name of an element
    tagName:    { default: 'a-box' },
    components: { default: ['dynamic-body', 'force-pushable', 'color|#FF00FF'] },
    maxCount:   { default: 20, min: 0 },
    interval:   { default: 1000, min: 0 },
    lifetime:   { default: 10000, min: 0 }
  },
  init: function () {
    this.boxes = [];
    this.timeout = setInterval(this.spawn.bind(this), this.data.interval);
  },
  spawn: function () {
    if (this.boxes.length >= this.data.maxCount) {
      // The clearTimeout() method clears a timer set with the setTimeout() method
      clearTimeout(this.timeout);
      return;
    }

    var data = this.data,
        box = document.createElement(data.tagName);

    this.boxes.push(box);
    this.el.appendChild(box);

    box.setAttribute('position', this.randomPosition());
    data.components.forEach(function (s) {
      var parts = s.split('|');
      box.setAttribute(parts[0], parts[1] || '');
    });

    // Recycling is important, kids.
    setInterval(function () {
      if (box.body.position.y > 0) return;
      box.body.position.copy(this.randomPosition());
      box.body.velocity.set(0,0,0);
    }.bind(this), this.data.lifetime);
  },
  randomPosition: function () {
    return {x: Math.random() * 10 - 5, y: 10, z: Math.random() * 10 - 5};
  }
});

AFRAME.registerComponent('force-pushable', {
  schema: {
    force: { default: 20 }
  },
  init: function () {
    this.pStart = new THREE.Vector3();
    this.sourceEl = this.el.sceneEl.querySelector('[camera]');
    this.el.addEventListener('click', this.forcePush.bind(this));
  },
  forcePush: function () {
    var force,
        el = this.el,
        pStart = this.pStart.copy(this.sourceEl.getAttribute('position'));
    // Compute direction of force, normalize, then scale.
    force = el.body.position.vsub(pStart);
    force.normalize();
    force.scale(this.data.force, force);
    el.body.applyImpulse(force, el.body.position);
  }
});

AFRAME.registerComponent('force-float', {
  schema: {
    force:    { default: 0.1 },
    keyCode:  { default: 32 },
    selector: { default: '[force-float-target]' }
  },
  init: function () {
    this.isFloating = false;
    document.addEventListener('keyup', this.onKeyup.bind(this));
  },
  onKeyup: function (e) {
    if (e.keyCode !== this.data.keyCode) return;
    var data = this.data,
        isFloating = this.isFloating,
        physics = this.el.sceneEl.systems.physics,
        targets = this.el.sceneEl.querySelectorAll(data.selector);
    if (isFloating) {
      physics.setOption ('gravity', this.gravity);
    } else {
      // Disable gravity.
      this.gravity = physics.data.gravity;
      physics.setOption('gravity', 0);
      // Lift targets slightly.
      targets = [].slice.call(targets).forEach(function (el) {
        var position = new CANNON.Vec3().copy(el.getAttribute('position')),
            impulse = new CANNON.Vec3(
              0.25 * data.force * Math.random(),
              1.00 * data.force * Math.random() + 1.5,
              0.25 * data.force * Math.random()
            );
        el.body.applyImpulse(impulse, position);
      });
    }
    this.isFloating = !isFloating;
  }
});


AFRAME.registerComponent('build-wall', {
  init: function () {
     document.querySelector('a-scene').addEventListener('render-target-loaded', function() {
  var numberOfBricks = 40;
  var brickWidth = 2;
  var brickDepth = brickWidth;
  var brickHeight = brickWidth/2;
  var xPosition = -7;
  var yPosition = brickHeight;
  var rowLength = 10;
  
  var bricksEl = document.querySelector('#bricks');
  
  var brick;
  
  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    
  return color;
  }
  
  
  for (i = 0; i < numberOfBricks / rowLength; i++) {
    xPosition = -7;
    
    if (i > 0) {
      yPosition+=brickHeight;
      
    }
    
    
    for (j = 0; j < rowLength; j++) {
      
      brick = document.createElement('a-box');
      bricksEl.appendChild(brick);
      brick.setAttribute('width', brickWidth);
      brick.setAttribute('height', brickHeight);
      brick.setAttribute('depth', brickDepth);
      brick.setAttribute('position', xPosition + ' ' + yPosition + ' ' + -9);
      brick.setAttribute('dynamic-body', '');
      brick.setAttribute('color', getRandomColor());
     
      // brick.setAttribute('constraint', '')
      
    
      xPosition+=brickWidth;
      
    }
    
    
    
    
  }
});



  }
});


