var THREE = require('./three-r65')

function Particle(mesh) {

  // Particle object.
  var p = mesh.clone()

  p.radius = p.geometry.radiusTop || 20

  // add physics properties.
  p.velocity = new THREE.Vector3(0, 0, 0)
  p.force    = new THREE.Vector3(0, 0, 0)
  p.drag     = 0.96

  p.update = function() {
    this.velocity.add(this.force)
    this.velocity.multiplyScalar(this.drag)
    this.position.add(this.velocity)
    //this.updateColor()

    // resets
    this.position.y = 1  // 2D constraint.
    this.force.set(0, 0, 0)
    this.updateMatrix()
  }.bind(p)

  p.updateColor = function() {
    /**
    var particleForce = this.force.length() * 0.01
      , color = Math.round(particleForce * 2000)
      , r, g, b

		// clamp to a color range.
    color = Math.max(0, Math.min(255, color))

    if (color > 200) {
      // bright color mix
      r = g = color / 255
      this.material.color.setRGB(r, g, 1.0)
    } else if (color > 128) {
      // medium color mix
      r = (color / 128 * 65) / 255
      g = (color / 128 * 105) / 255
      this.material.color.setRGB(r, g, 0.9)
    } else if (color >= 90) {
      // low color mix
      r = (color / 90 * 65) / 255
      g = (color / 90 * 105) / 255
      this.material.color.setRGB(r, g, 0.9)
    } else {
      // color mix is less than minimum allowed
      this.material.color.setRGB(0.3, 0.6, 0.9)
    }
    */
  }.bind(p)

  return p
}

exports.Particle = Particle

exports.create = function(mesh) {
  return new Particle(mesh)
}
