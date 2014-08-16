(function() {

  function reveal(e){
    var flipBox = e.currentTarget;
    if (this.parentNode == flipBox) {
      if (this.parentNode.firstElementChild == this) {
        flipBox.flipped = false;
      }
      else if (this.parentNode.lastElementChild == this) {
        flipBox.flipped = true;
      }
    }
  }

  xtag.register('x-flipbox', {
    lifecycle: {
      created: function () {
          // instantiate sides without initial flip animation
          if (this.firstElementChild) {
            xtag.skipTransition(this.firstElementChild, function () {});
          }
          if (this.lastElementChild) {
            xtag.skipTransition(this.lastElementChild, function () {});
          }
          if (!this.hasAttribute("direction")) {
            this.xtag._direction = "right";
          }
      }
    },
    events: {
      // only listen to one side of flipbox to prevent double firing of flipend
      'transitionend:delegate(x-flipbox > *:first-child)': function(e) {
          // because we can't use the descendent selector of > at the front of
          // our delegation, make sure this is the correct top-level element
          var flipBox = e.currentTarget;
          if (this.parentNode == flipBox) {
            xtag.fireEvent(flipBox, "flipend");
          }
      },
      'reveal:delegate(x-flipbox > *)': reveal
    },
    accessors: {
      direction: {
        attribute: {},
        get: function () {
          return this.xtag._direction;
        },
        set: function (value) {
          // set animation direction attribute and skip any transition
          var self = this;
          xtag.skipTransition(this.firstElementChild, function () {
            self.setAttribute('_anim-direction', value);
            return function () {};
          });
          xtag.skipTransition(this.lastElementChild, function () {
            self.setAttribute('_anim-direction', value);
          });
          this.xtag._direction = value;
        }
      },
      flipped: {
        attribute: { boolean: true }
      }
    },
    methods: {
      toggle: function () {
        this.flipped = !this.flipped;
      },
      "showFront": function () {
        this.flipped = false;
      },
      "showBack": function () {
        this.flipped = true;
      }
    }
  });

})();
