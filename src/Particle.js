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

    // resets
    this.position.y = 1  // 2D constraint.
    this.force.set(0, 0, 0)
    this.updateMatrix()
  }.bind(p)

  return p
}

exports.Particle = Particle

exports.create = function(mesh) {
  return new Particle(mesh)
}
