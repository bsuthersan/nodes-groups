
(function() {
  var BubbleChart, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
    
var color1 = d3.scale.ordinal()
    .range(["steelblue", "#99CC00", "grey"]); //For the year groups

var color2 = d3.scale.ordinal()
    .range(["steelblue", "pink"]); //For gender
    
  BubbleChart = (function() {
    function BubbleChart(data) {
      this.hide_details = __bind(this.hide_details, this);
      this.show_details = __bind(this.show_details, this);
      this.hide_years = __bind(this.hide_years, this);
        this.hide_all = __bind(this.hide_all, this);
        this.hide_allbutyears = __bind(this.hide_allbutyears, this)
      this.display_years = __bind(this.display_years, this);
      this.move_towards_year = __bind(this.move_towards_year, this);
      this.display_by_year = __bind(this.display_by_year, this);
      this.display_gender = __bind(this.display_gender, this);
      this.move_towards_gender = __bind(this.move_towards_gender, this);
      this.display_by_gender = __bind(this.display_by_gender, this);
      this.move_towards_center = __bind(this.move_towards_center, this);
      this.display_group_all = __bind(this.display_group_all, this);
      this.start = __bind(this.start, this);
      this.create_vis = __bind(this.create_vis, this);
      this.create_nodes = __bind(this.create_nodes, this);
      var max_amount;
      this.data = data;
      this.width = 940;
      this.height = 600;
      this.center = {
        x: this.width / 2,
        y: this.height / 2
      };
      this.year_centers = {
        "1": {
          x: 330,
          y: 300
        },
        "2": {
          x: 470,
          y: 200
        },
        "3": {
          x: 600,
          y: this.height / 2
        }
      };
        this.gender_centers = {
            "Male": {
                x: 470-50,
                y: this.height/2,
            },
            "Female": {
                x: 470+50,
                y: this.height/2
            }
        }
        this.gender_text = {
            "Male": {fill: "steelblue"},
            "Female": {fill: "#99CC00"}
        }
      this.layout_gravity = -0.08;
        this.padding = 0.5;
      this.damper = 0.11;
      this.vis = null;
      this.nodes = [];
      this.force = 0.5;
      this.circles = null;
      this.radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 85]);
      this.create_nodes();
      this.create_vis();
    }

    BubbleChart.prototype.create_nodes = function() {
      this.data.forEach((function(_this) {
        return function(d) {
          var node;
          node = {
            id: d.id,
            radius: 5,
            group: d.group,
            year: d.group,
              gender: d.gender,
            x: Math.random() * 900,
            y: Math.random() * 800
          };
          return _this.nodes.push(node);
        };
      })(this));
      return this.nodes.sort(function(a, b) {
        return b.value - a.value;
      });
    };

    BubbleChart.prototype.create_vis = function() {
      var that;
      this.vis = d3.select("#vis").append("svg").attr("width", this.width).attr("height", this.height).attr("id", "svg_vis");
      this.circles = this.vis.selectAll("circle").data(this.nodes, function(d) {
        return d.id;
      });
      that = this;
      this.circles.enter().append("circle").attr("r", 0)
.attr("id", function(d) {
        return "bubble_" + d.id
      });
      return this.circles.transition().duration(1000).attr("r", function(d) {
        return d.radius;
      });
    };

    BubbleChart.prototype.charge = function(d) {
      return -3
    };

    BubbleChart.prototype.start = function() {
      return this.force = d3.layout.force().nodes(this.nodes).size([this.width, this.height]);
    };

    BubbleChart.prototype.display_group_all = function() {
      this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
        return function(e) {
          return _this.circles.each(_this.move_towards_center(e.alpha)).attr("cx", function(d) {
            return d.x;
          }).attr("cy", function(d) {
            return d.y;
          }).attr("fill", "gold")
        };
      })(this));
      this.force.start();
      return this.hide_all();
    };

    BubbleChart.prototype.move_towards_center = function(alpha) {
      return (function(_this) {
        return function(d) {
          d.x = d.x + (_this.center.x - d.x) * (_this.damper + 0.02) * alpha;
          return d.y = d.y + (_this.center.y - d.y) * (_this.damper + 0.02) * alpha;
        };
      })(this);
    };

      
 BubbleChart.prototype.display_by_gender = function() { ///okay, do need to write this up the top
      this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.8).on("tick", (function(_this) {
        return function(e) {
          return _this.circles.each(_this.move_towards_gender(e.alpha)).attr("cx", function(d) {
            return d.x;
          }).attr("cy", function(d) {
            return d.y;
          }).attr("fill", function(d) { return color2(d.gender); })
        };
      })(this));
      this.force.start();
      return this.display_gender();
    };

    BubbleChart.prototype.move_towards_gender = function(alpha) {
      return (function(_this) {
        return function(d) {
          var target;
          target = _this.gender_centers[d.gender];
          d.x = d.x + (target.x - d.x) * (_this.damper + 0.03) * alpha * 1.1;
          return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
        };
      })(this);
    }; 
      
