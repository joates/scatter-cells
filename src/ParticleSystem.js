var THREE = require('./three-r65')

function ParticleSystem(radius) {

  // Particle system.
  var ps = new THREE.Object3D()

  ps.radius = radius || 600
  ps.equilibrium = false

	ps.agitationHistory = [],

  // add physics properties.
  ps.minAgitation = 0
  ps.agitationThreshold = 85
  ps.agitationHistoryMax = 20  // Approx. 333 milliseconds at 60fps.
  ps.radialConst  = ps.radius
  ps.radialAdjust = 0
  ps.repelForceModifierConst  = 0.032
  ps.repelForceModifierAdjust = 0
  ps.minParticleGap = 120

  ps.updateCells = function() {
    var particles = this.children
      , repelForce = new THREE.Vector3(0,0,0)
      , mag
      , repelStrength
      , numAgitatedParticles = 0
      , edgeDistance

    if (!this.equilibrium) {
      for (i=0; i<particles.length; i++) {
        var p1 = particles[i]

  			edgeDistance = this.radialConst + this.radialAdjust

        repelForce.copy(p1.position)

        mag = repelForce.length()
        repelStrength = (mag - edgeDistance) *-0.1

        if (repelStrength < 0) {
          repelForce.multiplyScalar(repelStrength/mag)
          p1.position.add(repelForce)
        }

        if (i >= particles.length - 1) continue

        var anyParticlesTouching = false

        for (j=i+1; j<particles.length; j++) {
          var p2 = particles[j]
            , pos1 = p1.position
            , pos2 = p2.position

          repelForce.copy(pos2)
          repelForce.sub(pos1)
          mag = repelForce.length()

          if (Math.abs(pos1.distanceTo(pos2)) < (p1.radius + p2.radius + this.minParticleGap)) {
            repelStrength = ((p1.radius + p2.radius) * 8) - mag
            anyParticlesTouching = true
          } else
            repelStrength = ((p1.radius + p2.radius) * 2) - mag

          if ((repelStrength > 0) && (mag > 0)) {
            repelForce.multiplyScalar(repelStrength*0.0025 / mag)
            //repelForce.multiplyScalar(repelStrength*0.0035 / mag)

            p1.force.sub(repelForce)
            p2.force.add(repelForce)
          }
        }

        if (p1.force.length() > 0.002) numAgitatedParticles++
      }

      if (numAgitatedParticles < this.agitationThreshold && anyParticlesTouching) {
        numAgitatedParticles = this.agitationThreshold
      }
    }

    return numAgitatedParticles
  }.bind(ps)
  
  ps.updateForces = function(num) {

    // TODO: convert this from agitation -> proximity !!
    if (this.agitationHistory.length < this.agitationHistoryMax) {
      this.agitationHistory.push(num)
    } else {
      this.minAgitation = Math.min.apply(Math, this.agitationHistory)
      if (this.minAgitation >= this.agitationThreshold) {
        // expand the container and adjust the repelforce.
        this.radialAdjust++
        this.repelForceModifierAdjust += 0.0025
        //console.log('+force: ' + (this.repelForceModifierConst + this.repelForceModifierAdjust))
        //console.log('radius: ' + (this.radialConst + this.radialAdjust))
      } else if (this.repelForceModifierAdjust > 0) {
        this.repelForceModifierAdjust -= 0.01
        //console.log('-force: ' + (this.repelForceModifierConst + this.repelForceModifierAdjust))
      }
      // discard the oldest entry.
      this.agitationHistory.shift()
    }

    //return ((this.repelForceModifierConst + this.repelForceModifierAdjust) < this.repelForceModifierConst)
    return (this.repelForceModifierAdjust < 0)
  }.bind(ps)

  return ps
}

exports.ParticleSystem = ParticleSystem

exports.create = function(radius) {
  return new ParticleSystem(radius)
}