BubbleChart.prototype.display_gender = function() {
    this.vis.selectAll(".all,.years").remove();
      var gender, gender_data, gender_x, gender_y;
      gender_x = {
        "Male": 350,
        "Female": 560
      };
    gender_y = {
        "Male": 150,
        "Female":150
    }
      gender_data = d3.keys(gender_x);
      gender = this.vis.selectAll(".gender").data(gender_data);
      return gender.enter()
          .append("text")
          .attr("class", "gender")
          .attr("x", (function(_this) {
        return function(d) {
          return gender_x[d];
        };
      })(this))
          .attr("y", function(d) { return(gender_y[d])})
          .attr("text-anchor", "middle").text(function(d) {
        return d;
      })
        .attr("fill", "black")
    .style("font-size", "20px")
    .style("fill", function(d) { return color2(d)})
    };
      
      
    BubbleChart.prototype.display_by_year = function() {
      this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", (function(_this) {
        return function(e) {
          return _this.circles.each(_this.move_towards_year(e.alpha)).attr("cx", function(d) {
            return d.x;
          }).attr("cy", function(d) {
            return d.y;
          }).attr("fill", function(d) { return color1(d.year); })
        };
      })(this));
      this.force.start();
        return this.display_years()
    };

    BubbleChart.prototype.move_towards_year = function(alpha) {
      return (function(_this) {
        return function(d) {
          var target;
          target = _this.year_centers[d.year];
          d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
          return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
        };
      })(this);
    };

    BubbleChart.prototype.display_years = function() {
        this.vis.selectAll(".gender,.years").remove();
      var years, years_data, years_x;
      years_x = {
        "1": 160,
        "2": this.width / 2,
        "3": this.width - 160
      };
      years_data = d3.keys(years_x);
      years = this.vis.selectAll(".years").data(years_data);
      return years.enter().append("text").attr("class", "years").attr("x", (function(_this) {
        return function(d) {
          return years_x[d];
        };
      })(this))
          .attr("y", 200)
          .attr("text-anchor", "middle").text(function(d) {
        return d;
      })
        .attr("fill", "black")
    .style("font-size", "20px")
    .style("fill", function(d) { return color1(d)})
    };

      
      
BubbleChart.prototype.hide_years = function() {
      var years;
      return years = this.vis.selectAll(".years").remove();
    };
BubbleChart.prototype.hide_all = function() {
      this.vis.selectAll(".gender,.years").remove();
    };
BubbleChart.prototype.hide_allbutyears = function() {
      this.vis.selectAll(".gender,.all").remove();
    };
      
    return BubbleChart;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  $(function() {
    var chart, render_vis;
    chart = null;
    render_vis = function(csv) {
      chart = new BubbleChart(csv);
      chart.start();
      return root.display_all();
    };
    root.display_all = (function(_this) {
      return function() {
        return chart.display_group_all();
      };
    })(this);
    root.display_year = (function(_this) {
      return function() {
        return chart.display_by_year();
      };
    })(this);
    root.display_gender = (function(_this) {
        return function() {
            return chart.display_by_gender();
        };
    })(this);
    root.toggle_view = (function(_this) {
      return function(view_type) {
        if (view_type === 'year') {
          return root.display_year(); }
        if (view_type === 'gender') {
            return root.display_gender();
        } else {
          return root.display_all();
        }
      };
    })(this);
    return d3.csv("data/data.csv", render_vis);
  });

}).call(this);
